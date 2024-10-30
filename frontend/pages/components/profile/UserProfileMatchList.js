// UserProfileMatchList.js
import { Component } from "../../components/Component.js";

export class UserProfileMatchList extends Component {
    constructor() {
        super();
    }

    render() {
        this.pageNumber = parseInt(this.getAttribute('page-number') || 1);
        return this.renderPlaceholder();
    }

    style() {
        return (`
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
        `);
    }

    loadMatchHistory(username, matchHistory) {
        this.innerHTML = this.#renderMatchHistory(matchHistory);
    }

    #renderMatchHistory(matchHistory) {
        return (`
            <div class="card mb-3 mt-3">
                <div class="card-header border-bottom">
                    <h5 class="mb-0">Latest Matches</h5>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover table-nowrap mb-1">
                        <thead>
                            <tr>
                                <th scope="col">Adversary</th>
                                <th scope="col">Date</th>
                                <th scope="col">Result</th>
                                <th scope="col">Score</th>
                                <th scope="col">Elo</th>
                                <th scope="col">Winning Chance</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.#renderMatches(matchHistory)}
                        </tbody>
                    </table>
                </div>
            </div>
        `) + this.style();
    }

    #renderMatches(matchHistory) {
        if (!matchHistory.length) {
            return `<tr><td colspan="6" class="text-center text-secondary">No matches played yet</td></tr>`;
        }
        return matchHistory.map((match) => this.#renderMatch(match)).join('');
    }

    #renderMatch(match) {
        const date = new Date(match.date).toLocaleDateString();
        return `
            <tr>
                <td>${match.opponent}</td>
                <td>${date}</td>
                <td>${this.#renderMatchResult(match.result)}</td>
                <td>${match.score}</td>
                <td>${this.#renderMatchEloDelta(match.eloDelta)}</td>
                <td>${this.#renderMatchWinningChance(match.winningChance)}</td>
            </tr>
        `;
    }

    #renderMatchResult(result) {
        return `
            <span class="badge badge-dot"><i class="${result === "Win" ? 'bg-success' : 'bg-danger'}"></i>${result}</span>
        `;
    }

    #renderMatchEloDelta(eloDelta) {
        return `
            <span class="badge badge-pill ${eloDelta.includes('+') ? 'bg-soft-success' : 'bg-soft-danger'} text-${eloDelta.includes('+') ? 'success' : 'danger'}">${eloDelta}</span>
        `;
    }

    #renderMatchWinningChance(winningChance) {
        const value = parseInt(winningChance.replace('%', ''));
        const bgClass = value < 20 ? 'bg-danger' : value < 40 ? 'bg-warning' : value < 60 ? 'bg-primary' : 'bg-success';
        return `
            <div class="d-flex align-items-center">
                <span class="me-2">${winningChance}</span>
                <div class="progress" style="width:100px">
                    <div class="progress-bar ${bgClass}" style="width:${winningChance}"></div>
                </div>
            </div>
        `;
    }
}

customElements.define('user-profile-match-list', UserProfileMatchList);

// import { Component } from "../../components/Component.js";
// // import { userStatsClient, userManagementClient } from '@utils/api';
// import { ErrorPage } from '../../utils/ErrorPage.js';
// import { redirect } from '../../../js/router.js';

// export class UserProfileMatchList extends Component {
//   constructor() {
//     super();
//   }

//   render() {
//     this.pageNumber = parseInt(this.getAttribute('page-number') || 1);
//     return this.renderPlaceholder();
//   }

//   style() {
//     return (`
//       <style>
//         .hide-placeholder-text {
//           color: var(--bs-secondary-bg)!important;
//           background-color: var(--bs-secondary-bg)!important;
//         }
//         .avatar-sm {
//           width: 2.25rem;
//           height: 2.25rem;
//         }
//         .badge-dot i {
//           width: .375rem;
//           height: .375rem;
//           border-radius: 50%;
//           margin-right: .5rem;
//           display: inline-block;
//         }
//         .progress {
//           height: .5rem;
//           font-size: .85rem;
//           background-color: #e7eaf0;
//           border-radius: 50rem;
//           display: flex;
//           overflow: hidden;
//         }
//         tbody {
//           font-size: .85rem;
//           font-weight: 400;
//         }
//       </style>
//     `);
//   }

//   loadMatchHistory(userId, matchHistory) {
//     this.user_id = userId;
//     this.innerHTML = this.#renderMatchHistory(matchHistory);

//     const paginationElement = this.querySelector('.pagination');
//     paginationElement.querySelectorAll('a').forEach((link) => {
//       super.addComponentEventListener(link, 'click', () => {
//         const pageNumber = parseInt(link.getAttribute('page-number'));
//         this.loadNewPage(pageNumber);
//       });
//     });
//   }

//   #renderMatchHistory(matchHistory) {
//     return (`
//       <div class="card mb-3 mt-3">
//         <div class="card-header border-bottom">
//           <h5 class="mb-0">Latest Matches</h5>
//         </div>
//         <div class="table-responsive">
//           <table class="table table-hover table-nowrap mb-1">
//             <thead>
//               <tr>
//                 <th scope="col">Adversary</th>
//                 <th scope="col">Date</th>
//                 <th scope="col">Result</th>
//                 <th scope="col">Score</th>
//                 <th scope="col">Elo</th>
//                 <th scope="col">Winning Chance</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${this.#renderMatches(matchHistory)}
//             </tbody>
//           </table>
//         </div>
//         <nav class="d-flex justify-content-center align-items-center">
//           ${this.#renderPagination(this.pageNumber, matchHistory['total_pages'])}
//         </nav>
//       </div>
//     `) + this.style();
//   }

//   #renderMatches(matchHistory) {
//     if (!matchHistory['history'].length) {
//       return `<tr><td colspan="6" class="text-center text-secondary">No matches played yet</td></tr>`;
//     }
//     return matchHistory['history'].map((match) => this.#renderMatch(match)).join('');
//   }

//   #renderPagination(currentPage, totalPages) {
//     const maxPagesToShow = 3;
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
//     const paginationItems = Array.from({ length: endPage - startPage + 1 },
//       (_, i) => this.#renderPageLink(startPage + i, startPage + i === currentPage)
//     );
//     return `
//       <ul class="pagination m-2">
//         <li class="page-item">
//           <a class="page-link ${currentPage === 1 ? 'disabled' : ''}" page-number="${currentPage - 1}">&laquo;</a>
//         </li>
//         ${paginationItems.join('')}
//         <li class="page-item">
//           <a class="page-link ${currentPage === totalPages ? 'disabled' : ''}" page-number="${currentPage + 1}">&raquo;</a>
//         </li>
//       </ul>
//     `;
//   }

//   #renderPageLink(pageNumber, active = false) {
//     return `<li class="page-item"><a class="page-link ${active ? 'active' : ''}" page-number="${pageNumber}">${pageNumber}</a></li>`;
//   }

//   async loadNewPage(pageNumber) {
//     this.pageNumber = pageNumber;
//     this.innerHTML = this.renderPlaceholder();
//     const matchHistory = await this.#getMatchHistory(this.user_id, pageNumber, 10);
//     if (!matchHistory || !(await this.#addUsernameInMatchHistory(matchHistory))) return;
//     this.loadMatchHistory(this.user_id, matchHistory);
//   }

//   async #getMatchHistory(userId, pageNumber, pageSize) {
//     try {
//       const { response, body } = await userStatsClient.getMatchHistory(userId, pageNumber, pageSize);
//       if (response.ok) return body;
//       redirect('/signin/');
//       return false;
//     } catch {
//       ErrorPage.loadNetworkError();
//       return false;
//     }
//   }

//   async #addUsernameInMatchHistory(matchHistory) {
//     const opponentsIds = matchHistory['history'].map((match) => parseInt(match['opponent_id']));
//     try {
//       const { response, body } = await userManagementClient.getUsernameListInCache(opponentsIds);
//       if (response.ok) {
//         matchHistory['history'].forEach((match) => {
//           match['opponent_username'] = body[match['opponent_id']];
//         });
//         return true;
//       }
//       redirect('/signin/');
//       return false;
//     } catch {
//       ErrorPage.loadNetworkError();
//       return false;
//     }
//   }

//   #renderMatch(match) {
//     const date = new Date(match['date']).toLocaleDateString();
//     const username = match['opponent_username'];
//     return `
//       <tr>
//         <td><img src="${userManagementClient.getURLAvatar(username)}" class="avatar-sm me-2"><a onclick="window.router.navigate('/profile/${username}/')">${username}</a></td>
//         <td>${date}</td>
//         <td>${this.#renderMatchResult(match['result'])}</td>
//         <td>${match['user_score']} - ${match['opponent_score']}</td>
//         <td>${this.#renderMatchEloDelta(match['elo_delta'])}</td>
//         <td>${this.#renderMatchWinningChance(parseInt(match['expected_result']))}</td>
//       </tr>
//     `;
//   }

//   #renderMatchResult(isWinningMatch) {
//     return `
//       <span class="badge badge-dot"><i class="${isWinningMatch ? 'bg-success' : 'bg-danger'}"></i>${isWinningMatch ? 'Win' : 'Lose'}</span>
//     `;
//   }

//   #renderMatchEloDelta(eloChange) {
//     return `
//       <span class="badge badge-pill ${eloChange > 0 ? 'bg-soft-success' : 'bg-soft-danger'} text-${eloChange > 0 ? 'success' : 'danger'}"><i class="bi ${eloChange > 0 ? 'bi-arrow-up' : 'bi-arrow-down'}"></i>${eloChange > 0 ? '+' : ''}${eloChange}</span>
//     `;
//   }

//   #renderMatchWinningChance(expectedResult) {
//     const bgClass = expectedResult < 20 ? 'bg-danger' : expectedResult < 40 ? 'bg-warning' : expectedResult < 60 ? 'bg-primary' : 'bg-success';
//     return `
//       <div class="d-flex align-items-center">
//         <span class="me-2">${expectedResult}%</span>
//         <div class="progress" style="width:100px">
//           <div class="progress-bar ${bgClass}" style="width:${expectedResult}%"></div>
//         </div>
//       </div>
//     `;
//   }

//   renderPlaceholder() {
//     const placeholderClass = 'placeholder placeholder-lg bg-body-secondary rounded hide-placeholder-text';
//     return `
//       <div class="card mb-3 mt-3 placeholder-glow">
//         <div class="card-header border-bottom"><h5 class="mb-0 ${placeholderClass}">Latest games</h5></div>
//         <div class="table-responsive"><table class="table"><thead><tr>${['Adversary', 'Date', 'Result', 'Score', 'Elo', 'Winning Chance'].map((header) => `<th><span class="${placeholderClass}">${header}</span></th>`).join('')}</tr></thead><tbody>${this.#renderPlaceholderMatches()}</tbody></table></div>
//       </div>
//     `;
//   }

//   #renderPlaceholderMatches(number = 10) {
//     return Array.from({ length: number }, () => `<tr>${['', '', '', '', '', ''].map(() => `<td><span class="placeholder placeholder-lg bg-body-secondary rounded hide-placeholder-text"></span></td>`).join('')}</tr>`).join('');
//   }
// }

// customElements.define('user-profile-match-list', UserProfileMatchList);
