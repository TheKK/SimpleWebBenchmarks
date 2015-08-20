onmessage = function(event) {
	var benchmarkName = event.data.benchmarkName;
	var benchmarkFilePath = "js/benchmarks/" + benchmarkName + ".js";
	var start, time;

	importScripts(benchmarkFilePath);

	init();
	start = Date.now();
	runBenchmark();
	time = Date.now() - start;	
	cleanup();

	postMessage({
		benchmarkName: benchmarkName,
		resultName: "time(ms)",
		resultValue: time
	});
};
