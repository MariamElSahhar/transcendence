// import { userManagementClient } from '../utils/api.js';
import './ConnectedNavbarComponent.js';
import './DisconnectedNavbarComponent.js';

export class NavbarComponent extends HTMLElement {
  connectedCallback() {
    const navActive = this.getAttribute('nav-active');
    this.render(navActive);
    this.applyStyle();
    this.adjustBodyPadding();
  }
  render(navActive) {
    // Always render the connected navbar for simplicity
    const content = `<connected-navbar-component nav-active="${navActive}"></connected-navbar-component>`;
    this.innerHTML = content;
  }
  

//   render(navActive) {
//     // const content = userManagementClient.isAuth()
//       ? `<connected-navbar-component nav-active="${navActive}"></connected-navbar-component>`
//       : `<disconnected-navbar-component nav-active="${navActive}"></disconnected-navbar-component>`;
//     this.innerHTML = content;
//   }

  applyStyle() {
    const style = document.createElement('style');
    style.innerHTML = `
      .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 9999;
          box-shadow: rgba(0, 82, 224, 0.1) 0px 6px 12px 0px;
      }
      .navbar-brand {
          font-family: 'JetBrains Mono Bold', monospace;
      }
      .nav-link {
          font-family: 'JetBrains Mono Light', monospace;
      }
    `;
    this.appendChild(style);
  }

  adjustBodyPadding() {
    const disablePaddingTop = this.getAttribute('disable-padding-top');
    const navbarHeight = this.querySelector('.navbar')?.offsetHeight || 0;
    document.body.style.paddingTop = disablePaddingTop === 'true' ? '0px' : `${navbarHeight}px`;
  }

  hideCollapse() {
    const navbarToggler = this.querySelector('.navbar-toggler');
    if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
      navbarToggler.click();
    }
  }

  get height() {
    return this.querySelector('.navbar')?.offsetHeight || 0;
  }

  addNotification(notification) {
    const notificationNav = this.querySelector('notification-nav-component');
    notificationNav?.addNotification(notification);
  }
}

customElements.define('navbar-component', NavbarComponent);
