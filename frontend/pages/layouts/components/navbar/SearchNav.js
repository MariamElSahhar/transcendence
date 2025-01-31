import { Component } from "../../../Component.js";
import { searchUsers } from "../../../../scripts/clients/users-client.js";
import { isAuth } from "../../../../scripts/utils/session-manager.js";

export class SearchNav extends Component {
	constructor() {
		super();
	}

	render() {
		return `
			<div class="position-relative z-1">
				<form id="search-form" class="d-flex my-0" role="search">
					<input id="search-bar" class="form-control" type="search"
							placeholder="Search users..." aria-label="Search" autocomplete="off">
				</form>
				<div id="search-results" class="rounded"></div>
			</div>
		`;
	}

	style() {
		return `
			<style>
				#search-results {
					position: absolute;
					width: 100%;
					max-height: 200px;
					overflow-y: auto;
					display: none;
					z-index: 2;
				}

				.result-item {
					cursor: pointer;
					background-color: var(--bs-body-bg);
					border: 1px solid var(--bs-border-color);
				}
			</style>
		`;
	}

	postRender() {
		this.searchBar = this.querySelector("#search-bar");
		super.addComponentEventListener(
			this.searchBar,
			"input",
			this.#searchBarHandler
		);
		super.addComponentEventListener(
			document,
			"click",
			this.#DOMClickHandler
		);
		this.searchResults = this.querySelector("#search-results");
		this.searchForm = this.querySelector("#search-form");
		super.addComponentEventListener(
			this.searchForm,
			"submit",
			this.#searchFormHandler
		);
	}

	async #searchBarHandler(event) {
		if (event.target.value.length < 2) {
			this.searchResults.style.display = "none";
			return;
		}
		if (!(await isAuth())) window.redirect("/");
		const { success, body, error } = await searchUsers(event.target.value);
		this.searchResults.innerHTML = "";
		if (success) {
			this.searchResults.innerHTML = this.#renderSearchResults(body.data);
			if (body.data && body.data.length > 0) {
				this.searchResults.style.display = "block";
			} else {
				this.searchResults.style.display = "none";
			}
		} else {
			// ErrorPage.loadNetworkError();
			console.log(error);
		}
	}

	#renderSearchResults(results) {
		if (!results || !results.length) return "";
		return results
			.slice(0, 3)
			.map((user) => {
				return `
					<div class="result-item p-1" onclick="window.redirect('/dashboard/${user.id}/')">
						<img src="${user.avatar}" alt="profile image" class="rounded-circle object-fit-cover" style="width: 40px; height: 40px;">
						${user.username}
					</div>
				`;
			})
			.join("");
	}

	#DOMClickHandler(event) {
		if (
			this.searchResults &&
			!this.searchResults.contains(event.target) &&
			event.target !== this.searchBar
		) {
			this.searchResults.style.display = "none";
		}
	}

	#searchFormHandler(event) {
		event.preventDefault();
	}
}

customElements.define("navbar-searchbar", SearchNav);
