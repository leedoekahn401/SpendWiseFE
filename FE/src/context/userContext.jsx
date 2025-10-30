import React, { createContext, useState, useEffect } from "react";
import instance from "../utils/instance";
import { API_PATH } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const res = await instance.get(API_PATH.AUTH.GET_INFO);
                    setUser(res.data.data);
                } catch (err) {
                    console.error("Failed to fetch user with token:", err);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const updateUser = (newUserData) => {
        setUser(prevUser => ({ ...prevUser, ...newUserData }));
    };

    const loginUser = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider 
            value={{ user, loading, loginUser, logoutUser, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;