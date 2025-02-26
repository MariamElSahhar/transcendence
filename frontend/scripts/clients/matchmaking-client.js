const BASE_URL = `http://127.0.0.1:8000/api`;
const URIs = {
	matchmaker: `${BASE_URL}/remote-pong/matchmaking/`,
};
import { post } from "../utils/http-requests.js";

export const matchMaker = async (systemID) => {
	const url = URIs.matchmaker;
	const requestBody = {
		systemID,
	};
	const { status, body, error } = await post(url, requestBody);
	if (error) return { status: status, success: false, data: error };
	return { status: status, success: true, data: body };
};

export const removeMatchMaking = async () => {
	const url = URIs.matchmaker;
	const { status, body, error } = await del(url);
	if (error) return { status: status, success: false, data: error };
	return { status: status, success: true, data: body };
};
