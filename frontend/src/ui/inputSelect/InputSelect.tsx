/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import styles from './InputSelect.module.css';

interface IInput {
	options: string[];
	type: string;
	placeholder?: string;
	name: string;
	border?: string;
	label?: string;
	pattern?: RegExp;
	required: boolean;
	value?: string;
	error?: FieldErrors<any>;
	errorMessage?: string;
	register: UseFormRegister<any>;
	setValue?: UseFormSetValue<any>;
	values?: { [name: string]: string | number | string[] | null };
}
const InputSelect = ({
	options,
	type,
	placeholder,
	name,
	errorMessage,
	border,
	label,
	pattern,
	required,
	error,
	setValue,
	register,
}: IInput) => {
	const [isActive, setActive] = useState(false);

	const handleToggle = () => {
		setActive(!isActive);
	};

	return (
		<div className={styles.container}>
			<label className={styles.label} htmlFor={name}>
				{label}
				<input
					type={type}
					className={styles.input}
					placeholder={placeholder}
					{...register(name, {
						required,
						onChange: () => setActive(true),

						pattern,
					})}
					onFocus={() => setActive(true)}
					style={{ border }}
				/>
				{error?.[`${name}`] && (
					<span className={styles.error}>{errorMessage}</span>
				)}
			</label>

			<ul
				className={`${styles.list} ${
					!isActive ? styles.list_default : styles.list_active
				}`}
			>
				{options.map((option) => {
					return (
						<li
							key={option}
							onClick={() => {
								handleToggle();
								setValue?.(name, option);
							}}
							className={styles.list__item}
						>
							{option}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default InputSelect;
