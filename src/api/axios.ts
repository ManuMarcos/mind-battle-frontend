import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const api = axios.create({
    baseURL : 'http://localhost:8080/api',
    headers: {
        'Content-Type' : 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if(accessToken){
            const decodedToken = jwtDecode(accessToken);
            if(decodedToken.exp && decodedToken.exp > Math.floor(Date.now() / 1000)){
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    (error) =>  Promise.reject(error)
);



export default api;