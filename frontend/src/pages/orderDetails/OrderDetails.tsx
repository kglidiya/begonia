/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import {
	formatDate,
	getOrderStatusEnum,
	getOrderStatus,
	getTotal,
} from '../../utils/utils';
import { ORDER_URL, handleRequestWithAuth } from '../../utils/api';
import { deleteCookie } from '../../utils/cookies';
import Loader from '../../components/loader/Loader';
import styles from './OrderDetails.module.css';
import { IOrder, IStatus, Role } from '../../utils/types';
import { ITEM_ROUTE } from '../../utils/paths';
import Button from '../../ui/button/Button';
import InputSelect from '../../ui/inputSelect/InputSelect';
import { Context } from '../..';

const orderStatus = ['Ожидает обработки', 'Отменен', 'В обработке', 'Получен'];

export default function OrderDetails() {
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
	const [order, setOrder] = useState<IOrder | undefined>();
	const { register, handleSubmit, setValue } = useForm<FieldValues>({
		values: { status: getOrderStatus(order?.status as string) },
	});

	const { id } = useParams();

	const [status, setStatus] = useState<IStatus<IOrder | undefined>>({
		isloading: false,
		data: undefined,
		error: '',
	});

	useEffect(() => {
		handleRequestWithAuth(
			logOut,
			status,
			setStatus,
			`${ORDER_URL}/${id}`,
			'GET',
			''
		);

		if (status.data) {
			setOrder(status.data);
		}
	}, [status.data?.id, order]);

	if (status.isloading) {
		return <Loader />;
	}

	const onSubmit = (values: FieldValues) => {
		handleRequestWithAuth(logOut, status, setStatus, `${ORDER_URL}`, 'PATCH', {
			id: order?.id,
			status: getOrderStatusEnum(values.status),
		});
	};

	return (
		<section>
			{order && (
				<div className={styles.container}>
					<h3 className={styles.title}>{`Заказ № ${order.id} от ${formatDate(
						String(order.createdAt)
					)}`}</h3>
					{userStore.user.role === Role.ADMIN && (
						<p className={styles.subtitle}>
							{`Пользователь: ${order.userName}, ${order.user.email}, ${order.phone}`}{' '}
						</p>
					)}
					{userStore.user.role === Role.ADMIN && (
						<form
							onSubmit={handleSubmit(onSubmit)}
							className={styles.statusGroup}
						>
							<InputSelect
								label="Статус заказа"
								register={register}
								setValue={setValue}
								options={orderStatus}
								type="text"
								name="status"
								required
							/>
							<Button
								type="submit"
								text="Изменить статус"
								fontSize="18px"
								width="200px"
							/>
						</form>
					)}

					{order.delivery && (
						<div className={styles.details}>
							<h5 className={styles.details__header}>Адрес доставки:</h5>
							<p>{order.delivery.address}</p>
							<div className="box-flex-row">
								{order.delivery.appartment && (
									<p> {` кв.: ${order.delivery.appartment}`} </p>
								)}
								{order.delivery.entrance && (
									<p> {`подъезд: ${order.delivery.entrance}`} </p>
								)}
								{order.delivery.floor && (
									<p> {`этаж: ${order.delivery.floor}`} </p>
								)}
							</div>
							{order.delivery.comments && (
								<p className={styles.details__comments}>
									{' '}
									{`Комментарии: ${order.delivery.comments}`}{' '}
								</p>
							)}
						</div>
					)}

					<div className={styles.details}>
						<h5 className={styles.details__header}>Товары:</h5>
						{order.orderItems?.map((el) => {
							return (
								<ul className={styles.list} key={el.id}>
									<li
										className={styles.list__item}
										onClick={() => navigate(`/${ITEM_ROUTE}/${el.item.id}`)}
									>
										<div className={styles.item__container}>
											<p className={styles.itemName}>{el.item.name}</p>
											<img
												src={el.item.image}
												alt={el.item.name}
												className={styles.image}
											/>
										</div>
									</li>
									<li className={styles.list__item}>{`${el.quantity} шт.`}</li>
									<li className={styles.list__item}>{`${el.subTotal} руб.`}</li>
								</ul>
							);
						})}
						{order.orderItems && (
							<p className={styles.text}>{`Общая сумма заказа: ${getTotal(
								order.orderItems
							)} руб.`}</p>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
