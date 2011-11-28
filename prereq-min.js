/*prereq1.0|MIT*/
// prereq.js
// Version - 1.03
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
// Alan Szlosek - aszlosek[a]milesplit.com
//
// http://github.com/milesplit/Prereq
//
// License: MIT
var Prereq=(function(g){var j=this,a={},c=[],e=g.head||g.getElementsByTagName("head")[0],h=function(d){return{}.toString.call(d)=="[object Array]"},f=function(d){return(typeof d=="function")},i=/\.js$/;var b=function(l){if(a[l]){a[l].l=true;var d=0;while(d<c.length){if(c[d]()){c.splice(d,1)}else{d++}}}};var k=function(l){if(l.u){var d=g.createElement("script");d.src=l.u;d.async=true;a[l.n]=l;d.onload=d.onreadystatechange=function(){if(!d.readyState||(/loaded|complete/).test(d.readyState)){d.onload=d.onreadystatechange=null;b(l.n);l.c(l)}};e.appendChild(d);return}b(l.n)};j.add=function(n,d,q){var m=arguments.length,p={n:n,u:n,l:false,c:function(){},a:[]};if(m>2){p.u=d;if(f(q)){p.c=q}else{p.a=q}}else{if(m==2){if(f(d)){p.u=n;p.c=d}else{p.u=d}}}p.u=i.test(p.u)?p.u:p.u+".js";p.n=p.n.replace(i,"");j.after(p.a,function(){k(p)});return j};j.after=function(l,d){if(j.loaded(l)){d()}else{c.push(function(){if(j.loaded(l)){d();return true}return false})}return j};j.css=function(d){var l=g.createElement("link");l.rel="stylesheet";l.href=d;e.appendChild(l);return j};j.loaded=function(l){if(!l){return true}if(!h(l)){l=[l]}for(var d=0;d<l.length;d++){if(!(function(m){if(!a[m]){return false}else{return a[m].l}})(l[d])){return false}}return true};j.define=function(m,d){var l={};d(l);a[m].d=l;return j};j.require=function(o,l){a[o]=a[o]||{};var l=l||function(){},d=a[o].d;d?l(d):j.add(o).after(o,function(){l(a[o].d)});return j};return j})(document);