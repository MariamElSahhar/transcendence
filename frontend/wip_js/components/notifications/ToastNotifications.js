import {Component} from '@components';
import {Toast} from 'bootstrap';
import {userManagementClient} from '@utils/api';
import {getRouter} from '@js/Router.js';
import {ErrorPage} from '@utils/ErrorPage.js';
import {Cookies} from '@js/Cookies.js';

export class ToastNotifications extends Component {
  constructor() {
    super();
  }
  render() {
    return (`
      <div aria-live="polite" aria-atomic="true" class="position-relative">
        <div class="toast-container p-3"></div>
      </div>
    `);
  }
  style() {
    return (`
      <style>
      .toast-container {
        top: 0px!important;
        right: 0px!important;
      }
      </style>
    `);
  }

  postRender() {
    this.toastContainer = this.querySelector('.toast-container');
    super.addComponentEventListener(window, 'scroll', () => {
      this.toastContainer.style.top = window.scrollY + 'px';
    });
  }

  static addErrorNotification(errorMessage) {
    const toastNotifications = document.querySelector(
        'toast-notifications-component',
    );
    if (toastNotifications) {
      toastNotifications.addNotification({
        type: 'error',
        message: errorMessage,
      });
    }
  }

  static addPolicyNotification(policyMessage) {
    const toastNotifications = document.querySelector(
        'toast-notifications-component',
    );
    if (toastNotifications) {
      toastNotifications.addPolicyNotification(policyMessage);
    }
  }

  addPolicyNotification(policyMessage) {
    const toastDiv = this.#generateToastPolicyNotification(
        {message: policyMessage},
    );
    this.toastContainer.appendChild(toastDiv);
    const toast = new Toast(toastDiv);
    toast.show();
    super.addComponentEventListener(toastDiv, 'hidden.bs.toast', () => {
      try {
        Cookies.add('policy', true);
        this.toastContainer.removeChild(toastDiv);
      } catch (error) {
        ;
      }
    });
  }

  addNotification(notification) {
    const toastDiv = this.#generateToastNotification(notification);
    toastDiv.setAttribute('toast-id', notification.id);
    this.toastContainer.appendChild(toastDiv);
    const toast = new Toast(toastDiv);
    toast.show();
    super.addComponentEventListener(toastDiv, 'hidden.bs.toast', () => {
      try {
        this.toastContainer.removeChild(toastDiv);
      } catch (error) {
        ;
      }
    });
  }

  #generateToastNotification(notification) {
    if (notification.type === 'friend_request') {
      return this.#generateToastFriendRequestNotification(notification);
    } else if (notification.type === 'tournament_start') {
      return this.#generateToastTournamentStartNotification(notification);
    } else if (notification.type === 'error') {
      return this.#generateToastErrorNotification(notification);
    } else if (notification.type === 'policy') {
      return this.#generateToastPolicyNotification(notification);
    }
  }

  #generateToastFriendRequestNotification(notification) {
    const toastDiv = document.createElement('div');
    const username = notification['sender_username'];
    toastDiv.className = 'toast';
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');
    toastDiv.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Friend Request</strong>
        <small class="text-body-secondary">just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body p-2">
            <div class="d-flex justify-content-start align-items-center">
                <div class="d-flex align-items-center mb-1">
                    <img src="${userManagementClient.getURLAvatar(username)}" alt="profile image"
                           class="rounded-circle object-fit-cover me-2"
                           style="width: 40px; height: 40px; min-height: 40px; min-width: 40px">
                    <p class="mb-0 text-muted" style="font-size: 0.8rem;">
                        <a class="text-primary text-decoration-none" onclick="window.router.navigate('/profile/${username}/')">${username}</a>
                        wants to be friends with you
                    </p>
              </div>
            </div>
            <div class="d-flex justify-content-around">
                  <button class="btn btn-little btn-success w-100 me-1">Accept</button>
                  <button class="btn btn-little btn-danger w-100 ms-1">Decline</button>
            </div>
      </div>
    `;
    const acceptButton = toastDiv.querySelector('.btn-success');
    const declineButton = toastDiv.querySelector('.btn-danger');

    super.addComponentEventListener(acceptButton, 'click', () => {
      this.#acceptFriendRequest(notification);
    });
    super.addComponentEventListener(declineButton, 'click', () => {
      this.#declineFriendRequest(notification);
    });
    return toastDiv;
  }

  async #acceptFriendRequest(notification) {
    try {
      const {response, body} = await userManagementClient.acceptFriend(
          notification.data,
      );
      if (response.ok || response.status !== 401) {
        this.#removeNotification(notification);
        if (!response.ok) {
          ToastNotifications.addErrorNotification(body['errors'][0]);
        }
      } else {
        getRouter().redirect('/signin/');
      }
    } catch (error) {
      ErrorPage.loadNetworkError();
    }
  }

  async #declineFriendRequest(notification) {
    try {
      const {response, body} = await userManagementClient.declineFriend(
          notification.data,
      );
      if (response.ok || response.status !== 401) {
        this.#removeNotification(notification);
        if (!response.ok) {
          ToastNotifications.addErrorNotification(body['errors'][0]);
        }
      } else {
        getRouter().redirect('/signin/');
      }
    } catch (error) {
      ErrorPage.loadNetworkError();
    }
  }

  #generateToastTournamentStartNotification(notification) {
    const toastDiv = document.createElement('div');
    toastDiv.className = 'toast';
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');
    toastDiv.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Tournament</strong>
        <small class="text-body-secondary">just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body p-2">
        <div class="d-flex justify-content-start align-items-center">
            <div class="d-flex align-items-center mb-1">
            <div class="me-2">
             <i class="bi bi-trophy-fill rounded-circle fs-3" ></i>
            </div>
                <p class="mb-0 text-muted" style="font-size: 0.8rem;">
                    Tournament 
                    <a class="text-primary text-decoration-none" onclick="window.router.navigate('/game/${notification.data}/')">${notification.title}</a>
                    has started
                </p>
            </div>
        </div>
        <button class="btn btn-little btn-primary w-100 me-1">Join</button>
      </div>`;
    toastDiv.querySelector('.btn-primary').addEventListener('click', () => {
      this.#joinTournament(notification);
    });
    return toastDiv;
  }

  #joinTournament(notification) {
    this.#removeNotification(notification);
    getRouter().navigate(`/game/${notification.data}/`);
  }

  #removeNotification(notification) {
    this.toastContainer.removeChild(
        this.querySelector(`div[toast-id="${notification.id}"]`),
    );
    this.notificationNav = document.querySelector('notification-nav-component');
    if (this.notificationNav) {
      this.notificationNav.removeNotification(notification);
    }
  }

  #generateToastErrorNotification(notification) {
    const toastDiv = document.createElement('div');
    toastDiv.className = 'toast ';
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');
    toastDiv.innerHTML = `
      <div class="toast-body bg-danger bg-opacity-25 text-danger-emphasis">
        <div class="d-flex align-items-center justify-content-between">
          <p class="m-0">${notification.message}</p>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    return toastDiv;
  }

  #generateToastPolicyNotification(notification) {
    const toastDiv = document.createElement('div');
    toastDiv.className = 'toast';
    toastDiv.setAttribute('role', 'alert');
    toastDiv.setAttribute('aria-live', 'assertive');
    toastDiv.setAttribute('aria-atomic', 'true');
    toastDiv.setAttribute('data-bs-autohide', 'false');
    toastDiv.innerHTML = `
      <div class="toast-header">
        <strong class="me-auto">Privacy policy</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body bg-opacity-25">
        <div class="d-flex align-items-center justify-content-between">
          <p class="m-0" style="font-size: 12px"'>${notification.message}</p>
        </div>
      </div>
    `;
    return toastDiv;
  }
}