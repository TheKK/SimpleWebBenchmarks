var TextureLoadingCompressed = {}

TextureLoadingCompressed.init = function() {
}

TextureLoadingCompressed.runBench = function() {
	var canvas = document.createElement("canvas");
	var gl = canvas.getContext("webgl");
	var start, time
	var RUN_TIME = 20;
	var runtime = RUN_TIME;
	var ct = gl.getExtension("WEBGL_compressed_texture_s3tc");
	var formats = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);
	var i, dxt5Supported = false;

	for (i in formats) {
		if (formats[i] == ct.COMPRESSED_RGBA_S3TC_DXT5_EXT) {
			dxt5Supported = true;
		}
	}

	if (dxt5Supported === false) {
		window.postMessage({time: "None"}, "*");
		return;
	}

	function bindTexture() {
		var texture;

		texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.compressedTexImage2D(gl.TEXTURE_2D, 0, ct.COMPRESSED_RGBA_S3TC_DXT5_EXT, image.width, image.height, 0, image); 
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST_MIPMAP_NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
		Rl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);

		runtime--;
		if (runtime === 0) {
			time = Date.now() - start;
			window.postMessage({time: (time / RUN_TIME) / 1000}, "*");
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

TextureLoadingCompressed.clenaup = function() {
}
