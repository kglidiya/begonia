import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';
import TextArea from '../../ui/textarea/TextArea';
import { ITEMS_URL, handleRequestWithAuth } from '../../utils/api';
import { productType, urlRegex } from '../../utils/utils';
import { IItem, IStatus } from '../../utils/types';
import Button from '../../ui/button/Button';
import Input from '../../ui/input/Input';
import InputSelect from '../../ui/inputSelect/InputSelect';
import { deleteCookie } from '../../utils/cookies';
import Modal from '../../components/modal/Modal';
import Notification from '../../components/notification/Notification';
import { Context } from '../..';
import Spinner from '../../ui/icons/spinner/Spinner';

type FormValues = {
	type: string;
	name: string;
	description: string;
	price: string;
	image: string;
	quantity: string;
	galleryImage1: string;
	galleryImage2: string;
	galleryImage3: string;
};

export default function Admin() {
	const userStore = useContext(Context).user;
	const navigate = useNavigate();
	const logout = () => {
		userStore.setUser({});
		userStore.setIsAuth(false);
		deleteCookie('token');
		deleteCookie('expires_on');
		localStorage.removeItem('token');
		navigate('/signin');
	};
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({
		values: {
			type: '',
			name: '',
			description: '',
			price: '',
			image: '',
			quantity: '',
			galleryImage1: '',
			galleryImage2: '',
			galleryImage3: '',
		},
	});
	const [status, setStatus] = useState<IStatus<[] | IItem>>({
		isLoading: false,
		data: [],
		error: '',
	});
	const [isModalOpen, setModalOpen] = useState(false);
	const closePopup = () => {
		setModalOpen(false);
	};
	const onSubmit = (values: FormValues) => {
		handleRequestWithAuth(logout, status, setStatus, ITEMS_URL, 'POST', {
			...values,
			price: values.price && +values.price,
			quantity: values.quantity && +values.quantity,
		});
		// e.target.reset();
	};
	useEffect(() => {
		window.scrollTo(0, 0);

		if (status.data && !Array.isArray(status.data)) {
			setModalOpen(true);
			setTimeout(() => {
				setModalOpen(false);
			}, 1000);
		}
	}, [status.data]);

	return (
		<section className={styles.container}>
			<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
				<h3 className={styles.title}>Заполните все поля</h3>
				<InputSelect
					placeholder="Тип бегонии"
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
				<Button
					type="submit"
					text={!status.isLoading ? 'Отправить' : <Spinner />}
					width="200px"
					fontSize="20px"
				/>
			</form>
			<Modal
				onClose={closePopup}
				isModalOpen={isModalOpen}
				backgroundColor="transparent"
			>
				<Notification text="Данные отправлены" />
			</Modal>
		</section>
	);
}
