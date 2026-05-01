import axios from 'axios';

const API = axios.create({
    baseURL: "https://fxae-backend.onrender.com",
    //baseURL: "http://localhost:5000",
    withCredentials: true,
});

export default API;