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
import { handleRequest } from '../../utils/utils';
import { getCookie } from '../../utils/cookies';
import { CART_URL } from '../../utils/api';
import { Context } from '../..';
import ButtonIncrement from '../../ui/buttonIncrement/ButtonIncrement';
import ButtonDecrement from '../../ui/buttonDecrement/ButtonDecrement';
import PlusIcon from '../../ui/icons/plusIcon/PlusIcon';
import { ITEM_ROUTE } from '../../utils/paths';
import { ICartItem, IStatus } from '../../utils/types';
import { toJS } from 'mobx';

interface ICartElement {
	status: IStatus<[] | ICartItem[]>;
	setStatus: Dispatch<SetStateAction<IStatus<[] | ICartItem[]>>>;
	cartItem: ICartItem;
	setIsDisabled: Dispatch<SetStateAction<boolean>>;
}
const CartElement = observer(
	({ cartItem, setStatus, status, setIsDisabled }: ICartElement) => {
		const cartStore = useContext(Context).cart;
		const [count, setCount] = useState(+cartItem.quantity);
		const accessToken: string | undefined = getCookie('token');
		const navigate = useNavigate();

		const increment = () => {
			setCount((count) => count + 1);
		};

		const decrement = () => {
			setCount((count) => count - 1);
		};

		const deleteCartItem = () => {
			cartStore.deleteCart(status, setStatus, cartItem.id, accessToken);
		};

		useEffect(() => {
			// if (cartItem.item.quantity < count) {
			// 	setIsDisabled(true);
			// }
			// if (cartItem.item.quantity >= count) {
			// 	setIsDisabled(false);
			// }
		// 			cartStore.cart.some((cartElement: any) => {
		// 	console.log(cartElement)
		// 	if (cartElement.item.quantity < cartElement.quantity) {
		// 		setIsDisabled(true);
		// 	}
		// 	if (cartElement.item.quantity >= cartElement.quantity) {
		// 		setIsDisabled(false);
		// 	}
		// });
			handleRequest(
				status,
				setStatus,
				CART_URL,
				'PATCH',
				{ id: cartItem.id, quantity: count },
				accessToken
			);
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
						<p
							className={styles.warning}
						>Товар закончился. Удалите товар из корзины для пролжения заказа</p>
					)}
				</div>

				<div className={styles.countGroup}>
					<div className="box-flex-row">
						<ButtonDecrement onClick={decrement} count={count} />
						{/* <p className="text-medium">{count}</p> */}
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
