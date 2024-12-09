export class NavbarUtils {
	static get height() {
		const navbar = document.querySelector(".navbar");
		return navbar ? navbar.offsetHeight : 0;
	}

	static hideCollapse() {
		const navbar = document.querySelector("navbar-component");
		if (navbar) {
			navbar.hideCollapse();
		}
	}
}
