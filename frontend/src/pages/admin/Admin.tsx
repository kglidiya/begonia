import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Admin.module.css';
import TextArea from '../../ui/textarea/TextArea';
import { ITEMS_URL } from '../../utils/api';
import { handleRequest, productType, urlRegex } from '../../utils/utils';
import { IItem, IStatus } from '../../utils/types';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import InputSelect from '../../ui/inputSelect/InputSelect';
import { getCookie } from '../../utils/cookies';
import Modal from '../../components/modal/Modal';
import Notification from '../../components/notification/Notification';

export default function Admin() {
	const accessToken: string | undefined = getCookie('token');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		values: {
			type: '',
			name: '',
			description: '',
			price: '',
			image: '',
			article: '',
			quantity: '',
			galleryImage1: '',
			galleryImage2: '',
			galleryImage3: '',
		},
	});
	const [status, setStatus] = useState<IStatus<[] | IItem>>({
		isloading: false,
		data: [],
		error: '',
	});
	const [isModalOpen, setModalOpen] = useState(false);
	const closePopup = () => {
		setModalOpen(false);
	};
	const onSubmit = (values: any) => {
		handleRequest(
			status,
			setStatus,
			ITEMS_URL,
			'POST',
			{
				...values,
				price: values.price && +values.price,
				article: values.article && +values.article,
				quantity: values.quantity && +values.quantity,
			},
			accessToken
		);
		// e.target.reset();
	};
	useEffect(() => {
		if (status.data && !Array.isArray(status.data)) {
			setModalOpen(true);
			setTimeout(() => {
				setModalOpen(false);
			}, 1000);
		}
	}, [status.data]);


	return (
		<div className={styles.container}>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
				<h3 className={styles.title}>Заполните все поля</h3>
				<InputSelect
					placeholder="Тип бегонии"
					register={register}
					setValue={setValue}
					options={productType}
					type="text"
					name="type"
					clearButton={false}
					required
					// errorMessage={"Заполните это поле"}
				/>
				<Input
					type="text"
					name="name"
					placeholder="Название сорта"
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
					pattern={urlRegex}
					name="image"
					placeholder="Ссылка на изображение"
					required
					register={register}
					error={errors}
					errorMessage={
						errors?.image?.type === 'required'
							? 'Заполните это поле'
							: 'Введите ссылку на изображение'
					}
					clearButton
					setValue={setValue}
				/>
				<TextArea
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
					placeholder="Цена"
					required
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<Input
					type="number"
					name="article"
					placeholder="Артикул"
					required
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<Input
					type="number"
					name="quantity"
					placeholder="Количество"
					required
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<p>Добавить дополнительные картинки</p>
				<Input
					type="text"
					pattern={urlRegex}
					name="galleryImage1"
					placeholder="Ссылка на каринку"
					required={false}
					register={register}
					clearButton
					setValue={setValue}
				/>
				<Input
					type="text"
					pattern={urlRegex}
					name="galleryImage2"
					placeholder="Ссылка на каринку"
					required={false}
					register={register}
					clearButton
					setValue={setValue}
				/>
				<Input
					type="text"
					pattern={urlRegex}
					name="galleryImage3"
					placeholder="Ссылка на каринку"
					required={false}
					register={register}
					clearButton
					setValue={setValue}
				/>
				<Button type="submit" text="Отправить" width="200px" fontSize="20px" />
		
			</form>
			<Modal
				onClose={closePopup}
				isModalOpen={isModalOpen}
				backgroundColor="transparent"
			>
				<Notification text="Данные отправлены" />
			</Modal>
		</div>
	);
}
