/* Pins elements on scroll */

/* Uses jQuery Waypoints plugin and sticky-shortcut */

$(document).ready(function() {
  
  /* Sticky shortcut */ 
	$('#staticNavigationWrapper').waypoint('sticky', {
	  stuckClass : 'stuckStNav',
    handler : function(direction){
    var lp = $('#loggedUserPicture');
    var lw = $('#loggedUserWidget');
    var lpPosRight = ( $(window).width() - $("#content").width() ) / 2;
    var lpPosInit = lpPosRight + lw.width();
    
    lp.css({
  	  position : "fixed",
  	  right : lpPosRight,
  	  opacity : 0,
  	  top : 13
    });

    if (direction == "down") {
      lp
      .stop()
      .clearQueue()
      .animate({
        opacity : 1
      }, {
        duration : 500,
        easing : "easeOutSine"
      });
    } else {
      lp.css({
        "position" : "static",
        "right" : "",
        "top" : "",
        opacity : 1
      });
      }
    }   
	});

	$('#dynamicNavigation').waypoint('sticky', {
	  wrapper:'<div id="dynNaviWrapper" />',
	  stuckClass : 'stuckDNav'
	});
	
	/* Style functions */
	$('#staticNavigationWrapper').waypoint(function(direction) {
	  if(direction == 'down') {
	    $('#staticNavigationBG').addClass("stNavScrollStyles").stop().animate({
	    	backgroundColor:"#2c9fcc",
	    	opacity:"0.95",
	    	duration: 600,
	    	easing: "easeOutQuint",
	    });

	  } else {
		  $('#staticNavigationBG').removeClass("stNavScrollStyles").stop().animate({
			backgroundColor:"#216aa1",
			opacity:"0.5",
	    	duration: 200,
	    	easing: "easeOutQuint",

	    });
	  }
	});

});



