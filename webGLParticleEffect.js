"use strict";

var WebGLParticleEffect = {
}

WebGLParticleEffect.init = function() {
}

WebGLParticleEffect.runBench = function() {
	var RENDER_WIDTH = 500, RENDER_HEIGHT = 500;
	var RENDER_SCREEN_RATIO = RENDER_WIDTH / RENDER_HEIGHT;
	var renderer, scene, camera;
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

		var geometry = new THREE.BoxGeometry(this.w, this.h, 10);
		var material = new THREE.MeshBasicMaterial({color: 0xff2255});

		this.threeBox = new THREE.Mesh(geometry, material);
		this.threeBox.position.x = posX;
		this.threeBox.position.y = posY;

		this.update = function() {
			this.velX += this.accX;
			this.velY += this.accY;
			this.threeBox.position.x += this.velX;
			this.threeBox.position.y += this.velY;
		}

		this.die = function() {
			return (this.threeBox.position.x >= 250 ||
				this.threeBox.position.x + this.w <= -250 ||
				this.threeBox.position.y <= -250);
		}
	}

	function adjustViewport() {
		var winWidth = window.innerWidth, winHeight = window.innerHeight;
		var rendWidth, rendHeight;
		var screenRatio = winWidth / winHeight;

		if (screenRatio > RENDER_SCREEN_RATIO) {
			rendWidth = RENDER_SCREEN_RATIO * winHeight;
			rendHeight = winHeight;

		} else {
			rendWidth = winWidth;
			rendHeight = rendWidth / RENDER_SCREEN_RATIO;
		}

		renderer.setSize(rendWidth, rendHeight);
		window.scrollTo(0, 0);
	}

	function prepare() {
		renderer = new THREE.WebGLRenderer();
		adjustViewport();
		renderer.setClearColor(0xcccccc);

		scene = new THREE.Scene();

		camera = new THREE.OrthographicCamera(
			-RENDER_WIDTH / 2,
			RENDER_WIDTH / 2,
			RENDER_HEIGHT / 2,
			-RENDER_HEIGHT / 2,
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

	prepare();
	start = Date.now();
	mainLoop();
}

WebGLParticleEffect.cleanup = function() {
	document.body.removeChild(document.body.firstChild);
}
