
var Prereq = (function(d) {
	var Me = this,
		_q = {},
		_listeners = { loading:[], loaded:[] },
		_head = d.head || d.getElementsByTagName('head')[0];
	var _loaded = function(k, t) {
		_q[k][t] = true;
		Me.fire(t, { type:t, name:k, url:_q[k].url });
	};
	var _load = function(k) {
		_fire(k, 'loeading');
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
	var _areLoaded = function(list) {
		var done = true;
		if ('length' in list) {
			for (var i=0; i < list.length; i++) {
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
	Me.add = function(a) {
		var l = a.length;
		for (var i=0; i < l; i++) {
			var o = a[i];
			if (!o.name) o.name=i;
			if (!_q[o.name]) {
				_q[o.name] = { name:o.name, url.o.url, loading:false, loaded:false };
				_load(o.name);
			}
		}
		return Me;
	}
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
	Me.on = function(type, f) {
		_listeners[type].push(f);
	};
	Me.fire = function(type, o) {
		var l = _listeners[type].length;
		for (var i=0; i < l; i++) {
			_listeners[type][i](o);
		}
	};
	return Me;
})(document);
