import { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { CART_URL, ITEMS_URL } from '../../utils/api';
import styles from './ItemUser.module.css';
import Button from '../../ui/button/Button';
import { handleRequest } from '../../utils/utils';
import { getCookie } from '../../utils/cookies';
import ButtonIncrement from '../../ui/buttonIncrement/ButtonIncrement';
import ButtonDecrement from '../../ui/buttonDecrement/ButtonDecrement';
import { Context } from '../..';
import Modal from '../modal/Modal';
import PhotoSlider from '../photoSider/PhotoSlider';
import useMediaQuery from '../../hooks/useMediaQuery';
import { ICartItem, IItem, IStatus } from '../../utils/types';
import ErrorWarning from '../errorWarning/ErrorWarning';
import Loader from '../loader/Loader';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import DeliveryConditions from '../deliveryConditions/DeliveryConditions';

const ItemUser = observer(() => {
	const userStore = useContext(Context).user;
	const cartStore = useContext(Context).cart;
	const { id } = useParams();
	const location = useLocation().pathname;
	const [status, setStatus] = useState<IStatus<IItem | []>>({
		isloading: false,
		data: [],
		error: '',
	});
	const { data, isloading, error } = useFetch(`${ITEMS_URL}/${id}`, location);
	const [item, setItem] = useState<IItem>();
	const [count, setCount] = useState(1);
	const [remainingQty, setRemainingQty] = useState(6);
	const [isInTheCart, setIsInTheCar] = useState<ICartItem[]>([]);
	const [buttonSwitch, setButtonSwitch] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);
	const accessToken: string | undefined = getCookie('token');
	const navigate = useNavigate();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	const checkIfInTheCart = (itemElement: IItem) => {
		return itemElement.cart.filter((el) => {
			return el.user.id === userStore.user.id;
		});
	};
	const matches = useMediaQuery('(min-width: 768px)');
	useEffect(() => {
		if (data && !Array.isArray(data)) {
			setRemainingQty(data.quantity);
			setItem({ ...data });
			setIsInTheCar(checkIfInTheCart(data));
			if (isInTheCart.length > 0) {
				setCount(isInTheCart[0].quantity);
				setRemainingQty(data.quantity - isInTheCart[0].quantity);
			}
		}
	}, [data, setCount]);

	const addToCart = () => {
		handleRequest(
			status,
			setStatus,
			CART_URL,
			'POST',
			{ id: Number(id), quantity: count },
			accessToken
		);
	};
	const updateQuantity = () => {
		handleRequest(
			status,
			setStatus,
			CART_URL,
			'PATCH',
			{ id: Number(isInTheCart[0].id), quantity: count },
			accessToken
		);
	};
	useEffect(() => {

		if (status.data && !Array.isArray(status.data)) {
			if (!isInTheCart.length) {
				cartStore.addToCart(status.data);
			}
			navigate('/cart');
		}
	}, [status.data]);

	const increment = () => {
		setCount((count) => count + 1);
		setRemainingQty((qty) => qty - 1);
	};
	const decrement = () => {
		setCount((count) => count - 1);
		setRemainingQty((qty) => qty + 1);
	};

	useEffect(() => {
		if (isInTheCart.length > 0) {
			cartStore.changeQuantity(isInTheCart[0].id, count);
			cartStore.setTotal();
		}
	}, [count]);

	const closePopup = () => {
		setModalOpen(false);
	};
	if (error) {
		return <ErrorWarning />;
	}

	if (isloading) {
		return <Loader />;
	}
    // console.log(remainingQty)
	return (
		<section className={styles.container}>
			{item && (
				<>
					<h3 className={styles.title}>{`Бегония ${item.type}`}</h3>

					<div className={styles.details}>
						<p className="text-medium text-bold">{item.name}</p>
						{isInTheCart.length > 0 ? (
							<div className={styles.details}>
								<Button
									fontSize="20px"
									width={!matches ? '90%' : '250px'}
									text="Перейти в корзину"
									onClick={updateQuantity}
									// disabled={remainingQty === 0}
								/>
								<div className={styles.counter}>
									<ButtonDecrement onClick={decrement} count={count} />
									<p className="text-medium">{count}</p>
									<ButtonIncrement
										onClick={increment}
										disabled={remainingQty <= 0}
									
									/>
								</div>
							</div>
						) : isInTheCart.length === 0 && !buttonSwitch ? (
							<Button
								fontSize="20px"
								width={!matches ? '90%' : '250px'}
								text="Добавить в корзину"
								onClick={() => {
									setRemainingQty((qty) => qty - 1);
									setButtonSwitch(true);
								}}
								disabled={remainingQty <= 0}
							/>
						) : (
							<div className={`${styles.buttonContainer} box-flex-row`}>
								<Button
									fontSize="20px"
									width={!matches ? '90%' : '250px'}
									text="Перейти в корзину"
									onClick={addToCart}
								/>
								<div className={styles.counter}>
									<ButtonDecrement onClick={decrement} count={count} />
									<p className="text-medium">{count}</p>
									<ButtonIncrement
										onClick={increment}
										disabled={remainingQty <= 0}
									/>
								</div>
							</div>
						)}
					</div>
					{remainingQty < 5 && (
						<p className={styles.warning}>
							{remainingQty <= 0
								? 'Больше нет в наличии'
								: `В наличии осталось ${remainingQty} шт.`}
						</p>
					)}
					<div className="box-flex-row">
						<p className="text-default text-bold">Цена</p>
						<p className="text-default">{`${item.price} руб.`}</p>
					</div>
					<div className={styles.details}>
						<div className={styles.wrapper}>
							<img
								src={item.image}
								alt={item.name}
								className={styles.imageMain}
								onClick={() => {
									setModalOpen(true);
								}}
							/>
							<div className="box-flex-row">
								{item.galleryImage1 && (
									<img
										src={item.galleryImage1}
										alt={item.name}
										className={styles.imageGallery}
										onClick={() => {
											setModalOpen(true);
										}}
									/>
								)}
								{item.galleryImage2 && (
									<img
										src={item.galleryImage2}
										alt={item.name}
										className={styles.imageGallery}
										onClick={() => {
											setModalOpen(true);
										}}
									/>
								)}
								{item.galleryImage3 && (
									<img
										src={item.galleryImage3}
										alt={item.name}
										className={styles.imageGallery}
										onClick={() => {
											setModalOpen(true);
										}}
									/>
								)}
							</div>
						</div>

						<p className={styles.description}>{item.description}</p>
					</div>
					<Modal onClose={closePopup} isModalOpen={isModalOpen} closeIcone={true}>
						<PhotoSlider item={item} />
						
					</Modal>
				</>
			)}
		</section>
	);
});
export default ItemUser;