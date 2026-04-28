import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProtectedRoute = () => {
    const { isAdminVerified, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (isAdminVerified) {
        return <Outlet />;
    } else {
        return <Navigate to="/admin/login" replace />;
    }
};

export default AdminProtectedRoute;
