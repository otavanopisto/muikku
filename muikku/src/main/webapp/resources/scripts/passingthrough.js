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
    
    $( "div[class*='wi-dock-navi']" ).mouseenter(function() {
      var tools =  $(this).find("[class*='dock-navi-tt-container']");
       tools.show( "drop", 150 );
       
      });

    $( "div[class*='wi-dock-navi']" ).mouseleave(function() {
      var tools =  $(this).find("[class*='dock-navi-tt-container']");
       tools.hide( "drop", 150 );
      });



    
   
       $(function() {
         
         // Creates dialogs from every element with pseudclass tt-dialog //
         

         
         var ttDockParents =  $("[class*='dock-navi-tt-container']");
         
         for (var i = 0; i < ttDockParents.length; i++)
         {
          

            var linkParent = $(ttDockParents)[i];
            var rootParent = $(linkParent).parent()[0];
  
             if (linkParent.children.length > 0){
              var links = $(linkParent).find( "div[class*='tt-menu-link']" );

              for (var i=0; i < links.length; i++){
                var link = $(links)[i];
               
                var lnam = $(link).attr("data-name");
                var dclass = 'div[class*="tt-dialog-' + lnam + '"]:hidden';
                var dlog = $(dclass)[0];
                
                $( dlog ).dialog({
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
                
                $(link).click(function() {
                  $( dlog ).dialog( "open" );
                });
                } 
             
             }
                
            
       
     
        
            
           
         }
         
         



          
       });
});