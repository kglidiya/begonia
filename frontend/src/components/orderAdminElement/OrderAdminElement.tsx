/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useNavigate } from 'react-router-dom';
import styles from './OrderAdminElement.module.css';
import { IOrder } from '../../utils/types';
import { formatDate, getOrderStatus } from '../../utils/utils';
import { ORDER_ROUTE } from '../../utils/paths';

interface IOrderAdminElement {
	order: IOrder;
}

export default function OrderAdminElement({ order }: IOrderAdminElement) {
	const navigate = useNavigate();
	const handleOnclick = () => {
		navigate(`${ORDER_ROUTE}/${order.id}`);
	};

	return (
		<article className={styles.container} onClick={handleOnclick}>
			<p className="text-bold">{`Заказ № ${order.id} от ${formatDate(
				String(order.createdAt)
			)}`}</p>
			<p className={styles.orderStatus}>{getOrderStatus(order.status)}</p>
			<p className="text-bold">Пользователь:</p>

			<div className={styles.userDetails}>
				<p>{order.userName}</p>
				<p>{order.user.email}</p>
				<p>{order.phone}</p>
			</div>
		</article>
	);
}
