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



// Dynamic navigation -->

  $( "#dynamicNaviButton" ).click(function() {
   $( "#dynamicNaviContainer" ).toggle( "slide", 500 );
  });

// Widget settings tool area -->
  
  $( "div[class*='wi-frontpage']" ).mouseenter(function() {
    var tools =  $(this).find(".wi-frontpage-widget-toolarea");
     tools.show( "slide", 50 );
     
    });

  $( "div[class*='wi-frontpage']" ).mouseleave(function() {
    var tools =  $(this).find(".wi-frontpage-widget-toolarea");
     tools.hide( "slide", 50 );
    });



 // Widget dragging --> 
 
  $( "div[class*='wi-frontpage-dynamic']" ).draggable({ snapMode: "inner" });
    
 // Seeker functionalities -->

  
  $( "#seeker" ).focus(function() {
    $('#seeker').val('');
  });

   $( "#seeker" ).blur(function() {
     var sval = this.defaultValue;
      $('#seeker').val(sval);
    });

// fastlinks and dialogs for dock applications -->

$( "div[class*='wi-dock-navi']" ).mouseenter(function() {
  var tools =  $(this).find(".tt-container");
   tools.show( "drop", 150 );
   
  });

$( "div[class*='wi-dock-navi']" ).mouseleave(function() {
  var tools =  $(this).find(".tt-container");
   tools.hide( "drop", 150 );
  });





   $(function() {
     $( "div[class*='tt-dialog']" ).dialog({
       autoOpen: false,
       show: {
         effect: "blind",
         duration: 1000
       },
       hide: {
         effect: "explode",
         duration: 1000
       }
     });

      var links = $( "div[class*='tt-menu-link']" ).length;

      for (var i=0; i < links; i++){
        $( "div[class*='tt-menu-link']" ).click(function() {
          $( "div[class*='tt-dialog']" ).dialog( "open" );
        });

        }

      
   });    


});



