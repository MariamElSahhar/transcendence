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

export function renderPreGameCard(
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
	const startDateInSeconds = Date.now() / 1000 + 3;
	let secondsLeft = Math.round(startDateInSeconds - Date.now() / 1000);
	const overlay = renderOverlay(container);
	overlay.innerHTML = `
		<h1 id="countdown" class="display-1 fw-bold">5</h1>
	`;
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
	return { overlay, countDownIntervalId };
}

export function renderEndGameCard(
	component,
	playerNames,
	playerScores,
	tournament = false
) {
	const overlay = renderOverlay(component.container);

	const winnerIsPlayer = playerScores[0] > playerScores[1];
	const winnerName = winnerIsPlayer ? playerNames[0] : playerNames[1];

	overlay.innerHTML = `
		<div id="end-game-card" class="card">
			<div class="card-body">
				<img class="my-2" id="winner-sprite" src="/assets/sprites/${
					winnerIsPlayer ? "mario" : "luigi"
				}.png"/>
				<h3 class="card-subtitle mb-2">${winnerName} Wins!</h3>
				<div class="d-flex w-100 gap-3">
					<div class="w-100">
						<p class="text-truncate text-end mb-0">${playerNames[0]}</p>
						<p class="display-6 text-end">${playerScores[0]}</p>
					</div>
					<div class="w-100">
						<p class="text-truncate text-start mb-0">${playerNames[1]}</p>
						<p class="display-6 text-start">${playerScores[1]}</p>
					</div>
				</div>
				<!-- CTAs -->
				${
					tournament
						? `<button id="next-match" class="btn btn-primary mt-3">Next Match</button>`
						: `<div class="d-flex w-100 gap-2">
					<button class="btn btn-secondary w-100" onclick="window.redirect('/home')">Go Home</button>
					<button class="btn btn-primary w-100" onclick="window.redirect('${window.location.pathname}')">Play Again</button>
				</div>`
				}
			</div>
		</div>
	`;

	if (tournament) {
		component.addComponentEventListener(
			document.querySelector("#next-match"),
			"click",
			() => {
				removeOverlay(overlay);
				component.startNextMatch();
			}
		);
	}
	return overlay;
}

export function renderTournamentResults(component, champion, sortedPlayers) {
	const overlay = renderOverlay(component.container);
	overlay.innerHTML = `
            <div class="card text-center bg-light text-dark" style="width: 30rem;">
                <div class="card-body">
                    <img src="/pages/tictactoe/shroom.png" alt="Game Icon" class="card-image">
                    <h1 class="display-4 fw-bold">${champion} </h1>
                    <h1 class="display-4 fw-bold"> is the Tournament Champion! </h1>
                    <button class="btn btn-primary mt-3">Finish</button>
                </div>
            </div>
			<div class="card text-center">
                <div class="card-body">
                <h2 class="card-title">Tournament Ranks</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Wins</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${sortedPlayers
								.map(
									([player, wins], index) => `
								<tr>
									<td>${index + 1}</td>
									<td>${player}</td>
									<td>${wins}</td>
								</tr>`
								)
								.join("")}
                        </tbody>
                    </table>
                </div>
            </div>
			<div class="d-flex w-100 gap-2">
					<button class="btn btn-secondary w-100" onclick="window.redirect('/home')">Go Home</button>
					<button class="btn btn-primary w-100" onclick="window.redirect('${
						window.location.pathname
					}')">Play Again</button>
			</div>
        `;
}
