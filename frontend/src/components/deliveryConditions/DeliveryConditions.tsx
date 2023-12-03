import styles from './DeliveryConditions.module.css';

export default function DeliveryConditions() {
	return (
		<div className={styles.container}>
			<h4 className={styles.title}>Доставка</h4>
			<p className={styles.text}>
				Доставка по Москве 450 руб в пределах МКАД, за пределами рассчитывается
				по договоренности.
			</p>
			<p className={styles.text}>
				Доставка за пределами Москвы Почтой России, СДЭК или др. компанией
			</p>
			<p className={styles.text}>
				Для расчета полной стоимости доставки с Вами свяжется менеджер
			</p>
		</div>
	);
}
