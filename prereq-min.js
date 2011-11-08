/*prereq1.0|MIT*/
// prereq.js
// Version - 1.02
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
//
// http://github.com/milesplit/Prereq
var Prereq=(function(d){var Me=this,_q={},_l=[],_h=d.head||d.getElementsByTagName('head')[0],_a=function(o){return{}.toString.call(o)=='[object Array]'},_f=function(o){return(typeof o=='function')};var _p=function(n){if(_q[n]){_q[n].l=true;var i=0;while(i<_l.length){if(_l[i]()){_l.splice(i,1)}else{i++}}}};var _s=function(o){if(o.u){var s=d.createElement('script');s.src=o.u;s.async=true;_q[o.n]=o;s.onload=s.onreadystatechange=function(){if(!s.readyState||(/loaded|complete/).test(s.readyState)){s.onload=s.onreadystatechange=null;_p(o.n);o.c(o)}};_h.appendChild(s);return}_p(o.n)};Me.add=function(a,b,c){var l=arguments.length,o={n:a,u:a,l:false,c:function(){},a:[]};if(l>2){o.u=b;if(_f(c)){o.c=c}else{o.a=c}}else if(l==2){if(_f(b)){o.u=a;o.c=b}else{o.u=b}}Me.after(o.a,function(){_s(o)});return Me};Me.after=function(n,f){if(Me.loaded(n)){f()}else{_l.push(function(){if(Me.loaded(n)){f();return true}return false})}return Me};Me.css=function(a){var s=d.createElement('link');s.rel='stylesheet';s.href=a;_h.appendChild(s);return Me};Me.loaded=function(n){if(!n){return true}if(!_a(n)){n=[n]}for(var i=0;i<n.length;i++){if(!(function(n){if(!_q[n]){return false}else{return _q[n].l}})(n[i])){return false}}return true};return Me})(document);