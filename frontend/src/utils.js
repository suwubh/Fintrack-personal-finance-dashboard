import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right'
    });
};

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top-right'
    });
};

export const APIUrl =
    process.env.REACT_APP_API_URL || 'https://fintrack-personal-finance-dashboard.onrender.com';

/**
 * Helper for making authenticated API requests.
 * Automatically attaches JWT token from localStorage.
 */
export const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    return fetch(`${APIUrl}${endpoint}`, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};
