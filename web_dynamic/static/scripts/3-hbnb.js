function placeHtml (place) {
  const guest = (place.max_guest === 1) ? 'Guest' : 'Guests';
  const bedroom = (place.number_rooms === 1) ? 'Bedroom' : 'Bedrooms';
  const bathroom = (place.number_bathrooms === 1) ? 'Bathroom' : 'Bathrooms';
  const html = `<article>
      <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">${place.price_by_night}</div>
      </div>

      <div class="information">
        <div class="max_guest">${place.max_guest} ${guest}</div>
            <div class="number_rooms">${place.number_rooms} ${bedroom}</div>
            <div class="number_bathrooms">${place.number_bathrooms} ${bathroom}</div>
      </div>

      <div class="description">
        ${place.description}
          </div>
    </article>`;
  return html;
}
const checkedAmenities = {};
$(document).ready(function () {
  $('.amenities .popover ul li :input').each(function (i) {
    const item = $(this)[0];
    item.onchange = function (e) {
      const itemId = item.getAttribute('data-id');
      if (checkedAmenities.itemId === undefined) {
        checkedAmenities[itemId] = item.getAttribute('data-name');
      } else {
        delete checkedAmenities[itemId];
      }
      let str = '';
      const names = Object.values(checkedAmenities);
      for (let i = 0; i < names.length; i++) {
        str += names[i];
        if (i < names.length - 1) {
          str += ', ';
        }
      }
      $('.amenities h4').html(str);
    };
  });

  const url = 'http://0.0.0.0:5001/api/v1/status/';
  $.getJSON(url, function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  const url2 = 'http://0.0.0.0:5001/api/v1/places_search/';
  $.ajax({
    url: url2,
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    success: function (data) {
      for (const place of data) {
        $('SECTION.places').append(placeHtml(place));
      }
    }
  });
});
