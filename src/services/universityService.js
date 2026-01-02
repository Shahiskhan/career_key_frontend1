import api from './api';

export const universityService = {
    getAllUniversities: async () => {
        try {
            const response = await api.get('/hec/universities');
            return response.data;
        } catch (error) {
            console.error("Error fetching universities:", error);
            return [];
        }
    },
    getUniversityDashboard: async (id) => {
        try {
            const response = await api.get(`/${id}/dashboard`);
            return response.data;
        } catch (error) {
            console.error("Error fetching university dashboard:", error);
            throw error;
        }
    }
};
