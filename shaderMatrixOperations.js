/*
 * Goal:
 * 	Test how much time WebGL takes to perform draw calls
 *
 */

var ShaderMatrixOperations = {}

ShaderMatrixOperations.init = function() {
}

ShaderMatrixOperations.runBench = function() {
	var canvas = document.createElement("canvas");
	var gl = canvas.getContext("webgl");
	var start, time;
	var vertices, verticesBuf;
	var vs, fs, shaderProgram;
	var vsSource = 
		"attribute vec3 aCoord;" +
		"void main(void) {" +
		"	gl_Position = vec4(1.0, 1.0, 1.0, 1.0);" +
		"}";
	var fsSource = 
		"precision highp float;" +
		"void main(void) {" +
		"	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);" +
		"}";

	function initShader() {
		vs = gl.createShader(gl.VERTEX_SHADER);
		fs = gl.createShader(gl.FRAGMENT_SHADER);
		shaderProgram = gl.createProgram();

		gl.shaderSource(vs, vsSource);
		gl.shaderSource(fs, fsSource);

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
	}

	function bindAndCreateBuffer() {
		verticesBuf = gl.createBuffer();
		vertices = [
			0.0, 1.0, 0.0,
			-1.0, -1.0, 0.0,
			1.0, -1.0, 0.0
		];
		gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuf);
	}

	start = Date.now();

	gl.useProgram(shaderProgram);

	gl.finish();

	time = Date.now() - start;

	window.postMessage({time: "Yoooo"}, "*");
}

ShaderMatrixOperations.clenaup = function() {
}
