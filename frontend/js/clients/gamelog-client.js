const BASE_URL = "http://127.0.0.1:8000/api";
import { post, get } from "../utils/http-requests.js";

const URIs = {
	gamelog: `${BASE_URL}/gamelog/`,
	gamelogRemote: `${BASE_URL}/gamelog/remote/`,
	gamelogTTT: `${BASE_URL}/gamelog/ttt/`,
	gamelogLocal: `${BASE_URL}/gamelog/local/`,
};

// Fetch game log
export const fetchUserGameLog = async (userid) => {
	/* const url = `${URIs.gamelog}${userid}/`;
	const { status, body, error } = await get(url);
	if (error) return { success: false, data: null, error: error };
	return { success: true, data: body.data }; */
	// DUMMY DATA
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
	};
	return { success: true, data: gamelog };
};

// Add remote game to gamelog
export const addRemoteGame = async (gameData) => {
	const url = URIs.gamelogRemote;
	const requestBody = { data: gameData };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};

// Add local game to gamelog
export const addLocalGame = async (gameData) => {
	const url = URIs.gamelogLocal;
	const requestBody = { data: gameData };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};

// Add tic tac toe game to gamelog
export const addTTTGame = async (gameData) => {
	const url = URIs.gamelogTTT;
	const requestBody = { data: gameData };
	const { status, body, error } = await post(url, requestBody);
	if (error) return { success: false, error };
	return { success: true };
};
