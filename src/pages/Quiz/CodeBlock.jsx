import React, { useEffect, useRef } from 'react';

// Supported languages with display names
export const CODE_LANGUAGES = [
    { value: '', label: 'Choisir un langage...' },
    { value: 'python', label: 'Python' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'java', label: 'Java' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'bash', label: 'Bash / Shell' },
    { value: 'plaintext', label: 'Texte / Pseudocode' },
];

// Simple token-based syntax highlighter (no external dep)
function tokenize(code, lang) {
    if (!code) return '';

    // Escape HTML first
    const escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    if (lang === 'plaintext' || !lang) return escaped;

    // Language-specific keyword sets
    const keywords = {
        python: /\b(def|return|class|import|from|as|if|elif|else|for|while|in|not|and|or|is|None|True|False|try|except|finally|with|pass|break|continue|lambda|yield|global|nonlocal|raise|del|assert)\b/g,
        javascript: /\b(const|let|var|function|return|class|import|export|from|if|else|for|while|of|in|new|this|typeof|instanceof|true|false|null|undefined|async|await|try|catch|finally|throw|switch|case|break|continue|default|=>)\b/g,
        typescript: /\b(const|let|var|function|return|class|interface|type|import|export|from|if|else|for|while|of|in|new|this|typeof|instanceof|true|false|null|undefined|async|await|try|catch|finally|throw|switch|case|break|continue|default|string|number|boolean|any|void|never)\b/g,
        java: /\b(public|private|protected|class|interface|extends|implements|return|void|int|long|double|float|boolean|char|String|if|else|for|while|new|this|super|static|final|abstract|try|catch|finally|throw|throws|import|package|null|true|false|break|continue|switch|case|default)\b/g,
        c: /\b(int|char|float|double|void|long|short|unsigned|signed|struct|union|enum|typedef|return|if|else|for|while|do|break|continue|switch|case|default|NULL|include|define|sizeof|const|static|extern|register)\b/g,
        cpp: /\b(int|char|float|double|void|long|short|unsigned|signed|struct|union|enum|class|public|private|protected|return|if|else|for|while|do|break|continue|switch|case|default|nullptr|true|false|new|delete|const|static|template|typename|namespace|using|include|define)\b/g,
        php: /\b(function|return|class|if|else|elseif|for|foreach|while|echo|print|new|true|false|null|public|private|protected|static|extends|implements|try|catch|finally|throw|namespace|use|require|include)\b/g,
        sql: /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|OUTER|ON|GROUP|BY|ORDER|HAVING|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|INDEX|DROP|ALTER|ADD|COLUMN|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|AND|OR|AS|DISTINCT|LIMIT|OFFSET|COUNT|SUM|AVG|MAX|MIN|IN|LIKE|BETWEEN|EXISTS|UNION|ALL)\b/gi,
        bash: /\b(if|then|else|elif|fi|for|while|do|done|case|in|esac|function|return|exit|echo|printf|read|export|local|readonly|source|cd|ls|grep|awk|sed|cat|chmod|chown|mkdir|rm|cp|mv|find|sort|uniq|head|tail|wc)\b/g,
        html: /(&lt;\/?[\w\s="'.-]+&gt;)/g,
        css: null,
        plaintext: null,
    };

    // String patterns
    const stringPattern = /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g;
    const commentPatterns = {
        python: /#.*/g,
        javascript: /\/\/.*|\/\*[\s\S]*?\*\//g,
        typescript: /\/\/.*|\/\*[\s\S]*?\*\//g,
        java: /\/\/.*|\/\*[\s\S]*?\*\//g,
        c: /\/\/.*|\/\*[\s\S]*?\*\//g,
        cpp: /\/\/.*|\/\*[\s\S]*?\*\//g,
        php: /\/\/.*|#.*|\/\*[\s\S]*?\*\//g,
        sql: /--.*|\/\*[\s\S]*?\*\//g,
        bash: /#.*/g,
    };
    const numberPattern = /\b(\d+\.?\d*)\b/g;

    // We'll do a simple multi-pass replacement using placeholders is too complex.
    // Instead, use a clean ordered method: work on segments.
    // For simplicity, apply keyword, string, comment, number highlighting in order with span wrapping.

    let result = escaped;

    // Use placeholders to protect already-highlighted spans from being re-processed
    const placeholders = [];
    const protect = (html) => {
        const idx = placeholders.length;
        placeholders.push(html);
        return `\x00PH${idx}\x00`;
    };
    const restore = (str) => str.replace(/\x00PH(\d+)\x00/g, (_, i) => placeholders[i]);

    // 1. Comments first (highest priority)
    if (commentPatterns[lang]) {
        result = result.replace(commentPatterns[lang], m => protect(`<span class="cq-comment">${m}</span>`));
    }

    // 2. Strings
    result = result.replace(stringPattern, m => protect(`<span class="cq-string">${m}</span>`));

    // 3. Numbers (only outside placeholders)
    result = result.replace(numberPattern, m => protect(`<span class="cq-number">${m}</span>`));

    // 4. Keywords (only outside placeholders — placeholders contain \x00 so regex won't match inside)
    if (keywords[lang]) {
        result = result.replace(keywords[lang], m => protect(`<span class="cq-keyword">${m}</span>`));
    }

    // Restore all placeholders
    return restore(result);
}

export default function CodeBlock({ code, language, className = '' }) {
    if (!code || !code.trim()) return null;

    const langLabel = CODE_LANGUAGES.find(l => l.value === language)?.label || language || 'Code';
    const highlighted = tokenize(code, language);

    return (
        <div className={`cq-code-block ${className}`}>
            <div className="cq-code-header">
                <div className="cq-code-lang-badge">
                    <span className="cq-code-dot" />
                    <span className="cq-code-dot" style={{ opacity: 0.6 }} />
                    <span className="cq-code-dot" style={{ opacity: 0.3 }} />
                    <span className="cq-code-lang-name">{langLabel}</span>
                </div>
                <button
                    className="cq-copy-btn"
                    onClick={() => navigator.clipboard?.writeText(code)}
                    title="Copier le code"
                >
                    Copier
                </button>
            </div>
            <pre className="cq-code-pre">
                <code
                    className="cq-code-content"
                    dangerouslySetInnerHTML={{ __html: highlighted }}
                />
            </pre>
        </div>
    );
}
