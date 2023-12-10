/* eslint-disable consistent-return */
import axios, { AxiosError } from 'axios';
import { getCookie, setCookie } from './cookies';
import { IStatus } from './types';

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const ITEMS_URL = `${BASE_URL}items`;
export const REFRESH_TOKEN = `${BASE_URL}refresh`;
export const SIGN_IN_URL = `${BASE_URL}signin`;
export const SIGN_UP_URL = `${BASE_URL}signup`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}reset-password`;
export const CART_URL = `${BASE_URL}cart`;
export const ORDER_URL = `${BASE_URL}orders`;

export const handleRequestWithAuth = async (
	logOut: () => void,
	status: IStatus<any>,
	setStatus: React.Dispatch<React.SetStateAction<IStatus<any>>>,
	url: string,
	method: string,
	data?: any,
	params: {} | null = null
) => {
	let accessToken: string | undefined = getCookie('token');
	const refreshToken: string | undefined = localStorage.token;

	if (!accessToken && Date.now() >= +localStorage.expires_on) {
		return logOut();
	}

	if (!accessToken) {
		if (Date.now() <= +localStorage.expires_on) {
			try {
				const res = await axios(REFRESH_TOKEN, {
					method: 'GET',
					headers: { Authorization: `Bearer ${refreshToken}` },
				});
				accessToken = res.data.accessToken;
				localStorage.setItem('token', res.data.refreshToken);
				localStorage.setItem('expires_on', String(Date.now() + 600000 * 1000));
				setCookie('token', res.data.accessToken, { path: '/', expires: 6000 });
			} catch (e: any) {
				return logOut();
			}
		}
	}

	try {
		setStatus({ ...status, isloading: true });
		const res = await axios(url, {
			method,
			data,
			headers: { Authorization: `Bearer ${accessToken}` },
			params,
		});
		if (res.statusText !== 'OK' && res.statusText !== 'Created') {
			throw new Error();
		}
		setStatus({ ...status, isloading: false, data: res.data });
	} catch (error) {
		if (error instanceof AxiosError) {
			setStatus({
				...status,
				isloading: false,
				error: error.response?.data.message,
			});
		}
	}
};

export const handleRequest = async (
	status: IStatus<any>,
	setStatus: React.Dispatch<React.SetStateAction<IStatus<any>>>,
	url: string,
	method: string,
	data?: any,
	params: {} | null = null
) => {
	try {
		setStatus({ ...status, isloading: true });
		const res = await axios(url, {
			method,
			data,
			params,
		});

		if (res.data.refreshToken && res.data.accessToken) {
			localStorage.setItem('token', res.data.refreshToken);
			localStorage.setItem('expires_on', String(Date.now() + 600000 * 1000));
			setCookie('token', res.data.accessToken, { path: '/', expires: 6000 });
		}
		if (res.statusText !== 'OK' && res.statusText !== 'Created') {
			throw new Error();
		}

		setStatus({ ...status, isloading: false, data: res.data });
	} catch (error) {
		if (error instanceof AxiosError) {
			setStatus({
				...status,
				isloading: false,
				error: error.response?.data.message,
			});
		}
	}
};
