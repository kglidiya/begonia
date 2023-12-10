/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */

import { ICartItem, OrderStatus, Type } from './types';

export const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString();
};

export const getTotal = (arr: ICartItem[]) => {
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
