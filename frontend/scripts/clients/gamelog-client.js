const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get } from "../utils/http-requests.js";

const URIs = {
	gamelog: (user_id) => `${BASE_URL}/users/${user_id}/gamelog/`,
	gamelogRemote: `${BASE_URL}/gamelog/remote/`,
	gamelogTTT: `${BASE_URL}/gamelog/ttt/`,
	gamelogLocal: `${BASE_URL}/gamelog/local/`,
};

// Fetch game log
export const fetchUserGameLog = async (user_id) => {
	const url = URIs.gamelog(user_id);
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Add remote game to gamelog
export const addRemoteGame = async (gameData) => {
	const url = URIs.gamelogRemote;
	const requestBody = { gameData };
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
