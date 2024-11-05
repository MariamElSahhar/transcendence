export function storeUserSession({ username, id, email, avatar }) {
	sessionStorage.setItem("username", username);
	sessionStorage.setItem("id", id);
	sessionStorage.setItem("email", email);
	sessionStorage.setItem("avatar", `http://127.0.0.1:8000${avatar}`);
}

export function getUserSessionData() {
	return {
		username: sessionStorage.getItem("username"),
		id: sessionStorage.getItem("id"),
		email: sessionStorage.getItem("email"),
		avatar: sessionStorage.getItem("avatar"),
	};
}

export function clearUserSession() {
	sessionStorage.removeItem("username");
	sessionStorage.removeItem("id");
	sessionStorage.removeItem("email");
	sessionStorage.removeItem("avatar");
}
