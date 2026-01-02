import api from './api';

export const studentService = {
    getStudentDashboard: async (id) => {
        try {
            const response = await api.get(`/student/${id}/dashboard`);
            return response.data;
        } catch (error) {
            console.error("Error fetching student dashboard:", error);
            throw error;
        }
    }
};
