/*prereq1.0|MIT*/
// prereq.js
// Version - 1.0
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
//
// http://github.com/milesplit/Prereq
var Prereq=(function(d){var Me=this,_q={},_l=[],_h=d.head||d.getElementsByTagName('head')[0];var _f=function(n){_q[n].loaded=true;var i=0;while(i<_l.length){if(_l[i]()){_l.splice(i,1)}else i++}};var _a=function(o){return{}.toString.call(o)=='[object Array]'};var _e=function(n){return(n in _q)};var _r=function(n){var d=true;if(!_a(n))n=[n];for(var i=0;i<n.length;i++){if(!Me.isLoaded(n[i])){d=false;break}}return d};Me.add=function(a,b,c){if(!b){b=a;a=_q.length}_q[a]={name:a,url:b,loaded:false};if(c){Me.after(c,function(){Me.add(a,b)})}else if(b){var s=d.createElement('script');s.src=b;s.type='text/javascript';s.async=true;s.onload=s.onreadystatechange=function(){if(!s.readyState||/loaded|complete/.test(s.readyState)){s.onload=s.onreadystatechange=null;_f(a)}}_h.appendChild(s)}else{_f(a)}return Me}Me.after=function(n,f){if(_r(n)){f();return Me}_l.push(function(){if(_r(n)){f();return true}return false});return Me};Me.css=function(a){var s=d.createElement('link');s.type='text/css';s.rel='stylesheet';s.href=a;_h.appendChild(s);return Me}Me.isLoaded=function(n){if(!_e(n))return false;else if(!_q[n].loaded)return false;else return true}return Me})(document);