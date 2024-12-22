const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get } from "../utils/http-requests.js";
import { storeUserSession, isAuth } from "../utils/session-manager.js";

const URIS = {
	login: `${BASE_URL}/login/`,
	logout: `${BASE_URL}/logout/`,
	refresh: `${BASE_URL}/token/refresh/`,
	register: `${BASE_URL}/register/`,
	auth: `${BASE_URL}/token/status`,
	verifyOTP: `${BASE_URL}/verify-otp/`,
};

// login and activate otp verification
export const login = async ({ username, password }) => {
	const url = URIS.login;
	const requestBody = { username, password };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	// remove this for production - user never accesses login page if they're authenticated
	const authenticated = await isAuth();
	if (authenticated) {
		storeUserSession({
			username: body.data.username,
			id: body.data.user_id,
			email: body.data.user_email,
			avatar: body.data.avatar,
			otp: body.data.otp,
		});
	}
	return { success: true };
};

// get new access token
export const refresh = async () => {
	const url = URIS.refresh;
	const { status, body, error } = await post(url);
	if (error) return { success: false, error: error };
	return { success: true };
};

// register and get access and refresh tokens
export const register = async ({ username, email, password }) => {
	const url = URIS.register;
	const requestBody = { username, email, password };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	return { success: true };
};

// checks if user is authenticated (if access token is valid)
export const tokenStatus = async () => {
	const url = URIS.auth;
	const { status, body, error } = await get(url);
	return status == 200 ? true : false;
};

// clears http-only cookies and sets user as offline on the server
export const logout = async () => {
	const url = URIS.logout;
	const { status, body, error } = await post(url);
	return status == 200 ? true : false;
};

// verify otp and receive access and refresh token on success
export const verifyOTP = async ({ username, otp }) => {
	const url = URIS.verifyOTP;
	const requestBody = { username, otp };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	storeUserSession({
		username: body.data.username,
		id: body.data.user_id,
		email: body.data.user_email,
		avatar: body.data.avatar,
		otp: body.data.otp,
	});
	return { success: true };
};
