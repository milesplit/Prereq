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
	var Me = this,
		_q = {},
		_listeners = { loading:[], loaded:[] },
		_head = d.head || d.getElementsByTagName('head')[0];
	// Private methods
	// fire a loaded or loading event
	var _fire = function(k, t) {
		_q[k][t] = true;
		Me.fire(t, { type:t, name:k, url:_q[k].url });
	};
	var isArray = function(o) {
  		return Object.prototype.toString.call(o) === '[object Array]';
	};
	// does the action of adding the script
	var _load = function(k) {
		_fire(k, 'loading');
		if (_q[k].url) {
			var s = d.createElement('script');
			s.src=_q[k].url;
			s.type='text/javascript';
			s.async='async';
			s.onload = s.onreadystatechange = function() {
				if (!s.readyState || /loaded|complete/.test(s.readyState)) {
					s.onload = s.onreadystatechange = null;
					_fire(k, 'loaded');
				}
			}
			_head.appendChild(s);
		} else {
			_fire(k, 'loaded');
		}
	};
	// tests if a list of requirements are done loading
	var _areLoaded = function(list) {
		var done = true;
		if (isArray(list)) {
			for (var i=0; i < list.length; i++) {
				console.log(list[i]);
				if (!_q[list[i]].loaded) {
					done = false
					break;
				}
			}
		} else if (!_q[list].loaded) {
			done = false;
		}
		return done;
	};
	// adds requirements to load queue
	Me.add = function() {
		var l = arguments.length;
		for (var i=0; i < l; i++) {
			var o = arguments[i];
			if (!o.name) o.name=i;
			if (!_q[o.name]) {
				_q[o.name] = { name:o.name, url:o.url, loading:false, loaded:false };
				_load(o.name);
			}
		}
		return Me;
	}
	// Either fire callback right away if all are done or set a listener to wait
	Me.after = function(m, f) {
		if (_areLoaded(m)) {
			f();
			return Me;
		}
		var done = false;
		Me.on('loaded', function() {
			if (!done && _areLoaded(m)) {
				f();
				done = true;
			}
		});
		return Me;
	};
	// set listener
	Me.on = function(type, f) {
		_listeners[type].push(f);
	};
	// fire event
	Me.fire = function(type, o) {
		var l = _listeners[type].length;
		for (var i=0; i < l; i++) {
			_listeners[type][i](o);
		}
	};
	return Me;
})(document);
