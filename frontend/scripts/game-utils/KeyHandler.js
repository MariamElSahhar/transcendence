import {sendWebSocketMessage} from "../../scripts/utils/websocket-manager.js"

export class KeyHandler {
    #gameEngine;
    #isUpKeyPressed = [false, false];
    #isDownKeyPressed = [false, false];

    constructor(gameEngine) {
        this.#gameEngine = gameEngine;
    }

    startListeningForKeys(player="local",playerSide="NA",players=null,gameSession=-1, sameSystem="NA") {
		this.#gameEngine.component.addComponentEventListener(
			window, 'keydown', async (event) => {
				if(player=="remote")
					{
						if (sameSystem==true)
                        {
                            if(event.key === "W" || event.key === "S"||  event.key === "w" || event.key === "s" || event.key === "ArrowUp" || event.key === "ArrowDown")
                            {
                                sendWebSocketMessage({action:"move",type:"keydown",key: event.key, playerSide:playerSide,gameSession:gameSession});
                            }
                        }
                        else if(sameSystem ==false)
                        {
                            if((playerSide == "left" && (event.key === "W" || event.key === "S"||  event.key === "w" || event.key === "s")) || (playerSide=="right" && (event.key === "ArrowUp" || event.key === "ArrowDown")))
                            {
                                sendWebSocketMessage({action:"move",type:"keydown",key: event.key, playerSide:playerSide,gameSession:gameSession});
                            }
                        }
				}
				else
               		this.handleKeyPress(event);
            }, this,
        );
        this.#gameEngine.component.addComponentEventListener(
            window, 'keyup', async (event) => {
                if(player=="remote")
					{
						if (sameSystem==true)
                        {
                            if(event.key === "W" || event.key === "S"||  event.key === "w" || event.key === "s" || event.key === "ArrowUp" || event.key === "ArrowDown")
                            {
                                sendWebSocketMessage({action:"move",type:"keyup",key: event.key, gameSession:gameSession});
                            }
                        }
                        else if(sameSystem ==false)
                        {
                            if((playerSide == "left" && (event.key === "W" || event.key === "S"||  event.key === "w" || event.key === "s")) || (playerSide=="right" && (event.key === "ArrowUp" || event.key === "ArrowDown")))
                            {
                                sendWebSocketMessage({action:"move",type:"keyup",key: event.key, gameSession:gameSession});
                            }
                        }
				}
				else
                this.handleKeyRelease(event);
            }, this,
        );
    }

    stopListeningForKeys() {
        this.#gameEngine.component.removeAllComponentEventListeners()
    }

    handleKeyPress(event) {
        switch (event.key) {
            case 'w':
            case 'W':
                this.#pressKey(0, 'up');
                return;
            case 'ArrowUp':
                this.#pressKey(1, 'up');
                return;
            case 's':
            case 'S':
                this.#pressKey(0, 'down');
                return;
            case 'ArrowDown':
                this.#pressKey(1, 'down');
                return;
            default:
                return;
        }
    }

    handleKeyRelease(event) {
        switch (event.key) {
            case 'w':
            case 'W':
                this.#releaseKey(0, 'up');
                return;
            case 'ArrowUp':
                this.#releaseKey(1, 'up');
                return;
            case 's':
            case 'S':
                this.#releaseKey(0, 'down');
                return;
            case 'ArrowDown':
                this.#releaseKey(1, 'down');
                return;
            default:
                return;
        }
    }

    #pressKey(index, direction) {
		const oppositeKey = direction === 'up' ? this.#isDownKeyPressed : this.#isUpKeyPressed;
        if (oppositeKey[index]) {
			this.#stopMovement(index);
        } else {
            direction === 'up' ? this.#moveUp(index) : this.#moveDown(index);
        }
        direction === 'up' ? (this.#isUpKeyPressed[index] = true) : (this.#isDownKeyPressed[index] = true);
    }

    #releaseKey(index, direction) {
        const pressedKey = direction === 'up' ? this.#isDownKeyPressed : this.#isUpKeyPressed;
        if (pressedKey[index]) {
            direction === 'up' ? this.#moveDown(index) : this.#moveUp(index);
        } else {
            this.#stopMovement(index);
        }
        direction === 'up' ? (this.#isUpKeyPressed[index] = false) : (this.#isDownKeyPressed[index] = false);
    }


    // handleFocusLoss() {
    //     this.#isUpKeyPressed[0] = false;
    //     this.#isUpKeyPressed[1] = false;
    //     this.#isDownKeyPressed[0] = false;
    //     this.#isDownKeyPressed[1] = false;

    //     this.#stopMovement(0);
    //     this.#stopMovement(1);
    // }

    #stopMovement(index) {
        this.#gameEngine.scene.setPlayerPaddleDirection('none', index);
    }

    #moveUp(index) {
        this.#gameEngine.scene.setPlayerPaddleDirection('up', index);
    }

    #moveDown(index) {
        this.#gameEngine.scene.setPlayerPaddleDirection('down', index);
    }
  }

