/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Shop.module.css';
import { ITEMS_URL, handleRequest } from '../../utils/api';
import { ITEM_ROUTE } from '../../utils/paths';
import ShopElement from '../../components/shopElement/ShopElement';
import { IItem, IItemsPagination, IStatus, Type } from '../../utils/types';
import Pagination from '../../components/pagination/Pagination';
import Loader from '../../components/loader/Loader';
import ErrorWarning from '../../components/errorWarning/ErrorWarning';
import useMediaQuery from '../../hooks/useMediaQuery';

export default function Shop() {
	const [status, setStatus] = useState<IStatus<IItemsPagination | undefined>>({
		isloading: false,
		data: undefined,
		error: '',
	});

	const [items, setItems] = useState<IItem[] | undefined>();
	const [currentPage, setCurrentPage] = useState(1);

	const matches = useMediaQuery('(min-width: 512px)');
	const [activeTab, setActiveTab] = useState(matches ? Type.ALL : Type.ELATIOR);
	const [resultPerPage, setResultPerPage] = useState(9);
	const navigate = useNavigate();

	useEffect(() => {
		handleRequest(status, setStatus, ITEMS_URL, 'GET', '', {
			type: activeTab,
			page: currentPage,
			resultPerPage,
		});
		window.scrollTo(0, 0);
	}, [activeTab, currentPage]);

	useMemo(() => {
		setItems(status.data?.res);
	}, [status.data?.res]);

	const handleTab1 = () => {
		setActiveTab(Type.ELATIOR);
		setCurrentPage(1);
		setResultPerPage(8);
	};
	const handleTab2 = () => {
		setActiveTab(Type.BULB);
		setCurrentPage(1);
		setResultPerPage(8);
	};
	const handleTab3 = () => {
		setActiveTab(Type.FOLIAGE);
		setCurrentPage(1);
		setResultPerPage(8);
	};
	const handleTab4 = () => {
		setActiveTab(Type.ALL);
		setCurrentPage(1);
		setResultPerPage(9);
	};
	if (status.isloading) {
		return <Loader />;
	}
	if (status.error) {
		return <ErrorWarning message="Произошла ошибка" />;
	}
	const handleItemCick = (id: number) => {
		navigate(`${ITEM_ROUTE}/${id}`);
	};

	return (
		<section className={styles.main}>
			<ul className={styles.tabs}>
				<li
					className={
						activeTab === Type.ALL
							? `${styles.tab} ${styles.tab_active}`
							: styles.tab
					}
					onClick={handleTab4}
				>
					Все сорта
				</li>
				<li
					className={
						activeTab === Type.ELATIOR
							? `${styles.tab} ${styles.tab_active}`
							: styles.tab
					}
					onClick={handleTab1}
				>
					Бегония элатиор
				</li>
				<li
					className={
						activeTab === Type.BULB
							? `${styles.tab} ${styles.tab_active}`
							: styles.tab
					}
					onClick={handleTab2}
				>
					Бегония клубневая
				</li>
				<li
					className={
						activeTab === Type.FOLIAGE
							? `${styles.tab} ${styles.tab_active}`
							: styles.tab
					}
					onClick={handleTab3}
				>
					Ампельная
				</li>
			</ul>
			<div className={styles.wrapper}>
				{Type.ALL && status.data?.itemsAll && (
					<div className={styles.scroll}>
						<ul className={styles.list}>
							{status.data.itemsAll.map((item) => {
								return (
									<li
										key={item.id}
										onClick={() => handleItemCick(item.id)}
										className={styles.list__item}
									>
										{item.name}{' '}
									</li>
								);
							})}
						</ul>
					</div>
				)}
				{activeTab === Type.ALL && (
					<div
						style={{
							width: '70%',
							display: matches ? 'block' : 'none',
						}}
					>
						<div className={styles.container}>
							{items &&
								items.map((item) => {
									if (activeTab === Type.ALL) {
										return (
											<ShopElement
												key={item.id}
												item={item}
												handleItemCick={handleItemCick}
											/>
										);
									}
								})}
						</div>
						<Pagination
							total={status.data?.total as number}
							resultPerPage={resultPerPage}
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
						/>
					</div>
				)}
				{activeTab !== Type.ALL && (
					<div style={{ width: '100%' }}>
						<div className={styles.container}>
							{items &&
								items.map((item) => {
									if (
										activeTab === Type.ELATIOR &&
										item.type === Type.ELATIOR
									) {
										return (
											<ShopElement
												key={item.id}
												item={item}
												handleItemCick={handleItemCick}
											/>
										);
									}
									if (activeTab === Type.BULB && item.type === Type.BULB) {
										return (
											<ShopElement
												key={item.id}
												item={item}
												handleItemCick={handleItemCick}
											/>
										);
									}
									if (
										activeTab === Type.FOLIAGE &&
										item.type === Type.FOLIAGE
									) {
										return (
											<ShopElement
												key={item.id}
												item={item}
												handleItemCick={handleItemCick}
											/>
										);
									}
								})}
						</div>
						<Pagination
							total={status.data?.total as number}
							resultPerPage={resultPerPage}
							setCurrentPage={setCurrentPage}
							currentPage={currentPage}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
