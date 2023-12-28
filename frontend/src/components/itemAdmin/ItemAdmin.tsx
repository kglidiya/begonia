import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import { ITEMS_URL, handleRequestWithAuth } from '../../utils/api';

import TextArea from '../../ui/textarea/TextArea';
import { IItem, IStatus } from '../../utils/types';
import Button from '../../ui/button/Button';
import { productType } from '../../utils/utils';
import styles from './ItemAdmin.module.css';
import Input from '../../ui/input/Input';
import InputSelect from '../../ui/inputSelect/InputSelect';
import { deleteCookie } from '../../utils/cookies';
import Modal from '../modal/Modal';
import Notification from '../notification/Notification';
import useMediaQuery from '../../hooks/useMediaQuery';
import { Context } from '../..';
import Spinner from '../../ui/icons/spinner/Spinner';
import Loader from '../loader/Loader';

export default function ItemAdmin() {
	const { id } = useParams();
	const [item, setItem] = useState<IItem>();
	const location = useLocation().pathname;
	const { data, isLoading } = useFetch(`${ITEMS_URL}/${id}`, location);
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
	const [isModalOpen, setModalOpen] = useState(false);
	const closePopup = () => {
		setModalOpen(false);
	};

	useEffect(() => {
		if (data) {
			setItem({ ...data });
		}
	}, [data]);

	const {
		register,
		handleSubmit,
		setValue,

		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		values: {
			quantity: item?.quantity,
			type: item?.type,
			name: item?.name,
			description: item?.description,
			price: item?.price,
			image: item?.image,
			galleryImage1: item?.galleryImage1,
			galleryImage2: item?.galleryImage2,
			galleryImage3: item?.galleryImage3,
		},
	});
	const matches = useMediaQuery('(min-width: 768px)');
	const [isDeleted, setIsDeleted] = useState({
		hidden: false,
		height: '100%',
		buttonText: 'Удалить из коллекции',
	});
	const [status, setStatus] = useState<IStatus<IItem | undefined>>({
		isLoading: false,
		data: undefined,
		error: '',
	});

	const deleteItem = () => {
		handleRequestWithAuth(
			logOut,
			status,
			setStatus,
			`${ITEMS_URL}/${Number(id)}`,
			'DELETE',
			id
		);

		setIsDeleted({ hidden: true, height: '100vh', buttonText: 'Товар удален' });
	};

	const onSubmit = (values: FieldValues) => {
		handleRequestWithAuth(
			logOut,
			status,
			setStatus,
			`${ITEMS_URL}/${id}`,
			'PATCH',
			{
				...values,
				price: values.price && +values.price,
				quantity: values.quantity && +values.quantity,
			}
		);
	};
	useEffect(() => {
		if (status.data !== undefined && !Array.isArray(status.data)) {
			setModalOpen(true);
			setTimeout(() => {
				setModalOpen(false);
			}, 1000);
		}
	}, [status.data]);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<section className={styles.container} style={{ height: isDeleted.height }}>
			<Button
				text={isDeleted.buttonText}
				width={matches ? '300px' : '100%'}
				fontSize={matches ? '24px' : '18px'}
				onClick={deleteItem}
			/>

			{item !== undefined && !isDeleted.hidden && (
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<h2 className={styles.title}>Редактировать</h2>
					<InputSelect
						label="Тип"
						register={register}
						setValue={setValue}
						options={productType}
						type="text"
						name="type"
						required
					/>
					<Input
						type="text"
						name="name"
						label="Название сорта"
						register={register}
						minLength={2}
						required
						error={errors}
						errorMessage={
							errors?.name?.type === 'required'
								? 'Заполните это поле'
								: 'Введите не менее 2 символов'
						}
						clearButton
						setValue={setValue}
					/>
					<Input
						type="text"
						name="image"
						label="Ссылка на главную картинку"
						register={register}
						required
						error={errors}
						errorMessage="Заполните это поле"
						clearButton
						setValue={setValue}
					/>

					{watch('image') !== '' && (
						<img
							src={watch('image')}
							alt="Фото"
							className={styles.photo__main}
						/>
					)}
					<TextArea
						label="Описание"
						register={register}
						required
						placeholder="Описание"
						name="description"
						error={errors}
						errorMessage="Заполните это поле"
						clearButton
						setValue={setValue}
					/>
					<Input
						type="number"
						name="price"
						label="Цена"
						min={50}
						register={register}
						required
						error={errors}
						errorMessage={
							errors?.price?.type === 'required'
								? 'Заполните это поле'
								: 'Введите цену больше 50'
						}
						clearButton
						setValue={setValue}
					/>
					<Input
						type="number"
						name="quantity"
						label="Количество"
						register={register}
						required
						error={errors}
						errorMessage="Заполните это поле"
						clearButton
						setValue={setValue}
					/>

					<div className={styles.gallery}>
						<p className={styles.gallery__title}>Фотогаллерея</p>
						<div className={styles.gallery__cards}>
							<div className={styles.gallery}>
								<Input
									type="text"
									name="galleryImage1"
									label="Ссылка на картинку"
									register={register}
									required={false}
									clearButton
									setValue={setValue}
								/>
								{watch('galleryImage1') !== '' && (
									<img
										src={watch('galleryImage1')}
										alt="Фото"
										className={styles.gallery__image}
									/>
								)}
							</div>
							<div className={styles.gallery}>
								<Input
									type="text"
									name="galleryImage2"
									label="Ссылка на картинку"
									register={register}
									required={false}
									clearButton
									setValue={setValue}
								/>
								{watch('galleryImage2') !== '' && (
									<img
										src={watch('galleryImage2')}
										alt="Фото"
										className={styles.gallery__image}
									/>
								)}
							</div>
							<div className={styles.gallery}>
								<Input
									type="text"
									name="galleryImage3"
									label="Ссылка на картинку"
									register={register}
									required={false}
									clearButton
									setValue={setValue}
								/>
								{watch('galleryImage3') !== '' && (
									<img
										src={watch('galleryImage3')}
										alt="Фото"
										className={styles.gallery__image}
									/>
								)}
							</div>
						</div>
					</div>
					<Button
						type="submit"
						width={matches ? '250px' : '100%'}
						fontSize={matches ? '20px' : '18px'}
						text={!status.isLoading ? 'Обновить' : <Spinner />}
					/>
				</form>
			)}
			{!isDeleted.hidden && (
				<Modal
					onClose={closePopup}
					isModalOpen={isModalOpen}
					backgroundColor="transparent"
				>
					<Notification text="Данные обновлены" />
				</Modal>
			)}
		</section>
	);
}
