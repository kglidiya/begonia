/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { makeAutoObservable } from 'mobx';
import { IOrder, OrderStatus } from '../utils/types';

export default class OrderStore {
	_order: IOrder[];

	_orderCount: number;

	constructor() {
		this._order = [];
		this._orderCount = 0;
		makeAutoObservable(this);
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
