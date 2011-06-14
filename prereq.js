/*prereq1.0|MIT*/
// prereq.js
// Version - 1.0
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
// Alan Szlosek - aszlosek[a]milesplit.com
//
// http://github.com/milesplit/Prereq
//
// License: MIT
//
// Please minify before use.
//

// Add Prereq to global namespace as a self-instantiating object
var Prereq = (function(d) {
	// Private variables
	var Me = this,	// self-reference
		_q = {},	// queue of scripts
		_l = [],	// listeners
		_h = d.head || d.getElementsByTagName('head')[0];	// head
	// Private: Fire Event (n=queue name)
	var _f = function(n) {
		console.log('done: ' + n);
		// Mark it in the queue
		_q[n].loaded = true;
		// Loop through and call any listeners
		var i = 0;
		while (i < _l.length) {
			// callback to event subscriber
			if ( _l[i]() ) { // if the callback returns true, remove it
				_l.splice(i, 1);
				
			} else i++;
		}
	};
	// is array?
	var _a = function(o) {
  		return {}.toString.call(o) == '[object Array]';
	};
	// exists in q?
	var _e = function(n) {
		return (n in _q);
	};
	// Ready? (n: array or name string)
	var _r = function(n) {
		var d = true; // done? has loaded all scripts in n
		// make n an array, if it's not already
		if (!_a(n)) n = [n];
		// loop through it to check if done with each
		for (var i=0; i < n.length; i++) {
			if (!Me.isLoaded(n[i])) {
				d = false;
				break;
			}
		}
		// return done status
		return d;
	};
	// Add a script to queue
	// Overloaded... a only then a is a string url, a and b then a is the name and b is the url
	Me.add = function(a, b, c) {
		// adjust for overloading if name was set or not
		if (!b) {
			b=a;
			a=_q.length;  // no name was set so we just need to give it a name, set it to its array position
		}
		// at this point a is always name and b is always url
		_q[a] = { name:a, url:b, loaded:false };  // add it to the queue
		if (c) {
			console.log('waiting: ' + b);
			Me.after(c, function() { Me.add(a, b); });
		} else if (b) {
			console.log('loading: ' + b);
			// create script element
			var s = d.createElement('script');
			s.src=b;
			s.type='text/javascript';
			s.async=true;
			// set up listener for when it's loaded
			s.onload = s.onreadystatechange = function() {
				if (!s.readyState || /loaded|complete/.test(s.readyState)) {
					s.onload = s.onreadystatechange = null;
					_f(a);
				}
			}
			// add it to the end of the document head
			_h.appendChild(s);
		} else {
			// in some cases we may set the url to null and we'll just fire loaded right away
			_f(a);
		}
		// return self reference as always for chaining
		return Me;
	}
	// Either fire callback right away if all are done or set a listener to wait
	// n can be a string name for a single check or an array for checking if multiple prereqs needed
	Me.after = function(n, f) {
		// is it already done?
		if (_r(n)) {
			// yes, so hit the callback immediately and then return self-reference
			f();
			return Me;
		}
		// this will fire any time a new script loads
		_l.push(function() {
			// when a new script has loaded, let's check if we're done with all our prereqs
			if (_r(n)) {
				f(); // callback
				return true; // return true to tell _l loop to remove this callback
			}
			return false;
		}); // the _l loop passes in a param, which we're not currently passing along
		// return self reference as always for chaining
		return Me;
	};
	// check if it has loaded
	Me.isLoaded = function(n) {
		if (!_e(n)) return false;
		else if (!_q[n].loaded) return false;
		else return true;
	}
	// return self
	return Me;
})(document);
