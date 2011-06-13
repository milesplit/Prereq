/*prereq1.0|MIT*/
// prereq.js
// Version - 1.0
//
// by
// Jason Byrne - @jasonbyrne - jbyrne[at]milesplit.com
//
// http://github.com/milesplit/Prereq
var Prereq=(function(d){var Me=this,_q={},_l={loading:[],loaded:[]},_h=d.head||d.getElementsByTagName('head')[0];var _f=function(n,t){_q[n][t]=true;var l=_l[t].length;for(var i=0;i<l;i++){_l[t][i]({type:t,name:n,url:_q[n].url})}};var _a=function(o){return{}.toString.call(o)=='[object Array]'};var _r=function(n){var d=true;if(_a(n)){for(var i=0;i<n.length;i++){if(!_q[n[i]].loaded){d=false break}}}else if(!_q[n].loaded){d=false}return d};Me.add=function(a,b){if(!b){b=a;a=_q.length}_q[a]={name:a,url:b,loading:false,loaded:false};_f(a,'loading');if(b){var s=d.createElement('script');s.src=b;s.type='text/javascript';s.async='async';s.onload=s.onreadystatechange=function(){if(!s.readyState||/loaded|complete/.test(s.readyState)){s.onload=s.onreadystatechange=null;_f(a,'loaded')}}_h.appendChild(s)}else{_f(a,'loaded')}return Me}Me.after=function(n,f){if(_r(n)){f();return Me}var d=false;Me.on('loaded',function(){if(!d&&_r(n)){f();d=true}});return Me};Me.on=function(t,f){_l[t].push(f)};return Me})(document);