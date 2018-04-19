/**
 * Common database helper functions.
 */
class DBHelper {

  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337;
    return `http://localhost:${port}/restaurants`;
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

    return idb.open('restaurant-reviews-db', 1, function(upgradeDb) {
      switch (upgradeDb.oldVersion) {
        case 0:
          const restaurantsStore = upgradeDb.createObjectStore('restaurants', { keyPath: 'id' });
          restaurantsStore.createIndex('by-name', 'name');
          restaurantsStore.createIndex('by-date', 'createdAt');
          restaurantsStore.createIndex('by-cuisine', 'cuisine_type');
          restaurantsStore.createIndex('by-neighborhood', 'neighborhood');
      }
    });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {

    fetch(DBHelper.DATABASE_URL).then(restaurants => {
      return restaurants.json();
    })
      .then(restaurants => {
        //If online request return data fill idb
        this.openRestaurantsDB().then(function (db) {
          var tx = db.transaction('restaurants', 'readwrite')
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
          var tx = db.transaction('restaurants')
          var store = tx.objectStore('restaurants');
          store.getAll().then(restaurants => {
            callback(null, restaurants)
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
