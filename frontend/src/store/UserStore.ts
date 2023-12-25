import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { IUser } from '../utils/types';

export const DEFAULT_STATE = {
	username: 'defaultUser',
	role: 'user',
};

export default class UserStore {
	_isAuth: boolean;

	_user: IUser | {};

	constructor() {
		makeAutoObservable(this);
		makePersistable(this, {
			name: 'User',
			properties: ['_isAuth', '_user'],
			storage: window.localStorage,
		});

		this._isAuth = false;
		this._user = {};
	}

	setIsAuth(bool: boolean) {
		this._isAuth = bool;
	}

	setUser(user: IUser | {}) {
		this._user = user;
	}

	get isAuth() {
		return this._isAuth;
	}

	get user() {
		return this._user;
	}
}
