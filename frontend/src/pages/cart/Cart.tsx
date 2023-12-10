import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import styles from './Cart.module.css';
import CartElement from '../../components/cartEement/CartElement';
import { Context } from '../..';
import Button from '../../ui/button/Button';
import DeliveryConditions from '../../components/deliveryConditions/DeliveryConditions';
import { ICartItem, IStatus } from '../../utils/types';
import useMediaQuery from '../../hooks/useMediaQuery';
import { deleteCookie } from '../../utils/cookies';
import { CART_URL, handleRequestWithAuth } from '../../utils/api';

const Cart = observer(() => {
	const navigate = useNavigate();
	const userStore = useContext(Context).user;
	const cartStore = useContext(Context).cart;
	const orderStore = useContext(Context).order;
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
		navigate('/signin');
	};

	const [isDisabled, setIsDisabled] = useState(false);
	const matches = useMediaQuery('(min-width: 576px)');
	const [status, setStatus] = useState<IStatus<[] | ICartItem[]>>({
		isloading: false,
		data: [],
		error: '',
	});
	const [statusCart, setStatusCart] = useState<IStatus<[] | ICartItem[]>>({
		isloading: false,
		data: [],
		error: '',
	});
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		setIsDisabled(
			cartStore.cart.some((el: ICartItem) => el.item.quantity < el.quantity)
		);
	}, [cartStore.cart]);

	useEffect(() => {
		handleRequestWithAuth(
			logOut,
			statusCart,
			setStatusCart,
			CART_URL,
			'GET',
			''
		);
		if (statusCart.data.length > 0) {
			cartStore.setCart(statusCart.data);
		}
	}, [statusCart.data.length]);

	return (
		<section className={styles.container}>
			{cartStore.cart.length === 0 ? (
				<p className={styles.title}>Ваша корзина пуста</p>
			) : (
				<>
					<DeliveryConditions />
					<div className={styles.totalGroup}>
						<p className={styles.text}>ИТОГО:</p>
						<p className={styles.text}>{`${cartStore.total} руб.`}</p>
					</div>
					<Button
						fontSize={matches ? '24px' : '16px'}
						width="300"
						text="Перейти к оформлению заказа"
						onClick={() => navigate('/checkout')}
						disabled={isDisabled}
					/>

					{cartStore.cart.length > 0 &&
						cartStore.cart.map((cartItem: ICartItem) => {
							return (
								<div key={cartItem.id} className={styles.cartItemGroup}>
									<CartElement
										status={status}
										setStatus={setStatus}
										cartItem={cartItem}
									/>
								</div>
							);
						})}
				</>
			)}
		</section>
	);
});

export default Cart;
