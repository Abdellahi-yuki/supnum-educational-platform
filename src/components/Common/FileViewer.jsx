import React, { useState, useEffect } from 'react';
import { X, Download, File, Loader2 } from 'lucide-react';
import { API_BASE_URL, FILE_BASE_URL } from '../../apiConfig';
import './FileViewer.css';

/**
 * FileViewer Component
 * @param {Object} file - The file object containing nom and chemin_fichier
 * @param {Function} onClose - Callback to close the viewer
 */
const FileViewer = ({ file, onClose }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    if (!file) return null;

    // Construct full URL if it's a relative path starting with /uploads/ or /archives/
    const rawPath = file.chemin_fichier || file.file_path || file.path || file.media_url || '';

    let filepath = '';
    if (rawPath.startsWith('http')) {
        filepath = rawPath;
    } else if (rawPath.startsWith('/')) {
        // Absolute relative path (from domain root)
        filepath = `${FILE_BASE_URL}${rawPath}`;
    } else {
        // Relative path
        filepath = `${FILE_BASE_URL}/${rawPath}`;
    }

    const filename = file.nom || file.file_name || file.name || (rawPath.split('/').pop()) || 'document';
    const extension = filepath.split('.').pop().split('?')[0].toLowerCase();

    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension);
    const isPDF = extension === 'pdf';
    const isText = ['txt', 'sql', 'html', 'css', 'js', 'json', 'py', 'php', 'md'].includes(extension);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            try {
                if (filepath.includes('drive.google.com')) {
                    window.open(filepath, "_blank");
                    onClose();
                    return;
                }

                if (isPDF) {
                    let embedUrl = filepath;
                    if (filepath.includes('drive.google.com/file/d/')) {
                        const fileId = filepath.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)[1];
                        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                    }
                    setContent(
                        <iframe
                            src={embedUrl}
                            className="pdf-viewer"
                            title={filename}
                        >
                            <div className="viewer-fallback">
                                <p>Impossible d'afficher le PDF dans le navigateur.</p>
                                <a href={filepath} target="_blank" rel="noreferrer">Ouvrir dans un nouvel onglet</a>
                            </div>
                        </iframe>
                    );
                } else if (isImage) {
                    setContent(
                        <div className="image-container">
                            <img src={filepath} alt={filename} />
                        </div>
                    );
                } else if (isText) {
                    const response = await fetch(filepath);
                    if (!response.ok) throw new Error('Échec du chargement du contenu du fichier');
                    const textContent = await response.text();
                    setContent(
                        <div className="text-viewer">
                            <pre><code>{textContent}</code></pre>
                        </div>
                    );
                } else {
                    setContent(
                        <div className="download-fallback">
                            <File size={48} />
                            <h3>Fichier {extension.toUpperCase()}</h3>
                            <p>Ce type de fichier nécessite un téléchargement pour être visualisé.</p>
                            <button
                                onClick={() => downloadFile(filepath, filename)}
                                className="btn-download"
                            >
                                📥 Télécharger le fichier
                            </button>
                        </div>
                    );
                }
            } catch (err) {
                console.error('FileViewer Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (file) {
            loadContent();
        }
    }, [file, filepath, extension, isImage, isPDF, isText, filename, onClose]);

    const downloadFile = (url, name) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="file-viewer-overlay" onClick={(e) => e.target.classList.contains('file-viewer-overlay') && onClose()}>
            <div className="file-viewer-content fade-in">
                <div className="file-viewer-header">
                    <div className="file-info">
                        <File size={18} />
                        <span className="filename">{filename}</span>
                    </div>
                    <div className="viewer-actions">
                        <button
                            onClick={() => downloadFile(filepath, filename)}
                            className="btn-action"
                            title="Télécharger"
                        >
                            <Download size={18} />
                        </button>
                        <button
                            onClick={onClose}
                            className="btn-close"
                            title="Fermer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="file-viewer-body">
                    {loading ? (
                        <div className="loading-state">
                            <Loader2 className="animate-spin" />
                            <span>Chargement du document...</span>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>Oups ! Une erreur est survenue lors du chargement.</p>
                            <small>{error}</small>
                            <button onClick={onClose} className="btn-primary">Retour</button>
                        </div>
                    ) : (
                        content
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
