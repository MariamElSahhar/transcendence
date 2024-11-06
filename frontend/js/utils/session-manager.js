import { refresh, tokenStatus, logout } from "../clients/token-client.js";

const maxRefreshAttempts = 3;
const backendURL = "http://127.0.0.1:8000";

export const storeUserSession = ({ username, id, email, avatar }) => {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("id", id);
	sessionStorage.setItem("email", email);
	sessionStorage.setItem("avatar", `${backendURL}${avatar}`);
};

export const getUserSessionData = () => {
	return {
		username: sessionStorage.getItem("username"),
		id: sessionStorage.getItem("id"),
		email: sessionStorage.getItem("email"),
		avatar: sessionStorage.getItem("avatar"),
	};
};

export const clearUserSession = async () => {
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("id");
	sessionStorage.removeItem("email");
	sessionStorage.removeItem("avatar");
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
	else clearUserSession();
};
