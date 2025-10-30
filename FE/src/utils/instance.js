import axios from "axios";
import {BASE_URL} from "../utils/apiPath";

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Interceptors

//run before request is sent
instance.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

//run after response is received
instance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response && error.response.status===401){
            console.log("Unauthorized");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }   
        return Promise.reject(error);
    }
);

export default instance;
