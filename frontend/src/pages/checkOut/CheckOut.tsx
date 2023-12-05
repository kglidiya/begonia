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
import { handleRequest, phoneRegex, phonePattern } from '../../utils/utils';
import { ORDER_URL } from '../../utils/api';
import { getCookie } from '../../utils/cookies';
import { ICartItem, IOrder, IStatus } from '../../utils/types';
import DeliveryConditions from '../../components/deliveryConditions/DeliveryConditions';
import Input from '../../ui/input/Input';
import useMediaQuery from '../../hooks/useMediaQuery';

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
	const cartStore = useContext(Context).cart;
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

	const accessToken: string | undefined = getCookie('token');
	const [status, setStatus] = useState<IStatus<IOrder | []>>({
		isloading: false,
		data: [],
		error: '',
	});

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { target } = e;
		setValue('phone', target.value.replace(phoneRegex, '+7 ($2) $3-$4-$5'));
	};
	const orderStore = useContext(Context).order;

	useEffect(() => {
		setOrderItems(toJS(cartStore.cart));
	}, [cartStore.cart]);

	useEffect(() => {
		orderStore.addToOrder(status.data);
		orderStore.setOrderCount();
		// cartStore.setCart([]);

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

		handleRequest(
			status,
			setStatus,
			`${ORDER_URL}`,
			'POST',
			{ ...body },
			accessToken
		);
		cartStore.setCart([]);
	};
	console.log(status.error);
	return (
		<section className={styles.container}>
			<DeliveryConditions />
			<div className={styles.orderGroup}>
				<h3 className={styles.title}>Ваш заказ</h3>
				{orderItems.map((el, i) => {
					return (
						<ul key={i} className={styles.list}>
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
					text="
      Заказать"
					width={!matches? '80%' : "300px"}
					fontSize={!matches? '20px' : "24px"}
				/>
				{status.error !== '' && <p className={styles.error}>{status.error}</p>}
			</form>
		</section>
	);
});

export default CheckOut;
