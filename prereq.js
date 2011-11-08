/*prereq1.0|MIT*/
// prereq.js
// Version - 1.02
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
		_h = d.head || d.getElementsByTagName('head')[0],	// head
		_a = function(o) { return {}.toString.call(o) == '[object Array]'; },
		_f = function(o) { return (typeof o == 'function'); };
	// Publish (n=queue name)
	var _p = function(n) {
		if (_q[n]) {
			// Mark it in the queue
			_q[n].l = true;
			// Loop through and call any listeners
			var i = 0;
			while (i < _l.length) {
				// callback to event subscriber
				if (_l[i]()) { // if the callback returns true, remove it
					_l.splice(i, 1);
				} else { i++; }
			}
		}
	};
	var _s = function(o) {
		if (o.u) {
			// create script element
			var s = d.createElement('script');
			s.src=o.u;
			s.async=true;
			_q[o.n] = o;
			// set up listener for when it's loaded
			s.onload = s.onreadystatechange = function() {
				if (!s.readyState || (/loaded|complete/).test(s.readyState)) {
					s.onload = s.onreadystatechange = null;
					_p(o.n);
					o.c(o);
				}
			};
			// add it to the end of the document head
			_h.appendChild(s);
			return;
		}
		_p(o.n);
	};
	// Add a script to queue
	// Overloaded... a only then a is a string url, a and b then a is the name and b is the url
	Me.add = function(a, b, c) {
		// initialize
		var l = arguments.length, o = { n:a, u:a, l:false, c:function(){}, a:[] };
		// handle overloding
		if (l > 2) {
			o.u=b;
			if (_f(c)) {
				o.c=c;
			} else {
				o.a=c;
			}
		} else if (l == 2) {
			if (_f(b)) {
				o.u=a;
				o.c=b;
			} else {
				o.u=b;
			}
		}
		// load script
		Me.after(o.a, function() {
			_s(o);
		});
		return Me;
	};
	// Either fire callback right away if all are done or set a listener to wait
	// n can be a string name for a single check or an array for checking if multiple prereqs needed
	Me.after = function(n, f) {
		// is it already done?
		if (Me.loaded(n)) {
			// yes, so hit the callback immediately and then return self-reference
			f();
		} else {
			// this will fire any time a new script loads
			_l.push(function() {
				if (Me.loaded(n)) {
					f();
					return true;
				}
				return false;
			}); // the _l loop passes in a param, which we're not currently passing along
		}
		// return self reference as always for chaining
		return Me;
	};
	// Add a css file (no callbacks)
	Me.css = function(a) {
		var s = d.createElement('link');
		s.rel = 'stylesheet';
		s.href = a;
		_h.appendChild(s);
		// return self reference as always for chaining
		return Me;
	};
	// loaded?
	Me.loaded = function(n) {
		// make n an array, if it's not already
		if (!n) { return true; }
		if (!_a(n)) { n = [n]; }
		// loop through it to check if done with each
		for (var i=0; i < n.length; i++) {
			if (!(function(n) {
				if (!_q[n]) { return false; }
				else { return _q[n].l; }
			})(n[i])) {
				return false;
			}
		}
		return true;
	};
	// return self
	return Me;
})(document);