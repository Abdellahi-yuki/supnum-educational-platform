import React, { useState, useEffect } from 'react';
import { Download, X, FileText, Music2, File } from 'lucide-react';

const FileViewer = ({ file, onClose }) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const filepath = file.chemin_fichier;
    const filename = file.nom;
    const extension = filepath.split('.').pop().toLowerCase();

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            try {
                // Handle Google Drive links
                if (filepath.includes('drive.google.com')) {
                    window.open(filepath, "_blank");
                    onClose();
                    return;
                }

                if (['pdf'].includes(extension)) {
                    // PDF handling
                    let embedUrl = filepath;
                    if (filepath.includes('drive.google.com/file/d/')) {
                        const fileId = filepath.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)[1];
                        embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                    }
                    setContent(
                        <div style={{ textAlign: 'center' }}>
                            <iframe src={embedUrl} style={{ width: '100%', height: '600px', border: 'none', borderRadius: '4px' }} allow="autoplay">
                                <p>Impossible d'afficher le PDF. <a href={filepath} target="_blank" rel="noreferrer">Cliquez ici pour l'ouvrir</a></p>
                            </iframe>
                        </div>
                    );
                } else if (['txt', 'md', 'py', 'js', 'html', 'css', 'csv'].includes(extension)) {
                    const response = await fetch(filepath);
                    if (!response.ok) throw new Error(`Fichier non trouvé (${response.status})`);
                    const text = await response.text();

                    if (extension === 'csv') {
                        const rows = text.split('\n').map(row => row.split(','));
                        setContent(
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                {row.map((cell, cellIndex) => {
                                                    const Tag = index === 0 ? 'th' : 'td';
                                                    const style = index === 0 ? { background: '#f8f9fa', fontWeight: 'bold' } : {};
                                                    return <Tag key={cellIndex} style={{ border: '1px solid #e2e8f0', padding: '8px 12px', textAlign: 'left', ...style }}>{cell.trim()}</Tag>;
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        );
                    } else {
                        const language = extension === 'py' ? 'python' : extension === 'js' ? 'javascript' : extension;
                        setContent(
                            <div>
                                <div style={{ background: '#2d3748', color: '#e2e8f0', padding: '10px', borderRadius: '4px 4px 0 0', fontFamily: 'monospace', fontSize: '12px' }}>
                                    📄 {filename} ({language})
                                </div>
                                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: "'Courier New', monospace", background: '#f8f9fa', padding: '20px', borderRadius: '0 0 4px 4px', overflowX: 'auto', margin: '0', border: '1px solid #e2e8f0' }}>{text}</pre>
                            </div>
                        );
                    }
                } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) {
                    setContent(
                        <div style={{ textAlign: 'center' }}>
                            <img src={filepath} style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} alt={filename} />
                        </div>
                    );
                } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    setContent(
                        <div style={{ textAlign: 'center' }}>
                            <video controls style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px' }}>
                                <source src={filepath} type={`video/${extension}`} />
                                Votre navigateur ne supporte pas la lecture vidéo.
                            </video>
                        </div>
                    );
                } else if (['mp3', 'wav'].includes(extension)) {
                    setContent(
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}><Music2 size={48} /></div>
                            <audio controls style={{ width: '100%', maxWidth: '400px' }}>
                                <source src={filepath} type={`audio/${extension}`} />
                                Votre navigateur ne supporte pas la lecture audio.
                            </audio>
                        </div>
                    );
                } else {
                    // Default for downloadable files
                    setContent(
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}><File size={48} /></div>
                            <h3>Fichier {extension.toUpperCase()}</h3>
                            <p>Ce type de fichier nécessite un téléchargement pour être visualisé.</p>
                            <button onClick={() => downloadFile(filepath, filename)} style={{ background: '#4299e1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>📥 Télécharger le fichier</button>
                        </div>
                    );
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [file]);

    const downloadFile = (filepath, filename) => {
        const link = document.createElement('a');
        link.href = filepath;
        link.download = filename || 'document';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div id="fileViewer" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '15px 20px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8f9fa'
                }}>
                    <h3 style={{ margin: 0 }}>{filename}</h3>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button onClick={() => downloadFile(filepath, filename)} style={{
                            background: '#4299e1',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}><Download size={16} /> Télécharger</button>
                        <button onClick={onClose} style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            borderRadius: '4px'
                        }}><X size={20} /></button>
                    </div>
                </div>
                <div style={{
                    flex: 1,
                    padding: '20px',
                    overflow: 'auto',
                    background: 'white'
                }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 2s linear infinite', margin: '0 auto' }}></div>
                            <p>Chargement...</p>
                            <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#e53e3e' }}>
                            <h3>Erreur de chargement</h3>
                            <p>Impossible de charger le fichier: {error}</p>
                            <button onClick={() => window.open(filepath, '_blank')} style={{ background: '#4299e1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Essayer d'ouvrir dans un nouvel onglet</button>
                        </div>
                    ) : content}
                </div>
            </div>
        </div>
    );
};

export default FileViewer;
