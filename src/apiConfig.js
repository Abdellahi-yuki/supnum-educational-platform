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
