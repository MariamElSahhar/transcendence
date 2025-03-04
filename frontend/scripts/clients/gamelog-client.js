import { post, get } from "../utils/http-requests.js";

const URIs = {
	gamelog: (user_id) => `/api/users/${user_id}/gamelog/`,
	gamelogRemote: `/api/gamelog/remote/`,
	gamelogTTT: `/api/gamelog/ttt/`,
	gamelogLocal: `/api/gamelog/local/`,
};

// Fetch game log
export const fetchUserGameLog = async (user_id) => {
	const url = URIs.gamelog(user_id);
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body };
};

// Add remote game to gamelog
export const addRemoteGame = async ({
	opponent_score,
	my_score,
	opponent_username,
	gameSession,
}) => {
	const url = URIs.gamelogRemote;
	const requestBody = {
		opponent_score,
		my_score,
		opponent_username,
		gameSession,
	};
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
