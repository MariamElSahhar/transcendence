export function storeUserSession({ username, id, email, avatar }) {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("user_id", id);
	sessionStorage.setItem("user_email", email);
	sessionStorage.setItem("user_avatar", avatar);
}

export function getUserSessionData() {
	return {
		username: sessionStorage.getItem("username"),
		user_id: sessionStorage.getItem("user_id"),
		user_email: sessionStorage.getItem("user_email"),
		user_avatar: sessionStorage.getItem("user_avatar"),
	};
}

export function clearUserSession() {
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("user_id");
	sessionStorage.removeItem("user_email");
	sessionStorage.removeItem("user_avatar");
}
