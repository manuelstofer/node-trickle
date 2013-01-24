;(function () {

    var VERSION = '0.0.1';

    var Trickle = function (interval, empty) {
        this._interval = interval;
        this._requests = [];
        this._lastRun = 0;
        this._paused = false;
        this._emptyfn = empty;
    };

    Trickle.prototype = {

        trickle: function (callback) {
            this._requests.push(callback);
            this._runNextTick();
           },

        shove: function (callback) {
            this._requests.unshift(callback);
            this._runNextTick();
        },

        isEmpty: function () {
            return this._requests.length === 0;
        },

        pause: function () {
            this._paused = true;
        },

        resume: function () {
            this._paused = false;
            this._run();
        },

        _runNextTick: function () {
            var self = this;
            var run = function () { self._run(); };
            if (typeof module != 'undefined') {
                process.nextTick(run);
            } else {
                setTimeout(run, 0);
            }
        },

        _run: function () {
            if (this._paused) return;

            var now = (new Date()).getTime();

            if (this._isReady()) {
                this._requests.shift().call();
                this._lastRun = now;

                if (!this.isEmpty()) {
                    this._plan();
                }

            } else if (!this._planed) {
                this._plan(this._lastRun + this._interval - now);
            }

            if (this.isEmpty() && this._emptyfn) {
                this._emptyfn();
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

    if (typeof module != 'undefined') {
        module.exports = {
            VERSION: VERSION,
            Trickle: Trickle
        };
    } else {
        window.Trickle = Trickle;
    }

}).call(this);
