class LoginPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
		<!-- Header (navbar) with left-aligned icon -->
		<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
			<div class="container-fluid">
				<div class="d-flex justify-content-start">
					<img
						src="../images/logo.svg"
						class="icon-option me-2"
						alt="Pong Game Logo"
					/>
				</div>
			</div>
		</nav>

		<!-- Main content area -->
		<main id="login-page">
			<div class="container">
				<h1 class="text-center">Welcome to Pong!</h1>

				<!-- Login Form -->
				<form id="loginForm" class="mt-4" autocomplete="off">
					<!-- Username Input -->
					<div class="mb-3">
						<label for="loginUser" class="form-label">Username</label>
						<input
							type="text"
							class="form-control"
							id="loginUser"
							name="user1"
							autocomplete="off"
							autocorrect="off"
							spellcheck="false"
						/>
					</div>

					<!-- Password Input -->
					<div class="mb-3">
						<label for="loginPass" class="form-label">Password</label>
						<input
							type="password"
							class="form-control"
							id="loginPass"
							name="password"
							autocomplete="off"
						/>
					</div>

					<!-- Submit Button -->
					<div class="text-center">
						<button type="submit" class="btn btn-primary w-100">
							Login
						</button>
					</div>
				</form>

				<!-- Link to Registration Page -->
				<p class="mt-3 text-center">
					New user? <a href="/register" onclick="route(event)">Register here</a>
				</p>
			</div>
		</main>
	  `;
	}
}

customElements.define("login-page", LoginPage);
