/* eslint-disable react/jsx-no-bind */
/* eslint-disable consistent-return */
import React, { FC, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import modal from './Modal.module.css';
import ModalOverLay from '../modalOverlay/ModalOverlay';

interface IModalProps {
	isModalOpen: boolean;
	children: ReactNode;
	onClose: () => void;
	backgroundColor?: string;

	closeIcone?: boolean;
}

const modalRoot = document.getElementById('modal-root') as
	| Element
	| DocumentFragment;

const Modal: FC<IModalProps> = ({
	isModalOpen,
	children,
	onClose,
	backgroundColor,
	closeIcone,
}) => {
	const [animation, setAnimation] = React.useState('fadeIn');
	function closePopup() {
		setAnimation('fadeOut');
		setTimeout(() => {
			setAnimation('fadeIn');
			onClose();
		}, 400);
	}

	React.useEffect(() => {
		function closeByEscape(evt: KeyboardEvent) {
			if (evt.key === 'Escape') {
				closePopup();
			}
		}

		if (isModalOpen) {
			document.addEventListener('keydown', closeByEscape);
			return () => {
				document.removeEventListener('keydown', closeByEscape);
			};
		}
	}, [isModalOpen]);

	if (!isModalOpen) return null;

	return ReactDOM.createPortal(
		// eslint-disable-next-line react/jsx-no-bind
		<ModalOverLay
			closePopup={closePopup}
			animation={animation}
			backgroundColor={backgroundColor}
			closeIcone={closeIcone}
		>
			<div className={modal.container}>{children}</div>
		</ModalOverLay>,
		modalRoot
	);
};

export default Modal;
