import CartStore from '../store/CartStore';
import OrderStore from '../store/OrderStore';
import UserStore from '../store/UserStore';

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}

export enum OrderStatus {
	CREATED = 'created',
	PENDING = 'pending',
	FULFFILED = 'fulfilled',
	CANCELLED = 'canceled',
}

export enum Type {
	ELATIOR = 'Элатиор',
	BULB = 'Клубневая',
	FOLIAGE = 'Ампельная',
	ALL = 'Все сорта',
}

export interface IItem {
	id: number;
	createdAt: string;
	updatedAt: string;
	type: string;
	description: string;
	price: number;
	isAvaiable: boolean;
	name: string;
	image: string;
	galleryImage1: string;
	galleryImage2: string;
	galleryImage3: string;
	quantity: number;
	cart: ICartItem[];
}

export interface IItemsPagination {
	res: IItem[];
	total: number;
	itemsAll: IItem[];
}

export interface ICartItem {
	id: number;
	createdAt: string;
	updatedAt: string;
	user: IUser;
	item: IItem;
	quantity: number;
	subTotal: number;
}

export interface IUser {
	id: number;
	createdAt: string;
	updatedAt: string;
	email: string;
	password: string;
	role: Role;
	cart: ICartItem[];
	orders: IOrder[];
	recoveryCode: null | number;
}

export interface IOrder {
	id: number;
	createdAt: Date;
	updatedAt: Date;
	orderItems: ICartItem[];
	user: IUser;
	delivery: IDelivery;
	phone: string;
	status: string;
	userName: string;
}

export interface IDelivery {
	address: string;
	appartment: number;
	entrance: number;
	floor: number;
	comments: string;
}

export interface IStatus<T> {
	isLoading: boolean;
	data: T;
	error: string;
}

export interface IContext {
	user: UserStore;
	order: OrderStore;
	cart: CartStore;
}
