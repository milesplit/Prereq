Prereq
=============

Yes, another JavaScript loader. I know, I know.

Why?
-------

I looked at a lot of the ones out there. And I really like pieces of them, but I just don't like the whole thing. I either
think the syntax is convoluted and overly complex or they try to do too many things.

The goal of this project is to be simple all the way around...

* Focused in its purpose: don't get sucked into doing more than just loading scripts.
* Event based
* Simple syntax handing for dependencies and callbacks
* Load all scripts right away (with some exceptions)
* Be able to define the requirements in the external js file... for more modularization
* Don't get sucked into trying to support every old browser known to man. If they're still using IE5 or Netscape they are used to sites not working.
* Keep it as small as possible.

Example use
-------

```javascript
Prereq
	.add('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js')
	.add('facebook', 'http://connect.facebook.net/en_US/all.js')
	.add('jqueryui', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.13/jquery-ui.min.js', 'jquery')
	.add('/js/some-other-file.js')
	.after('facebook', function() {
		FB.init({appId: 'YOUR APP KEY', status: true, cookie: true, xfbml: true});
	});
```

NOW LET'S DEFINE some-other-file.js

```javascript
Prereq.after(['jquery', 'facebook'], function() {

........... define your custom code however you normally would ......
...... we know facebook and jquery have loaded now ....

});
```

Code Explaination
-------

Again the goal is to be clear and simple. The code really speaks for itself for the most part. You define the scripts needed (with the add method),
optionally with aliases, and then you can define dependencies with the after method (either in the main file or in an external js) or inline as
the third argument to add.

Public Methods
-------

**add(url)**

url (string) - URL of the script.

Give it simply a URL and it will be un-aliased and will load the script immediately. This is appropriate for simple use where it has no dependencies.

**add(name, url)**

name (string) - Alias to give this script, which should be unique.

url (string) - URL of the script. You can pass in null if necessary, which comes in handy as a conditional sometimes to fire any afters.

Give the script an alias that we can use to refer to it later. The script will load immediately.

**add(name, url, prerequisites)**

name (string) - Alias to give this script, which should be unique.

url (string) - URL of the script.

prerequisites (string or array) - The name of the script this depends on or an array of strings of names if multiple dependencies.

At this time, this is the same thing as including scripts in an after tag. It will not load them until its prerequisits are loaded. What I'd like to update this
to do in the future is load the scripts into an img tag so that they are cached, just not executed. And then execute them once the dependencies load. That would
be equivalent of loading the script with Prereq.after within the script itself (as shown in the example above). So this is useful if you do not have control
over the scripts to insert Prereq.after in the external script or it is inpractical to do so. It makes for nice, clean code of inline dependencies.

**add(url, callback)**

url (string) - URL of the script.

callback (function) - Function will be called after it loads.

**add(name, url, callback)**

name (string) - Alias to give this script, which should be unique.

url (string) - URL of the script.

callback (function) - Function will be called after it loads.

**after(prerequisites, callback)**

prerequisites (string or array) - What the callback needs to load.

callback (function) - Code to call once prerequisites are done. If they are already done when this is called then it will fire immediately.

**loaded(name)**

name (string) - Name of a module to check if it has yet loaded. If script was not aliased, ask if the URL was loaded.

**css(url)**

url (string) - URL of the stylesheet.

No callbacks or queues. Just include a stylesheet dynamically.

CommonJS Methods
-------

I have the beginnings of some CommonJS like module code below... basic but works for using require and then defining the module with exports

**require(name, callback)**

name (string) - name of the module

callback (function) - function to call back once loaded

Example:

```javascript

Prereq.require('module', function(m){
	console.log(m);
});

```

**define(name, module)**

name (string) - name of the module... should be same as file name without the .js

module (function) - a closure function to define the module code

This should add to the exports object for anything desired to be made available outside the module

Example:

```javascript

Prereq.define('module', function(exports){
	
	exports.hello = {
		world:true
	};
	
});

```

Next?
-------

I'd like to be able have the url passed via add be an array so that you can provide fallback URLs. Will probably need to set a timeout for this to consider the first one failed.

Credit
-------

Thank you for inspiration and ideas to these great similar projects:

* YepNope - yepnopejs.com
* LabJS - labjs.com
* RequireJS - requirejs.org
* HeadJS - headjs.com

