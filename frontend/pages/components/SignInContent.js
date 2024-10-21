class SignInContent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.isValidEmailInput = false;
      this.isValidPasswordInput = false;
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          /* Add styles here */
        </style>
        <div>
          <h2>Sign In</h2>
          <form id="signin-form">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Sign In</button>
          </form>
          <div id="error-message"></div>
        </div>
      `;
  
      this.shadowRoot.querySelector('#signin-form').addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleSignIn();
      });
    }
  
    handleSignIn() {
      const email = this.shadowRoot.querySelector('#email').value;
      const password = this.shadowRoot.querySelector('#password').value;
  
      // Perform input validation and API call here
      if (email && password) {
        // Call to user management client or API
        console.log('Sign-in request:', { email, password });
      } else {
        this.shadowRoot.querySelector('#error-message').textContent = 'Please fill out all fields.';
      }
    }
  }
  
  // Define the custom element
  customElements.define('sign-in-content', SignInContent);
  