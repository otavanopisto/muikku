$(document).ready(function() {
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
    
    $( "div[class*='wi-dock-static-navi']" ).mouseenter(function() {
      var tools = $(this).find("[class*='dock-navi-tt-container']");
      tools.stop().show("fade", 50);
    });

    $( "div[class*='wi-dock-static-navi']" ).mouseleave(function() {
      var tools =  $(this).find("[class*='dock-navi-tt-container']");
       tools.stop().hide("fade", 50);
    });

});
