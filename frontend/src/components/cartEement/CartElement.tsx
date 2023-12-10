/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import styles from './CartElement.module.css';

import { deleteCookie } from '../../utils/cookies';
import { CART_URL, handleRequestWithAuth } from '../../utils/api';
import { Context } from '../..';
import ButtonIncrement from '../../ui/buttonIncrement/ButtonIncrement';
import ButtonDecrement from '../../ui/buttonDecrement/ButtonDecrement';
import PlusIcon from '../../ui/icons/plusIcon/PlusIcon';
import { ITEM_ROUTE } from '../../utils/paths';
import { ICartItem, IStatus } from '../../utils/types';

interface ICartElement {
	status: IStatus<[] | ICartItem[]>;
	setStatus: Dispatch<SetStateAction<IStatus<[] | ICartItem[]>>>;
	cartItem: ICartItem;
}
const CartElement = observer(
	({ cartItem, setStatus, status }: ICartElement) => {
		const userStore = useContext(Context).user;
		const cartStore = useContext(Context).cart;
		const orderStore = useContext(Context).order;
		const navigate = useNavigate();
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
		const [count, setCount] = useState(+cartItem.quantity);

		const increment = () => {
			setCount((count) => count + 1);
		};

		const decrement = () => {
			setCount((count) => count - 1);
		};

		const deleteCartItem = () => {
			handleRequestWithAuth(
				logOut,
				status,
				setStatus,
				`${CART_URL}`,
				'DELETE',
				{ id: cartItem.id }
			);
			cartStore.deleteCart(cartItem.id);
		};

		useEffect(() => {
			handleRequestWithAuth(logOut, status, setStatus, CART_URL, 'PATCH', {
				id: cartItem.id,
				quantity: count,
			});
			cartStore.changeQuantity(cartItem.id, count);
			cartStore.setTotal();
		}, [count]);

		return (
			<div className={styles.cartItemGroup}>
				<img
					src={cartItem.item.image}
					alt={cartItem.item.name}
					className={styles.image}
					onClick={() => {
						navigate(`/${ITEM_ROUTE}/${cartItem.item.id}`);
					}}
				/>
				<div
					className={`${styles.descriptionGroup} box-flex-column`}
					onClick={() => {
						navigate(`/${ITEM_ROUTE}/${cartItem.item.id}`);
					}}
				>
					<p className="text-default text-bold">{cartItem.item.name}</p>
					<p className={styles.description}>{cartItem.item.description}</p>
					{cartItem.item.quantity === count && (
						<p className={styles.warning}>Больше нет в наличии</p>
					)}
					{cartItem.item.quantity !== 0 && cartItem.item.quantity < count && (
						<p
							className={styles.warning}
						>{`Осталось ${cartItem.item.quantity} шт. Уменьшите количество`}</p>
					)}
					{cartItem.item.quantity === 0 && cartItem.item.quantity < count && (
						<p className={styles.warning}>
							Товар закончился. Удалите товар из корзины для пролжения заказа
						</p>
					)}
				</div>

				<div className={styles.countGroup}>
					<div className="box-flex-row">
						<ButtonDecrement onClick={decrement} count={count} />
						<p className="text-medium">{cartItem.quantity}</p>
						<ButtonIncrement
							onClick={increment}
							disabled={cartItem.item.quantity <= count}
						/>
					</div>

					<p className="text-medium text-bold">{`${cartItem.subTotal} руб.`}</p>
				</div>
				<span className={styles.closeButton}>
					<PlusIcon onClick={deleteCartItem} />
				</span>
			</div>
		);
	}
);

export default CartElement;
