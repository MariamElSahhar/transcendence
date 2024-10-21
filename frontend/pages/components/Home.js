class Home extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
    }
  
    render() {
      const isAuthenticated = this.isUserAuthenticated();
  
      this.shadowRoot.innerHTML = isAuthenticated
        ? `
          <style>
            /* Add styles here */
          </style>
          <navbar-component nav-active="home"></navbar-component>
          <friends-sidebar-component main-component="home-content"></friends-sidebar-component>
        `
        : `
          <style>
            /* Add styles here */
          </style>
          <navbar-component nav-active="home"></navbar-component>
          <home-content></home-content>
        `;
    }
  
    isUserAuthenticated() {
      // Placeholder for actual authentication logic
      return window.userManagementClient && window.userManagementClient.isAuth();
    }
  }
  
  // Define the custom element
  customElements.define('home-page', Home);
  