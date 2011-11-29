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
var Prereq=(function(l){var p={},q=true,i=false,n={},k={},h=l.head||l.getElementsByTagName("head")[0],m=function(d){return{}.toString.call(d)=="[object Array]"},c=function(d){return(typeof d=="function")},j=function(d){return(d)?((m(d))?d:[d]):[]},r=function(d){return(c(d))?d:function(){}},o=/\.js$/,a=function(d){k[d]=k[d]||[];n[d].l=q;for(var f=0;f<k[d].length;f++){k[d][f](n[d].e)}k[d]=[]},e=function(d,f){k[d]=k[d]||[];k[d].push(f)},g=function(d,s){if(!n[d]){n[d]={n:d,u:s,l:i,e:{}};for(var f=0;f<s.length;f++){if(s[f]!=d){e(s[f],function(){if(p.loaded(s)){a(d)}})}b(s[f],s[f])}}},b=function(f,s){var s=(s||f),s=o.test(s)?s:s+".js";var d=l.createElement("script");d.src=s;d.async=q;n[f]={n:f,u:s,l:i,e:{}};d.onload=d.onreadystatechange=function(){if(!d.readyState||(/loaded|complete/).test(d.readyState)){d.onload=d.onreadystatechange=null;a(f)}};h.appendChild(d)};p.require=function(v,t,s){var f=arguments.length,d=v,y=v,w=r(s),x=[];if(f==2){c(t)?(w=t):(y=t)}else{if(f>2){y=t;x=c(s)?[]:s}}y=j(y);d=j(d).join("-").replace(o,"");var u=function(){if(p.loaded(d)){w(n[d].e)}else{e(d,w);g(d,y)}};p.loaded(x)?u():p.require(x,u);return p};p.loaded=function(d){d=j(d);for(var f=0;f<d.length;f++){if(!(function(s){if(!n[s]){return i}else{return n[s].l}})(d[f])){return i}}return(d.length==0)?n:q};p.define=function(s,d,t){var f={};t?p.require(d,function(){t(f)}):d(f);n[s].e=f;return p};return p})(document);