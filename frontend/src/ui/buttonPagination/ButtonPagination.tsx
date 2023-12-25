import styles from './ButtonPagination.module.css';

interface IButtonPagination {
	onClick: () => void;
	text: string;
	isActive: boolean;
}
export default function ButtonPagination({
	onClick,
	text,
	isActive,
}: IButtonPagination) {
	return (
		<button
			type="button"
			className={
				isActive
					? `${styles.button} ${styles.button_default}`
					: `${styles.button} ${styles.button_active}`
			}
			onClick={onClick}
		>
			{text}
		</button>
	);
}
