//@ts-check
/** @type {HTMLCanvasElement} */
//@ts-ignore
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;

class Player {
	constructor() {
		this.width = 32;
		this.height = 32;
		this.x = canvas.width / 2 - this.width / 2;
		this.y = canvas.height / 2 - this.height / 2;

		this.isMovingUp = false;
		this.isMovingDown = false;
		this.isMovingRight = false;
		this.isMovingLeft = false;
		this.isSneaking = false;
		this.isRunning = false;
		this.baseSpeed = 3;

		this.wireUpEvents();
	}

	update(elapsedTime) {
		let speedMultiplier = 1;
		if (this.isRunning && !this.isSneaking) {
			speedMultiplier = 2;
		} else if (this.isSneaking && !this.isRunning) {
			speedMultiplier = 0.5;
		}
		let speed = this.baseSpeed * speedMultiplier;

		if (this.isMovingUp) {
			this.y -= speed;
		}
		if (this.isMovingLeft) {
			this.x -= speed;
		}
		if (this.isMovingDown) {
			this.y += speed;
		}
		if (this.isMovingRight) {
			this.x += speed;
		}

		if(this.x + this.width >= canvas.width) {
			this.x = canvas.width - this.width;
		}
		if(this.x <= 0) {
			this.x = 0;		
		}
		if(this.y + this.height >= canvas.height) {
			this.y = canvas.height - this.height;
		}
		if(this.y <= 0) {
			this.y = 0;		
		}
	}

	render() {
		ctx.save();
		ctx.fillStyle = "green";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	}

	wireUpEvents() {
		window.addEventListener("keydown", (e) => {
			// console.log(e.key);
			this.toggleMovement(e.key, true);
		});

		window.addEventListener("keyup", (e) => {
			// console.log(e.key);
			this.toggleMovement(e.key, false);
		});
	}

	toggleMovement(key, toggleValue) {
		// console.log(e.key);
		switch (key) {
			case "ArrowUp":
			case "w":
			case "W":
				this.isMovingUp = toggleValue;
				break;
			case "ArrowDown":
			case "s":
			case "S":
				this.isMovingDown = toggleValue;
				break;
			case "ArrowLeft":
			case "a":
			case "A":
				this.isMovingLeft = toggleValue;
				break;
			case "ArrowRight":
			case "d":
			case "D":
				this.isMovingRight = toggleValue;
				break;
			case "c":
				this.isSneaking = toggleValue;
				break;
			case "Shift":
				this.isRunning = toggleValue;
				break;
		}
	}
}

class Enemy {
	constructor() {
		this.width = 32;
		this.height = 32;
		this.x = 0;
		this.y = 0;
		this.baseSpeed = 3;
		this.movement = {
			timeSinceLastUpdate: 0,
			timeToNextUpdate: 1000, //we count in miliseconds so 1000 miliseconds is 1 second
			x: {
				direction: 1,
				speed: this.baseSpeed,
			},
			y: {
				direction: 1,
				speed: this.baseSpeed,
			},
		};
	}

	update(elapsedTime) {
		this.movement.timeSinceLastUpdate += elapsedTime;
		if (this.movement.timeSinceLastUpdate >= this.movement.timeToNextUpdate) {
			this.movement.x.direction = Math.random() >= 0.5 ? 1 : -1;
			this.movement.y.direction = Math.random() >= 0.5 ? 1 : -1;

			this.movement.x.speed = Math.random() * this.baseSpeed;
			this.movement.y.speed = Math.random() * this.baseSpeed;

			this.movement.timeToNextUpdate = Math.random() * 1000 + 500;
			this.movement.timeSinceLastUpdate = 0;
		}
		this.x += this.movement.x.speed * this.movement.x.direction;
		this.y += this.movement.y.speed * this.movement.y.direction;

		if(this.x + this.width >= canvas.width) {
			this.movement.x.direction = -1;
		}
		if(this.x <= 0) {
			this.movement.x.direction = 1;		
		}
		if(this.y + this.height >= canvas.height) {
			this.movement.y.direction = -1;
		}
		if(this.y <= 0) {
			this.movement.y.direction = 1;		
		}
	};

	render() {
		ctx.save();
		ctx.fillStyle = "red";
		ctx.fillRect(this.x, this.y, this.width, this.height);
		ctx.restore();
	};
}
let player = new Player();
let e1 = new Enemy();

let gameAssets = [player, e1];

let currentTime = 0;

let enemyTime = 0;
const enemySpawnRate = 5000;

function gameloop(timestamp) {
	// console.log(timestamp);
	ctx.clearRect(0, 0, canvas.width, canvas.height); /* clear canvas */

	let elapsedTime = Math.floor(timestamp - currentTime);
	currentTime = timestamp;

	enemyTime += elapsedTime;
	if(enemyTime >= enemySpawnRate) {
		gameAssets.push(new Enemy());
		enemyTime = 0;
	}

	// console.log(elapsedTime);
	gameAssets.forEach((asset) => {
		asset.update(elapsedTime);
		asset.render();
	});

	// player.update();
	// player.render();

	// e1.update();
	// e1.render();

	requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
