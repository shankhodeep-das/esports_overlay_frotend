import API from './axiosInstance';

export const createMatch = async (matchData, token) => {
  try {
    const response = await API.post(`/admin/create-match`, matchData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Network Error" };
  }
};

export const getAllMatches = async (token) => {
  try {
    const response = await API.get(`/admin/get-all-match`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.data.success && response.data.matches) {
      return response.data.matches;
    } // Should return an array of match objects
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch matches" };
  }
};