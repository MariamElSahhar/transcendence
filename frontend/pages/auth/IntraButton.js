import { Component } from "../Component.js";
// import {userManagementClient} from '@utils/api';
// import {ErrorPage} from '@utils/ErrorPage.js';

export class IntraButton extends Component {
	constructor() {
		super();
	}
	render() {
		return `
      <button id="intra-btn" class="btn btn-lg btn-outline-dark mb-2 w-100 dark-hover"
              type="submit">
          <svg xmlns:dc="http://purl.org/dc/elements/1.1/"
               xmlns:cc="http://creativecommons.org/ns#"
               xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
               xmlns:svg="http://www.w3.org/2000/svg"
               xmlns="http://www.w3.org/2000/svg"
               xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
               xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
               version="1.1" id="Calque_1" x="0px" y="0px"
               viewBox="0 0 137.6 96.599998"
               enable-background="new 0 0 595.3 841.9"
               xml:space="preserve" inkscape:version="0.48.2 r9819"
               width="24" height="24" sodipodi:docname="42_logo.svg"><script xmlns=""/>
              <metadata id="metadata17"><rdf:RDF><cc:Work rdf:about=""><dc:format>image/svg+xml</dc:format><dc:type
                      rdf:resource="http://purl.org/dc/dcmitype/StillImage"/></cc:Work></rdf:RDF></metadata>
              <defs id="defs15"/>
              <sodipodi:namedview pagecolor="#ffffff"
                                  bordercolor="#666666"
                                  borderopacity="1"
                                  objecttolerance="10"
                                  gridtolerance="10"
                                  guidetolerance="10"
                                  inkscape:pageopacity="0"
                                  inkscape:pageshadow="2"
                                  inkscape:window-width="1060"
                                  inkscape:window-height="811"
                                  id="namedview13" showgrid="false"
                                  fit-margin-top="0"
                                  fit-margin-left="0"
                                  fit-margin-right="0"
                                  fit-margin-bottom="0"
                                  inkscape:zoom="0.39642998"
                                  inkscape:cx="68.450005"
                                  inkscape:cy="48.350011"
                                  inkscape:window-x="670"
                                  inkscape:window-y="233"
                                  inkscape:window-maximized="0"
                                  inkscape:current-layer="Calque_1"/>
              <g id="g3" transform="translate(-229.2,-372.70002)">
                  <polygon
                          points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4 "
                          id="polygon5"/>
                  <polygon
                          points="316.1,398.1 341.4,372.7 316.1,372.7 "
                          id="polygon7"/>
                  <polygon
                          points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7 "
                          id="polygon9"/>
                  <polygon
                          points="366.8,423.4 341.4,448.7 366.8,448.7 "
                          id="polygon11"/>
              </g>
          </svg>
          Sign in with 42 Intra
      </button>
    `;
	}

	postRender() {
		this.btn = this.querySelector("#intra-btn");
		super.addComponentEventListener(this.btn, "click", this.#connectIntra);
	}

	reRender() {
		this.innerHTML = this.render() + this.style();
		this.postRender();
	}

	renderLoader() {
		return `
      <button id="intra-btn" class="btn btn-lg btn-outline-dark mb-2 w-100 dark-hover" type="submit" disabled>
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span class="sr-only">Loading...</span>
      </button>
    `;
	}

	async #connectIntra() {
		this.innerHTML = this.renderLoader() + this.style();
		try {
			const source = window.location.origin + window.location.pathname;
			const { response, body } = await userManagementClient.getOAuthIntra(
				source
			);
			if (response.ok) {
				window.location.href = body["redirection_url"];
			} else {
				this.reRender();
			}
		} catch (e) {
			ErrorPage.loadNetworkError();
		}
	}
}

customElements.define("intra-button-component", IntraButton);
