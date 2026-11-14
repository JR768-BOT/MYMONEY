var CACHE="mymoney-v4";
var FILES=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE&&n!=="mm-cfg"}).map(function(n){return caches.delete(n)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){
if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin)return;
e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(CACHE).then(function(x){x.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}))});

self.addEventListener("periodicsync",function(e){if(e.tag==="mm-remind")e.waitUntil(remind())});
function remind(){
return caches.open("mm-cfg").then(function(c){return c.match("cfg").then(function(r){return r?r.json():null}).then(function(cfg){
if(!cfg)return;var n=new Date(),k=null,last=cfg.last||"";
cfg.times.forEach(function(v){var p=v.split(":"),d=new Date();d.setHours(+p[0],+p[1],0,0);var df=n-d;if(df>=0&&df<=90*60000){var key=d.toDateString()+v;if(key!==last)k=key}});
if(!k)return;cfg.last=k;c.put("cfg",new Response(JSON.stringify(cfg)));
var gu=cfg.lang==="gu";
return self.registration.showNotification(gu?"મારા પૈસા":"My Money",{body:gu?"આજનો ખર્ચ ઉમેર્યો? માઇક દબાવી બોલો.":"Did you add today's expenses? Tap the mic and speak.",icon:"icons/icon-192.png",badge:"icons/icon-192.png",tag:"mm-remind"})})})}
self.addEventListener("notificationclick",function(e){e.notification.close();e.waitUntil(clients.matchAll({type:"window"}).then(function(l){for(var i=0;i<l.length;i++){if("focus" in l[i])return l[i].focus()}return clients.openWindow("./index.html")}))});
