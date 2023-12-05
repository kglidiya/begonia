import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import {
	formatDate,
	getOrderStatusEnum,
	getOrderStatus,
	getTotal,
	handleRequest,
} from '../../utils/utils';
import { ORDER_URL } from '../../utils/api';
import { getCookie } from '../../utils/cookies';
import Loader from '../../components/loader/Loader';
import styles from './OrderDetails.module.css';
import { IOrder, IStatus, Role } from '../../utils/types';
import { ITEM_ROUTE } from '../../utils/paths';
import Button from '../../ui/button/Button';
import InputSelect from '../../ui/inputSelect/InputSelect';
import { Context } from '../..';
import CartStore from '../../store/CartStore';

const orderStatus = ['Ожидает обработки', 'Отменен', 'В обработке', 'Получен'];

export default function OrderDetails() {
	const userStore = useContext(Context).user;
	const [order, setOrder] = useState<IOrder | undefined>();
	const { register, handleSubmit, setValue } = useForm<FieldValues>({
		values: { status: getOrderStatus(order?.status as string) },
	});
	const navigate = useNavigate();
	const { id } = useParams();

	const accessToken: string | undefined = getCookie('token');
	const [status, setStatus] = useState<IStatus<IOrder | undefined>>({
		isloading: false,
		data: undefined,
		error: '',
	});

	useEffect(() => {
		handleRequest(
			status,
			setStatus,
			`${ORDER_URL}/${id}`,
			'GET',
			'',
			accessToken
		);

		if (status.data) {
			setOrder(status.data);
		}
	}, [status.data?.id, order]);

	if (status.isloading) {
		return <Loader />;
	}

	const onSubmit = (values: any) => {
		handleRequest(
			status,
			setStatus,
			`${ORDER_URL}`,
			'PATCH',
			{ id: order?.id, status: getOrderStatusEnum(values.status) },
			accessToken
		);
	};
	// console.log(userStore.user.role)
	return (
		<div>
			{order && (
				<section className={styles.container}>
					<h3 className={styles.title}>{`Заказ № ${order.id} от ${formatDate(
						String(order.createdAt)
					)}`}</h3>
					{userStore.user.role === Role.ADMIN && (
						<p className={styles.subtitle}>
							{`Пользователь: ${order.userName}, ${order.user.email}, ${order.phone}`}{' '}
						</p>
					)}
                  {userStore.user.role === Role.ADMIN && <form
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
							clearButton={false}
							required
						/>
						<Button
							type="submit"
							text="Изменить статус"
							fontSize="18px"
							width="200px"
						/>
					</form>}
					

					{order.delivery && (
						<div className={styles.address}>
							<h5 className={styles.sectionHeader}>Адрес доставки:</h5>
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
								<p className={styles.comments}> {`Комментарии: ${order.delivery.comments}`} </p>
							)}
						</div>
					)}

					<div className={styles.address}>
						<h5 className={styles.sectionHeader}>Товары:</h5>
						{order.orderItems?.map((el, i) => {
							return (
								<ul className={styles.list} key={i}>
									<li
										className={styles.list__item}
										onClick={() => navigate(`/${ITEM_ROUTE}/${el.item.id}`)}
									>
										<div className={styles.itemGroup}>
											<p>{el.item.name}</p>
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
							<p>{`Общая сумма заказа: ${getTotal(order.orderItems)} руб.`}</p>
						)}
					</div>
				</section>
			)}
		</div>
	);
}
