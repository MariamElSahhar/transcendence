export class ConnectedNavbarComponent extends HTMLElement {
	connectedCallback() {
		// const username = userManagementClient.username;
		const username = "Mariam";
		const navActive = this.getAttribute("nav-active");

		this.innerHTML = `
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
          <div class="container-fluid">
            <a class="navbar-brand" onclick="window.redirect('/')">Transcendence</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                ${this.generateNavLinks(
					["local", "multiplayer", "tournaments", "ranking"],
					navActive
				)}
              </ul>
              <div class="d-flex align-items-center">
                <theme-button-component class="me-1"></theme-button-component>
                <friends-button-component class="me-1"></friends-button-component>
                <notification-nav-component class="me-1"></notification-nav-component>
                ${this.generateProfileDropdown(username)}
              </div>
            </div>
          </div>
        </nav>
      `;
	}

	generateNavLinks(links, activeLink) {
		return links
			.map(
				(link) => `
          <li class="nav-item">
            <a id="${link}" class="nav-link ${
					activeLink === link ? "active" : ""
				}">
              ${link.charAt(0).toUpperCase() + link.slice(1)}
            </a>
          </li>
        `
			)
			.join("");
	}

	generateProfileDropdown(username) {
		return `
        <div class="dropdown mx-2">
          <span class="dropdown-toggle" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="" class="rounded-circle object-fit-cover"
                 style="width: 40px; height: 40px;" alt="Profile Image">
            <span>@${username}</span>
          </span>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
            <li><a class="dropdown-item" onclick="window.redirect('/profile/${username}/')">Profile</a></li>
            <li><a class="dropdown-item" onclick="window.redirect('/settings/')">Settings</a></li>
            <li><a class="dropdown-item text-danger" id="logout">Sign out</a></li>
          </ul>
        </div>
      `;
	}
}

customElements.define("connected-navbar-component", ConnectedNavbarComponent);
