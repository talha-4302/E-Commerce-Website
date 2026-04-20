import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const backendUrl = "http://localhost:5000";

    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [adminToken, setAdminToken] = useState(() => localStorage.getItem('adminToken') || '');
    
    const [isUserVerified, setIsUserVerified] = useState(false);
    const [isAdminVerified, setIsAdminVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const verifyUserToken = async () => {
        if (!token) {
            setIsUserVerified(false);
            return;
        }

        try {
            const response = await axios.get(backendUrl + '/api/user/verify', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setIsUserVerified(true);
            } else {
                setIsUserVerified(false);
                setToken('');
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.log("Token Verification Error", error);
            setIsUserVerified(false);
            setToken('');
            localStorage.removeItem('token');
        }
    };

    const verifyAdminToken = async () => {
        if (!adminToken) {
            setIsAdminVerified(false);
            return;
        }

        try {
            const response = await axios.get(backendUrl + '/api/user/verify-admin', {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            if (response.data.success) {
                setIsAdminVerified(true);
            } else {
                setIsAdminVerified(false);
                setAdminToken('');
                localStorage.removeItem('adminToken');
            }
        } catch (error) {
            console.log("Admin Token Verification Error", error);
            setIsAdminVerified(false);
            setAdminToken('');
            localStorage.removeItem('adminToken');
        }
    };

    useEffect(() => {
        const verifyAll = async () => {
            setIsLoading(true);
            await Promise.all([
                verifyUserToken(),
                verifyAdminToken()
            ]);
            setIsLoading(false);
        };
        verifyAll();
    }, [token, adminToken]);

    const value = {
        token,
        setToken,
        adminToken,
        setAdminToken,
        isUserVerified,
        isAdminVerified,
        isLoading,
        backendUrl
    };

    return (
        <AuthContext.Provider value={value}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
