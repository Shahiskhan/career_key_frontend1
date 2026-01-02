import api from './api';

export const jobService = {
    fetchJobs: async (keywords) => {
        try {
            const response = await api.get('/student/jobs/fetch', {
                params: { keywords }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
