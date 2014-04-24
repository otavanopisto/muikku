/* Pins elements on scroll */

/* Uses jQuery Waypoints plugin and sticky-shortcut */

$(document).ready(function() {
  
    /* Sticky shortcut */ 
    
  
  
	$('#staticNavigationWrapper').waypoint('sticky', {
	  stuckClass : 'stuckStNav',
	  handler : function(direction){
	    var lup = $('.loggedUserPicture');
	    var luw = $('.loggedUserWidget');
      var luwPos = luw.position();	    
      var lupPos = lup.position(); 
      if(direction == 'down'){
        lup.css({
          "position" : "fixed",
           top: lupPos.top,
           right : lupPos.right,  
          "z-index"  : "14"
        });
        lup.animate({
          duration: 600,
          top: "15px",
          right : "5px",  
          easing: "easeOutQuint"
        });       
      }else{        
        lup.animate({
          duration: 600,
          top: luwPos.top,
          right : luwPos.right,          
          easing: "easeOutQuint"},
         {complete : function(){
           lup.css({
             
             "position" : "static",
              top: "auto",
              left: "auto",  
              right: "auto"      
              
           });

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



