import PlusIcon from '../icons/plusIcon/PlusIcon';
import styles from './ButtonIncrement.module.css';

interface IButtonIncrement {
	onClick: () => void;
	disabled: boolean;
}
export default function ButtonIncrement({
	onClick,
	disabled,
}: IButtonIncrement) {
	return (
		<button
			type="button"
			className={styles.conterButton}
			onClick={onClick}
			disabled={disabled}
		>
			<PlusIcon />
		</button>
	);
}
