Trickle
=======

For node.js

Trickle is to limit executions to a certain amount of executions within
a certain amount of time. 

For example, some APIs allow only 1 request per second. Since JavaScript
code is asynchronous, it could happen that we send 500 requests within
half a second. Trickle prevents this from happening by keeping our
functions and executing them when the time is right.

Example
-------

1 execution per 1000 milliseconds:

```javascript
var Trickle = require('trickle').Trickle;

// create trickle with interval of 1000ms
// the callback is called whenever the queue is empty
var trickle = new Trickle(1000, function (){
	console.log('empty');
});

// will output drop, drop, drop
for (var i = 0; i < 3; i++) {
	trickle.trickle(function () {
		console.log('drop');
	});
}

// trickle can be paused() and resumed()
// will output pause, wait 3sec and resume
trickle.trickle(function () {

	console.log('pause');
	trickle.pause();

	setTimeout(function(){
		console.log('resume');
		trickle.resume();
	}, 3000);
});

// more drops is printed right after (without waiting)
trickle.trickle(function () {
	console.log('more drops');
});


// using shove you can add a task in front of the queue
trickle.shove(function () {
	console.log('first');
});

```

The above code will output: 

```
first			@0 ms
drop			@1000 ms
drop			@2000 ms
drop			@3000 ms
pause			@4000 ms
resume			@5000 ms
more drops		@5000 ms
empty			@5000 ms

```

