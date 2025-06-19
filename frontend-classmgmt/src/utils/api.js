import axios from 'axios';
import { getAuth } from 'firebase/auth';



// const BASE_URL = import.meta.env.BASE_URL || 'https://classmgmtsys.onrender.com';
// const BASE_URL = 'https://classmgmtsys.onrender.com';
const BASE_URL = 'http://localhost:3001';
console.log("BASE_URL:", BASE_URL);
const api = axios.create({
    baseURL: `${BASE_URL}/api`
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
    try {
        const auth = getAuth();
        if (auth.currentUser) {
            const token = await auth.currentUser.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    } catch (error) {
        console.error('Error in auth interceptor:', error);
        return Promise.reject(error);
    }
}, (error) => {
    return Promise.reject(error);
});

// Add response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized
                    console.error('Unauthorized access');
                    break;
                case 403:
                    // Handle forbidden
                    console.error('Forbidden access');
                    break;
                default:
                    console.error('API Error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
);

export default api; 