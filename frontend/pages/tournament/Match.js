import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
import { Player } from "../local/Scene/player/Player.js";
import { Ball } from "../local/Scene/Ball.js";

export class Match {
    #engine;
    #threeJSGroup = new THREE.Group();
    #players = [null, null];
    #ball;
    #ballIsWaiting;
    #ballStartTime;
    #pointsToWinMatch;
    #matchIsOver = false;
    #points = [0, 0];
    #matchID;
    #playerNames;
    #onMatchEndCallback;

    constructor(matchID, playerNames, pointsToWinMatch = 5, onMatchEndCallback = null) {
        this.#matchID = matchID;
        this.#playerNames = playerNames || ["Player 1", "Player 2"];
        this.#pointsToWinMatch = pointsToWinMatch;
        this.#onMatchEndCallback = onMatchEndCallback;

        console.log("Initializing Match with players:", this.#playerNames);
    }

    async init(engine) {
        this.#engine = engine;

        // Initialize the ball
        this.#ball = new Ball();
        this.prepareBallForMatch();
        this.#threeJSGroup.add(this.#ball.threeJSGroup);

        // Position the group in the scene
        this.#threeJSGroup.position.set(30, 23.75, 0);

        // Initialize both players
        for (let i = 0; i < 2; i++) {
            this.#players[i] = new Player();
            await this.#players[i].init(i, this.#pointsToWinMatch);
            this.#threeJSGroup.add(this.#players[i].threeJSGroup);
        }
    }

    updateFrame(timeDelta, currentTime, paddleBoundingBox, boardSize) {
        this.#players[0].updateFrame(timeDelta, paddleBoundingBox);
        this.#players[1].updateFrame(timeDelta, paddleBoundingBox);

        if (!this.#matchIsOver) {
            if (this.#ballIsWaiting && currentTime >= this.#ballStartTime) {
                this.#ballIsWaiting = false;
            }
            if (!this.#ballIsWaiting) {
                this.#ball.updateFrame(timeDelta, boardSize, this);
            }
        }
    }

    prepareBallForMatch() {
        this.#ballIsWaiting = true;
        this.#ballStartTime = Date.now() + 3000;
        this.#ball.prepareForMatch();
    }

    playerMarkedPoint(playerIndex) {
        this.#points[playerIndex]++;
        this.#players[playerIndex].addPoint();

        console.log(`Score Update: ${this.#playerNames[0]} ${this.#points[0]} - ${this.#playerNames[1]} ${this.#points[1]}`);

        if (this.#points[playerIndex] >= this.#pointsToWinMatch) {
            this.#matchIsOver = true;
            this.#ball.removeBall();

            const winnerName = this.#playerNames[playerIndex] || `Player ${playerIndex + 1}`;
            console.log(`${winnerName} won the match`);

            // Display end game card if the method exists
            if (this.#engine.getComponent().addEndGameCard) {
                this.#engine.getComponent().addEndGameCard(this.#points[0], this.#points[1]);
            }

            // Notify the tournament that the match has ended
            if (this.#onMatchEndCallback) {
                this.#onMatchEndCallback(winnerName);
            }
            return;
        }

        // Prepare the ball for the next round
        this.prepareBallForMatch();
    }

    resetMatch() {
        this.#points = [0, 0];
        this.#matchIsOver = false;
        this.#players.forEach(player => player.reset());
        this.prepareBallForMatch();
    }

    getWinner() {
        if (this.#matchIsOver) {
            return this.#points[0] >= this.#pointsToWinMatch ? this.#playerNames[0] : this.#playerNames[1];
        }
        return null;
    }

    setBallMovement(movementJson) {
        this.#ball.setMovement(movementJson);
    }

    setBallPosition(positionJson) {
        this.#ball.setPosition(positionJson);
    }

    getPosition() {
        return this.#threeJSGroup.position;
    }

    get threeJSGroup() {
        return this.#threeJSGroup;
    }

    get players() {
        return this.#players;
    }

    get ball() {
        return this.#ball;
    }

    get ballStartTime() {
        return this.#ballStartTime;
    }

    get matchID() {
        return this.#matchID;
    }

    get playerNames() {
        return this.#playerNames;
    }
}


