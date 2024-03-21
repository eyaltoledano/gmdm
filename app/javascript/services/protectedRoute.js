// protectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import renderAlert from '../components/shared/renderAlert';
import { useUser } from '../hooks/useUser';
import { Loading } from 'react-daisyui';

const ProtectedRoute = ({ children }) => {
    const { isUserLoading, isLoggedIn, user } = useUser();

    if (isUserLoading) {
        return <Loading variant='ball' />
    }

    if (!isLoggedIn && !user) {
        // Redirect visitor to the home page, but save the current location they were
        // trying to go to (this is optional and could be skipped)
        renderAlert('error', 'Must be connected to access that page');
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
