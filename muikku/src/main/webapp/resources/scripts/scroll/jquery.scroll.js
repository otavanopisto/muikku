/* Pins elements on scroll */

/* Uses jQuery Waypoints plugin and sticky-shortcut */

$(document).ready(function() {
  
    /* Sticky shortcut */ 
  
	$('#staticNavigationWrapper').waypoint('sticky', {
	  stuckClass : 'stuckStNav'
	});
	
	$('#dynamicNavigation').waypoint('sticky', {
	  wrapper:'<div id="dynNaviWrapper" />',
	  stuckClass : 'stuckDNav'
	});
	
	/* Style functions */
	
	$('#staticNavigationWrapper').waypoint(function(direction) {
	  if(direction == 'down')
	    $('#staticNavigationBG').addClass("stNavScrollStyles", 800, "easeOutQuint");
	  else
	    $('#staticNavigationBG').removeClass("stNavScrollStyles");
	});


});



