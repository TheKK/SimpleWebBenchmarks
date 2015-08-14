var ParticleEffect = {}

ParticleEffect.init = function () {
	gCanvas2d.style.display = "block";
}

ParticleEffect.runBench = function() {
	var ctx = gCanvas2d.getContext("2d");
	var bulletList = []
	var start, time;
	var frameCount = 1;

	var Bullet = function(posX, posY, velX, velY) {
		this.w = 10;
		this.h = 10;
		this.posX = posX;
		this.posY = posY;
		this.velX = velX;
		this.velY = velY;
		this.accX = 0;
		this.accY = 0.1;

		this.update = function() {
			this.velX += this.accX;
			this.velY += this.accY;
			this.posX += this.velX;
			this.posY += this.velY;
		}

		this.render = function() {
			ctx.fillStyle = "red";
			ctx.fillRect(this.posX - this.w / 2,
				     this.posY - this.h / 2,
				     this.w, this.h);
		}

		this.die = function() {
			return (this.posX >= 500 ||
				this.posX + this.w <= 0 ||
				this.posY >= 500);
		}
	}

	for (var i = 0; i < 1000; ++i) {
		var vx = -5 + Math.random() * 10;
		var vy = -5 + Math.random() * 10;
		bulletList.push(new Bullet(250, 50, vx, vy));
	}

	function mainLoop() {
		var isRunning = true;

		// Clear
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 500, 500);

		// Update
		for (var i = 0; i < bulletList.length; ++i)
		bulletList[i].update();

		for (var i = 0; i < bulletList.length; ++i) {
			if (!bulletList[i].die()) {
				isRunning = true;
				break;
			}

			isRunning = false;
		}

		// Draw
		for (var i = 0; i < bulletList.length; ++i)
		bulletList[i].render();

		++frameCount;

		if (isRunning) {
			requestAnimationFrame(mainLoop);
		} else {
			time = Date.now() - start;	
			window.postMessage({time: frameCount / time * 1000}, "*");
		}
	}

	start = Date.now();
	mainLoop();
}

ParticleEffect.cleanup = function() {
	gCanvas2d.style.display = "none";
}
