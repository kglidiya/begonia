import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Context } from '../..';
import { Role } from '../../utils/types';

const AdminRoute = () => {
	const userStore = useContext(Context).user;

	const location = useLocation();

	return userStore.isAuth && userStore.user.role === Role.ADMIN ? (
		<Outlet />
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
};

export default AdminRoute;
