import api from './api';

export const hecService = {
    getHecDashboard: async (id) => {
        try {
            // According to user request: "agr hc ho to hecdasboard age student ho to studnet dashbaor"
            const response = await api.get(`/hec/${id}/dashboard`);
            return response.data;
        } catch (error) {
            console.error("Error fetching HEC dashboard:", error);
            throw error;
        }
    }
};
