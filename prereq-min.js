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
var Prereq=(function(r){var c={},m=true,q=false,b,i={},j=function(d){return{}.toString.call(d)=="[object Array]"},w=function(d){return(typeof d=="function")},n=function(d){return d instanceof Object},s=function(d){return d?(j(d)?d:[d]):[]},l=function(d){return w(d)?d:function(){}},e=(function(){var d=r.getElementsByTagName("script");return d[d.length-1]})(),v=(function(){return e?e.getAttribute("data-main")||"":""})(),u=r.head||r.getElementsByTagName("head")[0],g=/\.js$/,p="_",h=function(f){var x=o(f),t=0,d=x.s.length;x.l=m;for(;t<d;t++){x.s[t](x.e)}x.s=[]},o=function(d){return i[d]=i[d]||{l:q,t:q,e:{},s:[]}},a=function(f,t){o(f).t=m;t=(t.charAt(0)==="/"||/^\w+:/.test(t))?t:v+t+(g.test(t)?"":".js");var d=r.createElement("script");d.src=t;d.async=m;d.id=p+f;d.onload=d.onreadystatechange=function(){var x=d.readyState;if(!x||(/loaded|complete/).test(x)){d.onload=d.onreadystatechange=null;h(f)}};u.appendChild(d)};c.require=function(f,d,B){var t=[],x=[],A=l(B),z=[],y=function(C){C=o(t);c.loaded(t)?A(C.e):(function(){c.subscribe(t,A);for(var E=0,D=x.length;E<D;E++){(x[E]!=t)&&c.subscribe(x[E],function(){c.loaded(x)&&h(t)});!C.t&&a(x[E],x[E])}})()};(arguments.length==2)&&w(d)?(A=d):(z=j(d)?d:s(d));if(n(f)){for(k in f){t.push(k);j(f[k])?(x=x.concat(f[k])):x.push(f[k])}t=t.join(p)}else{x=s(f);t=x.join(p).replace(g,"")}c.loaded(z)?y():c.subscribe(z,y);b=t;return c};c.failover=function(d,f){f=f||5000;if(i[b]){var t=setTimeout(function(){u.removeChild(r.getElementById(p+b));a(b,d)},f);return c.subscribe(b,function(){clearTimeout(t)})}};c.loaded=function(t,x){t=s(t);for(var f=0,d=t.length;f<d;f++){if(!o(t[f]).l){return q}}return(d==0)?i:(function(){w(x)&&x();return m})()};c.subscribe=function(t,f){f?m:(f=t)&&(t=b);var t=s(t),x=0,d=t.length;for(;x<d;x++){o(t[x]).s.push(f)}return c};c.define=function(t,d,x){var f={};x?c.require(d,function(){x(f)}):d(f);i[t].e=f;return c};return c})(document);