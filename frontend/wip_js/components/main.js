import {Component} from './component.js';

import {
  FriendsButton,
  IntraButton,
  MultiplayerButton,
  ThemeButton,
} from './buttons';

import {
  Friends,
  FriendsSidebar,
} from './layouts';

import {
  ConnectedNavbar,
  DisconnectedNavbar,
  Navbar,
  NotificationNav,
  SearchNav,
} from './navbar';

import {
  Notification,
  ToastNotifications,
} from './notifications';

import {
  ActivateAccount,
  ActivateAccountContent,
  SignIn,
  SignInContent,
  SignUp,
  SignUpContent,
  TwoFactorAuth,
  Home,
  HomeContent,
  Local,
  PrivacyPolicy,
  PrivacyPolicyContent,
  Ranking,
  RankingContent,
  ResetPassword,
  ResetPasswordCode,
  ResetPasswordEmail,
  ResetPasswordNew,
  Settings,
  Settings2FA,
  SettingsContent,
  TournamentBracket,
  TournamentCreate,
  TournamentCreateContent,
  TournamentDetails,
  Tournaments,
  TournamentsContent,
  TournamentsList,
  UserProfile,
  UserProfileChart,
  UserProfileChartsCards,
  UserProfileContent,
  UserProfileHeader,
  UserProfileMatchList,
  UserProfileStatsCard,
  UserProfileStatsCards,
  NotFound,
} from './pages';

import {
  Alert,
  Error,
  ErrorContent,
} from './utilities';

import {
  Game,
} from './game';

customElements.define('friends-button-component', FriendsButton);
customElements.define('intra-button-component', IntraButton);
customElements.define('multiplayer-button-component', MultiplayerButton);
customElements.define('theme-button-component', ThemeButton);

customElements.define('friends-component', Friends);
customElements.define('friends-sidebar-component', FriendsSidebar);

customElements.define('connected-navbar-component', ConnectedNavbar);
customElements.define('disconnected-navbar-component', DisconnectedNavbar);
customElements.define('navbar-component', Navbar);
customElements.define('notification-nav-component', NotificationNav);
customElements.define('search-nav-component', SearchNav);

customElements.define('notification-component', Notification);
customElements.define('toast-notifications-component', ToastNotifications);

customElements.define('activate-account-component', ActivateAccount);
customElements.define(
    'activate-account-content-component', ActivateAccountContent,
);
customElements.define('two-factor-auth-component', TwoFactorAuth);
customElements.define('signin-component', SignIn);
customElements.define('signin-content-component', SignInContent);
customElements.define('signup-component', SignUp);
customElements.define('signup-content-component', SignUpContent);

customElements.define('home-component', Home);
customElements.define('home-content-component', HomeContent);

customElements.define('local-component', Local);

customElements.define('privacy-policy-component', PrivacyPolicy);
customElements.define('privacy-policy-content-component', PrivacyPolicyContent);

customElements.define('ranking-component', Ranking);
customElements.define('ranking-content-component', RankingContent);

customElements.define('reset-password-component', ResetPassword);
customElements.define('reset-password-code-component', ResetPasswordCode);
customElements.define('reset-password-email-component', ResetPasswordEmail);
customElements.define('reset-password-new-component', ResetPasswordNew);

customElements.define('settings-component', Settings);
customElements.define('settings-2fa-component', Settings2FA);
customElements.define('settings-content-component', SettingsContent);

customElements.define('tournament-bracket-component', TournamentBracket);
customElements.define('tournament-create-component', TournamentCreate);
customElements.define(
    'tournament-create-content-component', TournamentCreateContent,
);
customElements.define('tournament-details-component', TournamentDetails);
customElements.define('tournaments-component', Tournaments);
customElements.define('tournaments-content-component', TournamentsContent);
customElements.define('tournaments-list-component', TournamentsList);

customElements.define('notfound-component', NotFound);

customElements.define('user-profile-component', UserProfile);
customElements.define('user-profile-chart-component', UserProfileChart);
customElements.define(
    'user-profile-charts-cards-component', UserProfileChartsCards,
);
customElements.define(
    'user-profile-content-component', UserProfileContent,
);
customElements.define('user-profile-header-component', UserProfileHeader);
customElements.define(
    'user-profile-match-list-component', UserProfileMatchList,
);
customElements.define(
    'user-profile-stats-card-component', UserProfileStatsCard,
);
customElements.define(
    'user-profile-stats-cards-component', UserProfileStatsCards,
);

customElements.define('alert-component', Alert);
customElements.define('error-component', Error);
customElements.define('error-content-component', ErrorContent);

customElements.define('game-component', Game);


export {
  Component,
  FriendsButton,
  IntraButton,
  MultiplayerButton,
  ThemeButton,
  Friends,
  FriendsSidebar,
  ActivateAccount,
  ActivateAccountContent,
  SignIn,
  SignInContent,
  SignUp,
  SignUpContent,
  TwoFactorAuth,
  Local,
  PrivacyPolicy,
  PrivacyPolicyContent,
  Ranking,
  RankingContent,
  ResetPassword,
  ResetPasswordCode,
  ResetPasswordEmail,
  ResetPasswordNew,
  Settings,
  Settings2FA,
  SettingsContent,
  TournamentBracket,
  TournamentCreate,
  TournamentCreateContent,
  TournamentDetails,
  Tournaments,
  TournamentsContent,
  TournamentsList,
  UserProfile,
  UserProfileChart,
  UserProfileChartsCards,
  UserProfileContent,
  UserProfileHeader,
  UserProfileMatchList,
  UserProfileStatsCard,
  UserProfileStatsCards,
  Home,
  NotFound,
  Alert,
  Error,
  ErrorContent,
  Navbar,
  Notification,
};