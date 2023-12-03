import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from '../..';
import { Role } from '../../utils/types';

export const UserRoute = () => {
	const userStore = useContext(Context).user;

	const location = useLocation();

	return userStore.isAuth && userStore.user.role === Role.USER ? (
		<Outlet />
	) : (
		<Navigate to="/signin" state={{ from: location }} replace />
	);
};

export default UserRoute;
