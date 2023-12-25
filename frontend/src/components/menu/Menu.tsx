/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';
import { Context } from '../..';
import { Role } from '../../utils/types';
import { deleteCookie } from '../../utils/cookies';
import CartIcon from '../../ui/icons/cartIcon/CartIcon';
import FlowerIcon from '../../ui/icons/flowerIcon/FlowerIcon';
import ExitIcon from '../../ui/icons/exitIcon/ExitIcon';
import OrderIcon from '../../ui/icons/orderIcon/OrderIcon';

interface IMenu {
	isOpen: boolean;
	closeMenu: () => void;
}
export default function Menu({ isOpen, closeMenu }: IMenu) {
	const userStore = useContext(Context).user;
	const cartStore = useContext(Context).cart;
	const orderStore = useContext(Context).order;
	const navigate = useNavigate();
	const logout = () => {
		userStore.setUser({});
		userStore.setIsAuth(false);
		cartStore.setCart([]);
		orderStore.setOrder([]);
		orderStore.setOrderCount();
		deleteCookie('token');
		deleteCookie('expires_on');
		localStorage.removeItem('token');
		navigate('/');
	};
	return (
		<ul
			className={
				!isOpen
					? `${styles.list} ${styles.list_default}`
					: `${styles.list} ${styles.list_active}`
			}
		>
			<li className={styles.list__item} onClick={closeMenu}>
				<NavLink
					to="/"
					className={({ isActive }) =>
						isActive ? styles.link_active : styles.link
					}
				>
					<div className={`${styles.wrapper} box-flex-row`}>
						<p>Магазин</p>
						<FlowerIcon count={0} />
					</div>
				</NavLink>
			</li>
			{userStore.isAuth && userStore.user.role === Role.ADMIN && (
				<>
					<li className={styles.list__item} onClick={closeMenu}>
						<NavLink
							to="/admin"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className={`${styles.wrapper} box-flex-row`}>
								<p> Добавить новый товар</p>
								<CartIcon count={0} />
							</div>
						</NavLink>
					</li>
					<li className={styles.list__item} onClick={closeMenu}>
						<NavLink
							to="/orders"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className={`${styles.wrapper} box-flex-row`}>
								<p> Заказы</p>
								<OrderIcon count={0} />
							</div>
						</NavLink>
					</li>
				</>
			)}

			{userStore.isAuth && userStore.user.role === Role.USER && (
				<>
					<li className={styles.list__item} onClick={closeMenu}>
						<NavLink
							to="/cart"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className={`${styles.wrapper} box-flex-row`}>
								<p>Корзина</p>
								<CartIcon
									count={userStore.isAuth ? cartStore.cart.length : 0}
								/>
							</div>
						</NavLink>
					</li>
					<li className={styles.list__item} onClick={closeMenu}>
						<NavLink
							to="/orders/me"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className={`${styles.wrapper} box-flex-row`}>
								<p>Заказы</p>
								<OrderIcon
									count={userStore.isAuth ? orderStore.orderCount : 0}
								/>
							</div>
						</NavLink>
					</li>
				</>
			)}
			{userStore.user.email ? (
				<>
					<li className={styles.list__item}>{userStore.user.email}</li>
					<li
						className={styles.list__item}
						onClick={() => {
							logout();
							closeMenu();
						}}
					>
						Выйти
						<ExitIcon />
					</li>
				</>
			) : (
				<>
					<li className={styles.list__item} onClick={closeMenu}>
						<NavLink
							to="/cart"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className={`${styles.wrapper} box-flex-row`}>
								<p>Корзина</p>
								<CartIcon count={0} />
							</div>
						</NavLink>
					</li>
					<li className={styles.list__item} onClick={closeMenu}>
						<NavLink
							to="/orders/me"
							className={({ isActive }) =>
								isActive ? styles.link_active : styles.link
							}
						>
							<div className={`${styles.wrapper} box-flex-row`}>
								<p>Заказы</p>
								<OrderIcon count={0} />
							</div>
						</NavLink>
					</li>
					<li
						className={styles.list__item}
						onClick={() => {
							closeMenu();
							navigate('/signin');
						}}
					>
						{' '}
						<p className={styles.exit}> Войти</p>
					</li>
				</>
			)}
		</ul>
	);
}
