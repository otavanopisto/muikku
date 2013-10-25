/* Pins elements on scroll */

/* Uses jQuery Waypoints plugin and sticky-shortcut */



$(document).ready(function() {
  
  /* Sticky shortcut */ 
  
$('#staticNavigationFade').waypoint('sticky', {
  stuckClass : 'stuckStNav'

});


$('#dynamicNavigation').waypoint('sticky', {
  wrapper:'<div id="dynNaviWrapper" />',
  stuckClass : 'stuckDNav'
});


/* Style functions */

$('#staticNavigationFade').waypoint(function(direction) {
  if(direction == 'down')
    $('#staticNavigation').addClass( "stNavScrollStyles", 500, "easeOutQuint" );
  else
    $('#staticNavigation').removeClass( "stNavScrollStyles");
});


});



