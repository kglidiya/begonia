import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import styles from './NavBar.module.css';
import ExitIcon from '../../ui/icons/exitIcon/ExitIcon';
import { deleteCookie } from '../../utils/cookies';
import CartIcon from '../../ui/icons/cartIcon/CartIcon';
import { ICartItem, IOrder, IStatus, Role } from '../../utils/types';
import FlowerIcon from '../../ui/icons/flowerIcon/FlowerIcon';
import { CART_URL, ORDER_URL, handleRequestWithAuth } from '../../utils/api';
import useMediaQuery from '../../hooks/useMediaQuery';
import Menu from '../menu/Menu';
import MenuIcon from '../../ui/icons/menu/MenuIcon';
import OrderIcon from '../../ui/icons/orderIcon/OrderIcon';

interface INavBar {
	isMenuOpen: boolean;
	closeMenu: () => void;
	setMenuOpen: Dispatch<SetStateAction<boolean>>;
}
const NavBar = observer(({ isMenuOpen, closeMenu, setMenuOpen }: INavBar) => {
	const userStore = useContext(Context).user;
	const cartStore = useContext(Context).cart;
	const orderStore = useContext(Context).order;
	const navigate = useNavigate();
	const matches = useMediaQuery('(min-width: 912px)');
	const logOut = () => {
		userStore.setUser({});
		userStore.setIsAuth(false);
		cartStore.setCart([]);
		cartStore.setTotal([]);
		orderStore.setOrder([]);
		orderStore.setOrderCount();
		deleteCookie('token');
		deleteCookie('expires_on');
		localStorage.removeItem('token');
		navigate('/');
	};

	const [statusCart, setStatusCart] = useState<IStatus<ICartItem[] | []>>({
		isloading: false,
		data: [],
		error: '',
	});

	const [statusOrder, setStatusOrder] = useState<IStatus<IOrder[] | []>>({
		isloading: false,
		data: [],
		error: '',
	});
	useEffect(() => {
		if (userStore.isAuth && userStore.user.role === Role.USER) {
			cartStore.setTotal();
		}
	}, [cartStore.cart.length, userStore.isAuth]);
	useEffect(() => {
		if (userStore.isAuth && userStore.user.role === Role.USER) {
			handleRequestWithAuth(
				logOut,
				statusCart,
				setStatusCart,
				CART_URL,
				'GET',
				''
			);
			cartStore.setCart(statusCart.data);
		}
	}, [statusCart.data.length, userStore.isAuth]);

	useEffect(() => {
		if (userStore.isAuth && userStore.user.role === Role.USER) {
			handleRequestWithAuth(
				logOut,
				statusOrder,
				setStatusOrder,
				`${ORDER_URL}/me`,
				'GET',
				''
			);
		}
		if (statusOrder.data) {
			orderStore.setOrder(statusOrder.data);
			orderStore.setOrderCount();
		}
	}, [statusOrder.data?.length, userStore.isAuth]);

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<Link className={styles.logo} to="/">
					<div className={styles.logo__image} />
					<p className={styles.logo__title}>Мир бегоний</p>
				</Link>
				{matches && (
					<div className={styles.links}>
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p className={styles.link__text}> Магазин</p>
								<FlowerIcon count={0} />
							</div>
						</NavLink>
						{!userStore.isAuth && (
							<>
								<NavLink
									to="/cart"
									className={({ isActive }) =>
										isActive ? styles.link_active : styles.link
									}
								>
									<div className="box-flex-row">
										<p className={styles.link__text}>Корзина</p>
										<CartIcon count={0} />
									</div>
								</NavLink>
								<NavLink
									to="/orders/me"
									className={({ isActive }) =>
										isActive ? styles.link_active : styles.link
									}
								>
									<div className="box-flex-row">
										<p className={styles.link__text}>Заказы</p>
										<OrderIcon count={0} />
									</div>
								</NavLink>
							</>
						)}
						{userStore.isAuth && userStore.user.role === Role.ADMIN && (
							<>
								<NavLink
									to="/admin"
									className={({ isActive }) =>
										isActive ? styles.link_active : styles.link
									}
								>
									<div className="box-flex-row">
										<p className={styles.link__text}> Добавить новый товар</p>
										<CartIcon count={0} />
									</div>
								</NavLink>
								<NavLink
									to="/orders"
									className={({ isActive }) =>
										isActive ? styles.link_active : styles.link
									}
								>
									<div className="box-flex-row">
										<p className={styles.link__text}>Заказы</p>
										<OrderIcon count={0} />
									</div>
								</NavLink>
							</>
						)}
						{userStore.user.role === Role.USER && (
							<>
								<NavLink
									to="/cart"
									className={({ isActive }) =>
										isActive ? styles.link_active : styles.link
									}
								>
									<div className="box-flex-row">
										<p className={styles.link__text}>Корзина</p>
										<CartIcon
											count={userStore.isAuth ? cartStore.cart.length : 0}
										/>
									</div>
								</NavLink>
								<NavLink
									to="/orders/me"
									className={({ isActive }) =>
										isActive ? styles.link_active : styles.link
									}
								>
									<div className="box-flex-row">
										<p className={styles.link__text}>Заказы</p>
										<OrderIcon
											count={userStore.isAuth ? orderStore.orderCount : 0}
										/>
									</div>
								</NavLink>
							</>
						)}

						{userStore.user.email ? (
							<div className={styles.exit}>
								<p className={styles.link_active}>{userStore.user.email}</p>
								<ExitIcon onClick={logOut} />
							</div>
						) : (
							<NavLink
								to="/signin"
								className={({ isActive }) =>
									isActive ? styles.link_active : styles.link
								}
							>
								<p className={styles.link__text}> Войти</p>
							</NavLink>
						)}
					</div>
				)}
				{!matches && (
					<>
						<MenuIcon
							onClick={() => {
								setMenuOpen(!isMenuOpen);
							}}
						/>
						<Menu isOpen={isMenuOpen} closeMenu={closeMenu} />
					</>
				)}
			</div>
		</header>
	);
});

export default NavBar;
