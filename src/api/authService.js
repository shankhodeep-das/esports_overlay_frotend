import API from './axiosInstance';

export const requestAccess = async (userData) => {
    const response = await API.post('/auth/request-access', userData);
    return response.data;
};