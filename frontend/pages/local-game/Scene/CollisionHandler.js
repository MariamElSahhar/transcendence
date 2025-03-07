import { HandlePaddleEdge } from './HandlePaddleEdge.js';
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";

import {sendWebSocketMessage} from "../../../scripts/utils/websocket-manager.js"
class PhysicalObject {
  constructor() {
    this.intersection = null;
    this.t = null;
  }

  intersect(_travel, _currentClosestPhysicalObjectHit, _ballRadius) {
    throw new Error('Not implemented');
  }

  handleCollision(_travel, _ball, _collisionHandler, _match) {
    //_match.playerMarkedPoint(1 - this.isRight); // Update the score.

    // // Reset both players to their starting positions.
    // _match.resetPlayers();

    // return null;
    // //throw new Error('Not implemented');
    throw new Error('Not implemented');
  }
}

class Wall extends PhysicalObject {
  constructor(isTop, boardSize) {
    super();
    this.isTop = isTop;
    this.y = this.isTop ? boardSize.y * 0.5 : boardSize.y * -0.5;
  }

  intersect(travel, currentClosestPhysicalObjectHit, ballRadius) {
    const travelEdge = this.isTop ? travel.end.y + ballRadius : travel.end.y - ballRadius;

    if ((this.isTop && travelEdge < this.y) || (!this.isTop && travelEdge > this.y)) {
      return currentClosestPhysicalObjectHit;
    }

    this.intersection = travel.vector.clone()
      .divideScalar(travel.vector.y)
      .multiplyScalar(this.y - travel.begin.y + (this.isTop ? -ballRadius : ballRadius))
      .add(travel.begin);

    this.t = (this.intersection.x - travel.begin.x) / travel.vector.x;

    if (currentClosestPhysicalObjectHit === null || this.t < currentClosestPhysicalObjectHit.t) {
      return this;
    }

    return currentClosestPhysicalObjectHit;
  }

  handleCollision(travel, ball, _collisionHandler, _match) {

    ball.setMovementY(ball.movement.y * -1);
    const newTravelVector = travel.vector.clone().multiplyScalar(1 - this.t);
    newTravelVector.y *= -1;
    return new HandlePaddleEdge(
      this.intersection,
      this.intersection.clone().add(newTravelVector),
      newTravelVector
    );
  }
}

class Goal extends PhysicalObject {
  constructor(isRight, boardSize) {
    super();
    this.isRight = isRight;
    this.x = this.isRight ? boardSize.x : -boardSize.x;
  }

  intersect(travel, currentClosestPhysicalObjectHit, ballRadius) {
    const travelEdge = this.isRight ? travel.end.x + ballRadius : travel.end.x - ballRadius;

    if ((this.isRight && travelEdge < this.x) || (!this.isRight && travelEdge > this.x)) {
      return currentClosestPhysicalObjectHit;
    }

    this.intersection = travel.vector.clone()
      .divideScalar(travel.vector.x)
      .multiplyScalar(this.x - travel.begin.x + (this.isRight ? -ballRadius : ballRadius))
      .add(travel.begin);

    this.t = (this.intersection.x - travel.begin.x) / travel.vector.x;

    if (currentClosestPhysicalObjectHit === null || this.t < currentClosestPhysicalObjectHit.t) {
      return this;
    }

    return currentClosestPhysicalObjectHit;
  }

   handleCollision(_travel, _ball, _collisionHandler, match) {
      if(match.gameType=="local" || match.isHost)
      {
        if(match.gameType =="remote")
        {
          sendWebSocketMessage({ type: "ballPosition", position:new THREE.Vector3(0., 0., 0.), gameSession: match.engine.gameSession });
          sendWebSocketMessage({ type: "update_positions", ballposition:new THREE.Vector3(0., 0., 1.),gameSession:match.engine.gameSession,leftpaddle:match.players[0].paddle.getPosition(),rightpaddle:match.players[1].paddle.getPosition() });
          sendWebSocketMessage({type:"match_end", gameSession: match.engine.gameSession, index:1-this.isRight})
        }
        match.playerMarkedPoint(1 - this.isRight);
    }
    return null;
  }
}

class Paddle extends PhysicalObject {
  constructor(paddle) {
    super();
    this.top = paddle.topCollisionSegment;
    this.front = paddle.frontCollisionSegment;
    this.bottom = paddle.bottomCollisionSegment;
    this.paddleIsOnTheRight = paddle.paddleIsOnTheRight;
    this.paddleWasAlreadyHit = false;
    this.closestSideHit = null;
  }

  intersect(travel, currentClosestPhysicalObjectHit, ballRadius) {
    if (this.paddleWasAlreadyHit) return currentClosestPhysicalObjectHit;
    this.calculateClosestSideHit(travel, ballRadius);
    if (this.closestSideHit === null) return currentClosestPhysicalObjectHit;

    if (currentClosestPhysicalObjectHit === null || this.t < currentClosestPhysicalObjectHit.t) {
      return this;
    }

    return currentClosestPhysicalObjectHit;
  }

  calculateClosestSideHit(travel, ballRadius) {
    this.closestSideHit = null;
    this.intersectSide(travel, ballRadius, this.top, 'top', travel.vector.y <= 0);
    this.intersectSide(travel, ballRadius, this.front, 'front', true);
    this.intersectSide(travel, ballRadius, this.bottom, 'bottom', travel.vector.y >= 0);
  }

  intersectSide(travel, ballRadius, side, sideName, condition) {
    if (!condition || !side.begin || !side.end) return;

    const { intersection, t } = Paddle.circleSegmentIntersection(travel, side, ballRadius);
    if (intersection && (!this.t || t < this.t)) {
      this.closestSideHit = sideName;
      this.t = t;
      this.intersection = intersection;
    }
  }

  static circleSegmentIntersection(travel, segment, ballRadius) {
    const radiusHelper = travel.vector.clone().normalize().multiplyScalar(ballRadius);
    const travelHelper = new HandlePaddleEdge(
        travel.begin.clone().sub(radiusHelper),
        travel.end.clone().add(radiusHelper)
    );

    const { intersection, t } = travelHelper.intersect(segment);

    if (!intersection || t < 0 || t > 1) {
        return { intersection: null, t: null };
    }

    // Adjust the ball's position slightly outside the paddle to prevent visual overlap
    const adjustedIntersection = intersection.clone().sub(radiusHelper);

    return { intersection: adjustedIntersection, t };
}

  handleCollision(travel, ball, _collisionHandler, _match) {
    this.paddleWasAlreadyHit = true;
    let newTravelVector = travel.vector.clone().multiplyScalar(1 - this.t);

    if (this.closestSideHit === 'front') {
      const paddleHalfHeight = this.front.vector.y / 2;
      const movementReference = this.front.begin.clone();
      movementReference.y += paddleHalfHeight;
      movementReference.x += this.paddleIsOnTheRight ? paddleHalfHeight : -paddleHalfHeight;

      const normalizedMovement = this.intersection.clone()
        .sub(movementReference)
        .normalize();
        if(_match.gameType == "remote" && ball.movement.x > 0 && !_match.isHost || _match.gameType == "remote" && ball.movement.x < 0)
        {
          // console.log("right",_match.gameType == "remote" && ball.movement.x > 0 && !_match.isHost,"left",  _match.gameType == "remote" && ball.movement.x < 0, )
          sendWebSocketMessage({ type: "ballPosition", position:normalizedMovement.clone().multiplyScalar(ball.movement.length() * ball.acceleration), gameSession: _match.engine.gameSession });
          ball.movement.x=0;
          ball.movement.y=0;
        }
        else if(_match.gameType=="local")
            ball.movement = normalizedMovement.clone().multiplyScalar(ball.movement.length() * ball.acceleration);
        newTravelVector = normalizedMovement.multiplyScalar(newTravelVector.length());
      }
      else {
        if(_match.gameType == "remote" && ball.movement.x > 0 && !_match.isHost || _match.gameType == "remote" && ball.movement.x < 0)
        {
          let move= ball.movement;
          move.y=ball.movement.y * -1
          sendWebSocketMessage({ type: "ballPosition", position:move, gameSession: _match.engine.gameSession });
        }
        else if(_match.gameType == "local"){
          ball.setMovementY(ball.movement.y * -1)
        }
        newTravelVector.y *= -1;
      }

    return new HandlePaddleEdge(
      this.intersection,
      this.intersection.clone().add(newTravelVector),
      newTravelVector
    );
  }
}

export class CollisionHandler {
  constructor(paddle, boardSize) {
    this.TOP_WALL = new Wall(true, boardSize);
    this.BOTTOM_WALL = new Wall(false, boardSize);
    this.RIGHT_GOAL = new Goal(true, boardSize);
    this.LEFT_GOAL = new Goal(false, boardSize);
    this.physicalPaddle = new Paddle(paddle);
  }

   updateBallPositionAndMovement(timeDelta, match) {
    const ball = match.ball;
    let travel = new HandlePaddleEdge(
      ball.getPosition(),
      ball.getPosition().clone().add(ball.movement.clone().multiplyScalar(timeDelta))
    );
     while (travel !== null) {
      const closestObjectHit = this.getClosestObjectHit(travel, ball.radius);
      if (!closestObjectHit) {
          ball.setPosition(travel.end);
        return;
      }
      travel=closestObjectHit.handleCollision(travel, ball, this, match);
    }
  }

  getClosestObjectHit(travel, ballRadius) {
    let closestObjectHit = this.TOP_WALL.intersect(travel, null, ballRadius);
    closestObjectHit = this.BOTTOM_WALL.intersect(travel, closestObjectHit, ballRadius);
    closestObjectHit = this.LEFT_GOAL.intersect(travel, closestObjectHit, ballRadius);
    closestObjectHit = this.RIGHT_GOAL.intersect(travel, closestObjectHit, ballRadius);
    return this.physicalPaddle.intersect(travel, closestObjectHit, ballRadius);
  }
}

