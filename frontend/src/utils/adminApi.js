import axios from 'axios';

/**
 * Wrapper functions that attach the admin Authorization header.
 * Each returns the axios response data (not the full response).
 */
export const adminGet = async (backendUrl, token, path) => {
    const res = await axios.get(backendUrl + path, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const adminPost = async (backendUrl, token, path, body) => {
    const res = await axios.post(backendUrl + path, body, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const adminPut = async (backendUrl, token, path, body) => {
    const res = await axios.put(backendUrl + path, body, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

export const adminDelete = async (backendUrl, token, path) => {
    const res = await axios.delete(backendUrl + path, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
