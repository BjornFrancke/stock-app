import axios from "axios";


const authToken = localStorage.getItem('token');
export const axiosConfig = {
    headers: { Authorization: `Bearer ${authToken}` }
}


export const instance = axios.create({
    baseURL: 'http://localhost:3000'
});
instance.defaults.headers.common = axiosConfig.headers;
