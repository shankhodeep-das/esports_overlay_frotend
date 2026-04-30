import axios from 'axios';

const API = axios.create({
    baseURL: 'https://fxae-backend.vercel.app/', // Change to your production URL later
});

export default API;