import { refresh, tokenStatus, logout } from "../clients/token-client.js";

const maxRefreshAttempts = 3;
const backendURL = "http://127.0.0.1:8000";

export const storeUserSession = ({ username, id, email, avatar, accessToken, refreshToken }) => {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("id", id);
	sessionStorage.setItem("email", email);
	sessionStorage.setItem("avatar", `${backendURL}${avatar}`);
	sessionStorage.setItem("accessToken", accessToken);
	sessionStorage.setItem("refreshToken", refreshToken);
};

export const getUserSessionData = () => {
	return {
		username: sessionStorage.getItem("username"),
		id: sessionStorage.getItem("id"),
		email: sessionStorage.getItem("email"),
		avatar: sessionStorage.getItem("avatar"),
		accessToken: sessionStorage.getItem("accessToken"),
		refreshToken: sessionStorage.getItem("refreshToken"),
	};
};

export const clearUserSession = async () => {
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("id");
	sessionStorage.removeItem("email");
	sessionStorage.removeItem("avatar");
	sessionStorage.removeItem("accessToken");
	sessionStorage.removeItem("refreshToken");
	return await logout();
};

export const isAuth = async () => {
	const authenticated = await tokenStatus();
	let attempts = 0;
	while (!authenticated && attempts < maxRefreshAttempts) {
		refresh();
		attempts++;
	}
	if (authenticated) return true;
	else clearUserSession(); // NOTE: maybe this isn't the best behavior?
};
