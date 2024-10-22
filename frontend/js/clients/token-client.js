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
export const register = async ({ username, password }) => {
	const url = `${BASE_URL}/register/`;
	const requestBody = { username, password };
	reponse = await post(url, requestBody);
	if (error) return { success: false, error: error };
	return { success: true };
};
