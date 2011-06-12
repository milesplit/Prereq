Prereq
=============

Yes, another JavaScript loader

Why?
-------

Here is the main purpose of what I'm after. I don't especially like the syntax of a
lot of what is out there. I like parts of it, but it just seems too messy or overly
complex... or the project does too many other things.

I wanted an easy way to say what was required and wait for dependencies to load.
We can go ahead and load them all (for the most part) and even execute them without
waiting... because you can wrap your code execution in an event listener defining
its prereqs.

This project is NOT done.. it is NOT tested.. it is in its very very early stages.


Example use
-------


Prereq.add(

		{ name:'jquery', url:'http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js' },

		{ name:'facebook', url:'http://connect.facebook.net/en_US/all.js' },

		'/js/some-other-file.js'

	).after('facebook', function() {

		FB.init({appId: 'YOUR APP KEY', status: true, cookie: true, xfbml: true});

	});


NOW LET'S DEFINE some-other-file.js


Prereq.after(['jquery', 'facebook'], function() {

........... define your custom code however you normally would ......

});


Explaination
-------

The add method will (for now at least... could possibly change or augment) load all of the scripts
as script elements and therefore execute right away.

But through event listeners (both inline in our main file and also in our js files with prereqs)
we can only execute the code with prereqs after it loads.

We provide modules that have dependencies with names... so that we can easily refer to them by that 
name to make sure they have loaded.

The after method will check if its loaded and if so immediately hit the callback or otherwise
it will set the appropriate listeners.

Next?
-------

Next... I go to sleep. I'm not sure where this will go. If I will just give it up and go with yepnope 
or something or if I'll still think this is a good idea to pursue in the morning.

Goodnight!
