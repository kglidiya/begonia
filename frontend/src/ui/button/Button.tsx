import { ReactNode } from 'react';
import styles from './Button.module.css';

interface IButton {
	text: string | ReactNode;
	width: string;
	fontSize: string;
	onClick?: () => void;
	disabled?: boolean;
	type?: 'button' | 'submit' | 'reset' | undefined;
}
export default function Button({
	text,
	width,
	fontSize,
	onClick,
	disabled,
	type = 'button',
}: IButton) {
	return (
		// eslint-disable-next-line react/button-has-type
		<button
			// eslint-disable-next-line react/button-has-type
			type={type}
			className={styles.button}
			style={{ width, fontSize }}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
}
