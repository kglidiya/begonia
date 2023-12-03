import Admin from './pages/admin/Admin';
import Item from './pages/item/Item';
import Shop from './pages/shop/Shop';
import Auth from './pages/signup/Signup';
import {
	ADMIN_ROUTE,
	// BASKET_ROUTE,
	ITEM_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
	SHOP_ROUTE,
} from './utils/paths';

export const protectedRoutes = [
	{
		path: ADMIN_ROUTE,
		component: Admin,
	},
	// {
	//   path: BASKET_ROUTE,
	//   component: Basket,
	// },
];

export const pubicRoutes = [
	{
		path: SHOP_ROUTE,
		component: Shop,
	},
	{
		path: `${ITEM_ROUTE}/:id`,
		component: Item,
	},
	{
		path: LOGIN_ROUTE,
		component: Auth,
	},
	{
		path: REGISTRATION_ROUTE,
		component: Auth,
	},
];
