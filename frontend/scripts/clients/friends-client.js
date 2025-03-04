import { post, get, del } from "../utils/http-requests.js";

const URIs = {
	friendsID: (user_id, friend_id) =>
		`/api/users/${user_id}/friends/${friend_id}/`,
	friends: (user_id) => `/api/users/${user_id}/friends/`,
};

// Fetch all friends
export const fetchFriends = async (user_id) => {
	const url = URIs.friends(user_id);
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body.data };
};

// Add friend
export const addFriend = async (user_id, friend_id) => {
	const url = URIs.friends(user_id);
	const requestBody = { friend_id };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};

// Remove friend
export const removeFriend = async (user_id, friend_id) => {
	const url = URIs.friendsID(user_id, friend_id);
	const { status, body, error } = await del(url);
	if (error) return { success: false, error };
	return { success: true };
};
