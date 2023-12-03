export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const ITEMS_URL = `${BASE_URL}items`;
export const REFRESH_TOKEN = `${BASE_URL}refresh`;
export const SIGN_IN_URL = `${BASE_URL}signin`;
export const SIGN_UP_URL = `${BASE_URL}signup`;
export const FORGOT_PASSWORD_URL = `${BASE_URL}forgot-password`;
export const RESET_PASSWORD_URL = `${BASE_URL}reset-password`;
export const CART_URL = `${BASE_URL}cart`;
export const ORDER_URL = `${BASE_URL}orders`;
export const getAllItems = (): any => {
	return { url: ITEMS_URL, method: 'GET' };
};
