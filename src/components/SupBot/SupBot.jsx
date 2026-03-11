import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SupBot.css';

// ═══════════════════════════════════════════════════════════════
//  LOCAL NLP ENGINE — No API required
// ═══════════════════════════════════════════════════════════════

// ── 1. Text normalization ────────────────────────────────────────
const normalize = (text) =>
    text.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // strip diacritics
        .replace(/['']/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

// ── 2. Levenshtein distance (fuzzy typo tolerance) ───────────────
const levenshtein = (a, b) => {
    if (a === b) return 0;
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        let prev = i;
        for (let j = 1; j <= b.length; j++) {
            const val = a[i - 1] === b[j - 1] ? dp[j - 1] : Math.min(dp[j - 1], dp[j], prev) + 1;
            dp[j - 1] = prev;
            prev = val;
        }
        dp[b.length] = prev;
    }
    return dp[b.length];
};

// similarity 0→1 between two strings
const similarity = (a, b) => {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - levenshtein(a, b) / maxLen;
};

// ── 3. Synonym expansion map ─────────────────────────────────────
const SYNONYMS = {
    'filiere': ['filiere', 'filieres', 'specialite', 'specialites', 'parcours', 'option', 'branche', 'domaine', 'orientation'],
    'note': ['note', 'notes', 'resultat', 'resultats', 'bulletin', 'moyenne', 'moyennes', 'score'],
    'stage': ['stage', 'stages', 'internship', 'alternance', 'pfe'],
    'emploi du temps': ['emploi du temps', 'emploi', 'planning', 'horaire', 'horaires', 'edt', 'timetable', 'cours'],
    'reseau': ['reseau', 'reseaux', 'network', 'networking', 'cisco', 'ccna', 'lan', 'wan'],
    'securite': ['securite', 'cyber', 'cybersecurite', 'hack', 'hacking', 'pentest'],
    'developpement': ['developpement', 'dev', 'coding', 'programmation', 'code', 'coder'],
    'web': ['web', 'site web', 'frontend', 'backend', 'fullstack', 'html', 'css', 'react', 'javascript'],
    'media': ['multimedia', 'design', 'ux', 'ui', 'adobe', 'video', 'montage'],
    'compensation': ['compensation', 'compenser', 'ci', 'ce', 'compensation interne', 'compensation externe'],
    'passer': ['passer', 'passage', 'aller en', 'monter en', 'condition pour', 'admission en'],
    'valider': ['valider', 'validation', 'acquis', 'capitaliser', 'capit', 'module valide'],
    'bonjour': ['bonjour', 'salam', 'salut', 'hello', 'hi', 'bonsoir', 'bjr', 'coucou', 'assalam'],
    'merci': ['merci', 'shukran', 'thx', 'thanks', 'thank', 'parfait', 'super merci'],
    'absence': ['absence', 'absent', 'absenteisme', 'manquer cours', 'rater cours'],
    'inscription': ['inscription', 'inscrire', 's\'inscrire', 'candidature', 'dossier', 'admission', 'rejoindre'],
};

// Expand tokens via synonyms
const expandTokens = (tokens) => {
    const expanded = new Set(tokens);
    tokens.forEach(token => {
        Object.entries(SYNONYMS).forEach(([canonical, variants]) => {
            if (variants.includes(token) || token === canonical) {
                variants.forEach(v => expanded.add(v));
                expanded.add(canonical);
            }
        });
    });
    return [...expanded];
};

// ── 4. Tokenize query ────────────────────────────────────────────
const tokenize = (text) =>
    normalize(text).split(/[\s,;!?.]+/).filter(t => t.length > 1);

// ── 5. Score a query against a list of keyword phrases ──────────
const scoreQuery = (query, keywords, weight = 1) => {
    const qTokens = expandTokens(tokenize(query));
    let totalScore = 0;

    keywords.forEach(keyword => {
        const kTokens = tokenize(normalize(keyword));
        let matchScore = 0;

        kTokens.forEach(kt => {
            // Exact match
            if (qTokens.includes(kt)) {
                matchScore += 1.0;
                return;
            }
            // Fuzzy match (≥ 0.8 similarity for tokens ≥ 4 chars)
            if (kt.length >= 4) {
                const best = Math.max(...qTokens.map(qt => qt.length >= 3 ? similarity(qt, kt) : 0));
                if (best >= 0.82) matchScore += best * 0.8;
            }
            // Substring match (query contains keyword fragment)
            if (normalize(query).includes(kt) && kt.length >= 3) matchScore += 0.6;
        });

        if (matchScore > 0 && kTokens.length > 0) {
            totalScore += (matchScore / kTokens.length) * weight;
        }
    });

    return totalScore;
};

// ── 6. Entity extraction ─────────────────────────────────────────
const extractEntities = (text) => {
    const norm = normalize(text);
    return {
        level: norm.match(/\b(l1|l2|l3|premiere annee|deuxieme annee|troisieme annee)\b/)?.[1] || null,
        major: norm.match(/\b(spec|rss|dwm|web|reseau|systeme)\b/)?.[1] || null,
        semester: norm.match(/\b(s[1-6]|semestre [1-6])\b/)?.[1] || null,
        isQuestion: /\b(comment|pourquoi|quand|quoi|qui|combien|est-ce|c'est|peut-on|peut-il|peux-tu)\b/.test(norm),
    };
};

// ═══════════════════════════════════════════════════════════════
//  KNOWLEDGE BASE  (rich, natural responses)
// ═══════════════════════════════════════════════════════════════
const KB = [
    // ── INTENTS ─────────────────────────────────────────────────
    {
        id: 'greeting', category: 'intent', weight: 2,
        keywords: ['bonjour', 'salam', 'salut', 'hello', 'hi bonsoir', 'assalam alaykoum', 'coucou'],
        responses: [
            "Bonjour ! 👋 Je suis **SupBot**, votre conseiller académique SupNum. Que puis-je faire pour vous ?",
            "Salam ! 😊 Prêt à répondre à toutes vos questions sur SupNum — filières, notes, stages, ou la plateforme !",
            "Bonjour ! 🎓 Posez-moi vos questions sur SupNum, je suis là pour vous guider.",
        ],
        suggestions: ['Quelles sont les filières ?', 'Comment calculer ma moyenne ?', 'Emploi du temps'],
    },
    {
        id: 'thanks', category: 'intent', weight: 2,
        keywords: ['merci', 'shukran', 'thanks', 'c est bon', 'super merci', 'parfait merci'],
        responses: [
            "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.",
            "De rien ! Bonne continuation dans vos études. 🎓",
            "Toujours là pour vous aider ! ✨",
        ],
    },
    {
        id: 'farewell', category: 'intent', weight: 2,
        keywords: ['au revoir', 'bye', 'bonne journee', 'a bientot', 'ciao', 'a plus'],
        responses: [
            "Au revoir ! 👋 Bonne continuation à SupNum !",
            "À bientôt ! 🎓 N'hésitez pas à revenir.",
        ],
    },
    {
        id: 'who_are_you', category: 'intent', weight: 2,
        keywords: ['qui es tu', "c'est quoi supbot", 'tu es quoi', 'tu fais quoi', 'tu sers a quoi', 'comment tu marches'],
        responses: [
            "Je suis **SupBot** 🤖, votre assistant académique virtuel de SupNum !\n\nJe peux vous renseigner sur :\n*   📚 Filières (DWM, RSS, SPEC)\n*   📊 Notes, moyennes, validation\n*   💼 Stages et débouchés\n*   📅 Emploi du temps\n*   📋 Règlement intérieur\n*   Et bien plus !",
        ],
        suggestions: ['Filières de SupNum ?', 'Calculer ma moyenne ?'],
    },
    {
        id: 'frustration', category: 'intent', weight: 1.5,
        keywords: ['je comprends pas', 'je comprends rien', 'nul', 'aide moi', 'je sais pas', 'perdu', 'stresse'],
        responses: [
            "Ne vous inquiétez pas, c'est tout à fait normal ! 😊 Expliquez-moi votre problème plus précisément et je ferai de mon mieux pour vous aider.",
            "Je comprends que ce soit stressant. 💪 Dites-moi exactement ce qui vous pose problème.",
        ],
        suggestions: ['Calcul de moyenne ?', 'Conditions de passage ?', 'Contacter la scolarité'],
    },

    // ── GENERAL ─────────────────────────────────────────────────
    {
        id: 'about', category: 'général', weight: 1,
        keywords: ["c'est quoi supnum", 'qui est supnum', 'presentation de supnum', 'supnum c est quoi', 'ecole', 'institut'],
        split: "🏫 **L'Institut Supérieur du Numérique (SupNum)** est une grande école mauritanienne spécialisée dans le numérique.\n\n*   Formation **Licence Professionnelle** (Bachelor Engineering) en **3 ans**\n*   Pédagogie active : 74% pratique, 26% cours magistraux\n*   3 filières professionnalisantes : DWM, RSS, SPEC\n*   Partenariats avec des entreprises locales & régionales",
        suggestions: ['Quelles sont les filières ?', 'Comment candidater ?'],
    },
    {
        id: 'location', category: 'général', weight: 1,
        keywords: ['adresse', 'ou se trouve', 'localisation', 'nouakchott', 'ou est supnum'],
        response: "📍 SupNum est situé à **Nouakchott**, Avenue Nelson Mandela, Mauritanie.",
        suggestions: ['Téléphone ?', 'Site web ?'],
    },
    {
        id: 'contact', category: 'général', weight: 1,
        keywords: ['telephone', 'numero', 'contact', 'appeler', 'joindre', 'scolarite'],
        response: "📞 **Scolarité SupNum** :\n\n*   Téléphone : **+222 45 24 45 44**\n*   Adresse : Avenue Nelson Mandela, Nouakchott\n*   Site web : [www.supnum.mr](http://www.supnum.mr)",
    },
    {
        id: 'website', category: 'général', weight: 0.9,
        keywords: ['site web', 'site internet', 'url', 'lien supnum'],
        response: "🌐 Site officiel : **[www.supnum.mr](http://www.supnum.mr)**",
    },

    // ── PÉDAGOGIE ────────────────────────────────────────────────
    {
        id: 'active_pedagogy', category: 'pédagogie', weight: 1.2,
        keywords: ['pedagogie active', 'methode enseignement', 'comment apprend', 'approche formation', 'cm cours magistraux'],
        response: "🎓 **Pédagogie Active à SupNum** :\n\nL'étudiant est **acteur** de sa formation, pas simple spectateur !\n\n| Type | Volume |\n|------|--------|\n| Cours Magistraux (CM) | 26% |\n| Travaux Pratiques (TP) | 588h sur 3 ans |\n| Projets | 1 620h sur 3 ans |\n\nRésultat : diplômés **immédiatement opérationnels** en entreprise.",
        suggestions: ['Combien de stages ?', 'Quelles certifications ?'],
    },

    // ── FILIÈRES ─────────────────────────────────────────────────
    {
        id: 'list_majors', category: 'filières', weight: 1.1,
        keywords: ['filiere', 'specialite', 'parcours', 'option', 'quels sont les filieres', 'quel filiere choisir', 'quelles filieres'],
        response: "SupNum propose **3 filières** à partir de la L2 :\n\n🌐 **DWM** — Développement Web & Multimédia\n🛡️ **RSS** — Réseaux, Systèmes & Sécurité\n💻 **SPEC** — Développement des Systèmes d'Information\n\n*En L1, le programme est commun à tous.*",
        suggestions: ['Détails DWM ?', 'Détails RSS ?', 'Détails SPEC ?'],
    },
    {
        id: 'spec', category: 'filières', weight: 1.5,
        keywords: ['spec', "systeme d'information", 'java', 'python', 'base de donnees', 'developpement logiciel', 'architecte si'],
        response: "💻 **SPEC — Développement des Systèmes d'Information**\n\n📚 **Matières clés :**\n*   Java / JEE / Spring\n*   Python & algorithmique avancé\n*   Bases de données SQL & NoSQL\n*   Architecture SOA & microservices\n*   Méthodes Merise & UML\n*   Sécurité des systèmes d'information\n\n🎯 **Débouchés :** Développeur logiciel, Architecte SI, Chef de projet, Analyste-programmeur\n\n💰 Salaire d'entrée moyen : **100 000 – 150 000 MRU/mois**",
        suggestions: ['Certifications SPEC ?', 'Conditions de passage L2 ?'],
        setContext: 'SPEC',
    },
    {
        id: 'rss', category: 'filières', weight: 1.5,
        keywords: ['rss', 'reseau', 'securite', 'cisco', 'ccna', 'linux', 'windows serveur', 'cloud', 'cybersecurite', 'hacking', 'pentest'],
        response: "🛡️ **RSS — Réseaux, Systèmes & Sécurité**\n\n📚 **Matières clés :**\n*   Cisco Networking (CCNA)\n*   Administration Linux & Windows Server\n*   Sécurité réseau & cryptographie\n*   Cloud Computing (AWS/Azure bases)\n*   Virtualisation (VMware, Docker)\n*   Cybersécurité & tests d'intrusion\n\n🎯 **Débouchés :** Admin réseau, Ingénieur cybersécurité, Cloud Architect, SOC Analyst\n\n💰 Salaire d'entrée moyen : **90 000 – 140 000 MRU/mois**",
        suggestions: ['Certification CCNA ?', 'Passer en L2 ?'],
        setContext: 'RSS',
    },
    {
        id: 'dwm', category: 'filières', weight: 1.5,
        keywords: ['dwm', 'web', 'multimedia', 'design', 'ux', 'ui', 'adobe', 'mobile', 'react', 'frontend', 'seo'],
        response: "🌐 **DWM — Développement Web & Multimédia**\n\n📚 **Matières clés :**\n*   UX/UI Design & ergonomie web\n*   HTML / CSS / JavaScript / React\n*   Développement mobile (React Native)\n*   Suite Adobe (Illustrator, Animate, Premiere)\n*   Montage vidéo & motion design\n*   SEO & stratégie digitale\n\n🎯 **Débouchés :** Développeur Front-end, Designer UX/UI, Chef de projet digital, Community Manager\n\n💰 Salaire d'entrée moyen : **80 000 – 130 000 MRU/mois**",
        suggestions: ['Certifications Adobe ?', 'Passer en L2 ?'],
        setContext: 'DWM',
    },

    // ── PROGRAMME L1 ─────────────────────────────────────────────
    {
        id: 'l1_program', category: 'programme', weight: 1.1,
        keywords: ['programme l1', 'matiere l1', 'cours l1', 'module l1', 'premiere annee cours', 's1 s2'],
        response: "📚 **Programme L1 (S1 & S2) — Commun à tous** :\n\n*   Algorithmique & structures de données\n*   Programmation (Python, C)\n*   Mathématiques & logique formelle\n*   Réseaux informatiques (bases)\n*   Bases de données (SQL)\n*   Systèmes d'exploitation\n*   Communication professionnelle\n*   Anglais technique & numérique",
        suggestions: ['Passer en L2 ?', 'Calcul de moyenne ?'],
    },

    // ── SYSTÈME DE NOTES ─────────────────────────────────────────
    {
        id: 'calc_average', category: 'notes', weight: 1.5,
        keywords: ['calculer moyenne', 'formule note', 'calcul note', 'comment calculer', 'ncc nsn', 'formule moyenne'],
        response: "📝 **Formule officielle de la moyenne** :\n\n`Moyenne = (NCC × 0,4) + (NSN × 0,6)`\n\n*   **NCC** = Note Contrôle Continu\n*   **NSN** = Note Session Normale\n*   Score ≥ **10/20** → matière validée ✅\n*   Score < **6/20** → note **éliminatoire** ❌\n\n**Exemple :** NCC = 12, NSN = 14\n→ Moyenne = (12 × 0,4) + (14 × 0,6) = **13,2/20** ✅",
        suggestions: ["C'est quoi la compensation interne ?", 'Conditions de rattrapage ?'],
    },
    {
        id: 'ci', category: 'validation', weight: 1.3,
        keywords: ['compensation interne', 'ci', 'valider module', 'module valide', 'note eliminatoire'],
        response: "⚖️ **Compensation Interne (CI)** — Validation d'un module :\n\n✅ Module **validé** si :\n1.  Moyenne du module ≥ **10/20**\n2.  **Aucune** note de matière < **6/20**\n\n❌ Module **non validé** si :\n*   Moyenne < 10/20, OU\n*   Une matière a une note < 6/20 (éliminatoire)\n\n💡 Même avec une bonne moyenne, une note éliminatoire invalide le module !",
        suggestions: ['Compensation externe ?', 'Session de rattrapage ?'],
    },
    {
        id: 'ce', category: 'validation', weight: 1.3,
        keywords: ['compensation externe', 'ce', 'valider semestre', 'semestre valide', 'rattrapage'],
        response: "⚖️ **Compensation Externe (CE)** — Validation d'un semestre :\n\n✅ Semestre **validé** si :\n1.  Moyenne générale ≥ **10/20**\n2.  Moyennes des modules ≥ **8/20**\n3.  Notes des matières ≥ **6/20**\n\n💡 En cas d'échec → **session de rattrapage** disponible.",
        suggestions: ['Conditions de passage en L2 ?', 'Capitalisation ?'],
    },
    {
        id: 'capit', category: 'validation', weight: 1.2,
        keywords: ['capitalisation', 'capit', 'capitaliser', 'garder notes', 'matiere acquise'],
        response: "📦 **Capitalisation (CAPIT)** :\n\nUne matière avec une note ≥ **10/20** est **capitalisée** — elle reste acquise définitivement, même si le semestre n'est pas validé globalement.\n\nVous n'aurez jamais à repasser une matière déjà réussie ! 🎯",
        suggestions: ['Compensation interne ?', 'Compensation externe ?'],
    },
    {
        id: 'rattrapage', category: 'validation', weight: 1.2,
        keywords: ['rattrapage', 'session rattrapage', 'deuxieme session', 'en cas echec'],
        response: "🔄 **Session de rattrapage** :\n\n*   Organisée après la session normale en cas d'échec\n*   Concerne les matières non capitalisées (note < 10/20)\n*   La meilleure des deux notes est retenue\n*   Permet de valider le semestre malgré un premier échec\n\nDate de rattrapage communiquée par la scolarité.",
        suggestions: ['Compensation externe ?', 'Conditions de passage L2 ?'],
    },

    // ── CONDITIONS DE PASSAGE ────────────────────────────────────
    {
        id: 'l1_to_l2', category: 'passage', weight: 1.3,
        keywords: ['passer en l2', 'passage l2', 'l1 vers l2', 'condition l2', 'aller l2', 'monter l2'],
        response: "🎓 **Conditions de passage en L2** :\n\n1.  Moyenne annuelle ≥ **10/20**\n2.  Au moins **39 crédits** validés sur 60\n\n💡 *Vous pouvez passer avec quelques modules non validés si les crédits suffisent.*",
        suggestions: ['Compensation externe ?', 'Capitalisation ?'],
    },
    {
        id: 'l2_to_l3', category: 'passage', weight: 1.3,
        keywords: ['passer en l3', 'passage l3', 'l2 vers l3', 'condition l3', 'aller l3', 'monter l3'],
        response: "🎓 **Conditions de passage en L3** :\n\n1.  **60 crédits de L1** intégralement validés\n2.  Au moins **39 crédits** de L2 validés\n3.  Moyenne annuelle ≥ **10/20**\n\n⚠️ *Le stage de L2 (S4) doit également être validé.*",
        suggestions: ['Combien de stages ?', 'Calcul de moyenne ?'],
    },

    // ── ABSENCES ─────────────────────────────────────────────────
    {
        id: 'absences', category: 'règlement', weight: 1.1,
        keywords: ['absence', 'absent', 'absenteisme', 'manquer cours', 'rater cours', 'combien absences'],
        response: "📋 **Règlement sur les absences** :\n\n*   Maximum **3 absences injustifiées** par matière / semestre\n*   Au-delà → possible **interdiction d'examen**\n*   Absence justifiée → signaler à la scolarité dans les **48h** avec justificatif\n*   Absence à un examen sans justification → **0/20**\n\n💡 Contactez la scolarité rapidement en cas d'absence prolongée.",
        suggestions: ['Téléphone de la scolarité ?'],
    },

    // ── STAGES ───────────────────────────────────────────────────
    {
        id: 'stages', category: 'stages', weight: 1.2,
        keywords: ['stage', 'stages', 'stage obligatoire', 'combien stage', 'duree stage', 'quand stage'],
        response: "💼 **Stages à SupNum** — 2 stages obligatoires :\n\n| Stage | Niveau | Durée |\n|-------|--------|-------|\n| Stage technique | L2 — S4 | 2 mois minimum |\n| Stage de fin d'études | L3 — S6 | 4 à 6 mois |\n\n*   **90%** des stages sont **rémunérés**\n*   SupNum accompagne dans la recherche via son réseau\n*   Un rapport de stage est exigé à la fin",
        suggestions: ['Débouchés après SupNum ?', 'Certifications disponibles ?'],
    },
    {
        id: 'paid_stage', category: 'stages', weight: 1.1,
        keywords: ['stage paye', 'remuneration stage', 'salaire stage', 'stage gratuit'],
        response: "💰 **90%** des stages effectués par les étudiants de SupNum sont **rémunérés** !\n\nSupNum entretient un réseau de partenaires entreprises qui accueillent et rémunèrent activement nos stagiaires.",
        suggestions: ['Débouchés après SupNum ?'],
    },
    {
        id: 'debouches', category: 'stages', weight: 1.1,
        keywords: ['debouche', 'apres supnum', 'emploi apres', 'trouver travail', 'insertion pro', 'salaire apres'],
        response: "🚀 **Débouchés après SupNum** :\n\n*   Taux d'insertion : **> 85%** dans les 6 mois\n*   Salaires d'entrée : **80 000 – 150 000 MRU/mois** selon filière\n*   Poursuite en **Master** possible : France, Canada, Espagne, Maroc…\n*   Partenariats avec des entreprises locales et internationales\n\n🎓 *Certains diplômés créent leur propre startup !*",
    },

    // ── CERTIFICATIONS ───────────────────────────────────────────
    {
        id: 'certifs', category: 'certifications', weight: 1.1,
        keywords: ['certification', 'certif', 'diplome professionnel', 'ccna certif', 'oracle certif', 'pix adobe'],
        response: "🏆 **Certifications préparées à SupNum** :\n\n| Certification | Filière |\n|---|---|\n| 🔴 Cisco CCNA | RSS |\n| 🟡 Oracle Java | SPEC |\n| 🐍 Python Institute PCEP | Tous |\n| 🎨 Adobe Certified | DWM |\n| 🔢 PIX | Tous niveaux |",
        suggestions: ['Détails RSS ?', 'Détails SPEC ?'],
    },

    // ── INSCRIPTION ──────────────────────────────────────────────
    {
        id: 'inscription', category: 'inscription', weight: 1.2,
        keywords: ["s'inscrire", 'inscription', 'comment candidater', 'dossier candidature', 'admission', 'rejoindre supnum', 'prerequis'],
        response: "📝 **Comment rejoindre SupNum :**\n\n1.  Déposer un **dossier de candidature** à la scolarité\n2.  Pré-requis : **Baccalauréat** toutes séries (priorité scientifique)\n3.  Entretien ou test de positionnement\n4.  Paiement des frais d'inscription\n\n📞 Infos : **+222 45 24 45 44**\n📍 Avenue Nelson Mandela, Nouakchott",
    },

    // ── VIE ÉTUDIANTE ────────────────────────────────────────────
    {
        id: 'techcraft', category: 'vie étudiante', weight: 1,
        keywords: ['club', 'techcraft', 'vie etudiante', 'activite', 'association etudiante'],
        response: "🤝 **Club TechCraft** — Le club phare de SupNum !\n\n*   Hackathons & compétitions de code\n*   Ateliers pratiques & workshops\n*   Networking avec des professionnels\n*   Projets open-source communautaires\n*   Événements mensuels\n\nUn excellent moyen de renforcer son profil et son réseau professionnel ! 🚀",
    },
    {
        id: 'bourses', category: 'vie étudiante', weight: 0.9,
        keywords: ['bourse', 'aide financiere', 'financement', 'frais scolarite'],
        response: "💳 Pour toute information sur les **frais de scolarité**, les **bourses** ou les aides financières disponibles, contactez directement la scolarité :\n\n📞 **+222 45 24 45 44**",
    },

    // ── NAVIGATION PLATEFORME ────────────────────────────────────
    {
        id: 'nav_results', category: 'plateforme', weight: 1.5,
        keywords: ['voir mes notes', 'mes resultats', 'consulter notes', 'acceder notes', 'bulletin notes'],
        response: "📊 Je vous emmène sur la page **Résultats** pour consulter vos notes !",
        action: 'results',
        suggestions: ['Calculer ma moyenne ?'],
    },
    {
        id: 'nav_timetable', category: 'plateforme', weight: 1.5,
        keywords: ['emploi du temps', 'voir mes cours', 'planning semaine', 'horaires cours', 'voir cours aujourd hui'],
        response: "📅 Je vous emmène sur la page **Emploi du temps** !",
        action: 'timetable',
    },
    {
        id: 'nav_community', category: 'plateforme', weight: 1.5,
        keywords: ['communaute', 'chat camarades', 'discuter profs', 'forum etudiant'],
        response: "💬 Je vous emmène sur l'espace **Communauté** !",
        action: 'community',
    },
    {
        id: 'nav_settings', category: 'plateforme', weight: 1.4,
        keywords: ['parametres', 'mon profil', 'changer mot de passe', 'modifier compte'],
        response: "⚙️ Je vous emmène dans les **Paramètres** de votre profil !",
        action: 'settings',
    },
];

// ═══════════════════════════════════════════════════════════════
//  MATCHING ENGINE
// ═══════════════════════════════════════════════════════════════
const findBestMatch = (input, context) => {
    const entities = extractEntities(input);
    let bestScore = 0;
    let bestEntry = null;

    KB.forEach(entry => {
        let score = scoreQuery(input, entry.keywords, entry.weight);

        // Context boosting
        if (context.major && entry.setContext === context.major) score *= 1.2;
        if (context.lastCategory && entry.category === context.lastCategory) score *= 1.1;

        // Entity boosting
        if (entities.level && entry.id.includes(entities.level.replace('l', 'l'))) score *= 1.3;
        if (entities.major && entry.id.toLowerCase().includes(entities.major)) score *= 1.25;

        if (score > bestScore) {
            bestScore = score;
            bestEntry = entry;
        }
    });

    return { entry: bestEntry, score: bestScore };
};

// ═══════════════════════════════════════════════════════════════
//  SUPBOT COMPONENT
// ═══════════════════════════════════════════════════════════════
const SupBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{
        id: 1,
        text: "Bonjour ! Je suis **SupBot** 🎓 — votre conseiller académique SupNum.\n\nPosez-moi vos questions sur les *filières, les notes, les stages* ou la plateforme, je suis là pour vous guider !",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: ['Quelles sont les filières ?', 'Calculer ma moyenne ?', 'Combien de stages ?'],
    }]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [context, setContext] = useState({ major: null, lastCategory: null });
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
    }, [isOpen]);

    const sendMessage = (text) => {
        if (!text.trim() || isTyping) return;

        const userMsg = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Natural delay based on query length
        const delay = 500 + Math.min(text.length * 10, 900);
        setTimeout(() => {
            const { entry, score } = findBestMatch(text, context);

            let responseText, suggestions = [], action = null;

            if (score >= 0.35 && entry) {
                // Multi-response intent (random)
                if (entry.responses) {
                    responseText = entry.responses[Math.floor(Math.random() * entry.responses.length)];
                } else {
                    responseText = entry.response;
                }
                suggestions = entry.suggestions || [];
                action = entry.action || null;

                // Update context
                setContext(prev => ({
                    major: entry.setContext || prev.major,
                    lastCategory: entry.category,
                }));
            } else {
                // Intelligent fallback with context hint
                const hint = context.major ? ` Vous semblez intéressé par la filière **${context.major}**.` : '';
                responseText = `Je n'ai pas trouvé de réponse précise à votre question.${hint} 🤔\n\nEssayez de reformuler, ou contactez la scolarité :\n📞 **+222 45 24 45 44**`;
                suggestions = ['Quelles sont les filières ?', 'Calculer ma moyenne ?', 'Combien de stages ?'];
            }

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: responseText,
                sender: 'bot',
                timestamp: new Date(),
                suggestions,
            }]);
            setIsTyping(false);

            if (action) setTimeout(() => navigate(`/${action}`), 1000);
        }, delay);
    };

    // ── Renderers ──────────────────────────────────────────────
    const renderInline = (text) => {
        const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*|\[.*?\]\(.*?\))/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
            if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="inline-code">{part.slice(1, -1)}</code>;
            if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
            if (part.startsWith('[') && part.includes('](')) {
                const m = part.match(/\[(.*?)\]\((.*?)\)/);
                if (m) return <a key={i} href={m[2]} target="_blank" rel="noopener noreferrer" className="bot-link">{m[1]}</a>;
            }
            return part;
        });
    };

    const renderMessage = (text) => text.split('\n').map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        const isList = /^(\*\s{3}|\d+\.\s{2}|\|\s)/.test(line.trim());
        return <div key={i} className={isList ? 'msg-list-item' : 'msg-line'}>{renderInline(line)}</div>;
    });

    const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="supbot-container">
            <button
                className={`supbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(o => !o)}
                aria-label="Ouvrir SupBot"
            >
                {isOpen ? <X size={24} /> : <Bot size={28} />}
                {!isOpen && <span className="supbot-tooltip">Besoin d'aide ?</span>}
            </button>

            {isOpen && (
                <div className="supbot-window">
                    <div className="supbot-header">
                        <div className="supbot-avatar"><Sparkles size={18} color="white" /></div>
                        <div className="supbot-info">
                            <h3>SupBot <span className="bot-badge">IA</span></h3>
                            <span>Conseiller Académique · SupNum</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="supbot-close-mobile"><X size={20} /></button>
                    </div>

                    <div className="supbot-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message ${msg.sender}`}>
                                {msg.sender === 'bot' && (
                                    <div className="message-avatar-small"><Bot size={14} /></div>
                                )}
                                <div className="msg-col">
                                    <div className="message-bubble">
                                        <div className="message-content">{renderMessage(msg.text)}</div>
                                        <span className="message-time">{fmt(msg.timestamp)}</span>
                                    </div>
                                    {msg.suggestions?.length > 0 && (
                                        <div className="suggestions-row">
                                            {msg.suggestions.map((s, i) => (
                                                <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message bot">
                                <div className="message-avatar-small"><Bot size={14} /></div>
                                <div className="message-bubble typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="supbot-input">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Posez votre question…"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage(inputText)}
                            disabled={isTyping}
                        />
                        <button onClick={() => sendMessage(inputText)} disabled={!inputText.trim() || isTyping}>
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupBot;
