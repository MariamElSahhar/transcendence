import { showError } from "../../pages/error/ErrorPage.js";

let socket = null;

export function initializeWebSocket(url, onOpen, onMessage, onClose, onError) {
	if (socket) {
		console.warn("WebSocket is already initialized");
		return;
	}

	socket = new WebSocket(url);

	socket.onopen = () => {
		// console.log('WebSocket connected');
		if (onOpen) onOpen(socket);
	};

	socket.onmessage = (event) => {
		const data = JSON.parse(event.data);
		if (onMessage) onMessage(data);
	};

	socket.onclose = () => {
		// console.log('WebSocket closed');
		if (socket) {
			if (onClose) onClose();
		}
		socket = null;
	};

	socket.onerror = (error) => {
		showError();
		console.error("WebSocket error:", error);
		if (onError) onError(error);
	};
}

export function checkSocket() {
	return socket;
}

export function sendWebSocketMessage(message) {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(JSON.stringify(message));
	} else {
		showError();
		console.error("WebSocket is not connected");
	}
}

export function closeWebSocket() {
	if (socket) {
		socket.close();
	} else {
		console.warn("WebSocket is not initialized");
	}
}
