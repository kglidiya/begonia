import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Context } from '../../index';
import styles from './NavBar.module.css';

import ExitIcon from '../../ui/icons/exitIcon/ExitIcon';
import { deleteCookie, getCookie } from '../../utils/cookies';
import CartIcon from '../../ui/icons/cartIcon/CartIcon';
import { ICartItem, IOrder, IStatus, Role } from '../../utils/types';
import FlowerIcon from '../../ui/icons/flowerIcon/FlowerIcon';
import { handleRequest } from '../../utils/utils';
import { ORDER_URL } from '../../utils/api';
import useMediaQuery from '../../hooks/useMediaQuery';
import Menu from '../menu/Menu';
import MenuIcon from '../../ui/icons/menu/MenuIcon';
import OrderIcon from '../../ui/icons/orderIcon/OrderIcon';
import { toJS } from 'mobx';

const NavBar = observer(() => {
	const accessToken: string | undefined = getCookie('token');
	const userStore = useContext(Context).user;
	const cartStore = useContext(Context).cart;
	const orderStore = useContext(Context).order;
	// const [count, setCount] = useState(0);
	// const [countOrder, setCountOrder] = useState(orderStore.orderCount || 0);
	const navigate = useNavigate();
	// const location = useLocation().pathname;
	const matches = useMediaQuery('(min-width: 912px)');
	const logout = () => {
		userStore.setUser({});
		userStore.setIsAuth(false);
		cartStore.setCart([]);
		cartStore.setTotal([]);
		orderStore.setOrder([]);
		orderStore.setOrderCount();
		deleteCookie('token');
		localStorage.removeItem('token');
		navigate('/');

		// setCount(0)
	};
	// console.log(toJS(cartStore.cart[0]))
	const [isMenuOpen, setMenuOpen] = useState(false);
	const closeMenu = () => {
		setMenuOpen(false);
	};

	const [status, setStatus] = useState<IStatus<ICartItem[] | []>>({
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
		if (userStore.isAuth) {
			// console.log(`'fetchCart' `)
			// cartStore.fetchCart(status, setStatus);
			cartStore.setTotal();
			// console.log(status.data[0])
		}
		// }, [status.data.length, cartStore.cart.length, userStore.isAuth]);
	}, [cartStore.cart.length, userStore.isAuth]);
	useEffect(() => {
		if (userStore.isAuth && userStore.user.role === Role.USER) {
			// console.log(`'fetchCart' `)

			cartStore.fetchCart(status, setStatus, accessToken);

			// console.log(userStore.user.email)
		}
		// }, [status.data.length, cartStore.cart.length, userStore.isAuth]);
	}, [status.data.length, userStore.isAuth]);
	useEffect(() => {
		if (userStore.isAuth && userStore.user.role === Role.USER) {
			handleRequest(
				statusOrder,
				setStatusOrder,
				`${ORDER_URL}/me`,
				'GET',
				'',
				accessToken
			);
		}
		if (status.data) {
			orderStore.setOrder(statusOrder.data);
			orderStore.setOrderCount();
		}
	}, [statusOrder.data?.length, userStore.isAuth]);

	// console.log( localStorage.getItem("token"))
	// console.log( accessToken)
	return (
		<header className={styles.container}>
			<Link className={styles.logoGroup} to="/">
				<div className={styles.logo} />
				<p className={styles.title}>Пеларгонии и Co</p>
			</Link>
			{matches && (
				<div className={styles.wrapper}>
					{userStore.isAuth && userStore.user.role === Role.ADMIN && (
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p> Магазин</p>
								<FlowerIcon count={0} />
							</div>
						</NavLink>
					)}
					{userStore.isAuth && userStore.user.role === Role.ADMIN && (
						<NavLink
							to="/admin"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p> Добавить новый товар</p>
								<CartIcon count={0} />
							</div>
						</NavLink>
					)}
					{userStore.isAuth && userStore.user.role === Role.ADMIN && (
						<NavLink
							to="/orders"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p> Заказы</p>
								<OrderIcon count={0} />
							</div>
						</NavLink>
					)}
					{userStore.user.role !== Role.ADMIN && (
						<NavLink
							to="/"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p>Магазин</p>
								<FlowerIcon count={0} />
							</div>
						</NavLink>
					)}
					{userStore.user.role !== Role.ADMIN && (
						<NavLink
							to="/cart"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p>Корзина</p>
								<CartIcon
									count={userStore.isAuth ? cartStore.cart.length : 0}
								/>
							</div>
						</NavLink>
					)}

					{userStore.user.role !== Role.ADMIN && (
						<NavLink
							to="/orders/me"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className="box-flex-row">
								<p>Заказы</p>
								<OrderIcon
									count={userStore.isAuth ? orderStore.orderCount : 0}
								/>
							</div>
						</NavLink>
					)}

					{userStore.user.email ? (
						<div className={styles.exitGroup}>
							<p className={styles.link_active}>{userStore.user.email}</p>
							<ExitIcon onClick={logout} />
						</div>
					) : (
						<NavLink
							to="/signin"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<p className="text-default"> Войти</p>
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
		</header>
	);
});

export default NavBar;
