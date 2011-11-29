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
var Prereq=(function(n){var r={},s=true,i=false,l,p={},m={},h=n.head||n.getElementsByTagName("head")[0],o=function(d){return{}.toString.call(d)=="[object Array]"},e=function(d){return(typeof d=="function")},a=function(d){return d instanceof Object},j=function(d){return(d)?((o(d))?d:[d]):[]},u=function(d){return(e(d))?d:function(){}},q=/\.js$/,b=function(d){m[d]=m[d]||[];p[d].l=s;for(var f=0;f<m[d].length;f++){m[d][f](p[d].e)}m[d]=[]},g=function(d,t){if(!p[d]){p[d]={n:d,u:t,l:i,e:{}};for(var f=0;f<t.length;f++){if(t[f]!=d){r.subscribe(t[f],function(){if(r.loaded(t)){b(d)}})}c(t[f],t[f])}}},c=function(f,t){var t=(t||f),t=q.test(t)?t:t+".js";var d=n.createElement("script");d.src=t;d.async=s;d.id="_"+f;p[f]={n:f,u:t,l:i,e:{}};d.onload=d.onreadystatechange=function(){if(!d.readyState||(/loaded|complete/).test(d.readyState)){d.onload=d.onreadystatechange=null;b(f)}};h.appendChild(d)};r.require=function(f,d,z){var t=[],w=[],y=u(z),x=[];if(arguments.length==2){e(d)?(y=d):(x=o(d)?d:j(d))}if(a(f)){for(k in f){t.push(k);o(f[k])?(w=w.concat(f[k])):w.push(f[k])}t=t.join("-")}else{w=j(f);t=w.join("-").replace(q,"")}var v=function(){if(r.loaded(t)){y(p[t].e)}else{r.subscribe(t,y);g(t,w)}};r.loaded(x)?v():r.require(x,v);l=t;return r};r.failover=function(d,t){var f=p[l],t=(t>0)?t:5000;if(f){var v=setTimeout(function(){h.removeChild(n.getElementById("_"+l));c(l,d)},t);r.subscribe(l,function(){clearTimeout(v)})}};r.loaded=function(d){d=j(d);for(var f=0;f<d.length;f++){if(!(function(t){if(!p[t]){return i}else{return p[t].l}})(d[f])){return i}}return(d.length==0)?p:s};r.subscribe=function(d,f){m[d]=m[d]||[];m[d].push(f)};r.define=function(t,d,v){var f={};v?r.require(d,function(){v(f)}):d(f);p[t].e=f;return r};return r})(document);