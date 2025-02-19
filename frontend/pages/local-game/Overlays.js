export function renderEndGameCard(overlay, playerScore, opponentScore) {
	const playerName = this.playerNames[0];
	const opponentName = this.playerNames[1];
	const winnerIsPlayer = playerScore > opponentScore;
	const winnerName = winnerIsPlayer ? playerName : opponentName;

	this.renderOverlay();
	overlay.innerHTML = `
	<div id="end-game-card" class="card">
	  <div class="card-body">
		  <img class="my-2" id="winner-sprite" src="/assets/sprites/${
				winnerIsPlayer ? "mario" : "luigi"
			}.png"/>
		<h3 class="card-subtitle mb-2">${winnerName} Wins!</h3>
		<div class="d-flex w-100 gap-3">
		  <div class="w-100">
			<p class="text-truncate text-end mb-0">${playerName}</p>
			<p class="display-6 text-end">${playerScore}</p>
		  </div>
		  <div class="w-100">
			<p class="text-truncate text-start mb-0">${opponentName}</p>
			<p class="display-6 text-start">${opponentScore}</p>
		  </div>
		</div>
		<!-- CTAs -->
		<div class="d-flex w-100 gap-2">
			<button class="btn btn-secondary w-100" onclick="window.redirect('/home')">Go Home</button>
			<button class="btn btn-primary w-100" onclick="window.redirect('/play/single-player')">Play Again</button>
		  </div>
	  </div>
	</div>
  `;
}

export function renderOverlay(container) {
	const overlay = document.createElement("div");
	overlay.id = "game-overlay";
	overlay.classList.add(
		"position-fixed",
		"top-0",
		"start-0",
		"w-100",
		"h-100",
		"d-flex",
		"justify-content-center",
		"align-items-center",
		"bg-dark",
		"bg-opacity-75",
		"text-white"
	);
	overlay.style.zIndex = "9999";
	container.appendChild(overlay);
	return overlay;
}
