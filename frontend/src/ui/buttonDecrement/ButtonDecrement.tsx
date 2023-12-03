import styles from './ButtonDecrement.module.css';
import MinusIcon from '../icons/minusIcon/MinusIcon';

interface IButtonDecrement {
	onClick: () => void;
	count: number;
}
export default function ButtonDecrement({ onClick, count }: IButtonDecrement) {
	return (
		<button
			type="button"
			className={styles.conterButton}
			disabled={count === 1}
			onClick={onClick}
		>
			<MinusIcon />
		</button>
	);
}
