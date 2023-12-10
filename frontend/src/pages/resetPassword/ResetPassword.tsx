import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './ResetPassword.module.css';
import { handleRequest, RESET_PASSWORD_URL } from '../../utils/api';
import { IStatus } from '../../utils/types';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import useMediaQuery from '../../hooks/useMediaQuery';

const ResetPassword = () => {
	const {
		register,
		setValue,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm({
		values: {
			password: '',
			repeatPassword: '',
			code: '',
		},
	});

	const navigate = useNavigate();
	const matches = useMediaQuery('(min-width: 576px)');
	const [status, setStatus] = useState<IStatus<any>>({
		isloading: false,
		data: undefined,
		error: '',
	});

	const onSubmit = (values: any) => {
		handleRequest(status, setStatus, `${RESET_PASSWORD_URL}`, 'POST', {
			recoveryCode: Number(values.code),
			password: values.password,
		});
		navigate('/signin');
	};

	return (
		<main className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<h3 className={styles.title}>Восстановление пароля</h3>

				<Input
					type="password"
					placeholder="Введите новый пароль. Мин 4 символа"
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

				<Input
					type="password"
					placeholder="Повторите пароль"
					name="repeatPassword"
					required
					pattern={new RegExp(watch('password'))}
					register={register}
					error={errors}
					errorMessage={
						errors?.repeatPassword?.type === 'required'
							? 'Заполните это поле'
							: 'Пароли должны совпадать'
					}
					clearButton
					setValue={setValue}
				/>

				<p className={styles.subtitle}>Введите код восстановления</p>
				<Input
					type="number"
					placeholder="Введите код"
					name="code"
					required
					register={register}
					error={errors}
					errorMessage="Заполните это поле"
					clearButton
					setValue={setValue}
				/>
				<Button
					type="submit"
					text="Отправить"
					width={matches ? '300px' : '95%'}
					fontSize={matches ? '24px' : '18px'}
				/>
				{status.error && <p className={styles.error}>{status.error}</p>}
			</form>
		</main>
	);
};

export default ResetPassword;
