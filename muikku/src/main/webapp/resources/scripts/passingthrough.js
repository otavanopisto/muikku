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
    
    $("div[class*='wi-dock-static-navi']").mouseenter(function() {
      var tooltip = $(this).find("[class*='dock-navi-tt-container']");
      var innerTooltip = tooltip.children('div');
      
      tooltip.stop().show("fade", 100);
      
      // Offsets
      var iconOffset = tooltip.parent().offset().left + 15;
      var tOffset = tooltip.offset().left;

      // Sets tooltip's width same as view port width 
      // and left position is adjusted accordingly
      tooltip.css({
    	width: $(window).width(),
    	left:-tOffset
      });
      
      // Sets tooltip's inner elements padding-left same as tooltip's left position 
      // and sets background-position relative to icons position
      innerTooltip.css({
    	  paddingLeft: tOffset, 
    	  backgroundPosition: iconOffset+'px 0px'
      });
      
    });

    $("div[class*='wi-dock-static-navi']").mouseleave(function() {
      var tooltip =  $(this).find("[class*='dock-navi-tt-container']");
      tooltip.stop().hide();
      tooltip.css({
    	 left: "0px"
      });
    });

});
