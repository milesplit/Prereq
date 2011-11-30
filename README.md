Prereq
=============

Yes, another JavaScript loader. I know, I know.

Why?
-------

We looked at a lot of the ones out there. And really liked pieces of them, but we just didn't like the whole thing. Either
the syntax is convoluted and overly complex or they try to do too many things.

The goal of this project is to be simple all the way around...

* Focused in its purpose: don't get sucked into doing more than just loading scripts or trying to support ancient browsers. Prereq actively supports Chrome, Firefox, Safari, Opera, IE7+, and common modern mobile browsers.
* Speed and size. Keep it small under 2KB minified.
* Use simple syntax that supports dependencies, callbacks, and failover scripts.
* Asynchronous and micro-pubsub based.
* Support modules with CommonJS-ish syntax and dependencies defined in module.
* Independent from any other libraries.
* jQuery-like method chaining.

Version 1.1 - Change to CommonJS Type Syntax
-------

This version marks a huge change and will BREAK any old scripts. We killed the add and after methods and went with just require for both.

Also totally re-did the inner workings to make it more like an internal pubsub system.

Example use
-------

```html
<script data-main="js/" src="js/prereq.js"></script>
<script>
Prereq
	.require({ jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js' })
	.failover('/js/jquery.min.js')
	.require({ facebook: 'http://connect.facebook.net/en_US/all.js' })
	.require('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js', 'jquery')
	.require('module', function(m){
		// this script loaded
		alert(m.message);
	})
	.subscribe('facebook', function() {
		FB.init({appId: 'YOUR APP KEY', status: true, cookie: true, xfbml: true});
	});
</script>
```

NOW LET'S DEFINE js/module.js

```javascript
Prereq.define('module', ['jquery', 'facebook'], function(exports) {

........... define your custom code however you normally would ......
...... we know facebook and jquery have loaded now ....

	exports.message = 'Hello World';

});
```

Code Explaination
-------

Again the goal is to be clear and simple. The code really speaks for itself for the most part. You define the scripts needed (with the require method),
optionally with aliases, and then you can optionally define dependencies as the second argument to the require or define methods (either in the main file or in an external js).

Public Methods
-------

**require(scriptsToLoad[, dependencies][, callback])**

ARGUMENTS:

scriptsToLoad (required)

Always the first argument.

* (string) - Just pass in a string for the URL, path or module name;
* (array) - Pass in an array of one or more strings of URLs, paths, or module names.
* (object) - Pass in an object with alias keys and string or array values.

dependencies (optional)

If present this will always be the second argument.

* (string) - For a single dependency you can just pass in the URL, path, or module name.
* (array) - For multiple dependencies, pass in an array of strings.

callback (optional)

If present this will be either the second or third argument, but always the last one.

* (function) - Call back function once loaded.


**loaded(scriptsToTest)**

scriptsToTest - String or array of strings with URL, path, or module names.

**loaded()**

No arguments returns all scripts and their status.

**define(name[, dependencies], callback)**

name (string) - Name of the module. Should usually be file name without the .js

dependencies - String or array of strings.

callback (function) - Required. A wrapper for the code of your module. If present, either second or third argument but always last. Add exports as the argument to this method and add to it for what you want to be returned your callback. This is like CommonJS.

**subscribe([name, ]callback)**

Allows you to listen in on the internal pubsub to see when something loads.

name = (string) Optional. Name of the module to subscribe to its publish event. If you leave it off then will use the module previously referenced in require.

callback = (function) Required. What hit with publish.

**failover(url[, timeout])**

Provide an alternate URL for the module previously referenced by require.

url - String of URL, path or module name.

timeout - Optional. Integer in milliseconds. Default is 5000 (five seconds).


Credit
-------

Thank you for inspiration and ideas to these great similar projects:

* YepNope - yepnopejs.com
* LabJS - labjs.com
* RequireJS - requirejs.org
* HeadJS - headjs.com

