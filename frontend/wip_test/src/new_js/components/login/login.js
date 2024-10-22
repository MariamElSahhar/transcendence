class LoginComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="main-content">
                <div class="container">
                    <h1 class="text-center">Welcome to the Classic Pong Game!</h1>

                    <!-- Login Form -->
                    <form id="loginForm" class="mt-4" autocomplete="off">
                        <div class="mb-3">
                            <label for="loginUser" class="form-label">Username</label>
                            <input type="text" class="form-control" id="loginUser" name="user1" autocomplete="off" autocorrect="off" spellcheck="false" required>
                        </div>
                        <div class="mb-3">
                            <label for="loginPass" class="form-label">Password</label>
                            <input type="password" class="form-control" id="loginPass" name="password" autocomplete="off" required>
                        </div>

                        <!-- Centered Button -->
                        <div class="text-center">
                            <button type="submit" class="btn btn-primary w-100">Login</button>
                        </div>
                    </form>

                    <!-- Link to Registration Page -->
                    <p class="mt-3 text-center">New user? <a href="/register" onclick="route(event)">Register here</a></p>
                </div>
            </div>

            <footer>
                <p>&copy; 2024 Pong Game. All rights reserved.</p>
            </footer>
        `;

        // Add event listener to the form
        document.getElementById('loginForm').addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            const username = document.getElementById('loginUser').value;
            localStorage.setItem('loginUsername', username); // Store the username in localStorage
            const password = document.getElementById('loginPass').value;

            // Simulate a login check (replace this with real validation logic later)
            if (username && password) {
                router.navigate('/home_game');  // Navigate to the home game page using the router
            } else {
                alert('Please enter both username and password.');
            }
        });
    }
}

customElements.define('login-component', LoginComponent);
