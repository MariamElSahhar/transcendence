class NotFoundPage extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `<h1>404 - Page Not Found</h1>`;
    }
  }
  
  customElements.define('not-found-page', NotFoundPage);
  