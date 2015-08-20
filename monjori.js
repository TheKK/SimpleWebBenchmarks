"use strict";

var Monjori = {
}

Monjori.init = function() {
}

Monjori.runBench = function() {
	var RENDER_WIDTH = 500, RENDER_HEIGHT = 500;
	var RENDER_SCREEN_RATIO = RENDER_WIDTH / RENDER_HEIGHT;
	var renderer, scene, camera;
	var uniforms;
	var start, time;
	var fsSource = 
		"uniform vec2 resolution;" +
		"uniform float time;" +
		"" +
		"void main()	{" +
		"" +
			"vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;" +
			"float a = time*40.0;" +
			"float d,e,f,g=1.0/40.0,h,i,r,q;" +
			"e=400.0*(p.x*0.5+0.5);" +
			"f=400.0*(p.y*0.5+0.5);" +
			"i=200.0+sin(e*g+a/150.0)*20.0;" +
			"d=200.0+cos(f*g/2.0)*18.0+cos(e*g)*7.0;" +
			"r=sqrt(pow(abs(i-e),2.0)+pow(abs(d-f),2.0));" +
			"q=f/r;" +
			"e=(r*cos(q))-a/2.0;f=(r*sin(q))-a/2.0;" +
			"d=sin(e*g)*176.0+sin(e*g)*164.0+r;" +
			"h=((f+d)+a/2.0)*g;" +
			"i=cos(h+r*p.x/1.3)*(e+e+a)+cos(q*g*6.0)*(r+h/3.0);" +
			"h=sin(f*g)*144.0-sin(e*g)*212.0*p.x;" +
			"h=(h+(f-e)*q+sin(r-(a+h)/7.0)*10.0+i/4.0)*g;" +
			"i+=cos(h*2.3*sin(a/350.0-q))*184.0*sin(q-(r*4.3+a/12.0)*g)+tan(r*g+h)*184.0*cos(r*g+h);" +
			"i=mod(i/5.6,256.0)/64.0;" +
			"if(i<0.0) i+=4.0;" +
			"if(i>=2.0) i=4.0-i;" +
			"d=r/350.0;" +
			"d+=sin(d*d*8.0)*0.52;" +
			"f=(sin(a*g)+1.0)/2.0;" +
			"gl_FragColor=vec4(vec3(f*i/1.6,i/2.0+d/13.0,i)*d*p.x+vec3(i/1.3+d/8.0,i/2.0+d/18.0,i)*d*(1.0-p.x),1.0);" +
		"" +
		"}"
	;
	var vsSource = 
		"void main() {" +
		"	gl_Position = vec4(position, 1.0);" +
		"}"
	;
	var frameCount = 0;

	function adjustViewport() {
		renderer.setSize(window.innerWidth, window.innerHeight);
		window.scrollTo(0, 0);
	}

	function prepare() {
		var geometry, material, mesh;
		var showcase;

		renderer = new THREE.WebGLRenderer();
		adjustViewport();
		renderer.setPixelRatio(window.devicePixelRatio);

		scene = new THREE.Scene();

		camera = new THREE.Camera();
		camera.position.z = -1;

		geometry = new THREE.PlaneBufferGeometry(2, 2);

		uniforms = {
			time: { type: "f", value: 1.0 },
			resolution: { type: "v2", value: new THREE.Vector2() }
		};

		material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vsSource,
			fragmentShader: fsSource

		});

		mesh = new THREE.Mesh( geometry, material );
		scene.add( mesh );

		uniforms.resolution.value.x = renderer.domElement.width;
		uniforms.resolution.value.y = renderer.domElement.height;

		showcase = document.getElementById("showcase");
		showcase.appendChild(renderer.domElement);
	}

	function mainLoop() {
		var isRunning = true;

		uniforms.time.value += 0.05;

		// Draw
		renderer.render(scene, camera);

		++frameCount;
		if (frameCount === 1200) {
			isRunning = false;
		}

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

Monjori.cleanup = function() {
	var showcase;

	showcase = document.getElementById("showcase");
	showcase.removeChild(showcase.lastChild);
}
