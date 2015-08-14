var WebGLParticleEffect = {}

WebGLParticleEffect.init = function() {
	gCanvas3d.style.display = "block";
}

WebGLParticleEffect.effectBench = function() {
	var gl = gCanvas3d.getContext("webgl");

	gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
	gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
	gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.

	window.postMessage({time: 112}, "*");
}

WebGLParticleEffect.effectCleanup = function() {
	gCanvas3d.style.display = "none";
}
