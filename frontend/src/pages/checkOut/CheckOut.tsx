import { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
	AddressSuggestions,
	DaDataAddress,
	DaDataSuggestion,
} from 'react-dadata';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toJS } from 'mobx';
import styles from './CheckOut.module.css';
import '../../styles/vendor/react-data.css';
import Button from '../../ui/button/Button';
import TextArea from '../../ui/textarea/TextArea';
import { Context } from '../..';
import { phoneRegex, phonePattern } from '../../utils/utils';
import { ORDER_URL, handleRequestWithAuth } from '../../utils/api';
import { deleteCookie } from '../../utils/cookies';
import { ICartItem, IOrder, IStatus } from '../../utils/types';
import DeliveryConditions from '../../components/deliveryConditions/DeliveryConditions';
import Input from '../../ui/input/Input';
import useMediaQuery from '../../hooks/useMediaQuery';
import Spinner from '../../ui/icons/spinner/Spinner';

interface IInputValues {
	appartment: number | null;
	entrance: number | null;
	floor: number | null;
	comments: string;
	phone: string;
	userName: string;
}

const CheckOut = observer(() => {
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
	const [address, setAddress] = useState<
		DaDataSuggestion<DaDataAddress> | undefined
	>();
	const [orderItems, setOrderItems] = useState<ICartItem[]>(
		toJS(cartStore.cart)
	);
	const matches = useMediaQuery('(min-width: 414px)');
	const {
		register,
		handleSubmit,
		setValue,

		formState: { errors },
	} = useForm({
		values: {
			appartment: null,
			entrance: null,
			floor: null,
			comments: '',
			phone: '',
			userName: '',
		},
	});

	const [status, setStatus] = useState<IStatus<IOrder | []>>({
		isloading: false,
		data: [],
		error: '',
	});

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { target } = e;
		setValue('phone', target.value.replace(phoneRegex, '+7 ($2) $3-$4-$5'));
	};

	useEffect(() => {
		setOrderItems(toJS(cartStore.cart));
	}, [cartStore.cart]);

	useEffect(() => {
		orderStore.addToOrder(status.data);
		orderStore.setOrderCount();

		if (!Array.isArray(status.data)) {
			navigate('/orders/me');
		}
	}, [status.data]);

	const onSubmit = (values: IInputValues) => {
		const body = {
			delivery: {
				address: address?.value,
				appartment: values.appartment,
				entrance: values.entrance,
				floor: values.floor,
				comments: values.comments,
			},
			phone: values.phone,
			orderItems: cartStore.cart,
			userName: values.userName,
		};

		handleRequestWithAuth(logOut, status, setStatus, `${ORDER_URL}`, 'POST', {
			...body,
		});
		cartStore.setCart([]);
	};

	return (
		<section className={styles.container}>
			<DeliveryConditions />
			<div className={styles.orderGroup}>
				<h3 className={styles.title}>Ваш заказ</h3>
				{orderItems.map((el) => {
					return (
						<ul key={el.id} className={styles.list}>
							<li className={styles.list__item}>{el.item.name}</li>
							<li className={styles.list__item}>{`${el.quantity} шт.`}</li>
							<li className={styles.list__item}>{`${el.subTotal} руб.`}</li>
						</ul>
					);
				})}
				<p>{`Общая сумма заказа: ${cartStore.total} руб.`}</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
				<div className={styles.addressGroup}>
					<p className="text-default">Веедите полный адрес</p>
					<AddressSuggestions
						token={process.env.REACT_APP_DADATA_TOKEN as string}
						value={address}
						onChange={setAddress}
						inputProps={{ required: true }}
					/>
				</div>
				<Input
					type="number"
					label="Квартира"
					name="appartment"
					placeholder="Введите номер квартиры"
					required={false}
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<Input
					type="number"
					name="entrance"
					label="Подъезд"
					placeholder="Введите номер подъезда"
					required={false}
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<Input
					type="number"
					name="floor"
					label="Этаж"
					placeholder="Введите этаж"
					required={false}
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<TextArea
					register={register}
					required={false}
					placeholder="Введите комментарий для курьера"
					label="Комментарии"
					name="comments"
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<Input
					type="text"
					name="phone"
					label="Телефон"
					placeholder="Введите телефон для связи"
					pattern={phonePattern}
					required
					register={register}
					error={errors}
					errorMessage={
						errors?.phone?.type === 'required'
							? 'Заполните это поле'
							: 'Введите телефон в формате +7 (777) 777-77-77'
					}
					clearButton
					setValue={setValue}
					onChange={handleInput}
				/>
				<Input
					type="text"
					name="userName"
					label="Ваше имя"
					placeholder="Введите Ваше имя"
					required
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>

				<Button
					type="submit"
					text={!status.isloading ? 'Заказать' : <Spinner />}
					width={!matches ? '80%' : '300px'}
					fontSize={!matches ? '20px' : '24px'}
				/>
				{status.error !== '' && <p className={styles.error}>{status.error}</p>}
			</form>
		</section>
	);
});

export default CheckOut;
