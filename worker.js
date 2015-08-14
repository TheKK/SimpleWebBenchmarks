onmessage = function(event) {
	var name = event.data.name;
	var benchmarkFilePath = "js/benchmarks/" + name + ".js";
	var start, time;

	importScripts(benchmarkFilePath);

	init();
	start = Date.now();
	runBenchmark();
	time = Date.now() - start;	
	cleanup();

	postMessage({
		name: name,
		time: time
	});
};
