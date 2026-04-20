import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const AdminProtectedRoute = () => {
    const { adminToken } = useContext(ShopContext);

    // If there is no admin token, redirect to the admin login page
    if (!adminToken) {
        return <Navigate to="/admin/login" replace />;
    }

    // If token exists, render child routes
    return <Outlet />;
};

export default AdminProtectedRoute;
