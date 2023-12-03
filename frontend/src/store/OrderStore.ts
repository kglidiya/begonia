/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { makeAutoObservable } from 'mobx';
import { Dispatch, SetStateAction } from 'react';
import { IOrder, IStatus, OrderStatus } from '../utils/types';
import { getCookie } from '../utils/cookies';
import { handleRequest } from '../utils/utils';
import { ORDER_URL } from '../utils/api';

export default class OrderStore {
	_order: IOrder[];

	_orderCount: number;

	constructor() {
		this._order = [];
		this._orderCount = 0;
		makeAutoObservable(this);
	}

	fetchOrder(
		status: IStatus<IOrder[] | []>,
		setStatus: Dispatch<SetStateAction<IStatus<IOrder[] | []>>>
	) {
		const accessToken: string | undefined = getCookie('token');
		handleRequest(status, setStatus, `${ORDER_URL}/me`, 'GET', '', accessToken);
		this._order = status.data;
	}

	setOrderCount() {
		const activeOrders = this._order.filter((el: IOrder) => {
			if (
				el.status === OrderStatus.CREATED ||
				el.status === OrderStatus.PENDING
			) {
				return el;
			}
		}).length;
		this._orderCount = activeOrders;
	}

	setOrder(order: IOrder[]) {
		this._order = order;
	}

	updateOrderStatus(id: number) {
		this._order.map((el) => {
			if (el.id === id) {
				return (el.status = 'canceled');
			}
			return el;
		});
	}

	addToOrder(item: IOrder) {
		const newOrder = [item, ...this._order];
		this._order = newOrder;
	}

	get order() {
		return this._order;
	}

	get orderCount() {
		return this._orderCount;
	}
}
