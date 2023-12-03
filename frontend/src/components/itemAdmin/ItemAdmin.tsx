import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import useFetch from '../../hooks/useFetch';
import { ITEMS_URL } from '../../utils/api';

import TextArea from '../../ui/textarea/TextArea';
import { IItem, IStatus } from '../../utils/types';
import Button from '../../ui/button/Button';
import { handleRequest, productType } from '../../utils/utils';
import styles from './ItemAdmin.module.css';
import Input from '../../ui/input/Input';
import InputSelect from '../../ui/inputSelect/InputSelect';
import { getCookie } from '../../utils/cookies';

import DeliveryConditions from '../deliveryConditions/DeliveryConditions';
import PhotoSlider from '../photoSider/PhotoSlider';
import Modal from '../modal/Modal';
import Notification from '../notification/Notification';

export default function ItemAdmin() {
	const { id } = useParams();
	const [item, setItem] = useState<IItem>();
	const location = useLocation().pathname;
	const { data } = useFetch(`${ITEMS_URL}/${id}`, location);
	const accessToken: string | undefined = getCookie('token');
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
			article: item?.article,
			galleryImage1: item?.galleryImage1,
			galleryImage2: item?.galleryImage2,
			galleryImage3: item?.galleryImage3,
		},
	});

	const [isDeleted, setIsDeleted] = useState({
		hidden: false,
		height: '100%',
		buttonText: 'Удалить из коллекции',
	});
	const [status, setStatus] = useState<IStatus<IItem | undefined>>({
		isloading: false,
		data: undefined,
		error: '',
	});

	const deleteItem = () => {
		handleRequest(
			status,
			setStatus,
			`${ITEMS_URL}/${Number(id)}`,
			'DELETE',
			id,
			accessToken
		);

		setIsDeleted({ hidden: true, height: '100vh', buttonText: 'Товар удален' });
	};

	const onSubmit = (values: FieldValues) => {
		handleRequest(
			status,
			setStatus,
			`${ITEMS_URL}/${id}`,
			'PATCH',
			{
				...values,
				price: values.price && +values.price,
				article: values.article && +values.article,
				quantity: values.quantity && +values.quantity,
			},
			accessToken
		);
	};
	useEffect(() => {
		if (data && !Array.isArray(data)) {
			setModalOpen(true);
			setTimeout(() => {
				setModalOpen(false);
			}, 1000);
		}
	}, [status.data]);
	return (
		<section className={styles.main} style={{ height: isDeleted.height }}>
			<Button
				text={isDeleted.buttonText}
				width="300px"
				fontSize="24px"
				onClick={deleteItem}
				// onClick={() => {
				// 	setModalOpen(true);
				// }}
			/>

			{item !== undefined && !isDeleted.hidden && (
				<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
					<h3>Редактировать</h3>
					<InputSelect
						label="Тип"
						register={register}
						setValue={setValue}
						options={productType}
						type="text"
						name="type"
						clearButton={false}
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
					{/* {item.image !== '' && (
						<img src={item.image} alt="Фото" className={styles.photo__main} />
					)} */}
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
						errorMessage={'Заполните это поле'}
						clearButton
						setValue={setValue}
					/>
					<Input
						type="number"
						name="article"
						label="Артикул"
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
						width="250px"
						text="ОБНОВИТЬ"
						fontSize="20px"
						onClick={() => setModalOpen(true)}
					/>
				</form>
			)}
			{!isDeleted.hidden && <Modal
				onClose={closePopup}
				isModalOpen={isModalOpen}
				backgroundColor="transparent"
			>
				<Notification text="Данные обновлены" />
			</Modal>}
			
		</section>
	);
}