/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import { ChangeEventHandler, useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { ORDER_URL } from '../../utils/api';
import { getCookie } from '../../utils/cookies';
import styles from './OrdersAdmin.module.css';
import useDebounce from '../../hooks/useDebounce';
import { IOrder, IStatus } from '../../utils/types';
import OrderAdminElement from '../../components/orderAdminElement/OrderAdminElement';
import Input from '../../ui/input/Input';
import axios from 'axios';
import { useIsFirstRender } from '../../hooks/useIsFirstRender';
import Loader from '../../components/loader/Loader';

export default function Orders() {
	const { register, watch } = useForm<FieldValues>({ values: { query: '' } });
	const accessToken: string | undefined = getCookie('token');
	const [status, setStatus] = useState<IStatus<IOrder[]>>({
		isloading: false,
		data: [],
		error: '',
	});
	const [ordersAll, setOrdersAll] = useState<IOrder[]>([]);
	const [ordersSearch, setOrdersSearch] = useState<IOrder[]>([]);
	const [limit] = useState(5);
	const [offset, setOffset] = useState(0);
	const [fetching, setFetching] = useState(true);
	const [searching, setSearching] = useState(false);
	const isFirstRender = useIsFirstRender();
	const [total, setTotal] = useState(1);
	const scrollHander = () => {
		const { scrollHeight } = document.documentElement;
		const currentHeight =
			document.documentElement.scrollTop + window.innerHeight;
		if (scrollHeight - currentHeight < 100) {
			
			setFetching(true);
		}
	};
	
	useEffect(() => {
		document.addEventListener('scroll', scrollHander);
		// eslint-disable-next-line func-names
		return function () {
			document.removeEventListener('scroll', scrollHander);
		};
	}, []);

	const fetchOrders = (query?: string) => {
		setStatus({ ...status, isloading: true });
		if (query) {
			axios(`${ORDER_URL}`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${accessToken}` },
				params: { query: query },
			})
				.then((res) => {
					
					setOrdersSearch(res.data);
					setStatus({ ...status, isloading: false });
				})
				.finally(() => {
					setFetching(false);
					setSearching(false);
				});
		} else 
		axios(`${ORDER_URL}?offset=${offset}&limit=${limit}`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${accessToken}` },
		})
			.then((res) => {
				setTotal(res.data.total);
				setOrdersAll([...ordersAll, ...res.data.chunk]);
				if (isFirstRender) {
				
					setOffset(5);
				} else setOffset((prev) => prev + 5);
				setStatus({ ...status, isloading: false });
			})
			.finally(() => {
				setFetching(false);
			});
	};

	const debouncedSearch = useDebounce(fetchOrders, 1000);

	useEffect(() => {
	
		if (fetching && ordersAll.length !== total) {
			// console.log('fetching');
			fetchOrders();
		}
	}, [fetching]);

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = () => {
		setSearching(true);
		debouncedSearch(watch('query'));
		setOrdersAll([]);
		setOffset(0);
	};

	if (status.isloading) {
		return <Loader />;
	}
	return (
		<section className={styles.container}>
			<h3 className={styles.title}>Заказы</h3>
			<form>
				<Input
					type="text"
					name="query"
					label="Поиск"
					placeholder="Введите email или телефон пользователя"
					register={register}
					required={false}
					clearButton={false}
					onChange={handleInputChange}
				/>
			</form>

			<div className="box-flex-column">
				{ordersAll.length > 0 &&
					watch('query') === '' &&
					ordersAll.map((order) => {
						return <OrderAdminElement order={order} key={order.id} />;
					})}
				{ordersSearch.length > 0 &&
					watch('query') !== '' &&
					ordersSearch.map((order) => {
						return <OrderAdminElement order={order} key={order.id} />;
					})}

				{watch('query') !== '' && !searching && ordersSearch.length === 0 && (
					<h5>Поиск не дал результата</h5>
				)}
			</div>
		</section>
	);
}
