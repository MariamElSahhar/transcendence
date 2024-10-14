import { BaseApiClient } from './BaseClient.js';  // Importing the BaseApiClient class to inherit its functionalities

// Exporting the TournamentClient class that extends from BaseApiClient
export class TournamentClient extends BaseApiClient {
  
  // Define the base URL for the tournament API, using the current window's hostname and port 6001
  static URL = `https://${window.location.hostname}:6001`;

  // Define URI templates for different tournament API actions
  static URIs = {
    'tournaments': 'tournament/',  // Get all tournaments
    'tournament': 'tournament/:id/',  // Get specific tournament by ID
    'tournament-matches': 'tournament/:id/matches/',  // Get tournament matches by tournament ID
    'tournament-join': 'tournament/:id/players/',  // Join a tournament by ID
    'tournament-delete': 'tournament/:id/',  // Delete a tournament by ID
    'tournament-start': 'tournament/:id/start/',  // Start a tournament by ID
    'generate-matches': 'tournament/:id/matches/generate/',  // Generate matches for a tournament
    'tournament-create': 'tournament/',  // Create a new tournament
    'tournament-leave': 'tournament/:id/players/',  // Leave a tournament by ID
    'tournament-kick': 'tournament/:id/player/:playerId/',  // Kick a player from a tournament
  };

  // Constructor initializes the class with the base URL and URIs, and calls the parent constructor (BaseApiClient)
  constructor() {
    super();  // Call parent class constructor
    this.URL = TournamentClient.URL;  // Set the URL to the class's static URL
    this.URIs = TournamentClient.URIs;  // Set the URIs to the class's static URIs
  }

  // Method to kick a player from the tournament
  async kickPlayer(tournamentId, playerId) {
    // Replace the placeholders in the URI with actual tournamentId and playerId
    const URI = this.URIs['tournament-kick']
        .replace(':id', tournamentId)
        .replace(':playerId', playerId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send DELETE request using the inherited method and return the result
    return await this.deleteAuthRequest(URL);
  }

  // Method to leave a tournament
  async leaveTournament(tournamentId) {
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['tournament-leave'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send DELETE request and return the result
    return await this.deleteAuthRequest(URL);
  }

  // Method to create a new tournament
  async createTournament(name, maxPlayers, isPrivate, password) {
    // Build the request body with the tournament details
    const body = {
      'name': name,
      'max-players': maxPlayers,
      'is-private': isPrivate,
    };
    // If the tournament is private, include the password in the request body
    if (isPrivate) {
      body.password = password;
    }
    // Build the full URL for creating a tournament
    const URL = `${this.URL}/${this.URIs['tournament-create']}`;
    // Send POST request with the body and return the result
    return await this.postAuthRequest(URL, body);
  }

  // Method to generate matches for a tournament
  async generateMatches(tournamentId, random = true) {
    // Build the request body indicating whether to generate matches randomly
    const body = {
      'random': random,
    };
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['generate-matches'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send POST request with the body and return the result
    return await this.postAuthRequest(URL, body);
  }

  // Method to start a tournament
  async startTournament(tournamentId) {
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['tournament-start'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send PATCH request to start the tournament and return the result
    return await this.patchAuthRequest(URL);
  }

  // Method to delete a tournament
  async deleteTournament(tournamentId) {
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['tournament-delete'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send DELETE request to delete the tournament and return the result
    return await this.deleteAuthRequest(URL);
  }

  // Method to join a tournament
  async joinTournament(tournamentId, nickname, password) {
    // Build the request body with the player's nickname and password (if needed)
    const body = {
      nickname: nickname,
      password: password,
    };
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['tournament-join'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send POST request with the body to join the tournament and return the result
    return await this.postAuthRequest(URL, body);
  }

  // Method to get details of a specific tournament
  async getTournament(tournamentId) {
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['tournament'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send GET request to fetch tournament details and return the result
    return await this.getAuthRequest(URL);
  }

  // Method to get matches for a specific tournament
  async getTournamentMatches(tournamentId) {
    // Replace the placeholder in the URI with the actual tournamentId
    const URI = this.URIs['tournament-matches'].replace(':id', tournamentId);
    // Build the full URL
    const URL = `${this.URL}/${URI}`;
    // Send GET request to fetch tournament matches and return the result
    return await this.getAuthRequest(URL);
  }

  // Method to get a list of tournaments, with optional filters and pagination
  async getTournaments(page, pageSize = 10,
      displayPrivate = false,
      displayFinished = false) {
    // Build query parameters for pagination and filtering options
    const params = {
      'page': page,
      'page-size': pageSize,
      ...(displayPrivate && { 'display-private': '' }),  // Add private filter if true
      ...(displayFinished && { 'display-completed': '' }),  // Add finished filter if true
    };
    // Build the full URL for fetching tournaments
    const URL = `${this.URL}/${this.URIs['tournaments']}`;
    // Send GET request with the query parameters and return the result
    return await this.getAuthRequest(URL, params);
  }
}
