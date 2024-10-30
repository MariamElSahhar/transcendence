import { Component } from "../../components/Component.js";
import { dummyData } from "./dummyData.js"; // Only if needed, or remove

export class UserProfileStatsCards extends Component {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render(); // Render the base structure
        this.loadStatsFromData(); // Load data after rendering
    }

    render() {
        return `
            <div class="row gx-3 gy-2 mb-3 mt-3">
                <div class="col-xl-3 col-sm-6">
                    <user-profile-stats-card id="elo-card" title="Elo"
                                              icon="bi-bar-chart-line" icon-bg="bg-danger"
                                              footer-title="Since last week">
                    </user-profile-stats-card>
                </div>
                <div class="col-xl-3 col-sm-6">
                    <user-profile-stats-card id="win-rate-card" title="Win Rate"
                                              icon="bi-trophy" icon-bg="bg-success"
                                              footer-title="Since last week">
                    </user-profile-stats-card>
                </div>
                <div class="col-xl-3 col-sm-6">
                    <user-profile-stats-card id="matches-played-card" title="Played Games"
                                              icon="bi-controller" icon-bg="bg-primary"
                                              footer-title="Since last week">
                    </user-profile-stats-card>
                </div>
                <div class="col-xl-3 col-sm-6">
                    <user-profile-stats-card id="friends-card" title="Friends"
                                              icon="bi-people" icon-bg="bg-warning"
                                              footer-title="Since last week">
                    </user-profile-stats-card>
                </div>
            </div>
        `;
    }

    loadStatsFromData() {
        // Extract JSON data from the `data` attribute
        const statsData = JSON.parse(this.getAttribute("data") || "{}");

        // Set values for each child `user-profile-stats-card`
        this.querySelector("#elo-card").loadValues(statsData.elo, 10, "pts");
        this.querySelector("#win-rate-card").loadValues(statsData.winRate, 5, "%");
        this.querySelector("#matches-played-card").loadValues(statsData.matchesPlayed, 2, "games");
        this.querySelector("#friends-card").loadValues(statsData.friends, 1, "friends");
    }
}

customElements.define("user-profile-stats-cards", UserProfileStatsCards);


// import {Component} from "../../components/Component.js";
// import { dummyData } from "./dummyData.js";
// const useDummyData = true;  // Set to `false` to use API data
// export class UserProfileStatsCards extends Component {
//   constructor() {
//     super();
//   }
//   render() {
//     return (`
//         <div class="row gx-3 gy-2 mb-3 mt-3">
//                 <div class="col-xl-3 col-sm-6">
//                   <user-profile-stats-card-component id="elo-card" title="Elo"
//                                                      icon="bi-bar-chart-line" icon-bg="bg-danger"
//                                                      footer-title="Since last week"
//                                                      placeholder="true">
//                   </user-profile-stats-card-component>
//                 </div>
//                 <div class="col-xl-3 col-sm-6">
//                   <user-profile-stats-card-component id="win-rate-card" title="Win Rate"
//                                                       icon="bi-trophy" icon-bg="bg-success"
//                                                       footer-title="Since last week"
//                                                       placeholder="true">
//                   </user-profile-stats-card-component>
//                 </div>
//                 <div class="col-xl-3 col-sm-6">
//                   <user-profile-stats-card-component id="matches-played-card" title="Played Games"
//                                                       icon="bi-controller" icon-bg="bg-primary"
//                                                       footer-title="Since last week"
//                                                       placeholder="true">
//                   </user-profile-stats-card-component>
//                   </div>
//                 <div class="col-xl-3 col-sm-6">
//                   <user-profile-stats-card-component id="friends-card" title="Friends"
//                                                       icon="bi-people" icon-bg="bg-warning"
//                                                       footer-title="Since last week"
//                                                       placeholder="true">
//                   </user-profile-stats-card-component>
//                 </div>
//             </div
//     `);
//   }

//   async postRender() {
//     this.eloCard = this.querySelector('#elo-card');
//     this.winRateCard = this.querySelector('#win-rate-card');
//     this.playedGamesCard = this.querySelector('#matches-played-card');
//     this.friendsCard = this.querySelector('#friends-card');
//   }

//   loadStatistics(eloGraph, winRateGraph, matchesPlayedGraph) {
//     // Access the `graph` arrays within each object
//     const eloGraphData = eloGraph.graph;
//     const winRateGraphData = winRateGraph.graph;
//     const matchesPlayedGraphData = matchesPlayedGraph.graph;

//     // Check if the extracted data is in the correct format
//     if (!Array.isArray(eloGraphData) || !Array.isArray(winRateGraphData) || !Array.isArray(matchesPlayedGraphData)) {
//         console.error("Invalid data format for charts. Expected arrays:", {
//             eloGraphData, winRateGraphData, matchesPlayedGraphData
//         });
//         return;
//     }

//     // Map the arrays to get the data needed for the charts
//     const dates = eloGraphData.map((obj) => obj.date);
//     const eloScores = eloGraphData.map((obj) => obj.value);
//     const winRates = winRateGraphData.map((obj) => obj.value);
//     const matchesPlayed = matchesPlayedGraphData.map((obj) => obj.value);
//     const matchDates = matchesPlayedGraphData.map((obj) => obj.date);

//     // Configure and load the Rank History chart
//     if (this.rankGraph && typeof this.rankGraph.loadConfig === 'function') {
//         const rankConfig = {
//             type: 'line',
//             data: {
//                 labels: dates,
//                 datasets: [
//                     {
//                         label: 'Elo',
//                         data: eloScores,
//                         borderWidth: 4,
//                         pointRadius: 0,
//                         cubicInterpolationMode: 'monotone',
//                     },
//                     {
//                         label: 'Win Rate',
//                         data: winRates,
//                         borderWidth: 4,
//                         pointRadius: 0,
//                         cubicInterpolationMode: 'monotone',
//                         yAxisID: 'percentage',
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: {
//                     x: { ticks: { maxTicksLimit: 5 }},
//                     y: { ticks: { maxTicksLimit: 5 }},
//                     percentage: {
//                         position: 'right',
//                         suggestedMin: 0,
//                         suggestedMax: 100,
//                         ticks: { maxTicksLimit: 5, callback: (value) => `${value}%` },
//                     },
//                 },
//             },
//         };
//         this.rankGraph.loadConfig(rankConfig);
//     } else {
//         console.error('rankGraph or loadConfig is not properly initialized.');
//     }

//     // Configure and load the Matches Played History chart
//     if (this.matchGraph && typeof this.matchGraph.loadConfig === 'function') {
//         const matchConfig = {
//             type: 'bar',
//             data: {
//                 labels: matchDates,
//                 datasets: [{
//                     label: 'Number of Games',
//                     data: matchesPlayed,
//                     backgroundColor: 'rgba(254,100,132,1)',
//                 }],
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 scales: { y: { ticks: { maxTicksLimit: 10 }}},
//             },
//         };
//         this.matchGraph.loadConfig(matchConfig);
//     } else {
//         console.error('matchGraph or loadConfig is not properly initialized.');
//     }
// }


//   style() {
//     return (`
//       <style>
//       </style>
//     `);
//   }
// }
// customElements.define('user-profile-stats-cards', UserProfileStatsCards);