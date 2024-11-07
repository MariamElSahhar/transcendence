import { Component } from "../Component.js";

export class UserProfileChartsCards extends Component {
	constructor() {
		super();
	}

	render() {
		return `
            <div class="row gx-3 gy-2 mb-4 mt-3">
                <div class="col-md-6">
                    <user-profile-chart id="rank-graph"
                                        title="Rank History"
                                        type="line"
                                        placeholder="false">
                    </user-profile-chart>
                </div>
                <div class="col-md-6">
                    <user-profile-chart id="match-graph"
                                        title="Matches Played History"
                                        type="bar"
                                        placeholder="false">
                    </user-profile-chart>
                </div>
            </div>
        `;
	}

	postRender() {
		this.rankGraph = this.querySelector("#rank-graph");
		this.matchGraph = this.querySelector("#match-graph");
	}

	loadStatistics(eloGraph, winRateGraph, matchesPlayedGraph) {
		const dates = eloGraph.graph.map((obj) => obj.date);
		const eloScores = eloGraph.graph.map((obj) => obj.value);
		const winRates = winRateGraph.graph.map((obj) => obj.value);
		const matchDates = matchesPlayedGraph.graph.map((obj) => obj.date);
		const matchesPlayed = matchesPlayedGraph.graph.map((obj) => obj.value);

		// Rank History Chart Configuration
		if (this.rankGraph && typeof this.rankGraph.loadConfig === "function") {
			const rankConfig = {
				type: "line",
				data: {
					labels: dates,
					datasets: [
						{
							label: "Elo Score",
							data: eloScores,
							borderWidth: 2,
							pointRadius: 5,
							borderColor: "rgba(54, 162, 235, 1)",
							backgroundColor: "rgba(54, 162, 235, 0.2)",
						},
						{
							label: "Win Rate (%)",
							data: winRates,
							borderWidth: 2,
							pointRadius: 5,
							borderColor: "rgba(75, 192, 192, 1)",
							backgroundColor: "rgba(75, 192, 192, 0.2)",
							yAxisID: "percentage",
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						x: { ticks: { maxTicksLimit: 5 } },
						y: {
							beginAtZero: true,
							ticks: { maxTicksLimit: 5 },
							title: { display: true, text: "Elo Score" },
						},
						percentage: {
							position: "right",
							min: 0,
							max: 100,
							ticks: {
								maxTicksLimit: 5,
								callback: (value) => `${value}%`,
							},
							title: { display: true, text: "Win Rate (%)" },
						},
					},
					plugins: {
						tooltip: {
							enabled: true,
							mode: "index", // Display all datasets for the hovered point
							intersect: false,
							callbacks: {
								label: function (context) {
									const label = context.dataset.label || "";
									const value = context.raw;
									if (label === "Win Rate (%)") {
										return `${label}: ${value}%`; // Display Win Rate as percentage
									}
									return `${label}: ${value}`; // Display Elo score normally
								},
							},
						},
					},
					hover: {
						mode: "index",
						intersect: false,
					},
				},
			};
			this.rankGraph.loadConfig(rankConfig);
		} else {
			console.error(
				"rankGraph or loadConfig is not properly initialized."
			);
		}

		// Matches Played History Chart Configuration
		if (
			this.matchGraph &&
			typeof this.matchGraph.loadConfig === "function"
		) {
			const matchConfig = {
				type: "bar",
				data: {
					labels: matchDates,
					datasets: [
						{
							label: "Number of Games",
							data: matchesPlayed,
							backgroundColor: "rgba(255, 99, 132, 0.6)",
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					scales: { y: { ticks: { maxTicksLimit: 10 } } },
				},
			};
			this.matchGraph.loadConfig(matchConfig);
		} else {
			console.error(
				"matchGraph or loadConfig is not properly initialized."
			);
		}
	}
}
customElements.define("user-profile-charts-cards", UserProfileChartsCards);

// import { Component } from "../../components/Component.js";

// export class UserProfileChartsCards extends Component {
//   constructor() {
//     super();
//   }

//   render() {
//     return (`
//       <div class="row gx-3 gy-2 mb-4 mt-3">
//         <div class="col-md-6">
//             <user-profile-chart-component id="rank-graph"
//                                           title="Rank History"
//                                           type="line"
//                                           placeholder="true">
//             </user-profile-chart-component>
//         </div>
//         <div class="col-md-6">
//             <user-profile-chart-component id="match-graph"
//                                           title="Matches Played History"
//                                           type="bar"
//                                           placeholder="true">
//             </user-profile-chart-component>
//         </div>
//      </div>
//     `);
//   }

//   style() {
//     return (`
//       <style>
//         /* Add specific styles here if needed */
//       </style>
//     `);
//   }

//   postRender() {
//     // Set references to each chart component
//     this.rankGraph = this.querySelector('#rank-graph');
//     this.matchGraph = this.querySelector('#match-graph');
//   }

//   // Load statistics into charts; called externally by UserProfilePage
//   loadStatistics(eloGraph, winRateGraph, matchesPlayedGraph) {
//     const { graph: eloGraphData } = eloGraph;
//     const { graph: winRateGraphData } = winRateGraph;
//     const { graph: matchesPlayedGraphData } = matchesPlayedGraph;

//     const RankDates = eloGraphData.map((obj) => obj.date);
//     const eloScores = eloGraphData.map((obj) => obj.value);
//     const winRates = winRateGraphData.map((obj) => obj.value);
//     const matchesPlayed = matchesPlayedGraphData.map((obj) => obj.value);
//     const matchDates = matchesPlayedGraphData.map((obj) => obj.date);

//     // Update rank chart based on available data
//     if (eloScores.length === 1 || winRates.length === 1) {
//       this.rankGraph.loadNoDataChart();
//     } else {
//       this.rankGraph.loadConfig(
//         this.#generateRankConfig(RankDates, eloScores, winRates)
//       );
//     }

//     // Update matches played chart based on available data
//     const totalMatchesPlayed = matchesPlayed.reduce((acc, value) => acc + value, 0);
//     if (totalMatchesPlayed === 0) {
//       this.matchGraph.loadNoDataChart();
//     } else {
//       this.matchGraph.loadConfig(
//         this.#generateMatchConfig(matchDates, matchesPlayed)
//       );
//     }
//   }

//   #generateRankConfig(dates, eloScores, winRates) {
//     winRates = winRates.map((rate) => rate.toFixed(2));
//     const labels = dates.map((date) => this.#formatDateWithoutTime(date));
//     const labelsToolTip = dates.map((date) => this.#formatDateWithTime(date));

//     return {
//       type: 'line',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Elo',
//             data: eloScores,
//             labelsToolTip: labelsToolTip,
//             borderWidth: 4,
//             pointRadius: 0,
//             cubicInterpolationMode: 'monotone',
//           },
//           {
//             label: 'Win Rate',
//             data: winRates,
//             labelsToolTip: labelsToolTip,
//             borderWidth: 4,
//             pointRadius: 0,
//             cubicInterpolationMode: 'monotone',
//             yAxisID: 'percentage',
//           },
//         ],
//       },
//       options: {
//         // Chart configurations for tooltips and scales
//         plugins: {
//           tooltip: {
//             callbacks: {
//               title: (tooltipItems) => tooltipItems[0].dataset.labelsToolTip[tooltipItems[0].parsed.x],
//               label: (tooltipItems) => `${tooltipItems.dataset.label} : ${tooltipItems.parsed.y}${tooltipItems.datasetIndex ? '%' : ''}`
//             },
//           },
//         },
//         interaction: { intersect: false },
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//           x: { ticks: { maxTicksLimit: 5 } },
//           y: { ticks: { maxTicksLimit: 5 } },
//           percentage: {
//             position: 'right',
//             suggestedMin: 0,
//             suggestedMax: 100,
//             ticks: {
//               maxTicksLimit: 5,
//               callback: (value) => `${value}%`,
//             },
//           },
//         },
//       },
//     };
//   }

//   #generateMatchConfig(dates, matchesPlayed) {
//     return {
//       type: 'bar',
//       data: {
//         labels: dates,
//         datasets: [{
//           label: 'Number of Games',
//           data: matchesPlayed,
//           backgroundColor: 'rgba(254,100,132,1)',
//         }],
//       },
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: { y: { ticks: { maxTicksLimit: 10 } } },
//       },
//     };
//   }

//   #formatDateWithTime(isoDateString) {
//     return new Date(isoDateString).toLocaleString('en-US', {
//       day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
//     });
//   }

//   #formatDateWithoutTime(isoDateString) {
//     return new Date(isoDateString).toLocaleString('en-US', { day: 'numeric', month: 'short' });
//   }
// }

// customElements.define('user-profile-charts-cards', UserProfileChartsCards);
