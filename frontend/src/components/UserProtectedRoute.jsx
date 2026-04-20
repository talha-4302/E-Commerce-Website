import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const UserProtectedRoute = ({ children }) => {
    const { isUserVerified, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isUserVerified) {
        return <Navigate to="/userlogin" replace />;
    }

    return children;
};

export default UserProtectedRoute;
