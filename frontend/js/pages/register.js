import redirect from "../router.js";

document
	.getElementById("registerForm")
	.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevent the form from submitting the traditional way

		// Get form values
		const firstName = document.getElementById("registerFirstName").value;
		const lastName = document.getElementById("registerLastName").value;
		const username = document.getElementById("registerUsername").value;
		const email = document.getElementById("registerEmail").value;
		const password = document.getElementById("registerPassword").value;
		const confirmPassword = document.getElementById(
			"registerConfirmPassword"
		).value;
		const errorMessage = document.getElementById("error-message");

		// Clear previous error message
		errorMessage.style.display = "none";
		errorMessage.textContent = "";

		// Debugging logs to check form values
		console.log("First Name:", firstName);
		console.log("Last Name:", lastName);
		console.log("Username:", username);
		console.log("Email:", email);
		console.log("Password:", password);
		console.log("Confirm Password:", confirmPassword);

		// Validate all fields are filled
		if (
			!firstName ||
			!lastName ||
			!username ||
			!email ||
			!password ||
			!confirmPassword
		) {
			errorMessage.textContent = "All fields are required!";
			errorMessage.style.display = "block"; // Ensure it's set to block
			return;
		}

		// Email validation
		const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		if (!emailPattern.test(email)) {
			errorMessage.textContent = "Please enter a valid email address.";
			errorMessage.style.display = "block";
			return;
		}

		// Password validation
		const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
		if (!passwordPattern.test(password)) {
			errorMessage.textContent =
				"Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, and one number.";
			errorMessage.style.display = "block";
			return;
		}

		// Check if passwords match
		if (password !== confirmPassword) {
			errorMessage.textContent = "Passwords do not match!";
			errorMessage.style.display = "block";
			return;
		}

		// Proceed with storing or handling the form submission
		console.log("Form is valid, storing data...");
		localStorage.setItem("playerFirstName", firstName);
		localStorage.setItem("playerLastName", lastName);
		localStorage.setItem("playerEmail", email);

		// Debugging Routing - Comment this out if `handleLocation()` is causing issues
		if (typeof handleLocation === "function") {
			redirect("/users");
		} else {
			console.log("Routing to two_factor page...");
			// Simple redirection for debugging
			window.location.href = "/two_factor.html";
		}
	});
