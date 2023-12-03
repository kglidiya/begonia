import styles from '../Icons.module.css';
import IIcon from '../types';

export default function Arrow({ onClick }: IIcon) {
	return (
		<div className={styles.icon} onClick={onClick}>
			<svg
				fill="white"
				width="42px"
				height="42px"
				viewBox="0 0 1920 1920"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g fillRule="evenodd">
					<path d="M0 92.168 92.299 0l959.931 959.935L92.299 1920 0 1827.57l867.636-867.635L0 92.168Z" />
					<path d="M868 92.168 960.299 0l959.931 959.935L960.299 1920 868 1827.57l867.64-867.635L868 92.168Z" />
				</g>
			</svg>
		</div>
	);
}
