/*
 * Goal:
 * 	Test performance of WebGL shaders compiling.
 *
 */

var ShaderCompile = {
	vsSource : document.getElementById("shader-vs").innerHTML,
	fsSource : document.getElementById("shader-fs").innerHTML
}

ShaderCompile.init = function() {
}

ShaderCompile.runBench = function () {
	var canvas = document.createElement("canvas");
	var gl = canvas.getContext("webgl");
	var start, time;
	var vs;
	var fs;
	var shaderProgram;

	start = Date.now();

	vs = gl.createShader(gl.VERTEX_SHADER);
	fs = gl.createShader(gl.FRAGMENT_SHADER);
	shaderProgram = gl.createProgram();

	gl.shaderSource(vs, ShaderCompile.vsSource);
	gl.shaderSource(fs, ShaderCompile.fsSource);

	gl.compileShader(vs);
	if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {  
		console.log("An error occurred compiling the vertex shaders: " + gl.getShaderInfoLog(vs));  
		window.postMessage({time: "None"}, "*");
		return;  
	}

	gl.compileShader(fs);
	if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {  
		console.log("An error occurred compiling the fragment shaders: " + gl.getShaderInfoLog(fs));  
		window.postMessage({time: "None"}, "*");
		return;
	}

	gl.attachShader(shaderProgram, vs);
	gl.attachShader(shaderProgram, fs);
	gl.linkProgram(shaderProgram);
	gl.useProgram(shaderProgram);

	gl.finish();

	time = Date.now() - start;

	window.postMessage({time: time / 1000}, "*");
}

ShaderCompile.cleanup = function() {
}
