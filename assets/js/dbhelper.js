/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * SERVER PORT NUMBER
   */
  static get PORT() {
    return 1337;
  }

  /**
   * URL for restaurants endpoint
   */
  static get RESTAURANTS_API() {
    return `http://localhost:${DBHelper.PORT}/restaurants`;
  }

  /**
   * URL for reviews endpoint
   */
  static get REVIEWS_API() {
    return `http://localhost:${DBHelper.PORT}/reviews/`;
  }

  /**
   * URL for reviews per restaurant id endpoint
   */
  static get RESTAURANT_REVIEWS_API() {
    return `http://localhost:${DBHelper.PORT}/reviews/?restaurant_id=${DBHelper.getParameterByName('id')}`;
  }

  /**
   * GET Query String From URL
   * @param {*} name
   * @param {*} url
   */
  static getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }


  /**
   * Open database
   */
  static openRestaurantsDB() {
    // If the browser doesn't support service worker,
    // we don't care about having a database
    if (!navigator.serviceWorker) {
      console.log('This browser doesn\'t support Service Worker');
      return Promise.resolve();
      if (!('indexedDB' in window)) {
        console.log('This browser doesn\'t support IndexedDB');
        return Promise.resolve();
      }
    }

    return idb.open('restaurant-reviews-db', 2, function(upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          const restaurantsStore = upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
          restaurantsStore.createIndex('by-name', 'name');
          restaurantsStore.createIndex('by-date', 'createdAt');
          restaurantsStore.createIndex('by-cuisine', 'cuisine_type');
          restaurantsStore.createIndex('by-neighborhood', 'neighborhood');
        case 1:
          const reviewsStore = upgradeDb.createObjectStore('reviews', { keyPath: 'id' });
          reviewsStore.createIndex('by-restaurant', 'restaurant_id');
      }
    });
  }

  /**
   * Fetch all reviews.
   */
  static fetchReviews(callback) {

    fetch(DBHelper.REVIEWS_API).then(reviews => {
      return reviews.json();
    })
      .then(reviews => {
        this.openRestaurantsDB().then(function (db){
          let tx = db.transaction('reviews', 'readwrite');
          let reviewsStore = tx.objectStore('reviews');
          reviews.forEach(review => {
            reviewsStore.put(review);
          });

          callback(null, reviews)
        });
      })
      .catch(error => {
        //If online request fails try to catch local idb data
        this.openRestaurantsDB().then(function (db) {
          let tx = db.transaction('reviews');
          let store = tx.objectStore('reviews');
          store.getAll().then(reviews => {
            callback(null, reviews)
          })
            .catch(error => callback(error, null));
        })
          .catch(error => callback(error, null));
      });
  }

  /**
   * Fetch a review by its ID.
   */
  static fetchReviewById(id, callback) {
    // fetch all reviews with proper error handling.
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        const review = reviews.find(r => r.id == id);
        if (review) { // Got the review
          callback(null, review);
        } else { // Review does not exist in the database
          callback('Review does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch reviews by restaurant id with proper error handling.
   */
  static fetchReviewsByRestaurantId(restaurant, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchReviews((error, reviews) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = reviews.filter(r => r.restaurant_id == restaurant);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    fetch(DBHelper.RESTAURANTS_API).then(restaurants => {
      return restaurants.json();
    })
      .then(restaurants => {
        //If online request return data fill idb
        this.openRestaurantsDB().then(function (db) {
          var tx = db.transaction('restaurants', 'readwrite');
          var restaurantsStore = tx.objectStore('restaurants');
          restaurants.forEach(restaurant => {
            restaurantsStore.put(restaurant);
          });

          // limit store to 10 items
          restaurantsStore.index('by-date').openCursor(null, "prev").then(function(cursor) {
            return cursor.advance(10);
          }).then(function deleteRest(cursor) {
            if (!cursor) return;
            cursor.delete();
            return cursor.continue().then(deleteRest);
          });

          callback(null, restaurants)
        });
      })
      .catch(error => {
        //If online request fails try to catch local idb data
        this.openRestaurantsDB().then(function (db) {
          var tx = db.transaction('reviews');
          var store = tx.objectStore('reviews');
          store.getAll().then(reviews => {
            callback(null, reviews)
          })
            .catch(error => callback(error, null));
        })
          .catch(error => callback(error, null));
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return restaurant.photograph == null ? '/img/missing-image' : (`/img/${restaurant.photograph}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

  static cleanImageCache() {
    return DBHelper.openRestaurantsDB().then(function(db) {
      if (!db) return;

      var imagesNeeded = [];

      var tx = db.transaction('restaurants');
      return tx.objectStore('restaurants').getAll().then(function(restaurants) {
        restaurants.forEach(function(restaurant) {
          if (restaurant.photograph) {
            imagesNeeded.push(restaurant.photograph);
          }
        });

        return caches.open('restaurant-reviews-content-imgs');
      }).then(function(cache) {
        return cache.keys().then(function(requests) {
          requests.forEach(function(request) {
            var url = new URL(request.url);
            var urlIndex = url.pathnames.substring(0, url.pathnames.indexOf('_'));
            if (!imagesNeeded.includes(urlIndex)) cache.delete(request);
          });
        });
      });
    });
  }

}
