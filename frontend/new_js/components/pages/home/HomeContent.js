import { Component } from '@components';
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
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
        @media only screen and (max-aspect-ratio: 1/1) {
          #text {
            top: 10%;
            left: 50%;
            transform: translateX(-50%);
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
    if (!await this.#searchIfGameExists()) {
      return;
    }

    this.container = document.querySelector('#container');
    this.sidebarContent = document.querySelector('#sidebar-content');
    this.navbarHeight = document.querySelector('navbar-component').height;

    if (!WebGL.isWebGLAvailable()) {
      ToastNotifications.addErrorNotification('WebGL is not available on this device');
      console.error(WebGL.getWebGLErrorMessage());
      return;
    }

    await this.initPongScene(); // Initialize the Pong game scene
    this.renderer = this.initRenderer();
    this.container.appendChild(this.renderer.domElement);
    this.camera = this.initCamera();

    this.renderer.setAnimationLoop(() => {
      this.updateBallMovement(); // Update ball movement logic
      this.renderer.render(this.scene, this.camera);
    });

    super.addComponentEventListener(window, 'resize', this.resizeEvent);
    super.addComponentEventListener(document, Theme.event, this.themeEvent);
    this.generateText();
  }

  async #searchIfGameExists() {
    if (!userManagementClient.isAuth()) {
      return true;
    }
    try {
      this.innerHTML = this.renderLoader() + this.style();
      const { response, body } = await pongServerClient.getMyGamePort();
      if (response.ok) {
        if (body.port) {
          getRouter().redirect(`/game/${body.port}/`);
          return false;
        }
        this.innerHTML = this.render() + this.style();
        return true;
      } else {
        getRouter().redirect('/signin/');
        return false;
      }
    } catch (e) {
      ErrorPage.loadNetworkError();
      return false;
    }
  }

  async initPongScene() {
    this.scene = new THREE.Scene();

    // Create the paddle (table tennis paddle with a circular head and handle)
    const paddleFaceGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 32);
    const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const paddleFace = new THREE.Mesh(paddleFaceGeometry, paddleMaterial);
    paddleFace.position.set(0, -4.5, 0);
    paddleFace.rotation.set(Math.PI / 2, 0, 0);

    const paddleHandleGeometry = new THREE.BoxGeometry(0.2, 1.5, 0.2);
    const paddleHandle = new THREE.Mesh(paddleHandleGeometry, new THREE.MeshStandardMaterial({ color: 0x8b4513 }));
    paddleHandle.position.set(0, -5.75, 0);

    this.paddleGroup = new THREE.Group();
    this.paddleGroup.add(paddleFace);
    this.paddleGroup.add(paddleHandle);
    this.scene.add(this.paddleGroup);

    // Create ball
    const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.ball.position.set(0, 0.5, 0);
    this.scene.add(this.ball);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    this.scene.add(directionalLight);

    // Ball movement direction
    this.ballDirectionY = 0.1;
  }

  initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(this.getContainerWidth(), this.getContainerHeight());
    renderer.autoClear = false;
    return renderer;
  }

  initCamera() {
    const camera = new THREE.PerspectiveCamera(75, this.getContainerWidth() / this.getContainerHeight(), 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  updateBallMovement() {
    this.ball.position.y += this.ballDirectionY;
    const yBound = 4.5;

    // Bounce the ball
    if (this.ball.position.y > yBound || this.ball.position.y < this.paddleGroup.position.y + 1.25) {
      this.ballDirectionY = -this.ballDirectionY;
    }
  }

  resizeEvent() {
    this.renderer.setSize(this.getContainerWidth(), this.getContainerHeight());
    this.camera.aspect = this.getContainerWidth() / this.getContainerHeight();
    this.camera.updateProjectionMatrix();
  }

  async themeEvent() {
    const rotation = this.paddleGroup.rotation.y;
    this.scene.remove(this.paddleGroup);
    if (Theme.get() === 'dark') {
      this.container.classList.remove('light-background');
      this.container.classList.add('dark-background');
    } else {
      this.container.classList.remove('dark-background');
      this.container.classList.add('light-background');
    }
    await this.initPongScene(); // Reinitialize the scene with the paddle
    this.paddleGroup.rotation.y = rotation;
  }

  getContainerHeight() {
    const style = window.getComputedStyle(this.container);
    const marginTop = style.getPropertyValue('margin-top');
    const marginBottom = style.getPropertyValue('margin-bottom');
    const height = window.innerHeight - this.navbarHeight - parseInt(marginTop) - parseInt(marginBottom) - 2;
    return height > 0 ? height : 0;
  }

  getContainerWidth() {
    const style = window.getComputedStyle(this.container);
    const marginLeft = style.getPropertyValue('margin-left');
    const marginRight = style.getPropertyValue('margin-right');
    return window.innerWidth - parseInt(marginLeft) - parseInt(marginRight);
  }

  generateText() {
    this.querySelector('#text').innerHTML = this.renderText();
  }

  renderText() {
    return (`
      <h1 class="fw-bolder text-light title">The Pong Battle Ground!</h1>
      <p class="fw-light text-light description">Challenge your friends or face off against players from around the globe in fast-paced, head-to-head battles</p>
      ${this.renderButton()}
    `);
  }

  renderButton() {
    if (userManagementClient.isAuth()) {
      return (`
          <multiplayer-button-component class="action-button"></multiplayer-button-component>
      `);
    }
    return (`
        <div>
            <button class="btn btn-primary btn-lg action-button" onclick="window.router.navigate('/signin/')">Sign in</button>
        </div>
    `);
  }

  renderLoader() {
    return (`
      <div class="d-flex justify-content-center align-items-center" style="height: calc(100vh - ${NavbarUtils.height}px)">
          <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
          </div>
      </div>
    `);
  }
}