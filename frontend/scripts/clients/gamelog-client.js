const BASE_URL = "http://192.168.1.52:8000/api";
import { post, get,del } from "../utils/http-requests.js";

const URIs = {
	gamelog: (user_id) => `${BASE_URL}/users/${user_id}/gamelog/`,
	gamelogRemote: `${BASE_URL}/gamelog/remote/`,
	gamelogTTT: `${BASE_URL}/gamelog/ttt/`,
	gamelogLocal: `${BASE_URL}/gamelog/local/`,
	matchmaker: `${BASE_URL}/remote-pong/matchmaking/`,
};


export const matchMaker = async () => {
	const url = URIs.matchmaker;
	const { status, body, error } = await post(url);
	if (error) return {status:status, success: false, data: error };
	return { status:status, success: true, data: body };
};

export const removeMatchMaking = async () => {
	const url = URIs.matchmaker;
	const { status, body, error } = await del(url);
	if (error) return {status:status, success: false, data: error };
	return { status:status, success: true, data: body };
};

// Fetch game log
export const fetchUserGameLog = async (user_id) => {
	const url = URIs.gamelog(user_id);
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	console.log(body)
	return { success: true, data: body };
};

// Add remote game to gamelog
export const addRemoteGame = async ({	opponent_score,
	my_score,
	opponent_username,
	gameSession}) => {
	const url = URIs.gamelogRemote;
	const requestBody = {
		opponent_score,
		my_score,
		opponent_username,
		gameSession,
	};
	console.log(requestBody )
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};

// Add local game to gamelog
export const addLocalGame = async ({
	opponent_score,
	my_score,
	opponent_username,
	tournament_round,
}) => {
	const url = URIs.gamelogLocal;
	const requestBody = {
		opponent_score,
		my_score,
		opponent_username,
		tournament_round,
	};
	const { error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};

// Add tic tac toe game to gamelog
export const addTTTGame = async (gameData) => {
	const url = URIs.gamelogTTT;
	const requestBody = { gameData };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};
