$(document).ready(function () {
  checkedAmenities = [];
  $('.amenities .popover ul li input').each(function(i, item) {
    $(item).onchange = function () {
      console.log($(item).checked);
      console.log($(item));
    }
    // console.log('index is ' + i);
    // console.log('item is ' + $(item).attr('data-id'));
    // console.log('item is ' + $(item).attr('data-name'));
    checkedAmenities.push($(item).attr('data-id').val());
  });
  console.log(checkedAmenities);
});
