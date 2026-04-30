import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000', // Change to your production URL later
});

export default API;