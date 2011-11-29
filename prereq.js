/*prereq1.11|MIT*/
// prereq.js
// Version - 1.11
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
	var Me = {},	// self-reference
		t=true,f=false,
		_last, // last module
		_scriptQ = {},	// queue of scripts
		_subscriptions = {},	// subscriptions 
		_isArray = function(o) { return {}.toString.call(o) == '[object Array]' }, // test for array
		_isFunction = function(o) { return (typeof o == 'function') }, // test for function
		_isObject = function(o) { return o instanceof Object }, // test for function
		_arrayify = function(a) { return (a) ? ((_isArray(a)) ? a : [a]) : [] },
		_functionize = function(a) { return (_isFunction(a)) ? a : function(){} },
		_tag = (function(){	var scripts = d.getElementsByTagName('script'); return scripts[scripts.length-1] })(),
		_baseDir = (function(){ return _tag ? _tag.getAttribute('data-main') || '' : '' })(),
		_head = d.head || d.getElementsByTagName('head')[0], // head
		_js = /\.js$/, // regex for ending .js
		_sep = '_',
		// Small pubsub
		_publish = function(name) {
			// make sure subscription is initialized
			_subscriptions[name] = _subscriptions[name] || [];
			// mark as loaded
			_scriptQ[name].l = t;
			// publish to all subscribers
			for (var i=0; i < _subscriptions[name].length; i++) {
				_subscriptions[name][i](_scriptQ[name].e);
			}
			// unsubscribe all
			_subscriptions[name] = [];
		},
		// Add to queue
		_qModule = function(name, path) {
			if (!_scriptQ[name]) {
				// add to queue ... n=name, u=array of urls, l=loaded?, e=exports (from module)
				_scriptQ[name] = { n:name, u:path, l:f, e:{} };
				// Loop through array and add each
				for (var i=0; i < path.length; i++) {
					// listen for this to complete
					(path[i] != name) &&
						Me.subscribe(path[i], function(){
							Me.loaded(path) && _publish(name);
						});
					// load it
					_includeScript(path[i], path[i]);
				}
			}
		},
		// include script and publish event once loaded
		_includeScript = function(name, path) {
			var path = (path || name), path = _js.test(path) ? path : path + '.js',
				path = (path.charAt(0) === '/' || path.match(/^\w+:/) ? '' : _baseDir) + path;
			// create script element
			var script = d.createElement('script');
			script.src = path;
			script.async = t;
			script.id = _sep + name;
			// add it to queue
			_scriptQ[name] = { n:name, u:path, l:f, e:{} };
			// listen for loaded
			script.onload = script.onreadystatechange = function() {
				var rs = script.readyState;
				if (!rs || (/loaded|complete/).test(rs)) {
					// kill onload listener
					script.onload = script.onreadystatechange = null;
					// loaded
					_publish(name);
				}
			};
			// add it to the end of the document head
			_head.appendChild(script);
		};
	// Require
	Me.require = function(a, b, c) {
		var name = [],	// this will start as an array, but will be concatenated
			path = [],
			callback = _functionize(c),
			deps = [];
		// handle overloading
		(arguments.length == 2) &&
			_isFunction(b) ? (callback = b) : (deps = _isArray(b) ? b : _arrayify(b));
		// normalize
		if (_isObject(a)) {
			for (k in a) {
				name.push(k);
				_isArray(a[k]) ? (path = path.concat(a[k])) : path.push(a[k]);
			}
			name = name.join(_sep);
		} else {
			path = _arrayify(a);
			name = path.join(_sep).replace(_js, '');
		}
		// once loaded
		var ready = function(){
			// done?
			if (Me.loaded(name)) {
				// yes, so hit the callback immediately
				callback(_scriptQ[name].e);
			} else {
				// once it loads, hit callback
				Me.subscribe(name, callback);
				// put it in the queue if it's not already
				_qModule(name, path);
			}
		};
		// dependencies loaded
		Me.loaded(deps) ? ready() : Me.require(deps, ready);
		_last = name;
		return Me;
	};
	// failover option
	Me.failover = function(url, timeout) {
		// recall last module referenced by require
		var module = _scriptQ[_last], timeout = (timeout > 0) ? timeout : 5000; // default timeout is 5 seconds
		if (module) {
			// Set timer for when to go to failover
			var timer = setTimeout(function(){
				// remove old script tag from head
				_head.removeChild(d.getElementById(_sep + _last));
				// add new script tag
				_includeScript(_last, url);
			}, timeout);
			// If it does load, then kill timer
			Me.subscribe(_last, function(){
				clearTimeout(timer);
			});
		}
	};
	// loaded?
	Me.loaded = function(moduleNames) {
		// make moduleNames an array, if it's not already
		moduleNames = _arrayify(moduleNames);
		// loop through it to check if done with each
		for (var i=0; i < moduleNames.length; i++) {
			if (!(function(name) {
				if (!_scriptQ[name]) { return f; }
				else { return _scriptQ[name].l; }
			})(moduleNames[i])) {
				return f;
			}
		}
		return (moduleNames.length == 0) ? _scriptQ : t;
	};
	// Pubsub subscribe... decided to make public on Alan's suggestion, easy enough
	Me.subscribe = function(name, callback) {
		_subscriptions[name] = _subscriptions[name] || [];
		_subscriptions[name].push(callback);
	};
	// CommonJS type module definition
	Me.define = function(name, b, c){
		var exports = {};
		c ?	Me.require(b, function(){ c(exports); }) : b(exports);
		_scriptQ[name].e = exports;
		return Me;
	};
	// return self
	return Me;
})(document);