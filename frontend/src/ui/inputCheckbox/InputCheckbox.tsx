import { ChangeEvent } from 'react';
import styles from './InputCkeckbox.module.css';

interface ICheckbox {
	name: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	label?: string;
}
export default function Checkbox({ name, onChange, label }: ICheckbox) {
	return (
		<div className={styles.container}>
			<input
				id="isAvailable"
				type="checkbox"
				className={styles.input}
				name={name}
				onChange={onChange}
			/>
			<label htmlFor="isAvailable" className={styles.label}>
				{label}
			</label>
		</div>
	);
}
