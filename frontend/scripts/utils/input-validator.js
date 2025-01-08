	export const isValidEmail = (email) => {
		if (email.indexOf('..') !== -1) {
		  return { validity: false, message: "Invalid email format." };
		}
		if (email.length > 200) {
		  return { validity: false, message: "Maximum 200 characters." };
		}
		if (!/^[\w-_.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
		  return { validity: false, message: "Invalid email format." };
		}
		return { validity: true, message: "Looks good!" };
	  };

	  export const isValidUsername = (username) => {
		if (username.length < 2) {
		  return { validity: false, message: "At least 2 characters." };
		}
		if (username.length > 20) {
		  return { validity: false, message: "Maximum 20 characters." };
		}
		if (!/^[a-zA-Z0-9]+$/.test(username)) {
		  return { validity: false, message: "Only alphanumeric characters." };
		}
		return { validity: true, message: "Looks good!" };
	  };


export const isValidSecurePassword = (pass) => {
  if (pass.length < 8) {
    return { validity: false, message: "At least 8 characters." };
  }
  if (pass.length > 20) {
    return { validity: false, message: "Maximum 20 characters." };
  }
  if (pass.toLowerCase() === pass) {
    return { validity: false, message: "At least one uppercase letter." };
  }
  if (pass.toUpperCase() === pass) {
    return { validity: false, message: "At least one lowercase letter." };
  }
  if (!/\d/.test(pass)) {
    return { validity: false, message: "At least one number." };
  }
  if (!/[^\w\s]/g.test(pass)) {
    return { validity: false, message: "At least one special character." };
  }
  return { validity: true, message: "Looks good!" };
};