class TwoFactorAuth extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          /* Add styles for 2FA UI here */
          .two-factor-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
        </style>
        <div id="two-factor-auth" class="two-factor-container">
          <form id="two-factor-form">
            <label for="auth-code">Enter 2FA Code:</label>
            <input type="text" id="auth-code" name="auth-code" required>
            <button type="submit">Verify</button>
          </form>
          <div id="error-message"></div>
        </div>
      `;
  
      this.shadowRoot.querySelector('#two-factor-form').addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleTwoFactorAuth();
      });
    }
  
    handleTwoFactorAuth() {
      const authCode = this.shadowRoot.querySelector('#auth-code').value;
  
      if (authCode) {
        // Handle 2FA verification logic
        console.log('2FA Code:', authCode);
      } else {
        this.shadowRoot.querySelector('#error-message').textContent = 'Please enter the 2FA code.';
      }
    }
  }
  
  // Define the custom element
  customElements.define('two-factor-auth', TwoFactorAuth);
  