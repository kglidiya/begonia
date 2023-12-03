import { makeAutoObservable, toJS } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { Dispatch, SetStateAction } from 'react';
import { handleRequest } from '../utils/utils';
import { CART_URL } from '../utils/api';
import { getCookie } from '../utils/cookies';
import { ICartItem, IItem, IStatus } from '../utils/types';


export default class CartStore {
	_cart: ICartItem[];

	_total: number;

	_count: number;

	constructor() {
		this._cart = [];
		this._total = 0;
		this._count = 0;
		makeAutoObservable(this);
		makePersistable(this, {
			name: 'Cart',
			properties: ['_total'],
			storage: window.localStorage,
		});
		
	}

	fetchCart(
		status: IStatus<ICartItem[] | []>,
		setStatus: Dispatch<SetStateAction<IStatus<[] | ICartItem[]>>>,
		accessToken: string
	) {
		handleRequest(status, setStatus, CART_URL, 'GET', '', accessToken);
		// console.log(status.data)
		this._cart = status.data;
	}
	
	deleteCart(status: any, setStatus: any, id: number, accessToken: string) {
		handleRequest(
			status,
			setStatus,
			`${CART_URL}`,
			'DELETE',
			{ id },
			accessToken
		);
		this._cart = this._cart.filter((cart) => cart.id !== id);
	}

	addToCart(item: ICartItem) {
		this._cart.push(item);
	}

	setCart(cart: ICartItem[]) {
		this._cart = cart;
	}


	changeQuantity(id: number, quantity: number) {
		const cartUpdated = this._cart.map((cartItem) => {
		
			if (cartItem.id === id) {
				
				return {
					...cartItem,
					quantity: quantity,
					subTotal: quantity * cartItem.item.price,
				};
			} else return cartItem;
		});
		this._cart = cartUpdated;
	}

	setTotal() {
		if (this._cart.length === 0) {
			this._total = 0;
		}
		if (this._cart.length === 1) {
			this._total = this._cart[0].subTotal;
		}
		if (this._cart.length > 1) {
			const total = this._cart.reduce((acc, curr) => {
				return acc + curr.subTotal;
			}, 0);
			this._total = total;
		}
	}
	setCount() {
		this._count = this._cart.length;
	}

	get cart() {

		return this._cart;
	}

	get total() {
		return this._total;
	}

	get count() {
		return this._count;
	}
}
