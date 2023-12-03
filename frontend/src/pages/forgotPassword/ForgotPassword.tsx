import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './ForgotPassword.module.css';

import Button from '../../ui/button/Button';
import { handleRequest } from '../../utils/utils';
import { FORGOT_PASSWORD_URL } from '../../utils/api';
import { setCookie } from '../../utils/cookies';
import { IStatus } from '../../utils/types';
import Input from '../../ui/input/Input';
import useMediaQuery from '../../hooks/useMediaQuery';

const ForgotPassword = () => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({ values: { email: '' } });

	const navigate = useNavigate();
	const matches = useMediaQuery('(min-width: 576px)');
	const [status, setStatus] = useState<IStatus<any>>({
		isloading: false,
		data: undefined,
		error: '',
	});

	const onSubmit = (values: any) => {
		handleRequest(status, setStatus, `${FORGOT_PASSWORD_URL}`, 'POST', values);
	};
	useEffect(() => {
		if (status.data) {
			setCookie('recoveryCode', String(status.data), {
				path: '/',
				expires: 60000,
			});
			navigate('/reset-password');
		}
	}, [status.data]);

	return (
		<main className={styles.container}>
			<h3 className={styles.title}>Восстановление пароля</h3>
			<form
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
				noValidate
			>
				<Input
					type="email"
					placeholder="Email"
					name="email"
					required
					register={register}
					error={errors}
					errorMessage="Введите корректный email"
					clearButton
					setValue={setValue}
				/>

				<Button
					type="submit"
					text="Восстановить"
					width={matches ? '300px' : '95%'}
					fontSize={matches ? '24px' : '18px'}
				/>
			</form>
		</main>
	);
};

export default ForgotPassword;
