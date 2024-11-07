export class FooterComponent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer class="footer bg-dark text-white text-center py-3">
          <p>&copy; 2024 Transcendence</p>
        </footer>
      `;
    }
  }
  
  customElements.define('footer-component', FooterComponent);
  