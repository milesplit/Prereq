/*prereq1.11|MIT*/
// prereq.js
// Version - 1.12
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
		_modules = {},																// queue of scripts
		_isArray = function(o) { return {}.toString.call(o) == '[object Array]' }, 	// test for array
		_isFunction = function(o) { return (typeof o == 'function') }, 				// test for function
		_isObject = function(o) { return o instanceof Object }, 					// test for function
		_arrayify = function(a) { return a ? (_isArray(a) ? a : [a]) : [] },		// turn something into an array
		_functionize = function(a) { return _isFunction(a) ? a : function(){} },	// turn something into a function
		_tag = (function(){															// get calling script tag
			var scripts = d.getElementsByTagName('script');
			return scripts[scripts.length-1]
		})(),
		_baseDir = (function(){														// get data-main attribute from script tag
				return _tag ?														// did we find the script element?
					_tag.getAttribute('data-main') || '' : ''						// return it or empty string
		})(),
		_head = d.head || d.getElementsByTagName('head')[0], 						// get head or location to put scripts
		_js = /\.js$/, 																// regex for ending .js
		_sep = '_',																	// character to use as separator (saves a few bytes too)
		// SMALL PUBSUB
		_publish = function(name) {													// make sure subscription is initialized
			var module = _initModule(name),											// get module
				i=0,																// set iterator
				len=module.s.length;												// set length
			module.l = t;															// mark as loaded
			for (; i < len; i++) {													// loop through to all subscribers
				module.s[i](module.e);												// hit the callback, with exports data if applicable
			}
			module.s = [];															// unsubscribe all
		},
		// get/initialize the module
		_initModule = function(name){
			return _modules[name] = _modules[name] ||								// get it
				{																	// or set it
					l:f,															// loaded?
					t:f,															// script tag added?
					e:{},															// exports
					s:[]															// subscribers
				}
		},
		// include script and publish event once loaded
		_includeScript = function(name, path) {
			_initModule(name).t=t;													// add it to queue
			path = (path.toString().charAt(0) === '/' || /^\w+:/.test(path)) ?					// is path an absolute path?
					path :															// then leave it alone
					_baseDir + path	+												// if not then prepend baseDir
					(_js.test(path) ? '' : '.js');									// append .js if not present
			var script = d.createElement('script');									// create script element
			script.src = path;														// set src to path
			script.async = t;														// load asynchronously
			script.id = _sep + name;												// set an id so we can call it later
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
		var name = [],														// name will start as an array, but will be concatenated
			path = [],														// path is an array containing zero or more scripts to load
			callback = _functionize(c),										// callback function once loaded
			deps = [],														// dependencies array
			afterDepsLoaded = function(module){								// will call this function once dependencies are loaded
				module = _initModule(name);									// get module
				Me.loaded(name) ?											// has this module already loaded?
					callback(module.e) : 									// yes, so hit the callback immediately
					(function(){											// no, hasn't loaded yet...
						Me.subscribe(name, callback);						// ... so subscribe to the pubsub event for when it loads
						for (var i=0, len=path.length; i < len; i++) {		// Loop through and each to queue
							(path[i] != name) &&							// if group doesnt have same name as this one script
								Me.subscribe(path[i], function(){			// listen for this to complete
									Me.loaded(path) &&						// if all are loaded
										_publish(name);						// then broadcast that entire group is loaded
								});
							!module.t &&									// if script tag hasn't already been added
								_includeScript(path[i], path[i]);			// load this script
						}
					})();
			};
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
		Me.loaded(deps) ?															// are dependencies loaded yet?
			afterDepsLoaded() :														// yes, so proceed
			Me.subscribe(deps, afterDepsLoaded);							 		// nope... so let's wait for them to load
		_last = name;																// save name of this module, so we can add failovers
		return Me;
	};
	// failover option
	Me.failover = function(url, timeout) {
		timeout = timeout || 5000; 													// default timeout is 5 seconds
		if (_modules[_last]) {														// did we find the last module?
			var timer = setTimeout(function(){										// Set timer for when to go to failover
				_head.removeChild(d.getElementById(_sep + _last));					// remove old script tag from head
				_includeScript(_last, url);											// add new script tag
			}, timeout);
			return Me.subscribe(_last, function(){									// listen for this module, in case it loads prior to timeout
				clearTimeout(timer);												// if it does then kill the timer
			});
		}
	};
	// loaded?
	Me.loaded = function(names, callback) {					// Check on these modules/scripts to see if they have loaded
		names = _arrayify(names);							// make paths an array, if it's not already
		for (var i=0, len=names.length;	i < len; i++) {		// loop through module names
			if (!_initModule(names[i]).l) {					// if module is not loaded
				// .... this is where we need to add subscribe listener to test once whole thing loaded to hit callback
				return f;									// return false now
			}
		}
		return (len == 0) ?									// were no arguments passed in?
			_modules :										// then they want a list of all modules and their status
			(function(){									// if arguments and we made it this far then everything loaded
				_isFunction(callback) && callback();		// hit callback if provided
				return t;									// return true to indicate all were loaded
			})();											
	};
	// Pubsub subscribe
	Me.subscribe = function(a, b) {
		b ? t :												// allow overloading, if one argument
			(b=a) &&										// then a is the callback (normally b)
			(a=_last);										// and use the last module referenced
		var a = _arrayify(a),								// make a always an array
			i=0, len=a.length;								// initialize for loop variables
		for (; i < len; i++) {								// loop through module names
			_initModule(a[i]).s.push(b);					// add this subscriber
		}
		return Me;
	};
	// CommonJS type module definition
	Me.define = function(name, b, c){
		var exports = {};									// Create exports object
		c ?													// If three arguments?
			Me.require(b, function(){ c(exports); }) : 		// Make sure deps are loaded, then call the callback
			b(exports); 									// No deps, so just hit the callback, passing in exports
		_modules[name].e = exports; 						// Store the output so that we can pass it to subscribers
		return Me;
	};
	// CSS convinience method
	Me.style = function(a){
		a = _arrayify(a);
		var i=0, len=a.length;
		for (; i<len; i++) {
			var l = d.createElement('link');
			l.rel = 'stylesheet';
			l.href = a[i];
			_head.appendChild(l);
		}
		return Me;
	};
	
	Me.cleanup = function() {
		_last = null;
		_modules = {};
	};
	return Me;												// return self
})(document);