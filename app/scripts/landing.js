// when the page loads document, (document ready), there's a callback that gets the page to run the function that prints hello.
$(document).ready(function() {
  console.log("hello");
});

$(document).ready(function() {
  // this is a callback for when a click event happens on this element
  $('.hero-content h3').click(function() {
    var subText = $(this).text();
    $(this).text(subText + "!");
  });

  var onHoverAction = function(event) {
    console.log('Hover action triggered.');
    $(this).animate({'margin-top': '10px'});
  }
  
  var onHoverOffAction = function(event) {
    console.log('Hover off engaged');
    $(this).animate({'margin-top': '0px'});
  }

  $('.selling-points .point').hover(onHoverAction, onHoverOffAction);
});