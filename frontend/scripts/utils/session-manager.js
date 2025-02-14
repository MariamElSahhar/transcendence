import { refresh, tokenStatus, logout } from "../clients/token-client.js";
import { getMyInfo } from "../clients/users-client.js";

// const backendUrl = "http://127.0.0.1:8000";

export const storeUserSession = ({ username, id, email, avatar, otp }) => {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("id", id);
	sessionStorage.setItem("email", email);
	sessionStorage.setItem("avatar", `${window.APP_CONFIG.mediaUrl}${avatar}`);
	sessionStorage.setItem("otp", otp);
};

export const fetchUserSessionData = async () => {
	if (
		sessionStorage.getItem("username") ==
			`${window.APP_CONFIG.backendUrl}undefined` ||
		sessionStorage.getItem("id") == "undefined" ||
		sessionStorage.getItem("email") == "undefined" ||
		sessionStorage.getItem("avatar") == "undefined" ||
		sessionStorage.getItem("otp") == "undefined"
	) {
		console.log("refetching my info");
		const response = await getMyInfo();
		if (response.success) {
			storeUserSession({
				username: response.body.username,
				id: response.body.user_id,
				email: response.body.user_email,
				avatar: response.body.avatar,
				otp: response.body.otp,
			});
			return true;
		} else return false;
	}
	return true;
};

export const getUserSessionData = () => {
	return {
		username: sessionStorage.getItem("username"),
		userid: sessionStorage.getItem("id"),
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

export const isAuth = async () => {
	let authenticated = await tokenStatus();
	if (!authenticated) {
		await refresh();
		authenticated = await tokenStatus();
	}
	if (authenticated) {
		return await fetchUserSessionData();
	} else return false;
	// else clearUserSession(); // NOTE: maybe this isn't the best behavior?
};
