const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // In development (localhost), use port 8000 for PHP backend
    if (hostname === 'localhost' || hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
        return `${protocol}//${hostname}:8000/api`;
    }

    // In production, assume API is at /api relative to the domain
    return `${protocol}//${hostname}/api`;
};

export const API_BASE_URL = getBaseUrl();

// FILE_BASE_URL: legacy root URL (kept for backwards compat)
export const FILE_BASE_URL = API_BASE_URL.replace('/api', '');

/**
 * Build a secure URL for any file stored in /uploads/.
 * In production, routes through /api/file.php?f=... to enforce authentication.
 * In dev, serves directly from the PHP dev server which handles /uploads/ natively.
 *
 * @param {string} filePath - The path as stored in DB, e.g. "/uploads/archive/photo.pdf"
 * @returns {string} Full URL to securely access the file
 */
export const getFileUrl = (filePath) => {
    if (!filePath) return '';
    // Strip leading slash and /uploads/ prefix to get relative path
    const relative = filePath.replace(/^\/uploads\//, '').replace(/^uploads\//, '');
    return `${API_BASE_URL}/file.php?f=${encodeURIComponent(relative)}`;
};
