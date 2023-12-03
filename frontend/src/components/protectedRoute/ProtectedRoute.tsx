import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../..';

export const ProtectedRoute = () => {
	const userStore = useContext(Context).user;

	const location = useLocation();

	return userStore.isAuth ? (
		<Outlet />
	) : (
		<Navigate to="/signin" state={{ from: location }} replace />
	);
};

export default ProtectedRoute;
