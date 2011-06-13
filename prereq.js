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
			_l[t][i]({ type:t, name:n, url:_q[n].url });
		}
	};
	// is array
	var _a = function(o) {
  		return {}.toString.call(o) == '[object Array]';
	};
	// Ready? (list: array or string)
	var _r = function(list) {
		var d = true;
		if (_a(list)) {
			for (var i=0; i < list.length; i++) {
				if (!_q[list[i]].loaded) {
					d = false
					break;
				}
			}
		} else if (!_q[list].loaded) {
			d = false;
		}
		return d;
	};
	// adds requirements to load queue
	Me.add = function(a, b) {
		if (!b) {
			b=a;
			a=_q.length;
		}
		_q[a] = { name:a, url:b, loading:false, loaded:false };
		_f(a, 'loading');
		if (b) {
			var s = d.createElement('script');
			s.src=b;
			s.type='text/javascript';
			s.async='async';
			s.onload = s.onreadystatechange = function() {
				if (!s.readyState || /loaded|complete/.test(s.readyState)) {
					s.onload = s.onreadystatechange = null;
					_f(a, 'loaded');
				}
			}
			_h.appendChild(s);
		} else {
			_f(a, 'loaded');
		}
		return Me;
	}
	// Either fire callback right away if all are done or set a listener to wait
	Me.after = function(m, f) {
		if (_r(m)) {
			f();
			return Me;
		}
		var d = false;
		Me.on('loaded', function() {
			if (!d && _r(m)) {
				f();
				d = true;
			}
		});
		return Me;
	};
	// set listener (type, callback)
	Me.on = function(t, f) {
		_l[t].push(f);
	};
	return Me;
})(document);
