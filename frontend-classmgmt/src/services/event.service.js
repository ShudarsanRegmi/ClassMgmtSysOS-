import api from '../utils/api';

export const eventService = {
    // Get all events for a class with optional filters
    getClassEvents: async (classId, filters = {}) => {
        const queryParams = new URLSearchParams();
        
        // Add filters to query params
        if (filters.semester) queryParams.append('semester', filters.semester);
        if (filters.startDate) queryParams.append('startDate', filters.startDate);
        if (filters.endDate) queryParams.append('endDate', filters.endDate);
        if (filters.tags) queryParams.append('tags', filters.tags.join(','));
        if (filters.sort) queryParams.append('sort', filters.sort);

        const response = await api.get(`/events/class/${classId}?${queryParams}`);
        return response.data.events;
    },

    // Get single event by ID
    getEvent: async (eventId) => {
        const response = await api.get(`/events/${eventId}`);
        return response.data.event;
    },

    // Create new event
    createEvent: async (formData) => {
        const response = await api.post('/events', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.event;
    },

    // Update event
    updateEvent: async (eventId, formData) => {
        const response = await api.put(`/events/${eventId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.event;
    },

    // Delete event
    deleteEvent: async (eventId) => {
        await api.delete(`/events/${eventId}`);
    },

    // Like/Unlike event
    toggleLike: async (eventId) => {
        const response = await api.post(`/events/${eventId}/like`);
        return response.data.event;
    },

    // Add comment
    addComment: async (eventId, content) => {
        const response = await api.post(`/events/${eventId}/comments`, { content });
        return response.data.event;
    },

    // Delete comment
    deleteComment: async (eventId, commentId) => {
        const response = await api.delete(`/events/${eventId}/comments/${commentId}`);
        return response.data.event;
    }
}; 