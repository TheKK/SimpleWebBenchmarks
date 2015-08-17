"use strict";

function $(selector) {
	return document.querySelector(selector);
}

var gTitle = $("#title");
var gLogConsole = $("#logConsole");
var gRan = false;
var gJobs = [];

(function() {
	function loadScript(filePath) {
		return new Promise(function(resolve, reject) {
			var script = document.createElement("script");
			script.src = filePath;
			script.onload = function() {
				console.log(filePath + " loaded");
				resolve("haha");
			}
			console.log(filePath + " loading ");
			document.getElementsByTagName("body")[0].appendChild(script);
		});
	}

	function setupJobs() {
		gJobs = [
			{
				name: "objectInstancing",
				description: "Construct and desctruct",	
				createWorker: function() {
					return new window.Worker("worker.js");
				}
			},
			mainThreadBenchmark({
				name: "WebGLParticleEffect",
				description: "Spread particle everywhere",
				init: WebGLParticleEffect.init,
				runBenchmark: WebGLParticleEffect.runBench,
				cleanup: WebGLParticleEffect.cleanup
			}),
			mainThreadBenchmark({
				name: "ParticleEffect",
				description: "Spread particle everywhere",
				init: CanvasParticleEffect.init,
				runBenchmark: CanvasParticleEffect.runBench,
				cleanup: CanvasParticleEffect.cleanup
			}),
			mainThreadBenchmark({
				name: "TextureLoading",
				description: "How long it takes to register a 2D texture",
				init: TextureLoading.init,
				runBenchmark: TextureLoading.runBench,
				cleanup: TextureLoading.cleanup
			})
		];
	}

	function mainThreadBenchmark(args) {
		return {
			name: args.name,
			description: args.description,	
			createWorker: function() {
				if (args.init)
					args.init();

				return {                                                                   
					postMessage: function() {                                                
						var worker = this;                                                     
						var bench = args.runBenchmark;
						window.onmessage = function(event) {
							window.onmessage = null;
							event.data.name = args.name;
							worker.onmessage(event);                                             
						}

						bench();
					},                                                                       
					terminate: args.cleanup || function(){},                                        
				};                                                                         
			}
		};
	}

	function addLog(msg) {
		var newP = document.createElement("p");

		newP.innerHTML = msg;
		gLogConsole.appendChild(newP);
	}

	function clearLog() {
		while (gLogConsole.hasChildNodes())
			gLogConsole.removeChild(gLogConsole.lastChild);
	}

	function allBenchmarkDone() {
		gTitle.innerHTML = "- All Done!! -";

		gRan = false;
	}

	function runBenchmark(index) {
		var benchWorker;
		var job;

		index = index | 0;
		job = gJobs[index];

		/* All benchmakrs done */
		if (!job) {
			allBenchmarkDone();
			return;
		}

		benchWorker = job.createWorker();

		benchWorker.onmessage = function(event){
			var name = event.data.name;
			var time = event.data.time;

			var resultMsg = "Name: " + name + ", Time: " + time + "\n";
			addLog(resultMsg);

			benchWorker.terminate();

			++index;
			runBenchmark(index);
		};

		benchWorker.postMessage({
			name: job.name
		});
	}

	function run() {
		if (gRan)
			return;
		else
			gRan = true;

		title.innerHTML = "- Benchmarks Running -"
		clearLog();
		runBenchmark();
	}

	function toggleFullscreen() {
		if (document.mozFullScreenElement)
			document.mozCancelFullScreen();
		else
			document.documentElement.mozRequestFullScreen();
	}

	loadScript("canvasParticalEffect.js").then(function() {
	loadScript("webGLParticleEffect.js").then(function() {
	loadScript("textureLoading.js").then(function() {
		setupJobs();

		window.addEventListener("keypress", run);
		window.addEventListener("keydown", function(e) {
			if (e.key == 'f')
				toggleFullscreen();
		}, false);
		window.addEventListener('devicemotion', function(event) {
			if (Math.abs(event.acceleration.x) >= 15)
				run();
		});

		gTitle.addEventListener("click", run);
		gTitle.addEventListener("touchend", run);
	})})});
}).call(this)
