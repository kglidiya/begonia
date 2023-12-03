/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-useless-fragment */
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './OrdersUser.module.css';
import OrderUserElement from '../../components/orderUserElement/OrderUserElement';
import { IOrder, OrderStatus } from '../../utils/types';
import { Context } from '../..';
import Checkbox from '../../ui/inputCheckbox/InputCheckbox';

const OrdersUser = observer(() => {
	const orderStore = useContext(Context).order;
	const [order, setOrder] = useState<IOrder[] | undefined>();
	const [deleted, setDeleted] = useState(false);
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { checked } = event.target;
		setDeleted(checked);
	};

	useEffect(() => {
		window.scrollTo(0, 0);
		if (orderStore.order) {
			setOrder(orderStore.order);
		}
	}, [orderStore.order]);

	return (
		<section className={styles.section}>
			{order && order?.length > 0 && (
				<h3 className={styles.title}>Мои заказы</h3>
			)}
			{order?.length === 0 && (
				<p className={styles.warning}>Вы пока не совершали заказов</p>
			)}
			{order && order.length > 0 && (
				<div className="box-flex-row">
					<Checkbox name="deleted" onChange={handleChange} />
					<p>Показать отмененные</p>
				</div>
			)}
			{/* {!orderStore.order && <Loader/>} */}

			{deleted && order && order.length > 0 && (
				<>
					{order?.map((el: IOrder, i) => {
						if (el.status === OrderStatus.CANCELLED) {
							return (
								<OrderUserElement
									key={i}
									orderItem={el}
									// orderStatus={order.status}
								/>
							);
						}
					})}
				</>
			)}
			{!deleted && order && order.length > 0 && (
				<>
					{order?.map((el: IOrder, i) => {
						if (el.status !== OrderStatus.CANCELLED) {
							return <OrderUserElement key={i} orderItem={el} />;
						}
					})}
				</>
			)}
		</section>
	);
});

export default OrdersUser;
