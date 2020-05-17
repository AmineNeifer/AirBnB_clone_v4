const checkedAmenities = {};
const checkedStates = {};
const checkedCities = {};
const placeSearchURL = 'http://0.0.0.0:5001/api/v1/places_search/';
const statusURL = 'http://0.0.0.0:5001/api/v1/status/';


function getReviews (place_id) {
  let reviews;
  const getReviewsURL = 'http://0.0.0.0:5001/api/v1/places/' + place_id + '/reviews';
  const getUserURL = 'http://0.0.0.0:5001/api/v1/users/';
  $.ajax({
    async: false,
    url: getReviewsURL,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      reviews = data;
    }
  });
  for (let i = 0; i < reviews.length; i++) {
    $.ajax({
      async: false,
      url: getUserURL + reviews[i].user_id,
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log(moment(data.updated_at, 'MMMM Do YYYY'));
        reviews[i].userName = data.first_name + ' ' + data.last_name;
      }
    });
  }
  console.log(reviews);
  return reviews;
}

function placeHtml (place) {
  const guest = (place.max_guest === 1) ? 'Guest' : 'Guests';
  const bedroom = (place.number_rooms === 1) ? 'Bedroom' : 'Bedrooms';
  const bathroom = (place.number_bathrooms === 1) ? 'Bathroom' : 'Bathrooms';
  const description = place.description;
  const html = `<article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">$${place.price_by_night}</div>
      </div>

      <div class="information">
        <div class="max_guest">${place.max_guest} ${guest}</div>
            <div class="number_rooms">${place.number_rooms} ${bedroom}</div>
            <div class="number_bathrooms">${place.number_bathrooms} ${bathroom}</div>
      </div>
    ${
      (place.description !== null)
      ? '<div class="description">' +
        description +
      '</div>'
      : ''
    }
    <div class="reviews">
    <h2>Reviews <span>Show</span></h2>
       	<ul>
			<li>
				<h3>From Jordan Peterson the 9th November 2014</h3>
				<p>I had a great time witsdh family, I highly recommend it four a family gathering.</p>
			</li>
		</ul>
	  </div>
    </article>`;
  getReviews(place.id);
  return html;
}

$(document).ready(function () {
  const moment = moment();
  const sectionPlaces = $('SECTION.places');
  const btn = $('.filters button');

  $.ajax({
    url: placeSearchURL,
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    success: function (data) {
      for (const place of data) {
        sectionPlaces.append(placeHtml(place));
      }
    }
  });

  $.getJSON(statusURL, function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $('.amenities .popover ul li :input').each(function (i) {
    const item = $(this)[0];
    item.onchange = function (e) {
      const itemId = item.getAttribute('data-id');
      if (!(itemId in checkedAmenities)) {
        checkedAmenities[itemId] = item.getAttribute('data-name');
      } else {
        delete checkedAmenities[itemId];
      }
      let str = '';
      const amenityNames = Object.values(checkedAmenities);
      for (let i = 0; i < amenityNames.length; i++) {
        str += amenityNames[i];
        if (i < amenityNames.length - 1) {
          str += ', ';
        }
      }
      $('.amenities h4').html(str);
    };
  });

  $('.locations .popover ul li :input').each(function (i) {
    const item = $(this)[0];
    item.onchange = function (e) {
      const itemId = item.getAttribute('data-id');
      const itemName = item.getAttribute('data-location-name');
      if (itemName === 'state') {
        if (!(itemId in checkedStates)) {
          checkedStates[itemId] = item.getAttribute('data-name');
        } else {
          delete checkedStates[itemId];
        }
      } else if (itemName === 'city') {
        if (!(itemId in checkedCities)) {
          checkedCities[itemId] = item.getAttribute('data-name');
        } else {
          delete checkedCities[itemId];
        }
      }
      let str = '';
      const locationNames = Object.values(checkedStates).concat(Object.values(checkedCities));
      for (let i = 0; i < locationNames.length; i++) {
        str += locationNames[i];
        if (i < locationNames.length - 1) {
          str += ', ';
        }
      }
      $('.locations h4').html(str);
    };
  });

  btn.click(function () {
    $.ajax({
      url: placeSearchURL,
      type: 'POST',
      data: JSON.stringify({
        states: Object.keys(checkedStates),
        cities: Object.keys(checkedCities),
        amenities: Object.keys(checkedAmenities)
      }),
      contentType: 'application/json',
      success: function (data) {
        sectionPlaces.html('');
        for (const place of data) {
          sectionPlaces.append(placeHtml(place));
        }
      }
    });
  });
});
