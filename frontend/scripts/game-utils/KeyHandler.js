import {sendWebSocketMessage} from "../../scripts/utils/websocket-manager.js"

export class KeyHandler {
    isUp = [false, false];
    engine;
    isDown = [false, false];

    constructor(gameEngine) {
        this.engine = gameEngine;
    }

    listenForKeys(player="local",playerSide="NA",players=null,gameSession=-1, sameSystem="NA") {
		this.engine.component.addComponentEventListener(
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
        this.engine.component.addComponentEventListener(
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
        this.engine.component.removeAllComponentEventListeners()
    }

    handleKeyPress(event) {
        if (event.key === 'w' || event.key === 'W') {
            this.pressKey(0, 'up');
            return;
        }
        if (event.key === 'ArrowUp') {
            this.pressKey(1, 'up');
            return;
        }
        if (event.key === 's' || event.key === 'S') {
            this.pressKey(0, 'down');
            return;
        }
        if (event.key === 'ArrowDown') {
            this.pressKey(1, 'down');
            return;
        }
    }

    handleKeyRelease(event) {
        if (event.key === 'w' || event.key === 'W') {
            this.releaseKey(0, 'up');
            return;
        }
        if (event.key === 'ArrowUp') {
            this.releaseKey(1, 'up');
            return;
        }
        if (event.key === 's' || event.key === 'S') {
            this.releaseKey(0, 'down');
            return;
        }
        if (event.key === 'ArrowDown') {
            this.releaseKey(1, 'down');
            return;
        }
    }

    pressKey(index, direction) {
        const isMovingUp = direction === 'up';
        const oppositeKey = isMovingUp ? this.isDown : this.isUp;

        if (oppositeKey[index]) {
            this.stopMovement(index);
        } else {
            isMovingUp ? this.moveUp(index) : this.moveDown(index);
        }

        (isMovingUp ? this.isUp : this.isDown)[index] = true;
    }

    releaseKey(index, direction) {
        const isMovingUp = direction === 'up';
        const pressedKey = isMovingUp ? this.isDown : this.isUp;

        if (pressedKey[index]) {
            isMovingUp ? this.moveDown(index) : this.moveUp(index);
        } else {
            this.stopMovement(index);
        }

        (isMovingUp ? this.isUp : this.isDown)[index] = false;
    }

    moveDown(index) {
        this.engine.scene.setPaddleDirection('down', index);
    }

  moveUp(index) {
      this.engine.scene.setPaddleDirection('up', index);
    }

    stopMovement(index) {
        this.engine.scene.setPaddleDirection('none', index);
    }
}
