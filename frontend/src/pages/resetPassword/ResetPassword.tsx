import { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './ResetPassword.module.css';
import { handleRequest } from '../../utils/utils';
import { RESET_PASSWORD_URL } from '../../utils/api';
import { IStatus } from '../../utils/types';
import Input from '../../ui/input/Input';
import { values } from 'mobx';

const ResetPassword = () => {
	const {
		register,
		setValue,
		watch,
		setFocus,
		formState: { errors },
	} = useForm({
		values: {
			password: '',
			repeatPassword: '',
			digit1: '',
			digit2: '',
			digit3: '',
			digit4: '',
		},
	});

	const navigate = useNavigate();

	const [status, setStatus] = useState<IStatus<any>>({
		isloading: false,
		data: undefined,
		error: '',
	});
	const [code, setCode] = useState<number[] | []>([]);

	const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;

		if (target.name === 'digit1' && target.value !== '') {
			setCode(Object.assign(code.slice(), { 0: +target.value }));
		}
		if (target.name === 'digit2' && target.value !== '') {
			setCode(Object.assign(code.slice(), { 1: +target.value }));
		}
		if (target.name === 'digit3' && target.value !== '') {
			setCode(Object.assign(code.slice(), { 2: +target.value }));
		}
		if (target.name === 'digit4' && target.value !== '') {
			setCode(Object.assign(code.slice(), { 3: +target.value }));
		}
	};
	useEffect(() => {
		if (status.error) {
			setCode([]);
			setValue('digit1', '');
			setValue('digit2', '');
			setValue('digit3', '');
			setValue('digit4', '');
		}
	}, [status.error]);

	useEffect(() => {
		const subscription = watch((value) => {
			if (
				value.password &&
				value.password === value.repeatPassword &&
				value.digit1?.length === 0
			) {
				setFocus('digit1');
			}
			if (value.digit1?.length === 1) {
				setFocus('digit2');
			}
			if (value.digit2?.length === 1) {
				setFocus('digit3');
			}
			if (value.digit3?.length === 1) {
				setFocus('digit4');
			}
		});

		return () => subscription.unsubscribe();
	}, [code.length, setFocus, watch]);

	useEffect(() => {
		if (code.length === 4 && watch('password') === watch('repeatPassword')) {
			handleRequest(status, setStatus, `${RESET_PASSWORD_URL}`, 'POST', {
				recoveryCode: Number(code.join('')),
				password: watch('password'),
			});
			if (status.data) {
				navigate('/signin');
			}
		}
	}, [code.length, status.data]);


	return (
		<main className={styles.container}>
			<form className={styles.form}>
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
				<div className={styles.otpCodeGroup}>
					<Input
						clearButton={false}
						required
						type="text"
						name="digit1"
						maxLength={1}
						error={errors}
						errorMessage="Введите число"
						register={register}
						onChange={handleCodeChange}
					/>
					<Input
						clearButton={false}
						required
						type="text"
						maxLength={1}
						name="digit2"
						error={errors}
						errorMessage="Введите число"
						register={register}
						onChange={handleCodeChange}
					/>
					<Input
						clearButton={false}
						required
						type="text"
						name="digit3"
						maxLength={1}
						error={errors}
						errorMessage="Введите число"
						register={register}
						onChange={handleCodeChange}
					/>
					<Input
						clearButton={false}
						required
						type="text"
						name="digit4"
						maxLength={1}
						error={errors}
						errorMessage="Введите число"
						register={register}
						onChange={handleCodeChange}
					/>
				</div>
				{status.error && <p>Введен некорректный код</p>}
			</form>
		</main>
	);
};

export default ResetPassword;
