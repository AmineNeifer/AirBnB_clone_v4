let checkedAmenities = {};
let h4 = $('.amenities h4');
$(document).ready(function () {
  $('.amenities .popover ul li :input').each(function(i) {
    let item = $(this)[0];
    item.onchange = function (e) {
      let itemId = item.getAttribute('data-id');
      if (!checkedAmenities.hasOwnProperty(itemId)) {
	checkedAmenities[itemId] = item.getAttribute('data-name');
      } else {
	delete checkedAmenities[itemId];
      }
      let str = '';
      let names = Object.values(checkedAmenities);
      for (let i = 0; i < names.length; i++) {
	str += names[i];
	if (i < names.length - 1) {
	  str += ', ';
	}
      }
      $('.amenities h4').html(str);
    }
  });
});
