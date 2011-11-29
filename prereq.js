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
	var Me = {},																	// self-reference
		t=true,f=false,																// shortcuts for true/false
		_last, 																		// to save name of last module in require
		_scriptQ = {},																// queue of scripts
		_subscriptions = {},														// pubsub subscriptions 
		_isArray = function(o) { return {}.toString.call(o) == '[object Array]' }, 	// test for array
		_isFunction = function(o) { return (typeof o == 'function') }, 				// test for function
		_isObject = function(o) { return o instanceof Object }, 					// test for function
		_arrayify = function(a) { return (a) ? ((_isArray(a)) ? a : [a]) : [] },	// turn something into an array
		_functionize = function(a) { return (_isFunction(a)) ? a : function(){} },	// turn something into a function
		_tag = (function(){	var scripts = d.getElementsByTagName('script'); return scripts[scripts.length-1] })(),	// get calling script tag
		_baseDir = (function(){ return _tag ? _tag.getAttribute('data-main') || '' : '' })(),	// get data-main attribute from script tag
		_head = d.head || d.getElementsByTagName('head')[0], 						// get head or location to put scripts
		_js = /\.js$/, 																// regex for ending .js
		_sep = '_',																	// character to use as separator (saves a few bytes too)
		// SMALL PUBSUB
		_publish = function(name) {													// make sure subscription is initialized
			_subscriptions[name] = _subscriptions[name] || [];						// get subscriptions for this module
			_scriptQ[name].l = t;													// mark as loaded
			for (var i=0; i < _subscriptions[name].length; i++) {					// loop through to all subscribers
				_subscriptions[name][i](_scriptQ[name].e);							// hit the callback, with exports data if applicable
			}
			_subscriptions[name] = [];												// unsubscribe all
		},
		// Add to queue
		_qModule = function(name, path) {
			if (!_scriptQ[name]) {													// if module does not yet exist in queue
				_scriptQ[name] = { n:name, u:path, l:f, e:{} };						// n=name, u=array of urls, l=loaded?, e=exports (from module)
				for (var i=0; i < path.length; i++) {								// Loop through array and add each
					(path[i] != name) &&											// if group doesnt have same name as this one script
						Me.subscribe(path[i], function(){							// listen for this to complete
							Me.loaded(path) &&										// if all are loaded
								_publish(name);										// then broadcast that entire group is loaded
						});
					_includeScript(path[i], path[i]);								// load this script
				}
			}
		},
		// include script and publish event once loaded
		_includeScript = function(name, path) {
			var path = (path || name),												// use name if path not set
				path = _js.test(path) ? path : path + '.js',						// if no js at end then add it
				path = (path.charAt(0) === '/' || path.match(/^\w+:/) ?				// is path an absolute path?
					'' : _baseDir) + path;											// if not then prepend baseDir
			var script = d.createElement('script');									// create script element
			script.src = path;														// set src to path
			script.async = t;														// load asynchronously
			script.id = _sep + name;												// set an id so we can call it later
			_scriptQ[name] = { n:name, u:path, l:f, e:{} };							// add it to queue
			script.onload = script.onreadystatechange = function() {				// listen for changes to readyState
				var rs = script.readyState;											// shortcut to readyState (saves a few bytes)
				if (!rs || (/loaded|complete/).test(rs)) {							// is it done loading?
					script.onload = script.onreadystatechange = null;				// kill onload listener
					_publish(name);													// hit pubsub to let everyone know and mark it loaded
				}
			};
			_head.appendChild(script);												// add it to the end of the document head
		};
	// Require
	Me.require = function(a, b, c) {
		var name = [],																// name will start as an array, but will be concatenated
			path = [],																// path is an array containing zero or more scripts to load
			callback = _functionize(c),												// callback function once loaded
			deps = [];																// dependencies array
		(arguments.length == 2) &&													// if two arguments, handle overloading
			_isFunction(b) ?														// is second argument a function?
				(callback = b) :													// if so then it is the callback
				(deps = _isArray(b) ? b : _arrayify(b));							// if not then it is the dependencies
		if (_isObject(a)) {															// is first argument an object?
			for (k in a) {															// yes, so loop through each key/value pair
				name.push(k);														// add each key to the name array
				_isArray(a[k]) ?													// is the value an array?
					(path = path.concat(a[k])) :									// if so merge it into the path array
					path.push(a[k]);												// if not then add this value to the path array
			}
			name = name.join(_sep);													// concatenate all named keys into the name, separated by _sep
		} else {
			path = _arrayify(a);													// first argument was not an object, so make it an array
			name = path.join(_sep)													// so we need a name, so use the path array merged together, separated by _sep
				.replace(_js, '');													// trim any trailing .js from the name
		}
		var afterDepsLoaded = function(){											// will call this function once dependencies are loaded
			if (Me.loaded(name)) {													// has this module already loaded?
				callback(_scriptQ[name].e);											// yes, so hit the callback immediately
			} else {																// no, hasn't loaded yet...
				Me.subscribe(name, callback);										// ... so subscribe to the pubsub event for when it loads
				_qModule(name, path);												// and then put it in the queue to be loaded if it's not already
			}
		};
		Me.loaded(deps) ?															// are dependencies loaded yet?
			afterDepsLoaded() :														// yes, so proceed
			Me.require(deps, afterDepsLoaded);										// nope... so let's wait for them to load
		_last = name;																// save name of this module, so we can add failovers
		return Me;
	};
	// failover option
	Me.failover = function(url, timeout) {
		var module = _scriptQ[_last],												// recall last module referenced by require
			timeout = (timeout > 0) ? timeout : 5000; 								// default timeout is 5 seconds
		if (module) {																// did we find the last module?
			var timer = setTimeout(function(){										// Set timer for when to go to failover
				_head.removeChild(d.getElementById(_sep + _last));					// remove old script tag from head
				_includeScript(_last, url);											// add new script tag
			}, timeout);
			Me.subscribe(_last, function(){											// listen for this module, in case it loads prior to timeout
				clearTimeout(timer);												// if it does then kill the timer
			});
		}
		return Me;
	};
	// loaded?
	Me.loaded = function(moduleNames) {												// Check on these modules/scripts to see if they have loaded
		moduleNames = _arrayify(moduleNames);										// make moduleNames an array, if it's not already
		for (var i=0; i < moduleNames.length; i++) {								// loop through each module
			if (!(function(name) {													// has this specific one loaded?
				if (!_scriptQ[name]) { return f; }									// if it's not even in the queue yet then the answer is no
				else { return _scriptQ[name].l; }									// if it is in the queue then the answer is the value of the l property
			})(moduleNames[i])) {													// ask above function about this specific module
				return f;															// if any of them say they'd not loaded yet then return overall false
			}
		}
		return (moduleNames.length == 0) ?											// were no arguments passed in?
			_scriptQ :																// then they want a list of all modules and their status
			t;																		// argument passed in and we made it this far... which means all were loaded
	};
	// Pubsub subscribe... decided to make public on Alan's suggestion, easy enough
	Me.subscribe = function(name, callback) {
		_subscriptions[name] = _subscriptions[name] || [];							// if no subscribers to this module yet, create the array
		_subscriptions[name].push(callback);										// add this subscriber
		return Me;
	};
	// CommonJS type module definition
	Me.define = function(name, b, c){
		var exports = {};															// Create exports object
		c ?																			// If three arguments?
			Me.require(b, function(){ c(exports); }) : 								// Make sure deps are loaded, then call the callback
			b(exports); 															// No deps, so just hit the callback, passing in exports
		_scriptQ[name].e = exports; 												// Store the output so that we can pass it to subscribers
		return Me;
	};
	return Me;																		// return self
})(document);