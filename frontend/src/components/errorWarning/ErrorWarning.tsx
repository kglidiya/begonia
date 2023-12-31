import styles from './ErrorWarning.module.css';

interface IErrorWarning {
	message: string;
}

export default function ErrorWarning({ message }: IErrorWarning) {
	return (
		<div className={styles.container}>
			<p className={styles.message}>{message}</p>
		</div>
	);
}
