import React, { createContext, useContext, useState, useCallback } from 'react';
import FileViewer from '../components/Common/FileViewer';

const FileViewerContext = createContext(null);

export const useFileViewer = () => {
    const context = useContext(FileViewerContext);
    if (!context) {
        throw new Error('useFileViewer must be used within a FileViewerProvider');
    }
    return context;
};

export const FileViewerProvider = ({ children }) => {
    const [viewingFile, setViewingFile] = useState(null);

    const openFile = useCallback((file) => {
        setViewingFile(file);
    }, []);

    const closeFile = useCallback(() => {
        setViewingFile(null);
    }, []);

    return (
        <FileViewerContext.Provider value={{ openFile, closeFile, viewingFile }}>
            {children}
            {viewingFile && (
                <FileViewer
                    file={viewingFile}
                    onClose={closeFile}
                />
            )}
        </FileViewerContext.Provider>
    );
};
