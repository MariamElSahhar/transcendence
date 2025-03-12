import { Component } from "../../../pages/Component.js";
import { searchUsers } from "../../../scripts/clients/users-client.js";
import { isAuth } from "../../../scripts/utils/session-manager.js";
import { showError } from "../../../pages/error/ErrorPage.js";
export class SearchNav extends Component {
	render() {
		return `
			<div class="position-relative z-1">
				<input id="search-bar" class="form-control rounded-pill bg-light" type="search"
						placeholder="Search users..." aria-label="Search" autocomplete="off">
				<div id="search-results" class="rounded position-absolute w-100 z-2 d-none"></div>
			</div>
		`;
	}

	postRender() {
		this.searchBar = this.querySelector("#search-bar");
		this.searchResults = this.querySelector("#search-results");

		super.addComponentEventListener(
			this.searchBar,
			"input",
			this.handleInput
		);
		super.addComponentEventListener(document, "click", this.closeSearchBar);
	}

	async handleInput(event) {
		if (event.target.value.length < 2) {
			this.searchResults.style.display = "none";
			return;
		}
		if (!(await isAuth())) window.redirect("/");
		const { success, body, error } = await searchUsers(event.target.value);
		this.searchResults.innerHTML = "";

		if (error || !success) {
			showError();
			console.error(error || "Weird error occured.");
		}
		if (success) {
			if (body.data && body.data.length > 0) {
				this.searchResults.classList.remove("d-none");
				this.searchResults.classList.add("d-block");
				body.data.slice(0, 4).forEach((user) => {
					const div = document.createElement("div");
					div.className = "result-item p-1 cursor-pointer bg-body";
					div.innerHTML = `
						<img src="${window.APP_CONFIG.backendUrl}${user.avatar}" alt="profile image" class="rounded-circle object-fit-cover">
						${user.username}
					`;

					super.addComponentEventListener(div, "click", () => {
						window.redirect(`/dashboard/${user.id}`);
					});

					this.searchResults.appendChild(div);
				});
			}
		}
	}

	closeSearchBar(event) {
		if (
			!(
				this.searchResults?.contains(event.target) ||
				event.target == this.searchBar
			)
		) {
			this.searchResults.classList.add("d-none");
		}
	}

	style() {
		return `
			<style>
				#search-bar:active, #search-bar:focus {
					background-color: var(--bs-body-bg) !important;
				}

				#search-results {
					max-height: 200px;
					overflow-y: auto;
				}

				.result-item:hover {
					background-color: var(--sky-100) !important;
				}

				.result-item img {
					height: 40px;
					width: auto;
				}
			</style>
		`;
	}
}

customElements.define("navbar-searchbar", SearchNav);
