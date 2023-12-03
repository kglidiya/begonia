import { useContext } from 'react';
import styles from './ShopElement.module.css';
import { IItem, Role } from '../../utils/types';
import Button from '../../ui/button/Button';
import { Context } from '../..';

type Props = {
	item: IItem;
	handleItemCick: (id: number) => void;
};

export default function ShopElement({ item, handleItemCick }: Props) {
	const userStore = useContext(Context).user;

	return (
		<div className={styles.cardContainer} key={item.id}>
			<div className={styles.card} onClick={() => handleItemCick(item.id)}>
				<img src={item.image} alt={item.image} className={styles.card__image} />
				<p className={styles.card__title}>{item.name}</p>
				<div className={styles.price__container}>
					<p className={styles.card__title}>Цена:</p>
					<p>{`${item.price} руб.`}</p>
				</div>

				<p className={styles.card__description}>{item.description}</p>
				{item.quantity > 0 ? (
					<Button
						fontSize="18px"
						text={
							userStore.user.role === Role.ADMIN
								? 'Редактировать'
								: 'Добавить в корзину'
						}
						width="90%"
					/>
				) : (
					<Button
						fontSize="18px"
						text={
							userStore.user.role === Role.ADMIN
								? 'Редактировать'
								: 'Нет в наличии'
						}
						width="90%"
						disabled={userStore.user.role !== Role.ADMIN}
					/>
				)}
			</div>
		</div>
	);
}
