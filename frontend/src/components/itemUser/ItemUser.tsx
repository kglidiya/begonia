/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import useFetch from '../../hooks/useFetch';
import { CART_URL, ITEMS_URL, handleRequestWithAuth } from '../../utils/api';
import styles from './ItemUser.module.css';
import Button from '../../ui/button/Button';

import { deleteCookie } from '../../utils/cookies';
import ButtonIncrement from '../../ui/buttonIncrement/ButtonIncrement';
import ButtonDecrement from '../../ui/buttonDecrement/ButtonDecrement';
import { Context } from '../..';
import Modal from '../modal/Modal';
import PhotoSlider from '../photoSider/PhotoSlider';
import useMediaQuery from '../../hooks/useMediaQuery';
import { ICartItem, IItem, IStatus } from '../../utils/types';
import ErrorWarning from '../errorWarning/ErrorWarning';
import Loader from '../loader/Loader';
import Spinner from '../../ui/icons/spinner/Spinner';

const ItemUser = observer(() => {
	const navigate = useNavigate();
	const userStore = useContext(Context).user;
	const cartStore = useContext(Context).cart;
	const orderStore = useContext(Context).order;
	const logOut = () => {
		userStore.setUser({});
		userStore.setIsAuth(false);
		cartStore.setCart([]);
		cartStore.setTotal([]);
		orderStore.setOrder([]);
		orderStore.setOrderCount();
		deleteCookie('token');
		deleteCookie('expires_on');
		localStorage.removeItem('token');
		navigate('/signin');
	};
	const { id } = useParams();
	const location = useLocation().pathname;
	const [status, setStatus] = useState<IStatus<IItem | []>>({
		isLoading: false,
		data: [],
		error: '',
	});
	const { data, isLoading, error } = useFetch(`${ITEMS_URL}/${id}`, location);
	const [item, setItem] = useState<IItem>();
	const [count, setCount] = useState(1);
	const [remainingQty, setRemainingQty] = useState(6);
	const [isInTheCart, setIsInTheCar] = useState<ICartItem[]>([]);
	const [buttonSwitch, setButtonSwitch] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);

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
	}, [data, setCount, isInTheCart.length]);

	const addToCart = () => {
		if (!userStore.isAuth) {
			navigate('/signin');
		} else
			handleRequestWithAuth(logOut, status, setStatus, CART_URL, 'POST', {
				id: Number(id),
				quantity: count,
			});
	};
	const updateQuantity = () => {
		handleRequestWithAuth(logOut, status, setStatus, CART_URL, 'PATCH', {
			id: Number(isInTheCart[0].id),
			quantity: count,
		});
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
	}, [count, isInTheCart.length]);

	const closePopup = () => {
		setModalOpen(false);
	};

	if (error) {
		return <ErrorWarning message={error} />;
	}

	if (isLoading) {
		return <Loader />;
	}
	return (
		<section className={styles.container}>
			{item && (
				<>
					<h3 className={styles.title}>{`Бегония ${item.type}`}</h3>
					<div className={styles.details}>
						<p className={styles.subtitle}>{item.name}</p>
						<div className="box-flex-row">
							<p className="text-medium text-bold">Цена</p>
							<p className="text-medium">{`${item.price} руб.`}</p>
						</div>
						{isInTheCart.length > 0 ? (
							<div className={styles.counter__container}>
								<Button
									fontSize="20px"
									width={!matches ? '90%' : '250px'}
									text="Перейти в корзину"
									onClick={updateQuantity}
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
								text={!status.isLoading ? 'Добавить в корзину' : <Spinner />}
								onClick={() => {
									setRemainingQty((qty) => qty - 1);
									setButtonSwitch(true);
								}}
								disabled={remainingQty <= 0}
							/>
						) : (
							<div className={`${styles.button__container} box-flex-row`}>
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

					<div className={styles.details}>
						<div className={styles.images__container}>
							<img
								src={item.image}
								alt={item.name}
								className={styles.image_main}
								onClick={() => {
									setModalOpen(true);
								}}
							/>
							<div className={styles.gallery__container}>
								{item.galleryImage1 && (
									<img
										src={item.galleryImage1}
										alt={item.name}
										className={styles.image_gallery}
										onClick={() => {
											setModalOpen(true);
										}}
									/>
								)}
								{item.galleryImage2 && (
									<img
										src={item.galleryImage2}
										alt={item.name}
										className={styles.image_gallery}
										onClick={() => {
											setModalOpen(true);
										}}
									/>
								)}
								{item.galleryImage3 && (
									<img
										src={item.galleryImage3}
										alt={item.name}
										className={styles.image_gallery}
										onClick={() => {
											setModalOpen(true);
										}}
									/>
								)}
							</div>
						</div>

						<p className={styles.description}>{item.description}</p>
					</div>
					<Modal onClose={closePopup} isModalOpen={isModalOpen} closeIcone>
						<PhotoSlider item={item} />
					</Modal>
				</>
			)}
		</section>
	);
});
export default ItemUser;
