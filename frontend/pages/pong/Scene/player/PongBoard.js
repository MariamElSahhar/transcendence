import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.170.0/three.module.min.js";
const BOARD_COLOR = 0xffd88e;
const LINE_COLOR = 0xfffefc;
const NAME_COLOR = 0x000000;
export class PongBoard {
	#threeJSBoard;
	#score = 0;
	#side;
	#board;
	#lifelines;
	#goal;
	#size;
	#scoreSprite;
	#remainingLives;

	constructor() {}

	async init(side, maxScore, playerName) {
		if (!playerName || playerName.trim() === "") {
			playerName = "Unknown Player";
		}
		this.#side = side;
		this.#threeJSBoard = new THREE.Group();
		this.#size = new THREE.Vector3(20, 27.5, 1);
		this.#lifelines = [];
		this.#remainingLives = window.APP_CONFIG.pointsToWinPongMatch;
		this.initBoard(this.#size);
		this.initWalls(this.#size);
		this.initPlayerName(this.#size, playerName);
		this.initLight(this.#size);
	}

	initBoard(boardSize) {
		this.#board = new THREE.Mesh(
			new THREE.BoxGeometry(boardSize.x, boardSize.y, boardSize.z),
			new THREE.MeshStandardMaterial({ color: BOARD_COLOR }) 
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
			new THREE.MeshStandardMaterial({ color: LINE_COLOR })
		);

		const strapXPosition =
			this.#side === 0
				? boardSize.x / 2 - strapThickness / 2
				: -boardSize.x / 2 + strapThickness / 2;

		connectingStrap.position.set(strapXPosition, 0, 0);
		this.#threeJSBoard.add(connectingStrap);
	}

	initWalls(boardSize) {
		const wallWidth = 1;
		const wallHeight = boardSize.y + 2 * wallWidth;
		const wallDepth = boardSize.z * 2;

		const textureLoader = new THREE.TextureLoader();
		const wallTextureHorizontal = textureLoader.load(
			"/assets/textures/floor.webp",
			(texture) => {
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;

				const textureSize = 1;
				const wallWidth = wallGeometry.parameters.width;
				const wallHeight = wallGeometry.parameters.height;
				texture.repeat.set(
					wallWidth / textureSize,
					wallHeight / textureSize
				);
			}
		);
		const wallMaterialHorizontal = new THREE.MeshStandardMaterial({
			map: wallTextureHorizontal,
		});

		const wallGeometry = new THREE.BoxGeometry(
			boardSize.x,
			wallWidth,
			wallDepth
		);

		const topWall = new THREE.Mesh(wallGeometry, wallMaterialHorizontal);
		topWall.position.set(0, boardSize.y / 2 + wallWidth / 2, 0);
		this.#threeJSBoard.add(topWall);

		const bottomWall = new THREE.Mesh(wallGeometry, wallMaterialHorizontal);
		bottomWall.position.set(0, -boardSize.y / 2 - wallWidth / 2, 0);
		this.#threeJSBoard.add(bottomWall);

		const goalGeometry = new THREE.BoxGeometry(
			wallWidth,
			wallHeight,
			wallDepth
		);

		const goalTexture = textureLoader.load(
			"/assets/textures/floor.webp",
			(texture) => {
				texture.wrapS = THREE.RepeatWrapping;
				texture.wrapT = THREE.RepeatWrapping;
				const textureSize = 1;
				const goalHeight = goalGeometry.parameters.height;
				const goalWidth = goalGeometry.parameters.width;
				texture.repeat.set(
					goalWidth / textureSize,
					goalHeight / textureSize
				);
			}
		);
		const goalMaterial = new THREE.MeshStandardMaterial({
			map: goalTexture,
		});
		this.#goal = new THREE.Mesh(goalGeometry, goalMaterial);
		let sign = this.#side === 0 ? -1 : 1;
		this.#goal.position.set(sign * (boardSize.x / 2 + wallWidth / 2), 0, 0);
		this.#threeJSBoard.add(this.#goal);
	}

	initLight() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		this.#threeJSBoard.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(10, 20, 10);
		directionalLight.castShadow = true;
		this.#threeJSBoard.add(directionalLight);
	}

	initPlayerName(boardSize, playerName) {
		const nameColor = NAME_COLOR;
		const playerNameSprite = this.createTextSprite(
			playerName,
			nameColor,
			70,
			this.#side ? "right" : "left"
		);
		playerNameSprite.position.set(
			this.#side ? boardSize.x / 2 - 1 : -boardSize.x / 2 + 1,
			boardSize.y / 2 + 4.5,
			1
		);
		this.#threeJSBoard.add(playerNameSprite);
		this.initLifelines(boardSize);
	}

	initLifelines(boardSize) {
		const lifelineCount = window.APP_CONFIG.pointsToWinPongMatch;
		const spacing = 2;
		const padding = 2.3;
		const textureLoader = new THREE.TextureLoader();
		const heartMaterial = new THREE.SpriteMaterial({
			map: textureLoader.load("/assets/sprites/pixel-heart.webp"),
		});

		const startX = this.#side
			? boardSize.x / 2 - padding - (lifelineCount - 1) * spacing
			: -this.#size.x / 2 + padding;

		for (let i = 0; i < lifelineCount; i++) {
			const lifeline = new THREE.Sprite(heartMaterial);
			lifeline.scale.set(2, 2, 2);
			lifeline.position.set(
				startX + (this.#side ? i * spacing : i * spacing),
				boardSize.y / 2 + 2,
				2
			);

			this.#threeJSBoard.add(lifeline);
			if (this.#side) this.#lifelines.unshift(lifeline);
			else this.#lifelines.push(lifeline);
		}
	}

	removeLife() {
		this.#remainingLives--;
		const indexToReplace = this.#remainingLives;
		const textureLoader = new THREE.TextureLoader();
		const emptyHeart = new THREE.SpriteMaterial({
			map: textureLoader.load("/assets/sprites/nocolor-heart.webp"),
		});
		const newLifeline = new THREE.Sprite(emptyHeart);

		newLifeline.position.copy(this.#lifelines[indexToReplace].position);
		newLifeline.scale.set(2, 2, 2);

		this.#threeJSBoard.remove(this.#lifelines[indexToReplace]);
		this.#threeJSBoard.add(newLifeline);

		this.#lifelines.push(newLifeline);
	}

	createTextSprite(message, color, fontSize = 128, align) {
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");

		canvas.width = 1024;
		canvas.height = 512;

		const maxFontSize = fontSize;
		const minFontSize = 20;
		const maxLength = 20;
		const adjustedFontSize = Math.max(
			minFontSize,
			maxFontSize -
				(message.length > maxLength
					? (message.length - maxLength) * 2
					: 0)
		);

		context.fillStyle = color;
		context.font = `bold ${adjustedFontSize}px Verdana`;
		context.textAlign = align;
		context.textBaseline = "middle";

		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillText(message, canvas.width / 2, canvas.height / 2);

		const texture = new THREE.CanvasTexture(canvas);
		texture.needsUpdate = true;

		const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
		const sprite = new THREE.Sprite(spriteMaterial);

		const scaleFactor = 10;
		const scaleWidth = (canvas.width / canvas.height) * scaleFactor;
		sprite.scale.set(scaleWidth, scaleFactor, 1);

		return sprite;
	}

	addPoint() {
		this.#score++;
	}

	resetPoints() {
		this.#score = 0;
		const scoreColor = "#00008b";

		this.#threeJSBoard.remove(this.#scoreSprite);
		this.#scoreSprite = this.createTextSprite(`0`, scoreColor, 128);
		this.#scoreSprite.position.set(0, 0, 1.2);
		this.#threeJSBoard.add(this.#scoreSprite);
	}

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
