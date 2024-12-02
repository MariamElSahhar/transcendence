const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get, del } from "../utils/http-requests.js";
import { getUserSessionData } from "../utils/session-manager.js";

const URIs = {
	friends: `${BASE_URL}/friends/`,
};

// Fetch all friends
export const fetchFriends = async () => {
	const url = URIs.friends;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body.data };
};

// Add friend
export const addFriend = async ({ friend_id }) => {
	const url = URIs.friends;
	const requestBody = { friend_id };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};

// Remove friend
export const removeFriend = async (id) => {
	const url = `${URIs.friends}${id}/`;
	const { status, body, error } = await del(url);
	if (error) return { success: false, error };
	return { success: true };
};
