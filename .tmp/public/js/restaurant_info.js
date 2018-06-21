"use strict";var map,restaurant=void 0,reviews=void 0;window.initMap=function(){fetchRestaurantFromURL(function(e,t){if(e)console.error(e);else{var n=document.getElementById("map"),a=!1;if(n.addEventListener("click",function(){a||(self.map=new google.maps.Map(document.getElementById("map"),{zoom:16,center:t.latlng,scrollwheel:!1}),a=!0),DBHelper.mapMarkerForRestaurant(self.restaurant,self.map)}),fillBreadcrumb(),navigator.onLine)document.getElementById("connection-status").classList.add("hidden"),sendCachedReviews();else document.getElementById("connection-status").classList.remove("hidden"),document.getElementById("reload-button").addEventListener("click",reloadPage)}})};var reloadPage=function(){location.reload()},fetchRestaurantFromURL=function(n){if(self.restaurant)n(null,self.restaurant);else{var e=getParameterByName("id");e?DBHelper.fetchRestaurantById(e,function(e,t){(self.restaurant=t)?(fillRestaurantHTML(),n(null,t)):console.error(e)}):(error="No restaurant id in URL",n(error,null))}},fillRestaurantHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant;document.getElementById("restaurant-name").innerHTML=e.name;var t=document.getElementById("is-favorite-button"),n=e.is_favorite?"favorite":"not-favorite";t.classList.add(n),t.addEventListener("click",toggleFavorite),document.getElementById("is-favorite-text").innerText=e.is_favorite?"Remove from favorites":"Add to favorites",document.getElementById("restaurant-address").innerHTML=e.address;var a=DBHelper.imageUrlForRestaurant(e);document.getElementById("restaurant-source-large-webp").srcset=a+"-1600_large.webp 2x, "+a+"-800_large.webp",document.getElementById("restaurant-source-large").srcset=a+"-1600_large.jpg 2x, "+a+"-800_large.jpg",document.getElementById("restaurant-source-medium-webp").srcset=DBHelper.imageUrlForRestaurant(e)+"_medium.webp",document.getElementById("restaurant-source-medium").srcset=DBHelper.imageUrlForRestaurant(e)+"_medium.jpg",document.getElementById("restaurant-source-webp").srcset=DBHelper.imageUrlForRestaurant(e)+".webp";var r=document.getElementById("restaurant-img");r.className="restaurant-img",r.src=DBHelper.imageUrlForRestaurant(e)+".jpg",r.alt=e.name+" is a "+e.cuisine_type+" restaurant in "+e.address+".",document.getElementById("restaurant-cuisine").innerHTML=e.cuisine_type,e.operating_hours&&fillRestaurantHoursHTML(),DBHelper.fetchReviewsByRestaurantId(self.restaurant.id,function(e,t){self.restaurant.reviews=t,fillReviewsHTML()})},fillRestaurantHoursHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.operating_hours,t=document.getElementById("restaurant-hours");for(var n in e){var a=document.createElement("tr"),r=document.createElement("td");r.innerHTML=n,a.appendChild(r);var i=document.createElement("td");i.innerHTML=e[n],a.appendChild(i),t.appendChild(a)}},fillReviewsHTML=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant.reviews,t=document.getElementById("reviews-container"),n=document.createElement("h3");if(n.innerHTML="Reviews",!e){var a=document.createElement("p");return a.innerHTML="No reviews yet!",void t.appendChild(a)}var r=document.getElementById("reviews-list");e.forEach(function(e){r.appendChild(createReviewHTML(e))}),t.prepend(r),t.prepend(n)},createReviewHTML=function(e){var t=document.createElement("li"),n=document.createElement("p");n.innerHTML=e.name,t.appendChild(n);var a=document.createElement("p");a.innerHTML=new Date(e.updatedAt).toDateString(),t.appendChild(a);var r=document.createElement("p");r.innerHTML="Rating: "+e.rating,t.appendChild(r);var i=document.createElement("a");i.classList.add("delete-review-button"),i.classList.add("tooltip"),i.innerHTML='<span class="tooltip-text">Delete review</span>',t.appendChild(i),i.addEventListener("click",deleteReview);var s=document.createElement("p");s.innerHTML=e.comments,t.appendChild(s);var o=document.createAttribute("data-id");return o.value=e.id,t.attributes.setNamedItem(o),t},fillBreadcrumb=function(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:self.restaurant,t=document.getElementById("breadcrumb"),n=document.createElement("li");n.setAttribute("aria-current","page"),n.innerHTML=e.name,t.appendChild(n)},getParameterByName=function(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var n=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)").exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null},postReview=function(){var e=document.getElementById("reviews-form"),t=document.createElement("span"),n=document.getElementById("reviews-form-title"),a=document.getElementById("review-name"),r=document.getElementById("review-email"),i=document.querySelector('input[name="rating"]:checked'),s=document.getElementById("review-message"),o=a.value;console.log("name: "+o);var l=r.value;console.log("email: "+l);var d=void 0;null!=i&&(d=i.value),console.log("rating: "+d);var c=s.value;console.log("comments: "+c);var u=!0,m=validateEmail(l);if(e.classList.remove("not-valid"),null!=o&&null!=l&&m&&null!=d&&null!=c&&""!=c.trim()||(u=!1),u){var v=document.getElementById("form-not-valid-message");v&&(e.classList.remove("not-valid"),v.parentNode.removeChild(v),console.log("Removing not valid message")),fetch(DBHelper.REVIEWS_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:null,restaurant_id:restaurant.id,name:o,rating:d,comments:c,createdAt:new Date,updatedAt:new Date})}).then(function(e){console.log("Review post success: ",e),DBHelper.fetchReviewsByRestaurantId(self.restaurant.id,function(e,t){self.restaurant.reviews=t;for(var n=document.getElementById("reviews-list");n.firstChild;)n.removeChild(n.firstChild);self.restaurant.reviews.forEach(function(e){n.appendChild(createReviewHTML(e))})})}).catch(function(e){console.log("Review post failure: ",e);var t={id:1,restaurant_id:restaurant.id,name:o,rating:d,comments:c,createdAt:new Date,updatedAt:new Date};DBHelper.saveOfflineReview(t)})}else console.log("From not valid!"),e.classList.add("not-valid"),t.innerText="Please fill all fields and select a rating score!",n.appendChild(t),t.setAttribute("id","form-not-valid-message")},sendCachedReviews=function(){DBHelper.sendCachedReviews().then(function(e){null!=e&&fetch(DBHelper.REVIEWS_API,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:null,restaurant_id:e.restaurant_id,name:e.name,rating:e.rating,comments:e.comments,createdAt:e.createdAt,updatedAt:e.updatedAt})}).then(function(e){console.log("Offline review post success: ",e),DBHelper.clearCachedReviews(),DBHelper.fetchReviewsByRestaurantId(self.restaurant.id,function(e,t){self.restaurant.reviews=t;for(var n=document.getElementById("reviews-list");n.firstChild;)n.removeChild(n.firstChild);self.restaurant.reviews.forEach(function(e){n.appendChild(createReviewHTML(e))})})}).catch(function(e){console.log("Review post failure: ",e)})})},deleteReview=function(e){var t=e.target.parentElement,n=t.getAttribute("data-id");fetch(DBHelper.REVIEW_DELETE_API+n,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(function(e){console.log("Review deleted: "+n,e),DBHelper.fetchReviewsByRestaurantId(self.restaurant.id,function(e,t){self.restaurant.reviews=t}),t.parentElement.removeChild(t)}).catch(function(e){console.log("Review delete failed: ",e)})},toggleFavorite=function(){var e=self.restaurant.is_favorite;fetch(DBHelper.RESTAURANT_FAVORITE_API+!e,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({is_favorite:!e})}).then(function(e){console.log("Favorite status updated: ",e);var t=document.getElementById("is-favorite-button"),n=document.getElementById("is-favorite-text");t.classList.contains("favorite")?(t.classList.remove("favorite"),t.classList.add("not-favorite"),n.innerText="Add to favorites"):(t.classList.add("favorite"),t.classList.remove("not-favorite"),n.innerText="Remove from favorites"),self.restaurant.is_favorite=!self.restaurant.is_favorite}).catch(function(e){console.log("Favorite status change failed: ",e)})},reloadReviews=function(){},validateEmail=function(e){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(e).toLowerCase())};