import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";

export class PongBoard {
  #threeJSBoard;
  #score = 0;
  #side;
  #pointColor;
  #board;
  #goal;
  #size;
  #scoreSprite;
  #playerNameSprite;

  static #leftSideColor = 0xff0000; // Red for left player
  static #rightSideColor = 0x0000ff; // Blue for right player

  constructor() {}

  async init(side, maxScore, playerName) {
    console.log(`PongBoard.init called with side: ${side}, playerName: ${playerName}`);

    if (!playerName || playerName.trim() === "") {
      playerName = "Unknown Player";
    }

    this.#side = side;
    this.#pointColor = this.#side ? PongBoard.#rightSideColor : PongBoard.#leftSideColor;

    this.#threeJSBoard = new THREE.Group();
    this.#size = new THREE.Vector3(20, 27.5, 1);

    this.initBoard(this.#size);
    this.initWalls(this.#size);
    this.initScore(this.#size);
    this.initPlayerName(this.#size, playerName);
    this.initLight(this.#size);
  }

  initBoard(boardSize) {
    this.#board = new THREE.Mesh(
      new THREE.BoxGeometry(boardSize.x, boardSize.y, boardSize.z),
      new THREE.MeshStandardMaterial({ color: 0x808080 }) // Grey board
    );

    if (this.#side === 1) {
      this.#board.rotateZ(Math.PI);
    }

    this.#threeJSBoard.add(this.#board);

    const strapThickness = 0.2;
    const strapHeight = boardSize.y;
    const strapDepth = boardSize.z + 0.1;

    const connectingStrap = new THREE.Mesh(
      new THREE.BoxGeometry(strapThickness, strapHeight, strapDepth),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );

    const strapXPosition = this.#side === 0
      ? boardSize.x / 2 - strapThickness / 2
      : -boardSize.x / 2 + strapThickness / 2;

    connectingStrap.position.set(strapXPosition, 0, 0);
    this.#threeJSBoard.add(connectingStrap);
  }

  initWalls(boardSize) {
    const wallWidth = 1;
    const wallHeight = boardSize.y + 2 * wallWidth;
    const wallDepth = boardSize.z * 2;

    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x000033 });
    const wallGeometry = new THREE.BoxGeometry(boardSize.x, wallWidth, wallDepth);

    const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
    topWall.position.set(0, boardSize.y / 2 + wallWidth / 2, 0);
    this.#threeJSBoard.add(topWall);

    const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
    bottomWall.position.set(0, -boardSize.y / 2 - wallWidth / 2, 0);
    this.#threeJSBoard.add(bottomWall);

    const goalGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, wallDepth);
    this.#goal = new THREE.Mesh(goalGeometry, wallMaterial);
    let sign = this.#side === 0 ? -1 : 1;
    this.#goal.position.set(sign * (boardSize.x / 2 + wallWidth / 2), 0, 0);
    this.#threeJSBoard.add(this.#goal);
  }

  initLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.#threeJSBoard.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.#threeJSBoard.add(directionalLight);
  }

  initScore(boardSize) {
    const scoreColor = "#87CEEB";
    this.#scoreSprite = this.createTextSprite(`0`, scoreColor, 128);
    this.#scoreSprite.position.set(0, 0, 1.2);
    this.#threeJSBoard.add(this.#scoreSprite);
  }

  initPlayerName(boardSize, playerName) {
    const nameColor = "#ffffff";
    this.#playerNameSprite = this.createTextSprite(playerName, nameColor, 90);

    this.#playerNameSprite.position.set(0, boardSize.y / 2 + 3, 1.0);
    this.#threeJSBoard.add(this.#playerNameSprite);
  }

  createTextSprite(message, color = "#ffffff", fontSize = 100) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 512;
    canvas.height = 256;

    context.fillStyle = color;
    context.font = `bold ${fontSize}px Verdana`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(message, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(10, 5, 1);

    return sprite;
  }

  addPoint() {
    this.#score++;
    const scoreColor = 0x000033;

    this.#threeJSBoard.remove(this.#scoreSprite);
    this.#scoreSprite = this.createTextSprite(`${this.#score}`, scoreColor, 128);
    this.#scoreSprite.position.set(0, 0, 1.6);
    this.#threeJSBoard.add(this.#scoreSprite);
  }

  resetPoints() {
    this.#score = 0;
    const scoreColor = "#00008b";

    this.#threeJSBoard.remove(this.#scoreSprite);
    this.#scoreSprite = this.createTextSprite(`0`, scoreColor, 128);
    this.#scoreSprite.position.set(0, 0, 1.2);
    this.#threeJSBoard.add(this.#scoreSprite);
  }

  updateFrame() {}

  get score() {
    return this.#score;
  }

  get threeJSBoard() {
    return this.#threeJSBoard;
  }

  get size() {
    return this.#size;
  }
}

