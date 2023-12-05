import { ReactNode } from 'react';
import styles from './ModalOverlay.module.css';
import ClosePopupIcon from '../../ui/icons/closePopupIcon/ClosePopupIcon';

interface IModalOverLayProps {
	children: ReactNode;
	closePopup: () => void;

	animation: string;
	backgroundColor?: string;

	closeIcone?: boolean
}

export default function ModalOverLay({
	children,
	closePopup,
	animation,
	backgroundColor,
	closeIcone
}: IModalOverLayProps) {
	return (
		<div
			onClick={(e) => {
				
				if (e.target === e.currentTarget) {
					closePopup();
				}
			}}
			className={`${styles.overlay} ${styles[animation]}`}
			style={{backgroundColor}}
		>
			{closeIcone && <span className={styles.closeButton}>
				<ClosePopupIcon onClick={closePopup} />
			</span>}
			
			{children}
		</div>
	);
}
