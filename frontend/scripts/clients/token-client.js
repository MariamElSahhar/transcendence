import { post, get } from "../utils/http-requests.js";
import { storeUserSession, isAuth } from "../utils/session-manager.js";

const URIS = {
	login: `/api/login/`,
	logout: `/api/logout/`,
	refresh: `/api/token/refresh/`,
	register: `/api/register/`,
	auth: `/api/token/status`,
	verifyOTP: `/api/verify-otp/`,
	avatars: `/api/default-avatars/`,
};

export const getDefaultAvatars = async () => {
	const url = URIS.avatars;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// login and activate otp verification
export const login = async ({ username, password }) => {
	const url = URIS.login;
	const requestBody = { username, password };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	if (!body.data.otp) {
		storeUserSession({
			username: body.data.username,
			id: body.data.user_id,
			email: body.data.user_email,
			avatar: body.data.avatar,
			otp: body.data.otp,
		});
	}
	return { success: true, otp: body.data.otp };
};

// get new access token
export const refresh = async () => {
	const url = URIS.refresh;
	const { status, body, error } = await post(url);
	if (error) return { success: false, error: error };
	return { success: body.success };
};

// register and get access and refresh tokens
export const register = async ({ username, email, password }) => {
	const url = URIS.register;
	const requestBody = { username, email, password };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error: error };
	return { success: true, error: null };
};

// checks if user is authenticated (if access token is valid)
export const tokenStatus = async () => {
	const url = URIS.auth;
	const { status, body, error } = await get(url);
	if (error) return false;
	return body.success;
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
