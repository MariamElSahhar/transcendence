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

export function removeOverlay(overlay) {
	if (overlay) {
		overlay.remove();
	}
	return null;
}

export function renderGameInfoCard(
	component,
	container,
	player1,
	player2,
	engine,
	match = undefined
) {
	const overlay = renderOverlay(container);
	let countDownOverlay, countDownIntervalId;
	overlay.innerHTML = `
	  <div class="card text-center">
		<div class="card-body">
			${
				match
					? `<p>${
							match < 2
								? `Round 1 - Match ${match}`
								: `Final Round`
					  }</p>`
					: ""
			}
			<h2>${player1} vs ${player2}</h2>
			<button id="start-game" class="btn w-100">Go!</button>
		</div>
	  </div>
	`;
	component.addComponentEventListener(
		document.querySelector("#start-game"),
		"click",
		() => {
			removeOverlay(overlay);
			({ countDownOverlay, countDownIntervalId } = renderCountdownCard(
				container,
				engine
			));
		}
	);
	return { countDownOverlay, countDownIntervalId };
}

export function renderCountdownCard(container, engine) {
	const overlay = renderOverlay(container);
	overlay.innerHTML = `
		<h1 id="countdown" class="display-1 fw-bold">5</h1>
	`;
	const countDownIntervalId = startCountdown(overlay, engine);
	return { overlay, countDownIntervalId };
}

export function startCountdown(overlay, engine) {
	const startDateInSeconds = Date.now() / 1000 + 3;
	let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
	overlay.querySelector("#countdown").textContent = secondsLeft;

	const countDownIntervalId = setInterval(() => {
		secondsLeft -= 1;
		overlay.querySelector("#countdown").textContent = secondsLeft;

		if (secondsLeft <= 0) {
			clearInterval(countDownIntervalId);
			engine.startGame();
			removeOverlay(overlay);
		}
	}, 1000);
	return countDownIntervalId;
}

export function renderEndGameCard(
	container,
	playerNames,
	playerScore,
	opponentScore,
	path
) {
	const overlay = renderOverlay(container);

	const playerName = playerNames[0];
	const opponentName = playerNames[1];
	const winnerIsPlayer = playerScore > opponentScore;
	const winnerName = winnerIsPlayer ? playerName : opponentName;

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
				<button class="btn btn-primary w-100" onclick="window.redirect('${
					window.location.pathname
				}')">Play Again</button>
			</div>
		</div>
		</div>
	`;
	return overlay;
}
