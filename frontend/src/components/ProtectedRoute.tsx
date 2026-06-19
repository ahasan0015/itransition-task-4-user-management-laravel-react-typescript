import { Navigate, Outlet } from 'react-router-dom';

/**
 * NOTE: Login User Only Route
 */
const ProtectedRoute = () => {
    // cheack if token exists in localStorage
    const token = localStorage.getItem('token');

    // IMPORTANT: if token exists, render the route (Outlet), 
    // otherwise redirect to login.
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;