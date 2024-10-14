class RegisterPage extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<!-- Header (navbar) -->
			<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
				<div class="container-fluid">
					<a class="navbar-brand" href="/" onclick="route()">Pong Game</a>
				</div>
			</nav>

			<!-- Main content area for registration -->
			<main id="register-page">
				<h1 class="page-title text-center">Create Account</h1>

				<!-- Registration form inside a styled box -->
				<div class="registration-box mx-auto p-4">
					<form id="registerForm">
						<div class="row mb-3">
							<label for="registerFirstName" class="col-md-4 col-form-label"
								>First Name</label
							>
							<div class="col-md-8">
								<input
									type="text"
									class="form-control"
									id="registerFirstName"
									required
								/>
							</div>
						</div>

						<div class="row mb-3">
							<label for="registerLastName" class="col-md-4 col-form-label"
								>Last Name</label
							>
							<div class="col-md-8">
								<input
									type="text"
									class="form-control"
									id="registerLastName"
									required
								/>
							</div>
						</div>

						<div class="row mb-3">
							<label for="registerUsername" class="col-md-4 col-form-label"
								>Username</label
							>
							<div class="col-md-8">
								<input
									type="text"
									class="form-control"
									id="registerUsername"
									required
								/>
							</div>
						</div>
						<div class="row mb-3">
							<label for="registerEmail" class="col-md-4 col-form-label"
								>Email</label
							>
							<div class="col-md-8">
								<input
									type="email"
									class="form-control"
									id="registerEmail"
									required
								/>
							</div>
						</div>
						<div class="row mb-3">
							<label for="registerPassword" class="col-md-4 col-form-label"
								>Password</label
							>
							<div class="col-md-8">
								<input
									type="password"
									class="form-control"
									id="registerPassword"
									required
								/>
							</div>
						</div>
						<div class="row mb-3">
							<label
								for="registerConfirmPassword"
								class="col-md-4 col-form-label"
								>Confirm Password</label
							>
							<div class="col-md-8">
								<input
									type="password"
									class="form-control"
									id="registerConfirmPassword"
									required
								/>
							</div>
						</div>

						<!-- Error message container -->
						<div id="error-message" class="text-danger mb-3"></div>

						<div class="row">
							<div class="col-md-12 text-center">
								<button type="submit" class="btn btn-success w-50">
									Register
								</button>
							</div>
						</div>
					</form>
				</div>
			</main>
		`;
	}
}

customElements.define("register-page", RegisterPage);
