import { refresh, tokenStatus, logout } from "../clients/token-client.js";

const maxRefreshAttempts = 3;
const backendURL = "http://127.0.0.1:8000";

export const storeUserSession = ({ username, id, email, avatar , otp}) => {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("id", id);
	sessionStorage.setItem("email", email);
	sessionStorage.setItem("avatar", `${backendURL}${avatar}`);
	sessionStorage.setItem("otp", otp);
};

export const getUserSessionData = () => {
	return {
		username: sessionStorage.getItem("username"),
		id: sessionStorage.getItem("id"),
		email: sessionStorage.getItem("email"),
		avatar: sessionStorage.getItem("avatar"),
		otp: sessionStorage.getItem("otp"),
	};
};

export const clearUserSession = async () => {
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("id");
	sessionStorage.removeItem("email");
	sessionStorage.removeItem("avatar");
	sessionStorage.removeItem("otp");
	return await logout();
};


function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
}


export const isAuth = async () => {
	let authenticated = await tokenStatus();
	let attempts = 0;
	while (!authenticated && attempts < maxRefreshAttempts) {
		await refresh();
		authenticated = await tokenStatus();
		attempts++;
	}
	if (authenticated) return true;
	else clearUserSession(); // NOTE: maybe this isn't the best behavior?
};
