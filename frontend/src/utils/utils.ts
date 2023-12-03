/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

import axios, { AxiosError } from 'axios';
import { getCookie, setCookie } from './cookies';
import { ICartItem, IStatus, OrderStatus, Type } from './types';

export const handleRequest = async (
	status: IStatus<any>,
	setStatus: React.Dispatch<React.SetStateAction<IStatus<any>>>,
	url: string,
	method: string,
	data?: any,
	token?: string,
	params: {} | null = null
) => {
	try {
		setStatus({ ...status, isloading: true });
		// console.log("1");
		// console.log(token)
		const res = await axios(url, {
			method,
			data,
			headers: token ? { Authorization: `Bearer ${token}` } : {},
			params,
		});
		// console.log(status.data)
		if (res.data.refreshToken && res.data.accessToken) {
			localStorage.setItem('token', res.data.refreshToken);
			setCookie('token', res.data.accessToken, { path: '/', expires: 60000 });
		}
		if (res.statusText !== 'OK' && res.statusText !== 'Created') {
			// console.log("2");

			throw new Error();
		}
		// console.log(res);
		setStatus({ ...status, isloading: false, data: res.data });
	} catch (error) {
		console.log(error)
		if (error instanceof AxiosError) {
			// console.log(error.response?.data);
			setStatus({
				...status,
				isloading: false,
				error: error.response?.data.message,
			});
		}
	}
	// console.log("4");
};


export const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString();
};

export const getTotal = (arr: ICartItem[]) => {
	// console.log(arr)
	return arr.reduce((acc, curr) => {
		return acc + curr.subTotal;
	}, 0);
};

export const getOrderStatus = (status: string) => {
	if (status === OrderStatus.CREATED) return (status = 'Ожидает обработки');
	if (status === OrderStatus.CANCELLED) return (status = 'Отменен');
	if (status === OrderStatus.PENDING) return (status = 'В обработке');
	if (status === OrderStatus.FULFFILED) return (status = 'Получен');
	return status;
};

export const getOrderStatusEnum = (
	status: string | number | string[] | null
) => {
	if (status === 'Ожидает обработки') return (status = OrderStatus.CREATED);
	if (status === 'Отменен') return (status = OrderStatus.CANCELLED);
	if (status === 'В обработке') return (status = OrderStatus.PENDING);
	if (status === 'Получен') return (status = OrderStatus.FULFFILED);
	return status;
};

export const productType = [Type.BULB, Type.ELATIOR, Type.FOLIAGE];

export const phoneRegex =
	/(\+7|8)[\s(]?(\d{3})[\s)]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})/;

export const emailRegex = /^\S+@\S+\.\S+$/;
export const urlRegex =
	/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;
export const phonePattern = /(?:\+|\d)[\d\-\(\) ]{9,}\d/g;
