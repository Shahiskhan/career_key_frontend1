import api from './api';

const degreeRequestService = {
    createDegreeRequest: async (dto, document) => {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
        if (document) {
            formData.append('documents', document);
        }

        const response = await api.post('/degree-requests', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getRequestsByUniversity: async (universityId, page = 0, size = 10, sortBy = 'createdOn', sortDir = 'desc') => {
        const response = await api.get(`/degree-requests/university/${universityId}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    getRequestsByUniversityAndStatus: async (universityId, status, page = 0, size = 10, sortBy = 'createdOn', sortDir = 'desc') => {
        const response = await api.get(`/degree-requests/university/${universityId}/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    getRequestsByStudent: async (studentId, page = 0, size = 10, sortBy = 'createdOn', sortDir = 'desc') => {
        const response = await api.get(`/degree-requests/student/${studentId}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    getRequestsByStudentAndStatus: async (studentId, status, page = 0, size = 10, sortBy = 'createdOn', sortDir = 'desc') => {
        const response = await api.get(`/degree-requests/student/${studentId}/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    getRequestsByStatus: async (status, page = 0, size = 10, sortBy = 'createdOn', sortDir = 'desc') => {
        const response = await api.get(`/degree-requests/status/${status}`, {
            params: { page, size, sortBy, sortDir }
        });
        return response.data;
    },

    verifyByUniversity: async (degreeRequestId, universityId) => {
        const response = await api.post(`/degree-requests/${degreeRequestId}/verify/university/${universityId}`);
        return response.data;
    },

    rejectByUniversity: async (degreeRequestId, universityId, remarks) => {
        const response = await api.post(`/degree-requests/${degreeRequestId}/reject/university/${universityId}`, { remarks });
        return response.data;
    },
};

export default degreeRequestService;
