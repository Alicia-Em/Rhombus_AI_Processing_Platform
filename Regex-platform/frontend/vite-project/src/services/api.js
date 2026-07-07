import axios from 'axios'

const API_BASE_URL = 'http:localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": 'multipart/form-data',
    },
});

export const uploadFile = async (formData) => {
    try {
        const response = await api.post('/upload/', formData)
        return response.data
    } catch (error) {
        throw error.rsponse?.data || error.message;
    }
};

export const getAllJobs = async () => {
    try {
        const response = await api.get('/jobs/');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message
    }
};

export const downloadResult = async (jobId) => {
    try {
        const response = await api.get(`jobs/${jobid}/download/`);
        return response.data
    } catch (error) {
        throw error.response?.data || error.message
    }
};
