/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import styles from './Footer.module.css';
import Modal from '../modal/Modal';
import DeliveryConditions from '../deliveryConditions/DeliveryConditions';

export default function Footer() {
	const [isModalOpen, setModalOpen] = useState(false);
	const closePopup = () => {
		setModalOpen(false);
	};
	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				<p className={styles.text}>begonia.world.ru@gmail.com</p>
				<p
					className={styles.text}
					onClick={() => {
						setModalOpen(true);
					}}
				>
					Доставка
				</p>
			</div>
			<Modal
				onClose={closePopup}
				isModalOpen={isModalOpen}
				closeIcone
				backgroundColor="rgba(0, 0, 0, 0.3)"
			>
				<div className={styles.delivery}>
					<DeliveryConditions />
				</div>
			</Modal>
		</footer>
	);
}
