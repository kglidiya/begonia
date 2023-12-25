import styles from './Notification.module.css';

interface INotification {
	text: string;
}
export default function Notification({ text }: INotification) {
	return (
		<div className={styles.container}>
			<p className={styles.text}>{text}</p>
		</div>
	);
}
