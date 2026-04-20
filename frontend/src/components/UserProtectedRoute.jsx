import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const UserProtectedRoute = ({ children }) => {
    const { token } = useContext(ShopContext);

    if (!token) {
        return <Navigate to="/userlogin" replace />;
    }

    return children;
};

export default UserProtectedRoute;
