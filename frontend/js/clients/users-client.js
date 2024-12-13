const BASE_URL = "http://127.0.0.1:8000/api/users";
import { get, post, patch, del } from "../utils/http-requests.js";

const URIs = {
	users: `${BASE_URL}/`,
};

// Fetch all users
export const fetchUsers = async () => {
	const url = URIs.fetchUsers;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Function user by ID
export const fetchUserById = async (id) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Function user by ID
export const fetchUsersByUsername = async (username) => {
	// const url = `${URIs.users}`;
	// const { status, body, error } = get(url);
	// if (error) return { success: false, data: null, error: error };
	return {
		success: true,
		body: [
			{ username: "res1", userid: "33" },
			{ username: "res1", userid: "33" },
		],
	};
};

// Create user
export const createUser = async (userData) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = post(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Update existing user by id
export const updateUser = async (id, userData) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = patch(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Delete user
export const deleteUser = async (id) => {
	const url = `${URIs.users}${id}/`;
	const { status, body, error } = del(url, userData);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

export const usernameExist = async (username) => {
	// console.log(username.username)
	const url = `${URIs.users}username/${username}/exists/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, error: error };
	return { success: true, exists: body.exists };
};

export const emailExist = async (email) => {
	// console.log(email.email)
	const url = `${URIs.users}email/${email}/exists/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, error: error };
	return { success: true, body };
};
