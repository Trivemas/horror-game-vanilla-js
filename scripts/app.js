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
		this.baseSpeed = 10;

		this.wireUpEvents();
	}

	update() {
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

let player = new Player();

function gameloop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); /* clear canvas */

	player.update();
	player.render();

	requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);
