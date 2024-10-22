const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get } from "../utils/http-requests.js";

export const login = async ({ username, password }) => {
	// login endpoint
	const url = `${BASE_URL}/login/`;
	const requestBody = { username, password };

	// try sending request
	const { status, body, error } = await post(url, requestBody);

	// if there's an error
	if (error) return { success: false, error: error };

	// everything's fine - return data
	return { success: true };
};

export const refresh = async () => {
	// token refresh endpoint
	const url = `${BASE_URL}/token/refresh/`;
	// try sending request
	const { status, body, error } = await post(url);
	// if there's an error
	if (error) return { success: false, error: error };
	// everything's fine - return data
	return { success: true };
};

export const register = async ({ username, password }) => {
	// registration endpoint
	const url = `${BASE_URL}/register/`;
	const requestBody = { username, password };
	// try sending request
	reponse = await post(url, credentials);
	// if there's an error
	if (error) return { success: false, error: error };
	// everything's fine - return data
	return { success: true };
};
