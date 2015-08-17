/*
 * Goal:
 * 	Test object creation and destruction throughput.
 *
 * 	In games, it's command to create objects, like enemy or bullets, at run
 * 	time. So how fast javascript engine creates and delete object directly
 * 	affect our gaming experience.
 *
 */

var DummyObject = function() {
	this.hp_ = 123;
	this.mp_ = 321;
	this.atk_ = 32;
	this.def_ = 10;
	this.dex_ = 23;

	this.posX = 0;
	this.posY = 0;
	this.velX = 12;
	this.velY = -9;

}

DummyObject.prototype.update = function() {
	this.posX += this.velX;
	this.posY += this.velY;
}

DummyObject.prototype.render = function() {
}

DummyObject.prototype.attack = function(target) {
	target.hp() -= (this.atk_ - target.def());
}

function init() {
}

function runBenchmark() {
	for (var i = 0; i < 1000; ++i) {
		var dummyList = [];

		for (var j = 0; j < 1000; ++j)
			dummyList.push(new DummyObject());
	}
}

function cleanup() {
}
