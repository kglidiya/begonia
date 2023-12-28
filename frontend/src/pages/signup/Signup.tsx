import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';
import styles from './Signup.module.css';
import Button from '../../ui/button/Button';
import { emailRegex } from '../../utils/utils';
import { SIGN_UP_URL, handleRequest } from '../../utils/api';
import { Context } from '../..';
import { IStatus, IUser } from '../../utils/types';
import Input from '../../ui/input/Input';
import useMediaQuery from '../../hooks/useMediaQuery';
import Spinner from '../../ui/icons/spinner/Spinner';

interface FormValues {
	email: string;
	password: string;
}

const Signup = observer(() => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({ values: { email: '', password: '' } });
	const { user } = useContext(Context);
	const matches = useMediaQuery('(min-width: 576px)');
	const navigate = useNavigate();
	const [status, setStatus] = useState<IStatus<undefined | IUser>>({
		isLoading: false,
		data: undefined,
		error: '',
	});

	const onSubmit = (values: FormValues) => {
		handleRequest(status, setStatus, SIGN_UP_URL, 'POST', {
			email: values.email.toLowerCase(),
			password: values.password,
		});
		user.setIsAuth(true);
	};

	useEffect(() => {
		if (status.data) {
			user.setUser(status.data);
			navigate('/');
		}
	}, [navigate, status.data, user]);

	return (
		<main className={styles.container}>
			<h3 className={styles.title}>Регистрация</h3>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="text"
					placeholder="Email"
					name="email"
					pattern={emailRegex}
					required
					register={register}
					error={errors}
					errorMessage={
						errors?.email?.type === 'required'
							? 'Заполните это поле'
							: 'Введите корректный email'
					}
					clearButton
					setValue={setValue}
				/>
				<Input
					type="password"
					placeholder="Пароль"
					name="password"
					required
					pattern={/.{4,}/}
					register={register}
					error={errors}
					errorMessage={
						errors?.password?.type === 'required'
							? 'Заполните это поле'
							: 'Пароль должен содержать минимум 4 символа'
					}
					clearButton
					setValue={setValue}
				/>
				<Button
					type="submit"
					text={!status.isLoading ? 'Зарегистрироваться' : <Spinner />}
					width={matches ? '300px' : '95%'}
					fontSize={matches ? '24px' : '18px'}
				/>
			</form>
			{status.error && <p className={styles.error}>{status.error}</p>}
			<div className={styles.singupGroup}>
				<p className={styles.text}>Вы уже зарегистированы?</p>
				<Link to="/signin" className={styles.link}>
					Войти
				</Link>
			</div>
		</main>
	);
});

export default Signup;
