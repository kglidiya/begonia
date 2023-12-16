import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './ForgotPassword.module.css';
import Button from '../../ui/button/Button';
import { handleRequest, FORGOT_PASSWORD_URL } from '../../utils/api';
import { IStatus } from '../../utils/types';
import Input from '../../ui/input/Input';
import useMediaQuery from '../../hooks/useMediaQuery';
import Spinner from '../../ui/icons/spinner/Spinner';

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
		handleRequest(status, setStatus, `${FORGOT_PASSWORD_URL}`, 'POST', {
			email: values.email.toLowerCase(),
		});
	};
	useEffect(() => {
		if (status.data) {
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
					text={!status.isloading ? 'Восстановить' : <Spinner />}
					width={matches ? '300px' : '95%'}
					fontSize={matches ? '24px' : '18px'}
				/>
			</form>
		</main>
	);
};

export default ForgotPassword;
