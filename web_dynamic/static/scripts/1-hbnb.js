const checkedAmenities = {};
$(document).ready(function () {
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
});
