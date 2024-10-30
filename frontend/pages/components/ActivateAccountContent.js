class ActivateAccountContent extends HTMLElement {
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
          .centered-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .spinner-border {
            width: 3rem;
            height: 3rem;
            border-width: 0.25rem;
          }
        </style>
        <div class="centered-container">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;
      
      // Placeholder for actual account activation logic
      this.activateAccount();
    }
  
    activateAccount() {
      const token = this.getAttribute('token');
      const id = this.getAttribute('id');
      
      if (token && id) {
        console.log('Activating account with token:', token, 'and id:', id);
        // Placeholder: Perform account activation using token and id
      } else {
        console.error('Token or ID missing for account activation.');
      }
    }
  }
  
  // Define the custom element
  customElements.define('activate-account-content', ActivateAccountContent);
  