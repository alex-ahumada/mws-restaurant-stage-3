let restaurant;
var map;
let reviews;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      var mapContainer = document.getElementById('map');
      var mapClicked = false;
      mapContainer.addEventListener("click", () => {
        if (!mapClicked) {
          self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: restaurant.latlng,
            scrollwheel: false
          });
          mapClicked = true;
        }
        DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
      });
      fillBreadcrumb();

      if (navigator.onLine) {
        const connectionStatus = document.getElementById('connection-status');
        connectionStatus.classList.add('hidden');
        sendCachedReviews();
      }
      else {
        const connectionStatus = document.getElementById('connection-status');
        connectionStatus.classList.remove('hidden');

        const reloadButton = document.getElementById('reload-button');
        reloadButton.addEventListener('click', reloadPage);
      }
    }
  });
};

var reloadPage = () => {
  location.reload();
};

/**
 * Get current restaurant from page URL.
 */
var fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }

      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
var fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const isFavorite = document.getElementById('is-favorite-button');
  const favoriteClass = restaurant.is_favorite ? "favorite" : "not-favorite";
  isFavorite.classList.add(favoriteClass);
  isFavorite.addEventListener("click", toggleFavorite);

  const isFavoriteText = document.getElementById('is-favorite-text');
  isFavoriteText.innerText = restaurant.is_favorite ? "Remove from favorites" : "Add to favorites";

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const imgSource = DBHelper.imageUrlForRestaurant(restaurant);

  const largeSourceWebp = document.getElementById('restaurant-source-large-webp');
  largeSourceWebp.srcset = imgSource + '-1600_large.webp 2x, ' + imgSource +'-800_large.webp';

  const largeSource = document.getElementById('restaurant-source-large');
  largeSource.srcset = imgSource + '-1600_large.jpg 2x, ' + imgSource +'-800_large.jpg';

  const mediumSourceWebp = document.getElementById('restaurant-source-medium-webp');
  mediumSourceWebp.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '_medium.webp';

  const mediumSource = document.getElementById('restaurant-source-medium');
  mediumSource.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '_medium.jpg';

  const webpSource = document.getElementById('restaurant-source-webp');
  webpSource.srcset = DBHelper.imageUrlForRestaurant(restaurant) + '.webp';

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant) + '.jpg';
  image.alt = restaurant.name + ' is a ' + restaurant.cuisine_type + ' restaurant in ' + restaurant.address + '.';

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }

  DBHelper.fetchReviewsByRestaurantId(self.restaurant.id, (error, reviews) => {
    self.restaurant.reviews = reviews;
    fillReviewsHTML();
  });

};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
var fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
var fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.prepend(ul);
  container.prepend(title);
};

/**
 * Create review HTML and add it to the webpage.
 */
var createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.updatedAt).toDateString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const deleteButton = document.createElement('a');
  deleteButton.classList.add('delete-review-button');
  deleteButton.classList.add('tooltip');
  deleteButton.innerHTML = '<span class="tooltip-text">Delete review</span>';
  li.appendChild(deleteButton);
  deleteButton.addEventListener('click', deleteReview);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  let idAttribute = document.createAttribute('data-id');
  idAttribute.value = review.id;
  li.attributes.setNamedItem(idAttribute);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
var fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.setAttribute('aria-current', 'page');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
var getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * Post review when after form validation
 */
var postReview = () => {
  const reviewsForm = document.getElementById('reviews-form');
  const formNotValidMessage = document.createElement('span');
  // Get form input value
  const reviewsFormTitle = document.getElementById('reviews-form-title');
  const nameInput = document.getElementById('review-name');
  const emailInput = document.getElementById('review-email');
  const ratingInput = document.querySelector('input[name="rating"]:checked');
  const commentsInput = document.getElementById('review-message');

  const name = nameInput.value;
  console.log('name: ' + name);
  const email = emailInput.value;
  console.log('email: ' + email);
  let rating;
  if(ratingInput != null) {
    rating = ratingInput.value;
  }
  console.log('rating: ' + rating);
  const comments = commentsInput.value;
  console.log('comments: ' + comments);

  // Validate form input
  let validForm = true;
  let validEmail = validateEmail(email);

  reviewsForm.classList.remove('not-valid');

  if (name == null || email == null || !validEmail || rating == null || comments == null || comments.trim() == "") {
    validForm = false;
  }

  if (validForm) {

    const messageToRemove = document.getElementById('form-not-valid-message');
    // Remove not valid message if present
    if (messageToRemove) {
      reviewsForm.classList.remove('not-valid');
      messageToRemove.parentNode.removeChild(messageToRemove);
      console.log('Removing not valid message');
    }

    // If valid, post review
    //console.log('New review for restaurant with ID: ' + self.restaurant.id + '\n From: ' + name + '\n Rating: ' + rating + '\n Comments: ' +message);
    fetch(DBHelper.REVIEWS_API, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "id": null,
        "restaurant_id": restaurant.id,
        "name": name,
        "rating": rating,
        "comments": comments,
        "createdAt": new Date(),
        "updatedAt": new Date()
      })
    })
      .then( response => {
        console.log('Review post success: ', response);

        // Update restaurant object reviews
        DBHelper.fetchReviewsByRestaurantId(self.restaurant.id, (error, reviews) => {
          self.restaurant.reviews = reviews;
          // Add new review to DOM
          const ul = document.getElementById('reviews-list');
          while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
          }
          self.restaurant.reviews.forEach(review => {
            ul.appendChild(createReviewHTML(review));
          });
        });
      })
      .catch( error => {
        console.log('Review post failure: ', error);
        const review = {
          id: 1,
          restaurant_id: restaurant.id,
          name: name,
          rating: rating,
          comments: comments,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        DBHelper.saveOfflineReview(review);
      });

  } else {
    console.log('From not valid!');

    reviewsForm.classList.add('not-valid');

    formNotValidMessage.innerText = 'Please fill all fields and select a rating score!';
    reviewsFormTitle.appendChild(formNotValidMessage);
    formNotValidMessage.setAttribute('id', 'form-not-valid-message');
  }
};

/**
 *
 */
var sendCachedReviews = () => {
  DBHelper.sendCachedReviews().then( cachedReview => {

    if (cachedReview != null) {
      fetch(DBHelper.REVIEWS_API, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "id": null,
          "restaurant_id": cachedReview.restaurant_id,
          "name": cachedReview.name,
          "rating": cachedReview.rating,
          "comments": cachedReview.comments,
          "createdAt": cachedReview.createdAt,
          "updatedAt": cachedReview.updatedAt
        })
      })
        .then( response => {
          console.log('Offline review post success: ', response);
          DBHelper.clearCachedReviews();

          // Update restaurant object reviews
          DBHelper.fetchReviewsByRestaurantId(self.restaurant.id, (error, reviews) => {
            self.restaurant.reviews = reviews;
            // Add new review to DOM
            const ul = document.getElementById('reviews-list');
            while (ul.firstChild) {
              ul.removeChild(ul.firstChild);
            }
            self.restaurant.reviews.forEach(review => {
              ul.appendChild(createReviewHTML(review));
            });
          });
        })
        .catch( error => {
          console.log('Review post failure: ', error);
        });
    }

  });
};

/**
 * Post review when after form validation
 */
var deleteReview = (event) => {
  let review = event.target.parentElement;
  let reviewId = review.getAttribute('data-id');

  fetch(DBHelper.REVIEW_DELETE_API + reviewId, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then( response => {
      console.log('Review deleted: ' + reviewId, response);

      // Reload restaurant object reviews
      DBHelper.fetchReviewsByRestaurantId(self.restaurant.id, (error, reviews) => {
        self.restaurant.reviews = reviews;
      });

      // Delete review element from DOM
      review.parentElement.removeChild(review);
    })
    .catch( error => {
      console.log('Review delete failed: ', error);
    });
};

/**
 * Add/remove restaurant to favorites
 */
var toggleFavorite = () => {
  const isFavorite = self.restaurant.is_favorite;

  fetch(DBHelper.RESTAURANT_FAVORITE_API + !isFavorite, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "is_favorite": !isFavorite
    })
  })
    .then( response => {
      console.log('Favorite status updated: ', response);
      const isFavorite = document.getElementById('is-favorite-button');
      const isFavoriteText = document.getElementById('is-favorite-text');

      if (isFavorite.classList.contains('favorite')) {
        isFavorite.classList.remove('favorite');
        isFavorite.classList.add('not-favorite');
        isFavoriteText.innerText = 'Add to favorites';
      } else {
        isFavorite.classList.add('favorite');
        isFavorite.classList.remove('not-favorite');
        isFavoriteText.innerText = 'Remove from favorites';
      }

      self.restaurant.is_favorite = !self.restaurant.is_favorite;
    })
    .catch( error => {
      console.log('Favorite status change failed: ', error);
    });

};

var reloadReviews = () => {

}

/**
 * Validate email input
 * @param email
 * @returns {boolean}
 */
var validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
