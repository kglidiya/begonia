import IIcon from '../types';
import styles from '../Icons.module.css';

export default function PlusIcon({ onClick }: IIcon) {
	return (
		<div className={styles.icon} onClick={onClick}>
			<svg
				className={styles.fill}
				width="32px"
				height="32px"
				viewBox="0 0 32 32"
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M30 15.25h-13.25v-13.25c0-0.414-0.336-0.75-0.75-0.75s-0.75 0.336-0.75 0.75v0 13.25h-13.25c-0.414 0-0.75 0.336-0.75 0.75s0.336 0.75 0.75 0.75v0h13.25v13.25c0 0.414 0.336 0.75 0.75 0.75s0.75-0.336 0.75-0.75v0-13.25h13.25c0.414 0 0.75-0.336 0.75-0.75s-0.336-0.75-0.75-0.75v0z" />
			</svg>
		</div>
	);
}
