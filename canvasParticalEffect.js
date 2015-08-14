var CanvasParticleEffect = {}

CanvasParticleEffect.init = function() {
}

CanvasParticleEffect.runBench = function() {
	var render;
	var scene;
	var camera;
	var start, time;
	var bulletList = []
	var frameCount = 1;

	var Bullet = function(posX, posY, velX, velY) {
		this.w = 10;
		this.h = 10;
		this.velX = velX;
		this.velY = velY;
		this.accX = 0;
		this.accY = -0.1;

		var geometry = new THREE.BoxGeometry(this.w, this.h, 30);
		var material = new THREE.MeshBasicMaterial({
				color: parseInt(0xff0000, 16)
			});
		this.threeBox = new THREE.Mesh(geometry, material);
		this.threeBox.position.x = posX;
		this.threeBox.position.y = posY;

		this.update = function() {
			this.velX += this.accX;
			this.velY += this.accY;
			this.threeBox.position.x += this.velX;
			this.threeBox.position.y += this.velY;
		}

		this.render = function() {
			ctx.fillStyle = "red";
			ctx.fillRect(this.threeBox.position.x - this.w / 2,
				     this.threeBox.position.y - this.h / 2,
				     this.w, this.h);
		}

		this.die = function() {
			return (this.threeBox.position.x >= 250 ||
				this.threeBox.position.x + this.w <= -250 ||
				this.threeBox.position.y <= -250);
		}
	}

	renderer = new THREE.CanvasRenderer();
	renderer.setSize(500, 500);
	renderer.setClearColor(0xcccccc);

	scene = new THREE.Scene();

	camera = new THREE.OrthographicCamera(
		-window.innerWidth / 2,
		window.innerWidth / 2,
		window.innerHeight / 2,
		-window.innerHeight / 2,
		1, 1000);
	camera.position.z = 100;

	document.body.insertBefore(renderer.domElement, document.body.firstChild);

	for (var i = 0; i < 1000; ++i) {
		var vx = -5 + Math.random() * 10;
		var vy = -5 + Math.random() * 10;
		var bullet = new Bullet(0, 200, vx, vy);
		bulletList.push(bullet);
		scene.add(bullet.threeBox);
	}

	function mainLoop() {
		var isRunning = true;

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
		renderer.render(scene, camera);

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

CanvasParticleEffect.cleanup = function() {
	document.body.removeChild(renderer.domElement);
}
