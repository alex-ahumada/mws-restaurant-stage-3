let restaurants,
  neighborhoods,
  cuisines;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
var fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
var fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };

  var mapContainer = document.getElementById('map');
  var mapClicked = false;
  mapContainer.addEventListener("click", function() {
    if (!mapClicked) {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: loc,
        scrollwheel: false
      });

      addMarkersToMap();
      mapClicked = true;
    }
  });

  updateRestaurants();
};

/**
 * Update page and map for current restaurants.
 */
var updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      //fillRestaurantsHTMLfromDB();
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
var resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  //Clean images cache
  DBHelper.cleanImageCache();

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
var fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
var createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
  li.className = 'restaurant';

  const picture = document.createElement('picture');
  li.append(picture);

  const largeSourceWebp = document.createElement('source');
  largeSourceWebp.media = '(min-width: 750px)';
  largeSourceWebp.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant) + '-800_large.webp');
  largeSourceWebp.type = 'image/webp';
  picture.append(largeSourceWebp);

  const largeSource = document.createElement('source');
  largeSource.media = '(min-width: 750px)';
  largeSource.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant) + '-800_large.jpg');
  largeSource.type = 'image/jpeg';
  picture.append(largeSource);

  const mediumSourceWebp = document.createElement('source');
  mediumSourceWebp.media = '(min-width: 500px)';
  mediumSourceWebp.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant) + '_medium.webp');
  mediumSourceWebp.type = 'image/webp';
  picture.append(mediumSourceWebp);

  const mediumSource = document.createElement('source');
  mediumSource.media = '(min-width: 500px)';
  mediumSource.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant) + '_medium.jpg');
  mediumSource.type = 'image/jpeg';
  picture.append(mediumSource);

  const sourceWebp = document.createElement('source');
  sourceWebp.setAttribute('data-srcset', DBHelper.imageUrlForRestaurant(restaurant) + '.webp');
  sourceWebp.type = 'image/webp';
  picture.append(sourceWebp);

  const image = document.createElement('img');
  image.className = 'restaurant-img';
  image.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  image.setAttribute('data-src', DBHelper.imageUrlForRestaurant(restaurant) + '.jpg');
  image.alt = restaurant.name + ' is a ' + restaurant.cuisine_type + ' restaurant in ' + restaurant.address + '.';
  picture.append(image);

  const name = document.createElement('h3');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', restaurant.name);
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
var addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

/**
 * Initialize b-lazy
 */
document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    var bLazy = new Blazy({
      selector: '.restaurant-img',
      offset: 10
    });
  }
};
