import API from './axiosInstance';

export const fetchPendingMembers = async () => {
    const response = await API.get('/admin/pending-members');
    return response.data;
};

export const updateMemberStatus = async (id, action) => {
    const response = await API.post('/admin/handle-request', { userId: id, action: action });
    return response.data;
};