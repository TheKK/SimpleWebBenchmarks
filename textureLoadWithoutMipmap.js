/*
 * Goal:
 * 	Test WebGL texture binding and upload performance.
 *
 *	Texture in one of importance element in most graphical games. This
 *	benchmarks test the ability how fast could browser handle texture
 *	binding and uploading with mipmap disabled.
 *
 */

var TextureLoadingWithoutMipmap = {}

TextureLoadingWithoutMipmap.init = function() {
}

TextureLoadingWithoutMipmap.runBench = function() {
	var canvas = document.createElement("canvas");
	var gl = canvas.getContext("webgl");
	var start, time
	var RUN_TIME = 20;
	var runtime = RUN_TIME;

	function bindTexture() {
		var texture;

		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);

		gl.finish();

		runtime--;
		if (runtime === 0) {
			time = Date.now() - start;
			window.postMessage({
				resultName: "time(ms)",
				resultValue: (time / RUN_TIME)
			}, "*");
		} else {
			bindTexture();
		}
	}

	var image = new Image();
	image.onload = function() {
		start = Date.now();
		bindTexture();
	}
	image.src = "./testImage.jpg";
}

TextureLoadingWithoutMipmap.clenaup = function() {
}
