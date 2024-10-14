import { Component } from '@components';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { NavbarUtils } from '@utils/NavbarUtils.js';
import { Theme } from '@js/Theme.js';
import { userManagementClient, pongServerClient } from '@utils/api';
import { ToastNotifications } from '@components/notifications';
import { getRouter } from '@js/Router.js';
import { ErrorPage } from '@js/utils/ErrorPage.js';

export class HomeContent extends Component {
  constructor() {
    super();
  }

  render() {
    const theme = Theme.get();
    return (`
      <div id="container" class="m-2 rounded ${theme === 'light' ? 'light-background' : 'dark-background'}">
        <div id="text" class="d-flex flex-column position-absolute"></div>
      </div>
    `);
  }

  style() {
    return (`
      <style>
        .light-background {
          background: linear-gradient(to bottom, #57c1eb 0%, #246fa8 100%);
        }

        .dark-background {
          background: linear-gradient(to bottom, #020111 10%, #3a3a52 100%);
        }

        @media only screen and (min-aspect-ratio: 1/1) {
          #text {
            top: 50%;
            left: 75%;
            transform: translateX(-50%) translateY(-50%);
          }
        }

        @media (max-height: 400px) {
          #text {
            font-size: 10px;
          }
          h1 {
            font-size: 20px;
          }
        }

        .title {
          animation: title-animation 0.5s ease forwards;
        }

        .description {
          animation: description-animation 1.5s ease forwards;
        }

        .action-button {
          animation: action-button-animation 2s ease forwards;
        }
      </style>
    `);
  }

  async postRender() {
    if (!await this.#searchIfGameExists()) return;

    this.container = document.querySelector('#container');
    this.navbarHeight = document.querySelector('navbar-component')?.height || 0;

    if (!WebGL.isWebGLAvailable()) {
      ToastNotifications.addErrorNotification('WebGL is not available on this device');
      console.error(WebGL.getWebGLErrorMessage());
      return;
    }

    await this.initCubeScene(); // Initialize the cube scene

    this.renderer = this.initRenderer();
    this.container.appendChild(this.renderer.domElement);

    this.camera = this.initCamera();
    this.animateCube(); // Start the animation loop

    super.addComponentEventListener(window, 'resize', this.resizeEvent.bind(this));
    super.addComponentEventListener(document, Theme.event, this.themeEvent.bind(this));
    this.generateText();
  }

  async initCubeScene() {
    this.scene = new THREE.Scene();
    const texture = await this.loadTexture('/assets/images/unnamed.png'); // Use your uploaded PNG

    const geometry = new THREE.BoxGeometry(3, 3, 3); // Create the cube
    const material = new THREE.MeshBasicMaterial({ map: texture });

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(0, 0, 0);
    this.scene.add(this.cube);
  }

  loadTexture(path) {
    const loader = new THREE.TextureLoader();
    return new Promise((resolve, reject) => {
      loader.load(path, resolve, undefined, reject);
    });
  }

  initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(this.getContainerWidth(), this.getContainerHeight());
    return renderer;
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(75, this.getContainerWidth() / this.getContainerHeight(), 0.1, 1000);
    camera.position.z = 5; // Adjust to fit the cube in view
    return camera;
  }

  animateCube() {
    this.renderer.setAnimationLoop(() => {
      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;
      this.renderer.render(this.scene, this.camera);
    });
  }

  resizeEvent() {
    this.renderer.setSize(this.getContainerWidth(), this.getContainerHeight());
    this.camera.aspect = this.getContainerWidth() / this.getContainerHeight();
    this.camera.updateProjectionMatrix();
  }

  async themeEvent() {
    const rotation = this.cube.rotation.y;
    this.scene.remove(this.cube);

    await this.initCubeScene(); // Reinitialize the cube for the new theme
    this.cube.rotation.y = rotation;
  }

  getContainerWidth() {
    return window.innerWidth;
  }

  getContainerHeight() {
    return window.innerHeight - this.navbarHeight;
  }

  async #searchIfGameExists() {
    if (!userManagementClient.isAuth()) {
      return true;
    }
    try {
      const { response, body } = await pongServerClient.getMyGamePort();
      if (response.ok && body.port) {
        getRouter().redirect(`/game/${body.port}/`);
        return false;
      }
      return true;
    } catch (e) {
      ErrorPage.loadNetworkError();
      return false;
    }
  }

  generateText() {
    document.querySelector('#text').innerHTML = `
      <h1 class="fw-bolder text-light title">The Pong Battle Ground!</h1>
      <p class="fw-light text-light description">Challenge your friends or face off against players from around the globe in fast-paced, head-to-head battles.</p>
      ${this.renderButton()}
    `;
  }

  renderButton() {
    if (userManagementClient.isAuth()) {
      return `<multiplayer-button-component class="action-button"></multiplayer-button-component>`;
    }
    return `
      <div>
        <button class="btn btn-primary btn-lg action-button" onclick="window.router.navigate('/signin/')">Sign in</button>
      </div>
    `;
  }
}
