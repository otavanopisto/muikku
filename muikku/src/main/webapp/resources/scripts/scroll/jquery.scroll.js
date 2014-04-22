/* Pins elements on scroll */

/* Uses jQuery Waypoints plugin and sticky-shortcut */

$(document).ready(function() {
  
    /* Sticky shortcut */ 
  
	$('#staticNavigationWrapper').waypoint('sticky', {
	  stuckClass : 'stuckStNav',
	  handler : function(direction){
      if(direction == 'down'){
        $('.loggedUserPicture').css({
          "position" : "fixed",
          "z-index"  : "14"
        });
        $('.loggedUserPicture').stop().animate({
          duration: 6000,
          top: "15px",
          easing: "easeOutQuint",
          complete: function(){

          }
        
        });       
      }else{        
        $('.loggedUserPicture').css({
          "position" : "static"          
        });
        $('.loggedUserPicture').stop().animate({
          duration: 6000,
          easing: "easeOutQuint",
          complete: function(){
          }        
        });        
      }	    
	  }   
	});

	
	$('#dynamicNavigation').waypoint('sticky', {
	  wrapper:'<div id="dynNaviWrapper" />',
	  stuckClass : 'stuckDNav',
	 
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



