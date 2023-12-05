import { Route, Routes } from 'react-router-dom';
import Item from '../../pages/item/Item';
import {
	ADMIN_ROUTE,
	CART_ROUTE,
	CHECKOUT_ROUTE,
	FORGOT_PASSWORD_ROUTE,
	ITEM_ROUTE,
	LOGIN_ROUTE,
	ORDER_ROUTE,
	REGISTRATION_ROUTE,
	RESET_PASSWORD_ROUTE,
	SHOP_ROUTE,
} from '../../utils/paths';
import Shop from '../../pages/shop/Shop';
import Signup from '../../pages/signup/Signup';
import Signin from '../../pages/signin/Signin';
import AdminRoute from '../adminRouter/AdminRoute';
import Cart from '../../pages/cart/Cart';
import Admin from '../../pages/admin/Admin';
import { ProtectedRoute } from '../protectedRoute/ProtectedRoute';
import ForgotPassword from '../../pages/forgotPassword/ForgotPassword';
import styles from './AppRouter.module.css';
import ResetPassword from '../../pages/resetPassword/ResetPassword';
import CheckOut from '../../pages/checkOut/CheckOut';
import Orders from '../../pages/ordersAdmin/OrdersAdmin';
import OrdersUser from '../../pages/odersUser/OrdersUser';
import OrderDetails from '../../pages/orderDetails/OrderDetails';
import { UserRoute } from '../userRoute/UserRoute';
interface IAppRouter {
	closeMenu: () => void;
}
export default function AppRouter({closeMenu}: IAppRouter) {
	return (
		<main className={styles.main} onClick={closeMenu}>
			<Routes>
				<Route path={SHOP_ROUTE} element={<Shop />} />
				<Route path={REGISTRATION_ROUTE} element={<Signup />} />
				<Route path={LOGIN_ROUTE} element={<Signin />} />
				<Route path={FORGOT_PASSWORD_ROUTE} element={<ForgotPassword />} />
				<Route path={RESET_PASSWORD_ROUTE} element={<ResetPassword />} />
				<Route element={<UserRoute />}>
					<Route path={CART_ROUTE} element={<Cart />} />
					<Route path={CHECKOUT_ROUTE} element={<CheckOut />} />
					<Route path={`${ORDER_ROUTE}/me`} element={<OrdersUser />} />
				</Route>
				<Route element={<ProtectedRoute />}>
					<Route path={`${ORDER_ROUTE}/:id`} element={<OrderDetails />} />
				</Route>
				<Route path={`${ITEM_ROUTE}/:id`} element={<Item />} />

				<Route element={<AdminRoute />}>
					<Route path={ADMIN_ROUTE} element={<Admin />} />
					<Route path={ORDER_ROUTE} element={<Orders />} />
					{/* <Route path={`${ORDER_ROUTE}/:id`} element={<OrderDetails />} /> */}
				</Route>
			</Routes>
		</main>
	);
}
