var VERSION = '0.0.1';

var Trickle = function (interval, callback) {
	this._interval = interval;
	this._requests = [];
	this._lastRun = 0;
	this._callback = callback;
};

Trickle.prototype = {

	trickle: function (callback) {
		var self = this;
		this._requests.push(callback);
		process.nextTick(function () { self._run(); });
	},

	isEmpty: function () {
		return this._requests.length === 0;
	},

	_run: function () {
		var now = (new Date()).getTime();
				
		if (this._isReady()) {
			this._requests.shift().call();
			this._lastRun = now;

			if (!this.isEmpty()) {
				this._plan();
			}

		} else if (!this._planed){
			this._plan(this._lastRun + this._interval - now);
		}

		if(this.isEmpty() && this._callback){
			this._callback();
		}
	},

	_plan: function (to) {
		var self = this;
		self._planed = true;
		setTimeout(function () {
				self._planed = false; self._run();
			}, to || this._interval
		);
	},

	_isReady: function () {
		return this._lastRun === null || this._lastRun + this._interval <= (new Date()).getTime();
	}
};

module.exports = {
	VERSION: VERSION,
	Trickle: Trickle
};
