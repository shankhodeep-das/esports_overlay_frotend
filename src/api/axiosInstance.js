import axios from 'axios';

const API = axios.create({
    baseURL: "https://fxae-backend.onrender.com",
});

export default API;