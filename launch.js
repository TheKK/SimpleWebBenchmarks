"use strict";

function $(selector) {
	return document.querySelector(selector);
}

var gTitle = $("#title");
var gLogConsole = $("#logConsole");
var gRunningBenchBox = $("#runningBenchBox");
var gBenchDescBox = $("#benchDescBox");
var gResultTable = $("#resultTable");
var gShowcase = $("#showcase");
var gRan = false;
var gJobs = [];
var gUrlToPost = null;
var gResults = [];
var gAutoRun = false;

(function() {

function loadScripts(fileList) {
	return new Promise(function(resolve, reject) {
		var fileName;
		var script;

		if (fileList.length === 0) {
			resolve("All scripts loaded");
			return;
		}

		fileName = fileList[0];

		script = document.createElement("script");
		script.src = fileName;
		script.onload = function() {
			console.log(fileName + " loaded");
			loadScripts(fileList.slice(1)).then(function() {
				resolve();
			});
		}

		document.getElementsByTagName("body")[0].appendChild(script);
	});
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
		},
		checkSupport: args.checkSupport,
		enable: args.enable
	};
}

function parseUrlArguments() {
	var part, parts, numParts, slices;
	var i;

	if (!window.location.search)
		return;

	parts = window.location.search.substr(1).split(',');
	numParts = parts.length;
	for (i = 0; i < numParts; ++i) {
		part = parts[i];
		slices = part.split('=');
		if (slices.length === 2) {
			if (slices[0] === 'AutoRun') {
				gAutoRun = slices[1].toLowerCase() === 'true';
			} else if (slices[0] === 'UrlToPost') {
				gUrlToPost = slices[1];
				console.log('will post to ' + gUrlToPost);
			} else {
				console.log('weird url part ' + part);
			}
		}
	}
}

function setupJobs() {
	gJobs = [
		{
			name: "objectInstancing",
			description: "Construct and desctruct",
			createWorker: function() {
				return new window.Worker("worker.js");
			},
			checkSupport: function() {
				return window.Worker ? true : false;
			},
			enable: true
		},
		mainThreadBenchmark({
			name: "ShaderCompile",
			description: "How long it takes to compile shaders",
			init: ShaderCompile.init,
			runBenchmark: ShaderCompile.runBench,
			cleanup: ShaderCompile.cleanup,
			checkSupport: function() {
				return true;
			},
			enable: true
		}),
		mainThreadBenchmark({
			name: "TextureLoading",
			description: "How long it takes to register a 2D texture",
			init: TextureLoading.init,
			runBenchmark: TextureLoading.runBench,
			cleanup: TextureLoading.cleanup,
			checkSupport: function() {
				return true;
			},
			enable: true
		}),
		mainThreadBenchmark({
			name: "TextureLoadingWithoutNoMipmap",
			description: "How long it takes to register a 2D texture",
			init: TextureLoadingWithoutMipmap.init,
			runBenchmark: TextureLoadingWithoutMipmap.runBench,
			cleanup: TextureLoadingWithoutMipmap.cleanup,
			checkSupport: function() {
				return true;
			},
			enable: true
		}),
		mainThreadBenchmark({
			name: "WebGLParticleEffect",
			description: "Spread particle everywhere",
			init: WebGLParticleEffect.init,
			runBenchmark: WebGLParticleEffect.runBench,
			cleanup: WebGLParticleEffect.cleanup,
			checkSupport: function() {
				return true;
			},
			enable: true
		}),
		mainThreadBenchmark({
			name: "ParticleEffect",
			description: "Spread particle everywhere",
			init: CanvasParticleEffect.init,
			runBenchmark: CanvasParticleEffect.runBench,
			cleanup: CanvasParticleEffect.cleanup,
			checkSupport: function() {
				return true;
			},
			enable: true
		}),
		mainThreadBenchmark({
			name: "Monjori benchmark",
			description: "Monjori",
			init: Monjori.init,
			runBenchmark: Monjori.runBench,
			cleanup: Monjori.cleanup,
			checkSupport: function() {
				return true;
			},
			enable: true
		})
	];
}

function addResult(name, value) {
	gResults.push({"name": name, "value": value});
}

function clearResult() {
	gResults = [];
}

function postResult(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("POST", url, true);
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.send("results=" + JSON.stringify(gResults));
}

function addLog(msg, desc) {
	var newP = document.createElement("p");

	newP.innerHTML = msg;

	if (desc) {
		newP.desc = desc;
		newP.addEventListener("mouseover", descBoxMouseOver);
		newP.addEventListener("mouseout", descBoxMouseOut);
		newP.addEventListener("mousemove", descBoxMouseMove);
	}

	gLogConsole.appendChild(newP);
}

function clearLog() {
	while (gLogConsole.hasChildNodes())
		gLogConsole.removeChild(gLogConsole.lastChild);
}

function setRunningBenchName(name) {
	gRunningBenchBox.innerHTML = name;
}

function hideRunningBenchBox() {
	gRunningBenchBox.style.display = "none";
}

function showRunninBenchBox() {
	gRunningBenchBox.style.display = "block";
}

function descBoxMouseOver(event) {
	gBenchDescBox.style.display = "block";
	gBenchDescBox.innerHTML = event.target.desc;
}

function descBoxMouseOut(event) {
	gBenchDescBox.style.display = "none";
}

function descBoxMouseMove(event) {
	gBenchDescBox.style.left = (event.clientX + window.scrollX + 20) + "px";
	gBenchDescBox.style.top = (event.clientY + window.scrollY + 20) + "px";
}

function allBenchmarkDone() {
	gTitle.innerHTML = "- All Done!! -";
	descBoxMouseOut();
	gShowcase.style.display = "none";
	gResultTable.style.display = "block";
	hideRunningBenchBox();

	if (gUrlToPost) {
		postResult(gUrlToPost);
	}

	gRan = false;
}

function runBenchmark(index) {
	var benchWorker;
	var job;

	index = index | 0;
	job = gJobs[index];

	while (job) {
		if (job.enable === true) {
			if (job.checkSupport() === true) {
				break;
			} else {
				addLog("Benchmak '" + job.name + "' is not support by your browser, skipped");
			}
		} else {
			++index;
			job = gJobs[index];
		}
	}

	/* All benchmakrs done */
	if (!job) {
		allBenchmarkDone();
		return;
	}

	benchWorker = job.createWorker();

	/* Show name of benchmark in floating box */
	setRunningBenchName(job.name);

	benchWorker.onmessage = function(event){
		var name = event.data.name;
		var time = event.data.time;

		var resultMsg = "Name: " + name + ", Time: " + time + "\n";
		addLog(resultMsg, job.description);
		addResult(name, time);

		benchWorker.terminate();

		runBenchmark(index + 1);
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
	setRunningBenchName("Waiting...");
	showRunninBenchBox();
	clearLog();
	clearResult();
	gResultTable.style.display = "none";
	gShowcase.style.display = "block";

	runBenchmark();
}

function toggleFullscreen() {
	if (document.mozFullScreenElement)
		document.mozCancelFullScreen();
	else
		document.documentElement.mozRequestFullScreen();
}

var scriptsToLoad = [
	"canvasParticalEffect.js",
	"webGLParticleEffect.js",
	"textureLoading.js",
	"textureLoadWithoutMipmap.js",
	"shaderCompile.js",
	"textureLoadWithoutMipmap.js",
	"shaderMatrixOperations.js",
	"monjori.js"
];

window.onload = function() {
	loadScripts(scriptsToLoad).then(function() {
		setupJobs();
		parseUrlArguments();
		gTitle.innerHTML = "- Press Any Key To Start -";

		if (gAutoRun) {
			run();
		}

		window.addEventListener("keypress", run);
		window.addEventListener("keydown", function(e) {
			if (e.key == 'f') {
				toggleFullscreen();
			} else {
				run();
			}
		}, false);
		window.addEventListener('devicemotion', function(event) {
			if (Math.abs(event.acceleration.x) >= 15) {
				run();
			}
		});

		gTitle.addEventListener("click", run);
		gTitle.addEventListener("touchend", run);
	});
};

})()
