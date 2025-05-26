import axios from 'axios';
import { auth } from '../firebase';

const API_URL = 'http://localhost:3001/api/notices';

// Helper function to get the current user's auth token
const getAuthHeader = async () => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    }
    return {};
};

export const getNotices = async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({
        page,
        limit,
        ...filters
    });
    const response = await axios.get(`${API_URL}?${params}`);
    return response.data;
};

export const getNotice = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createNotice = async (noticeData) => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User must be authenticated to create a notice');
    }

    const authConfig = await getAuthHeader();
    const noticeWithUserData = {
        ...noticeData,
        author: {
            uid: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email
        }
    };

    const response = await axios.post(API_URL, noticeWithUserData, authConfig);
    return response.data;
};

export const updateNotice = async (id, noticeData) => {
    const authConfig = await getAuthHeader();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User must be authenticated to update a notice');
    }

    const noticeWithUserData = {
        ...noticeData,
        author: {
            uid: user.uid,
            name: user.displayName || 'Anonymous',
            email: user.email
        }
    };

    const response = await axios.put(`${API_URL}/${id}`, noticeWithUserData, authConfig);
    return response.data;
};

export const deleteNotice = async (id) => {
    const authConfig = await getAuthHeader();
    if (!auth.currentUser) {
        throw new Error('User must be authenticated to delete a notice');
    }

    const response = await axios.delete(`${API_URL}/${id}`, authConfig);
    return response.data;
}; 