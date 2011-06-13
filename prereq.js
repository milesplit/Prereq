/*prereq1.0|MIT*/
// prereq.js
// Version - 1.0
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
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
		_l = { loading:[], loaded:[] },	// listeners
		_h = d.head || d.getElementsByTagName('head')[0];	// head
	// Private: Fire Event (n=queue name, t=event type)
	var _f = function(n, t) {
		// Mark it in the queue
		_q[n][t] = true;
		// Loop through and call any listeners
		var l = _l[t].length;
		for (var i=0; i < l; i++) {
			// callback to event subscriber
			_l[t][i]({ type:t, name:n, url:_q[n].url });
		}
	};
	// is array?
	var _a = function(o) {
  		return {}.toString.call(o) == '[object Array]';
	};
	// Ready? (n: array or name string)
	var _r = function(n) {
		var d = true; // done? has loaded all scripts in n
		if (_a(n)) {
			// If n is an array then loop through it to check if done with each
			for (var i=0; i < n.length; i++) {
				if (!_q[n[i]].loaded) {
					// not done with this one so set d to false and end loop
					d = false
					break;
				}
			}
		} else if (!_q[n].loaded) {
			// not done with this one so set d to false
			d = false;
		}
		// return done status
		return d;
	};
	// Add a script to queue
	// Overloaded... a only then a is a string url, a and b then a is the name and b is the url
	Me.add = function(a, b) {
		// adjust for overloading if name was set or not
		if (!b) {
			b=a;
			a=_q.length;  // no name was set so we just need to give it a name, set it to its array position
		}
		// at this point a is always name and b is always url
		_q[a] = { name:a, url:b, loading:false, loaded:false };  // add it to the queue
		_f(a, 'loading');  // fire event that it is in the process of loading
		if (b) {
			// create script element
			var s = d.createElement('script');
			s.src=b;
			s.type='text/javascript';
			s.async='async';
			// set up listener for when it's loaded
			s.onload = s.onreadystatechange = function() {
				if (!s.readyState || /loaded|complete/.test(s.readyState)) {
					s.onload = s.onreadystatechange = null;
					_f(a, 'loaded');
				}
			}
			// add it to the end of the document head
			_h.appendChild(s);
		} else {
			// in some cases we may set the url to null and we'll just fire loaded right away
			_f(a, 'loaded');
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
		// it is not ready yet, so lets set up a listener for when it's done
		var d = false;
		// this will fire any time a new script loads
		Me.on('loaded', function() {
			// when a new script has loaded, let's check if we're done with all our prereqs
			if (!d && _r(n)) {
				f();
				d = true; // this will stop it from firing again
			}
		});
		// return self reference as always for chaining
		return Me;
	};
	// set listener (type, callback)
	Me.on = function(t, f) {
		// add it to our listener array
		_l[t].push(f);
	};
	// return self
	return Me;
})(document);
