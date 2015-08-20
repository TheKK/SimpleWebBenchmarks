"use strict";

var WebGLDrawCall = {
}

WebGLDrawCall.init = function() {
}

WebGLDrawCall.runBench = function() {
	var RENDER_WIDTH = 500, RENDER_HEIGHT = 500;
	var RENDER_SCREEN_RATIO = RENDER_WIDTH / RENDER_HEIGHT;
	var renderer, scene, camera;
	var start, time;
	var bulletList = []
	var frameCount = 0;
	var isRunning = true;

	var Bullet = function(posX, posY) {
		this.w = 10;
		this.h = 10;

		var geometry = new THREE.BoxGeometry(this.w, this.h, 10);
		var material = new THREE.MeshBasicMaterial({color: 0x030101});

		this.threeBox = new THREE.Mesh(geometry, material);
		this.threeBox.position.x = posX;
		this.threeBox.position.y = posY;
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
		var showcase;
		var renderX, renderY;

		renderer = new THREE.WebGLRenderer();
		adjustViewport();
		renderer.setClearColor(0xeeeeee);

		scene = new THREE.Scene();

		camera = new THREE.OrthographicCamera(
			-RENDER_WIDTH / 2,
			RENDER_WIDTH / 2,
			RENDER_HEIGHT / 2,
			-RENDER_HEIGHT / 2,
			1, 1000);

		camera.position.z = 100;

		showcase = document.getElementById("showcase");
		showcase.appendChild(renderer.domElement);

		for (var i = 0; i < 1000; ++i) {
			var x = -RENDER_WIDTH / 2 + Math.random() * RENDER_WIDTH;
			var y = -RENDER_HEIGHT / 2 + Math.random() * RENDER_HEIGHT;
			var bullet = new Bullet(x, y);
			scene.add(bullet.threeBox);
		}
	}

	function mainLoop() {
		++frameCount;
		if (frameCount === 300) {
			isRunning = false;
		}

		// Draw
		renderer.render(scene, camera);

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

WebGLDrawCall.cleanup = function() {
	var showcase;

	showcase = document.getElementById("showcase");
	showcase.removeChild(showcase.lastChild);
}
