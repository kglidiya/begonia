import styles from '../Icons.module.css';
import IIcon from '../types';

export default function ClosePopupIcon({ onClick }: IIcon) {
	return (
		<div className={styles.icon} onClick={onClick}>
			<svg
				width="53px"
				height="53px"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M19 5L5 19M5.00001 5L19 19"
					stroke="white"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		</div>
	);
}
