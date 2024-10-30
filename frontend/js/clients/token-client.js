const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get } from "../utils/http-requests.js";

// login and get new access and refresh tokens
export const login = async ({ username, password }) => {
	const url = `${BASE_URL}/login/`;
	const requestBody = { username, password };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	return { success: true };
};

// get new access token
export const refresh = async () => {
	const url = `${BASE_URL}/token/refresh/`;
	const { status, body, error } = await post(url);
	if (error) return { success: false, error: error };
	return { success: true };
};

// register and get access and refresh tokens
export const register = async ({ username, email, password }) => {
	const url = `${BASE_URL}/register/`;
	const requestBody = { username, email, password };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	return { success: true };
};

// checks if user is authenticated (if access token is valid)
export const isAuth = async () => {
	// const url = `${BASE_URL}/token/status`;
	// const { status, body, error } = await get(url);
	// if (error) return false;
	// return true;

	return false;
};

export const verifyOTP = async ({ username, otp }) => {
	const url = `${BASE_URL}/verify-otp/`;
	const requestBody = { username, otp };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	return { success: true };
};
