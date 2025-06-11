import api from '../utils/api';
import { auth } from '../firebase';


// Helper function to get current user info
const getCurrentUserInfo = () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User must be authenticated');
    
    return {
        uid: user.uid,
        name: user.displayName || 'Anonymous',
        email: user.email
    };
};

export const getNotices = async (page = 1) => {
    const response = await api.get(`/notices?page=${page}`);
    return response.data;
};

export const getNotice = async (id) => {
    const response = await api.get(`/notices/${id}`);
    return response.data;
};

export const createNotice = async (noticeData) => {
    const user = getCurrentUserInfo();
    
    // Format the data according to backend expectations
    const formattedData = {
        ...noticeData,
        author: user
    };

    console.log('Sending notice data:', formattedData);
    const response = await api.post('/notices', formattedData);
    return response.data;
};

export const updateNotice = async (id, noticeData) => {
    const user = getCurrentUserInfo();
    
    // Format the data according to backend expectations
    const formattedData = {
        ...noticeData,
        author: user
    };

    console.log('Updating notice data:', formattedData);
    const response = await api.put(`/notices/${id}`, formattedData);
    return response.data;
};

export const deleteNotice = async (id) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
}; 