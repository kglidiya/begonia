
import { UseFormRegister } from 'react-hook-form';
import styles from './TextArea.module.css';
import CloseIcon from '../icons/closeIcon/CloseIcon';

interface ITextArea {
	placeholder?: string;
	name: string;
	label?: string;
	register: UseFormRegister<any>;
	required: boolean;
	maxLength?: number;
	minLength?: number;
	error?: any;
	errorMessage?: string;
	clearButton?: boolean;
	setValue?: any;
}
const TextArea = ({
	placeholder,
	name,
	label,
	register,
	required,
	maxLength,
	minLength,
	error,
	errorMessage,
	clearButton,
	setValue,
}: ITextArea) => {
	return (
		<div className={styles.container}>
			{clearButton && <CloseIcon onClick={() => setValue(name, '')} />}
			<label className={styles.label}>	{label}</label>
			
				<textarea
					className={styles.input}
					placeholder={placeholder}
					{...register(name, {
						required,
						maxLength,
						minLength,
					})}
				/>
				{error?.[`${name}`] && (
					<span className={styles.error}>{errorMessage}</span>
				)}
		
		</div>
	);
};

export default TextArea;
