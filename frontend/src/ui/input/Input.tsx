
import styles from './Input.module.css';
import CloseIcon from '../icons/closeIcon/CloseIcon';

interface IInput {
	type?: string;
	placeholder?: string;
	name: string;
	label?: string;
	register: any;
	required: boolean;
	maxLength?: number;
	minLength?: number;
	min?: number;
	max?: number;
	pattern?: RegExp;
	error?: any;
	errorMessage?: string;
	clearButton?: boolean;
	setValue?: any;
	// onChange?: ChangeEventHandler<HTMLInputElement>;
	onChange?: any;
}
const Input = ({
	type,
	placeholder,
	name,
	label,
	register,
	required,
	maxLength,
	minLength,
	min,
	max,
	pattern,
	error,
	errorMessage,
	clearButton,
	setValue,
	onChange,
}: IInput) => {
	// console.log(error)
	return (
		<div className={styles.container}>
			{clearButton && <CloseIcon onClick={() => setValue(name, '')} />}
			<label className={styles.label}>{label}</label>
			<input
				placeholder={placeholder}
				type={type}
				autoComplete="on"
				{...register(name, {
					onChange,
					required,
					maxLength,
					minLength,
					pattern,
					max,
					min,
				})}
				className={styles.input}
			/>
			{error?.[`${name}`] && (
				<span className={styles.error}>{errorMessage}</span>
			)}
		</div>
	);
};

export default Input;
