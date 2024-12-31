const BASE_URL = "http://127.0.0.1:8000/api/users";
import { get, post, patch, del } from "../utils/http-requests.js";

const URIs = {
	users: `${BASE_URL}`,
	usersID: (id) => `${BASE_URL}/${id}/`,
	usersUsername: (username) => `${BASE_URL}/?username=${username}`,
	userAvatar: (id) => `${BASE_URL}/${id}/avatar/`,
};

// Fetch all users
export const fetchUsers = async () => {
	const url = URIs.users;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};


// Function user by ID
export const fetchUserById = async (id) => {
	const url = URIs.usersID(id);
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Function user by ID
export const searchUsers = async (username) => {
	const url = URIs.usersUsername(username);
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, body };
};

// Update existing user by id
export const updateUser = async (id, userData) => {
	const url = URIs.usersID(id);
	const { status, body, error } = await patch(url, userData);
	if (error) return { success: false, body: null, error: error };
	return { success: true, body };
};

// Delete user
export const deleteUser = async (id) => {
	const url = URIs.usersID(id);
	const { status, body, error } = await del(url);
	if (error) return { success: false, error: error };
	return { success: true };
};

// Delete user avatar
export const deleteAvatar = async ({ user_id }) => {
	const url = URIs.userAvatar(user_id);
	const { status, body, error } = await del(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Upload user avatar
export const uploadAvatar = async ({ avatar, user_id }) => {
	const url = URIs.userAvatar(user_id);
	const { status, body, error } = await post(url, { avatar, user_id });
	if (error) return { success: false, error: error };
	return { success: true, data: body };
};

/* export const usernameExist = async (username) => {
	// console.log(username.username)
	const url = `${URIs.users}/username/${username}/exists/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, error: error };
	return { success: true, exists: body.exists };
}; */

/* export const emailExist = async (email) => {
	// console.log(email.email)
	const url = `${URIs.users}/email/${email}/exists/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, error: error };
	return { success: true, body };
};
 */

/* export const update2fa = async ({ id, update }) => {
	const url = `${URIs.users}/${id}/2fa/`;
	console.log(url);
	const { status, body, error } = await post(url, update);
	if (error) return { success: false, data: null, error: error };
	return { success: true, body };
}; */

/* // Create user
export const createUser = async (userData) => {
	const url = URIs.users;
	const { status, body, error } = await post(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
}; */
