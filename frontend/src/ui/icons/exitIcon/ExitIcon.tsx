import IIcon from '../types';
import styles from '../Icons.module.css';

export default function ExitIcon({ onClick }: IIcon) {
	return (
		<div className={styles.icon} onClick={onClick}>
			<svg
				width="32px"
				height="32px"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				stroke="#000000"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
				<polyline points="16 17 21 12 16 7" />
				<line x1="21" y1="12" x2="9" y2="12" />
			</svg>
		</div>
	);
}
