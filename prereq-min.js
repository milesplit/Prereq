/*prereq1.0|MIT*/
// prereq.js
// Version - 1.0
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
//
// http://github.com/milesplit/Prereq
var Prereq=(function(g){var c=this,f={},h=[],i=g.head||g.getElementsByTagName('head')[0];var j=function(a){f[a].loaded=true;var b=0;while(b<h.length){if(h[b]()){h.splice(b,1)}else{b++}}};var l=function(a){return{}.toString.call(a)=='[object Array]'};var m=function(a){return(a in f)};var k=function(a){var b=true;if(!l(a)){a=[a]}for(var e=0;e<a.length;e++){if(!c.isLoaded(a[e])){b=false;break}}return b};c.add=function(a,b,e){if(!b){b=a;a=f.length}f[a]={name:a,url:b,loaded:false};if(e){c.after(e,function(){c.add(a,b)})}else if(b){var d=g.createElement('script');d.src=b;d.async=true;d.onload=d.onreadystatechange=function(){if(!d.readyState||(/loaded|complete/).test(d.readyState)){d.onload=d.onreadystatechange=null;j(a)}};i.appendChild(d)}else{j(a)}return c};c.after=function(a,b){if(k(a)){b();return c}h.push(function(){if(k(a)){b();return true}return false});return c};c.css=function(a){var b=g.createElement('link');b.rel='stylesheet';b.href=a;i.appendChild(b);return c};c.isLoaded=function(a){if(!m(a)){return false}else if(!f[a].loaded){return false}else{return true}};return c})(document);
