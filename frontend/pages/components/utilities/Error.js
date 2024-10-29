import {Component} from '../Component.js';

export class Error extends Component {
  constructor() {
    super();
  }

  async connectedCallback()
  {
	  await import("./ErrorContent.js");
	  this.render();
	}
	render() {
		this.innerHTML=`
	    <navbar-component></navbar-component>
		<error-content-component refresh="${this.getAttribute('refresh')}" message="${this.getAttribute('message')}"></error-content-component>
    `;
  }
  style() {
    return (`
    `);
  }
}

customElements.define('error-component', Error);
