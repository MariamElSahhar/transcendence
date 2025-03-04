import { Component } from "../../Component.js";

export class GameLogTable extends Component {
	constructor() {
		super();
		this.gamelog = {};
		this.pagenumber = 0;
		this.activeTab = "local";
	}
	style() {
		return `
            <style>
                .result
                {
                    font-family: 'New Super Mario Font U', sans-serif;
                    text-shadow:
                                -1px -1px 0 black,
                                1px -1px 0 black,
                                -1px 1px 0 black,
                                1px 1px 0 black;
                }

                .page-link
                {
                    color: black;
                    cursor: pointer;
                }

                .tab-content {
                    min-height: 350px;
                }

                .log-border {
                    border-collapse: separate;
                    border-top: 10px solid transparent !important;
                    border-image: url('assets/wall.png') 90 round !important;
                }

                .btn-icon {
                    width: 30px;
                    height: 30px;
                    margin-right: 5%;
                }

                .arrows:hover
                {
                    size:large;
                }
                .table tbody, td, tfoot, th, thead, tr {
                    background-color: rgba(255, 255, 255, 0.3) !important;
                }

                tbody {
                    font-size: .85rem;
                    font-weight: 400;
                }
                .nav-link {
                    transition: all 0.3s ease;
                }
                .nav-link.active,
                .nav-link:focus,
                .nav-link:hover {
                    color: black !important;
                    background-color: var(--brick-400) !important;
                }
            </style>
        `;
	}

	renderGameLog(matchHistory) {
		this.gamelog = matchHistory;
		this.attributeChangedCallback();
	}

	render() {
		return `
            <div class="mb-3 mt-3">
                <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-dark me-2 ${
							this.activeTab === "local" ? "active" : ""
						}" id="pills-local-tab" data-bs-toggle="pill" data-bs-target="#pills-local" type="button" role="tab" aria-controls="pills-local" aria-selected="true"><i class="bi text-dark bi-joystick"></i> Local Pong</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-dark me-2 ${
							this.activeTab === "remote" ? "active" : ""
						}" id="pills-remote-tab" data-bs-toggle="pill" data-bs-target="#pills-remote" type="button" role="tab" aria-controls="pills-remote" aria-selected="false"><i class="bi text-dark bi-people-fill"></i> Online Pong</button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button class="nav-link text-dark me-2 ${
							this.activeTab === "ttt" ? "active" : ""
						}" id="pills-ttt-tab" data-bs-toggle="pill" data-bs-target="#pills-ttt" type="button" role="tab" aria-controls="pills-ttt" aria-selected="false"><i class="bi text-dark bi-grid-3x3-gap-fill"></i> Tic Tac Toe</button>
                    </li>
                </ul>
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade ${
						this.activeTab === "local" ? "show active" : ""
					}" id="pills-local" role="tabpanel" aria-labelledby="pills-local-tab">
                        ${this.renderMatches(this.gamelog.local, "local")}
                    </div>
                    <div class="tab-pane fade ${
						this.activeTab === "remote" ? "show active" : ""
					}" id="pills-remote" role="tabpanel" aria-labelledby="pills-remote-tab">
                        ${this.renderMatches(this.gamelog.remote, "remote")}
                    </div>
                    <div class="tab-pane fade ${
						this.activeTab === "ttt" ? "show active" : ""
					}" id="pills-ttt" role="tabpanel" aria-labelledby="pills-ttt-tab">
                        ${this.renderMatches(this.gamelog.ttt, "ttt")}
                    </div>
                </div>
            </div>
        `;
	}

	renderMatches(gamelog, gametype) {
		if (!gamelog || gamelog.length === 0) {
			return `
                <div class="d-flex flex-column justify-content-start align-items-center w-100">
                    <p class="text-dark mb-1">No games yet...</p>
                    <p class="text-dark">Go to the home page to start playing!</p>
                </div>`;
		}
		const rows = gamelog
			.slice(this.pagenumber * 5, this.pagenumber * 5 + 5)
			.map(
				(game) => `
                    <tr>
                    <td>${game.opponent_username}</td>
                    <td class="result fs-3 ${
						game.is_win ? "text-success" : "text-danger"
					}">
                        ${game.is_win ? "WIN" : "LOSS"}
                    </td>
                        <td>${game.my_score} - ${game.opponent_score} </td>
                        <td>${game.date.split("T")[0]}</td>
                        ${
							gametype == "local"
								? `<td>${
										game.tournament_round
											? game.tournament_round < 3
												? `<img src="/assets/letter-t.png" class="mr-2 btn-icon" alt="Left Icon">First Round`
												: `<img src="/assets/letter-t.png" class="mr-2 btn-icon" alt="Left Icon">Final Round`
											: "-"
								  }</td>`
								: ""
						}
                    </tr>
                `
			)
			.join("");

		return `
            <div class="table-responsive">
                <table class="table log-border table-hover table-nowrap mb-1">
                    <thead class>
                        <tr>
                        <th scope="col">Opponent</th>
                            <th scope="col">Result</th>
                            <th scope="col">Score</th>
                            <th scope="col">Date</th>
                            ${
								gametype == "local"
									? `<th scope="col">Tournament</th>`
									: ""
							}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
            <nav>
                <ul class="pagination pagination-sm justify-content-center">
                    <li class="
                        page-item ${this.pagenumber === 0 ? "disabled" : ""}
                    ">
                        <a class="page-link  border-0 bg-transparent mt-1" data-page="previous">
                            <i class="arrows cursor-pointer bi bi-arrow-left-circle-fill"></i>
                        </a>
                    </li>
                    ${Array.from({
						length: Math.ceil(gamelog.length / 5) || 1,
					})
						.map(
							(_, i) => `
                    <li class="page-item ${
						this.pagenumber === i ? "active" : ""
					}">
                        <a class="page-link border-0 bg-transparent" data-page="${i}">${
								i + 1
							}</a>
                    </li>`
						)
						.join("")}
                    <li class="page-item ${
						this.pagenumber ===
						Math.ceil((gamelog.length || 0) / 5) - 1
							? "disabled"
							: ""
					}">
                        <a class="page-link border-0 bg-transparent mt-1" data-page="next">
                            <i class="arrows cursor-pointer bi bi-arrow-right-circle-fill"></i>
                        </a>
                    </li>
                </ul>
            </nav>`;
	}

	postRender() {
		this.querySelectorAll(".nav-link").forEach((link) => {
			super.addComponentEventListener(link, "click", (_) => {
				this.pagenumber = 0;
				this.activeTab = link.getAttribute("id").split("-")[1];
				this.attributeChangedCallback();
			});
		});

		this.querySelectorAll(".page-link").forEach((link) => {
			const page = link.getAttribute("data-page");
			super.addComponentEventListener(link, "click", (_) => {
				if (page === "previous") {
					this.pagenumber--;
				} else if (page === "next") {
					this.pagenumber++;
				} else if (!isNaN(parseInt(page))) {
					this.pagenumber = parseInt(page);
				}
				this.attributeChangedCallback();
			});
		});
	}
}

customElements.define("gamelog-table", GameLogTable);
