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
import Loader from '../../components/loader/Loader';
import ErrorWarning from '../../components/errorWarning/ErrorWarning';
import { toJS } from 'mobx';
import { check } from 'prettier';
import { getCookie } from '../../utils/cookies';
import { CART_URL } from '../../utils/api';
import { handleRequest } from '../../utils/utils';

const Cart = observer(() => {
	const cartStore = useContext(Context).cart;
	const accessToken: string | undefined = getCookie('token');
	const navigate = useNavigate();

	const [cartItems, setCartItems] = useState<[] | ICartItem[]>([]);
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

	// if (status.error) {
	// 	return <ErrorWarning />;
	// }
	// if(status.isloading) {
	// 	return <Loader/>
	// }
	// console.log(cartStore.cart)

	const updateCart = () => {
		handleRequest(statusCart, setStatusCart, CART_URL, 'GET', '', accessToken);

		// if(statusCart.data.length > 0) {
		// 	cartStore.setCart(statusCart.data)
		// 	console.log('1')
		// 	if(!isDisabled){
		// 		console.log('2')
		// 		navigate('/checkout')
		// 	}
		// }
		// cartStore.setCart(statusCart.data)
	};
	//console.log(statusCart.data)
	useEffect(() => {
		handleRequest(statusCart, setStatusCart, CART_URL, 'GET', '', accessToken);
		// console.log(statusCart.data)
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
					{/* {cartItems.length > 0 &&
						cartItems.map((cartItem) => {
							return (
								<div key={cartItem.id} className={styles.cartItemGroup}>
									<CartElement
										status={status}
										setStatus={setStatus}
										cartItem={cartItem}
										setIsDisabled={setIsDisabled}
									/>
								</div>
							);
						})} */}
					{cartStore.cart.length > 0 &&
						cartStore.cart.map((cartItem: ICartItem) => {
							return (
								<div key={cartItem.id} className={styles.cartItemGroup}>
									<CartElement
										status={status}
										setStatus={setStatus}
										cartItem={cartItem}
										setIsDisabled={setIsDisabled}
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
