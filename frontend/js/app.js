import { fetchUsers } from "./api/users.js";

export const populateUserList = async () => {
	const userListElement = document.getElementById("user-list");

	if (!userListElement) return;
	try {
		const users = await fetchUsers();

		console.log(users);
		users.forEach((user) => {
			const listItem = document.createElement("li");
			listItem.textContent = user.username;
			userListElement.appendChild(listItem);
		});

		if (users.length == 0) {
			const listItem = document.createElement("li");
			listItem.textContent = "no users created yet";
			userListElement.appendChild(listItem);
		}

	} catch (error) {
		console.error("Error fetching users:", error);
		userListElement.innerHTML = "<li>Failed to load user list</li>";
	}
};
