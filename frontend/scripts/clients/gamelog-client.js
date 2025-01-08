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
	/* // DUMMY DATA
	const gamelog = {
		local: [
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 20",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-11-20",
				opponent: "Player 3",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
		],
		remote: [
			{
				date: "2024-11-20",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: true,
			},
			{
				date: "2024-09-19",
				opponent: "Player 2",
				my_score: "3",
				opponent_score: "2",
				is_win: false,
			},
		],
		ttt: [],
	}; */
	return { success: true, data: gamelog };
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
	tournament,
}) => {
	const url = URIs.gamelogLocal;
	const requestBody = {
		opponent_score,
		my_score,
		opponent_username,
		tournament,
	};
	const { status, body, error } = await post(url, requestBody);
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
