export function setInvalidInput(input) {
	input.classList.remove("is-valid");
	input.classList.add("is-invalid");
}

export function setValidInput(input) {
	input.classList.remove("is-invalid");
	input.classList.add("is-valid");
}

export function setDefaultInputValidity(input) {
	input.classList.remove("is-invalid");
	input.classList.remove("is-valid");
}
