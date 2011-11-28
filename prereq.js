/*prereq1.1|MIT*/
// prereq.js
// Version - 1.1
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
		t=true,f=false,
		_scriptQ = {},	// queue of scripts
		_subscriptions = {},	// subscriptions
		_head = d.head || d.getElementsByTagName('head')[0],	// head
		_isArray = function(o) { return {}.toString.call(o) == '[object Array]'; }, // test for array
		_isFunction = function(o) { return (typeof o == 'function'); }, // test for function
		_arrayify = function(a) { return (a) ? ((_isArray(a)) ? a : [a]) : []; },
		_functionize = function(a) { return (_isFunction(a)) ? a : function(){}; },
		_js = /\.js$/; // regex for ending .js
	// Small pubsub
	var _publish = function(name) {
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
		}, _subscribe = function(name, callback) {
			_subscriptions[name] = _subscriptions[name] || [];
			_subscriptions[name].push(callback);
		};
	// Add to queue
	var _qModule = function(name, path) {
		if (!_scriptQ[name]) {
			// add to queue ... n=name, u=array of urls, l=loaded?, e=exports (from module)
			_scriptQ[name] = { n:name, u:path, l:f, e:{} };
			// Loop through array and add each
			for (var i=0; i < path.length; i++) {
				// listen for this to complete
				if (path[i] != name) {
					_subscribe(path[i], function(){
						if (Me.loaded(path)) {
							_publish(name);
						}
					});
				}
				// load it
				_includeScript(path[i], path[i]);
			}
		}
	};
	// include script and publish event once loaded
	var _includeScript = function(name, path) {
		var path = (path || name), path = _js.test(path) ? path : path + '.js';
		// create script element
		var script = d.createElement('script');
		script.src = path;
		script.async = t;
		// add it to queue
		_scriptQ[name] = { n:name, u:path, l:f, e:{} };
		// listen for loaded
		script.onload = script.onreadystatechange = function() {
			if (!script.readyState || (/loaded|complete/).test(script.readyState)) {
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
		var len = arguments.length,
			name = a,
			path = a,
			callback = _functionize(c),
			deps = [];
		// handle overloading
		if (len == 2) {	// two arguments
			_isFunction(b) ? (callback = b) : (path = b);
		} else if (len > 2) {
			path = b;
			deps = _isFunction(c) ? [] : c;
		}
		// normalize
		path = _arrayify(path);
		name = _arrayify(name).join('-').replace(_js, '');
		// once loaded
		var ready = function(){
			// done?
			if (Me.loaded(name)) {
				// yes, so hit the callback immediately
				callback(_scriptQ[name].e);
			} else {
				// once it loads, hit callback
				_subscribe(name, callback);
				// put it in the queue if it's not already
				_qModule(name, path);
			}
		};
		// dependencies loaded
		Me.loaded(deps) ? ready() : Me.require(deps, ready);
		return Me;
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
	// CommonJS type module definition
	Me.define = function(name, callback){
		var exports = {};
		callback(exports);
		_scriptQ[name].e = exports;
		return Me;
	};
	// return self
	return Me;
})(document);