import redirect from "/js/router.js";

document
	.getElementById("loginForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const username = document.getElementById("loginUser").value;
		const password = document.getElementById("loginPass").value;

		if (username && password) {
			redirect("/users");
		} else {
			alert("Please enter both username and password.");
		}
	});
