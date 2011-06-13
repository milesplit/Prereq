Prereq
=============

Yes, another JavaScript loader. I know, I know.

Why?
-------

I looked at a lot of the ones out there. And I really like pieces of them, but I just don't like the whole thing. I either
think the syntax is convoluted and overly complex or they try to do too many things or whatever.

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

Explaination
-------

The add method will load all of the scripts as script elements and therefore execute right away, but through event listeners
(both inline in our main file and also in our js files with prereqs) we can prevent the meat of the code from executing until the prereqisites are done loading.

We provide modules that have dependencies with names... so that we can easily refer to them by that  name to make sure they have loaded.

The after method will check if its loaded and if so immediately hit the callback or otherwise it will set the appropriate listeners.

Next?
-------

I'd like to be able have the url passed via add be an array so that you can provide fallback URLs. Will probably need to set a timeout for this to consider the first one failed.
