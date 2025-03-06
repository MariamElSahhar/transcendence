import { Component } from "../../../pages/Component.js";
import { searchUsers } from "../../../scripts/clients/users-client.js";
import { isAuth } from "../../../scripts/utils/session-manager.js";

export class SearchNav extends Component {
	render() {
		return `
			<div class="position-relative z-1">
				<input id="search-bar" class="form-control rounded-pill bg-light" type="search"
						placeholder="Search users..." aria-label="Search" autocomplete="off">
				<div id="search-results" class="rounded position-absolute w-100 z-2"></div>
			</div>
		`;
	}

	postRender() {
		this.searchBar = this.querySelector("#search-bar");
		this.searchResults = this.querySelector("#search-results");

		super.addComponentEventListener(this.searchBar, "input", this.handleInput);
		super.addComponentEventListener(document, "click", this.handleDocumentClick);
	}

	handleInput = async (event) => {
		if (event.target.value.length < 2) {
			this.searchResults.style.display = "none";
			return;
		}
		if (!(await isAuth())) {
			window.redirect("/");
			return;
		}

		const { success, body, error } = await searchUsers(event.target.value);
		this.searchResults.innerHTML = "";

		if (success) {
			this.searchResults.innerHTML = this.renderResults(body.data);
			this.searchResults.style.display = (body.data && body.data.length > 0) ? "block" : "none";
		} else {
			console.error(error);
		}
	};

	renderResults(data) {
		if (!data || data.length === 0) return "";
		return data.slice(0, 3)
			.map(user => `
				<div class="result-item p-1" onclick="window.redirect('/dashboard/${user.id}/')">
					<img src="${window.APP_CONFIG.backendUrl}${user.avatar}" alt="profile image" class="rounded-circle object-fit-cover" style="width: 40px; height: 40px;">
					${user.username}
				</div>
			`).join("");
	}

	handleDocumentClick = (event) => {
		if (
			this.searchResults &&
			!this.searchResults.contains(event.target) &&
			event.target !== this.searchBar
		) {
			this.searchResults.style.display = "none";
		}
	};
	
	style() {
		return `
			<style>
				#search-bar:active, #search-bar:focus {
					background-color: var(--bs-body-bg) !important;
				}

				#search-results {
					max-height: 200px;
					overflow-y: auto;
					display: none;
				}

				.result-item {
					cursor: pointer;
					background-color: var(--bs-body-bg);
					border: 1px solid var(--bs-border-color);
				}
			</style>
		`;
	}
}

customElements.define("navbar-searchbar", SearchNav);
