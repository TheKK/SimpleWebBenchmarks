/*
 * Goal:
 * 	Test object creation and destruction throughput.
 *
 * 	In games, it's command to create objects, like enemy or bullets, at run
 * 	time. So how fast javascript engine creates and delete object directly
 * 	affect our gaming experience.
 *
 * How:
 */

var DummyObject = function() {
	self.hp_ = 123;
	self.mp_ = 321;
	self.atk_ = 32;
	self.def_ = 10;
	self.dex_ = 23;

	self.posX = 0;
	self.posY = 0;
	self.velX = 12;
	self.velY = -9;

	return {
		update: function() {
			self.posX += self.velX;
			self.posY += self.velY;
		},

		render: function() {
		},

		attack: function(target) {
			target.hp() -= (self.atk_ - target.def());
		}
	};
}

function init() {
}

function runBenchmark() {
	for (var i = 0; i < 100; ++i) {
		var dummyList = [];

		for (var j = 0; j < 1000; ++j)
			dummyList.push(new DummyObject());

		delete dummyList;
	}
}

function cleanup() {
}
