import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@css/style.css';

import 'bootstrap';

import '@components';

import {Router, Route} from './router.js';
import {Theme} from './Theme.js';

Theme.init();

const app = document.querySelector('#front');

const router = new Router(app, [
  new Route('/local/', 'local-component'),
  new Route('/multiplayer/', 'home-component'),
  new Route('/tournaments/', 'tournaments-component'),
  new Route('/tournaments/page/:pageId/', 'tournaments-component'),
  new Route('/ranking/', 'ranking-component'),
  new Route('/ranking/page/:pageId/', 'ranking-component'),
  new Route('/signin/', 'signin-component'),
  new Route('/signup/', 'signup-component'),
  new Route('/reset-password/', 'reset-password-component'),
  new Route('/account/active/:id/:token/', 'activate-account-component'),
  new Route('/tournaments/create/', 'tournament-create-component'),
  new Route('/profile/:username/', 'user-profile-component'),
  new Route('/settings/', 'settings-component'),
  new Route('/game/:port/', 'game-component'),
  new Route('/privacy-policy/', 'privacy-policy-component'),
  new Route('/home/', 'home-component'),
  new Route('/', 'home-component'),
  new Route('', 'notfound-component'),
]);

window.router = router;
router.init();