import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import styles from './OrderUserElement.module.css';
import { IOrder, IStatus, OrderStatus } from '../../utils/types';
import {
	formatDate,
	getOrderStatus,
	getTotal,
	handleRequest,
} from '../../utils/utils';
import { ORDER_URL } from '../../utils/api';
import { ORDER_ROUTE } from '../../utils/paths';
import Button from '../../ui/button/Button';
import { getCookie } from '../../utils/cookies';
import { Context } from '../..';

interface IOrderUserElement {
	orderItem: IOrder;
}

const OrderUserElement = observer(({ orderItem }: IOrderUserElement) => {
	const accessToken: string | undefined = getCookie('token');
	const [orderStatus, setOrderStatus] = useState(orderItem.status);
	const orderStore = useContext(Context).order;
	const [status, setStatus] = useState<IStatus<[] | IOrder>>({
		isloading: false,
		data: [],
		error: '',
	});

	const deleteOrder = () => {
		handleRequest(
			status,
			setStatus,
			`${ORDER_URL}`,
			'PATCH',
			{ id: orderItem.id, status: OrderStatus.CANCELLED },
			accessToken
		);

		setOrderStatus(OrderStatus.CANCELLED);
		orderStore.updateOrderStatus(orderItem.id);
		orderStore.setOrderCount();
	};

	const navigate = useNavigate();

	const onClick = (e: any) => {
		if (e.target.textContent === 'Отменить') {
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
						<p>{`Общая сумма заказа: ${getTotal(
							orderItem.orderItems
						)} руб.`}</p>
						<p className={styles.orderStatus}>
							{getOrderStatus(orderItem.status)}
						</p>
					</div>

					<div className={styles.itemsGroup}>
						{orderItem.orderItems.map((el, i) => {
							return (
								<ul key={i} className={styles.list}>
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
						<Button
							width="100px"
							text="Отменить"
							fontSize="20px"
							// onClick={(e) => onClick(e)}
						/>
					)}
				</article>
			)}
		</>
	);
});

export default OrderUserElement;
