/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import styles from './OrderUserElement.module.css';
import { IOrder, IStatus, OrderStatus } from '../../utils/types';
import { formatDate, getOrderStatus, getTotal } from '../../utils/utils';
import { ORDER_URL, handleRequestWithAuth } from '../../utils/api';
import { ORDER_ROUTE } from '../../utils/paths';
import Button from '../../ui/button/Button';
import { deleteCookie } from '../../utils/cookies';
import { Context } from '../..';

interface IOrderUserElement {
	orderItem: IOrder;
}

const OrderUserElement = observer(({ orderItem }: IOrderUserElement) => {
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
	const [orderStatus, setOrderStatus] = useState(orderItem.status);

	const [status, setStatus] = useState<IStatus<[] | IOrder>>({
		isloading: false,
		data: [],
		error: '',
	});

	const deleteOrder = () => {
		handleRequestWithAuth(logOut, status, setStatus, `${ORDER_URL}`, 'PATCH', {
			id: orderItem.id,
			status: OrderStatus.CANCELLED,
		});

		setOrderStatus(OrderStatus.CANCELLED);
		orderStore.updateOrderStatus(orderItem.id);
		orderStore.setOrderCount();
	};

	const onClick = (e: React.MouseEvent<HTMLElement>) => {
		const target = e.target as HTMLElement;
		if (target.textContent === 'Отменить') {
			deleteOrder();
		} else navigate(`${ORDER_ROUTE}/${orderItem.id}`);
	};

	return (
		<>
			{orderItem.orderItems && (
				<article className={styles.container} onClick={(e) => onClick(e)}>
					<div className={styles.orderGroup}>
						<p className={styles.text}>{`Закат от ${formatDate(
							String(orderItem.createdAt)
						)}`}</p>
						<p className={styles.price}>{`Общая сумма заказа: ${getTotal(
							orderItem.orderItems
						)} руб.`}</p>
						<p className={styles.orderStatus}>
							{getOrderStatus(orderItem.status)}
						</p>
					</div>

					<div className={styles.itemsGroup}>
						{orderItem.orderItems.map((el) => {
							return (
								<ul key={el.id} className={styles.list}>
									<li className={styles.list__item}>{el.item.name}</li>
									<li>
										<img
											src={el.item.image}
											alt={el.item.name}
											className={styles.list__image}
										/>
									</li>
									<li className={styles.list__item}>{`${el.quantity} шт.`}</li>
									<li className={styles.list__item}>{`${el.subTotal} руб.`}</li>
								</ul>
							);
						})}
					</div>
					{orderStatus === OrderStatus.CREATED && (
						<Button width="100px" text="Отменить" fontSize="20px" />
					)}
				</article>
			)}
		</>
	);
});

export default OrderUserElement;
