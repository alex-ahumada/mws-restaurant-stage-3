"use strict";var map,restaurants=void 0,neighborhoods=void 0,cuisines=void 0,markers=[];document.addEventListener("DOMContentLoaded",function(e){fetchNeighborhoods(),fetchCuisines()});var fetchNeighborhoods=function(){DBHelper.fetchNeighborhoods(function(e,t){e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})},fillNeighborhoodsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.neighborhoods,n=document.getElementById("neighborhoods-select");e.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,n.append(t)})},fetchCuisines=function(){DBHelper.fetchCuisines(function(e,t){e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})},fillCuisinesHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.cuisines,n=document.getElementById("cuisines-select");e.forEach(function(e){var t=document.createElement("option");t.innerHTML=e,t.value=e,n.append(t)})};window.initMap=function(){var e={lat:40.722216,lng:-73.987501},t=document.getElementById("map"),n=!1;t.addEventListener("click",function(){n||(self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:e,scrollwheel:!1}),addMarkersToMap(),n=!0)}),updateRestaurants()};var updateRestaurants=function(){var e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,a=t.selectedIndex,r=e[n].value,s=t[a].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(r,s,function(e,t){e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})},resetRestaurants=function(e){self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",DBHelper.cleanImageCache(),self.markers.forEach(function(e){return e.setMap(null)}),self.markers=[],self.restaurants=e},fillRestaurantsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants,t=document.getElementById("restaurants-list");t.innerHTML="",e.forEach(function(e){t.append(createRestaurantHTML(e))}),addMarkersToMap()},createRestaurantHTML=function(e){var t=document.createElement("li");t.className="restaurant";var n=document.createElement("picture");t.append(n);var a=document.createElement("source");a.media="(min-width: 750px)",a.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)+"-800_large.webp"),a.type="image/webp",n.append(a);var r=document.createElement("source");r.media="(min-width: 750px)",r.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)+"-800_large.jpg"),r.type="image/jpeg",n.append(r);var s=document.createElement("source");s.media="(min-width: 500px)",s.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)+"_medium.webp"),s.type="image/webp",n.append(s);var o=document.createElement("source");o.media="(min-width: 500px)",o.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)+"_medium.jpg"),o.type="image/jpeg",n.append(o);var i=document.createElement("source");i.setAttribute("data-srcset",DBHelper.imageUrlForRestaurant(e)+".webp"),i.type="image/webp",n.append(i);var c=document.createElement("img");c.className="restaurant-img",c.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",c.setAttribute("data-src",DBHelper.imageUrlForRestaurant(e)+".jpg"),c.alt=e.name+" is a "+e.cuisine_type+" restaurant in "+e.address+".",n.append(c);var u=document.createElement("h3");u.innerHTML=e.name,t.append(u);var l=document.createElement("p");l.innerHTML=e.neighborhood,t.append(l);var d=document.createElement("p");d.innerHTML=e.address,t.append(d);var m=document.createElement("a");return m.innerHTML="View Details",m.setAttribute("role","button"),m.setAttribute("aria-label",e.name),m.href=DBHelper.urlForRestaurant(e),t.append(m),t},addMarkersToMap=function(){(0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurants).forEach(function(e){var t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",function(){window.location.href=t.url}),self.markers.push(t)})};document.onreadystatechange=function(){if("complete"===document.readyState)new Blazy({selector:".restaurant-img",offset:10})};