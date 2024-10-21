class ActivateAccount extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const id = this.getAttribute('id');
      const token = this.getAttribute('token');
  
      this.shadowRoot.innerHTML = `
        <style>
          /* Add styles here */
        </style>
        <navbar-component></navbar-component>
        <activate-account-content id="${id}" token="${token}">
        </activate-account-content>
      `;
    }
  }
  
  // Define the custom element
  customElements.define('activate-account', ActivateAccount);
  