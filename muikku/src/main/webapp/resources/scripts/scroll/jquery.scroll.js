/* Pins elements on scroll */

/* Uses jQuery Waypoints plugin and sticky-shortcut */



$(document).ready(function() {
$('#staticNavigationFade').waypoint('sticky', {
  stuckClass : 'stuckStNav'
});
$('#dynamicNavigation').waypoint('sticky', {
  wrapper:'<div id="dynNaviWrapper" />',
  stuckClass : 'stuckDNav'
});

});



