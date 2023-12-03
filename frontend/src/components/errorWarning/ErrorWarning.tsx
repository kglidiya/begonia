import styles from './ErrorWarning.module.css';

export default function ErrorWarning() {
	return (
		<div className={styles.error}>
			<p className={styles.message}>Произошла ошибка</p>
		</div>
	);
}
