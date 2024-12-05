import { Component } from "../Component.js";

export class GameLogTable extends Component {
	constructor() {
		super();
		this.gamelog = {};
	}

	style() {
		return `
            <style>
                .hide-placeholder-text {
                    color: var(--bs-secondary-bg)!important;
                    background-color: var(--bs-secondary-bg)!important;
                }
                .avatar-sm {
                    width: 2.25rem;
                    height: 2.25rem;
                }
                .badge-dot i {
                    width: .375rem;
                    height: .375rem;
                    border-radius: 50%;
                    margin-right: .5rem;
                    display: inline-block;
                }
                .progress {
                    height: .5rem;
                    font-size: .85rem;
                    background-color: #e7eaf0;
                    border-radius: 50rem;
                    display: flex;
                    overflow: hidden;
                }
                tbody {
                    font-size: .85rem;
                    font-weight: 400;
                }
            </style>
        `;
	}

	renderGameLog(matchHistory) {
		this.gamelog = matchHistory;
		this.update();
	}

	render() {
		this.pageNumber = parseInt(this.getAttribute("page-number") || 1);
		return `
            <div class="mb-3 mt-3">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link active" id="pills-local-tab" data-bs-toggle="pill" data-bs-target="#pills-local" type="button" role="tab" aria-controls="pills-local" aria-selected="true">Local Pong</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-remote-tab" data-bs-toggle="pill" data-bs-target="#pills-remote" type="button" role="tab" aria-controls="pills-remote" aria-selected="false">Online Pong</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link" id="pills-ttt-tab" data-bs-toggle="pill" data-bs-target="#pills-ttt" type="button" role="tab" aria-controls="pills-ttt" aria-selected="false">Tic Tac Toe</button>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-local" role="tabpanel" aria-labelledby="pills-local-tab">
                        ${this.#renderMatches(
							this.gamelog.local,
							"#pills-local"
						)}
                    </div>
                    <div class="tab-pane fade" id="pills-remote" role="tabpanel" aria-labelledby="pills-remote-tab">
                        ${this.#renderMatches(
							this.gamelog.remote,
							"#pills-remote"
						)}
                    </div>
                    <div class="tab-pane fade" id="pills-ttt" role="tabpanel" aria-labelledby="pills-ttt-tab">
                        ${this.#renderMatches(this.gamelog.ttt, "#pills-ttt")}
                    </div>
                </div>
            </div>
        `;
	}

	#renderMatches(gamelog) {
		if (!gamelog || gamelog.length === 0) {
			return `
                <div class="d-flex flex-column justify-content-start align-items-center w-100">
                    <p class="text-secondary">No games yet :(</p>
                    <p class="text-secondary">Go to the home page to start playing!</p>
                </div>`;
		}
		const rows = gamelog
			.map(
				(game) => `
                    <tr>
                        <td><span class="badge badge-dot"><i class="${
							game.result === "Win" ? "bg-success" : "bg-danger"
						}"></i></span>${game.result}</td>
                        <td>${game.opponent}</td>
                        <td>${game.my_score} - ${game.opponent_score} </td>
                        <td>${game.date}</td>
                    </tr>
                `
			)
			.join("");

		return `
            <div class="table-responsive">
                <table class="table table-hover table-nowrap mb-1">
                    <thead>
                        <tr>
                            <th scope="col">Result</th>
                            <th scope="col">Opponent</th>
                            <th scope="col">Score</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>`;
	}
}

customElements.define("gamelog-table", GameLogTable);
