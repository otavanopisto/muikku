$(document).ready(function() {

	// Dynamic navigation
	
	var ht = $(window).height();
	var bgr = $('.wi-dock-dynami-navi-contentBgr');
	bgr.height(ht);
	
	$(window).resize(function(){
		bgr.height($(window).height());
        
    });
    	  
    $( "#dynamicNaviButton" ).click(function() {
    	var container = $('#dynamicNaviContainer');
        if (container.css("opacity") == "0"){
        	container.css({
        		"display" : "block"
            });
            container.animate({
            	"margin-left" : "0",
                opacity : 1
            }, 100, "easeOutSine");    
            
            } else {
              container.animate({
            		"margin-left" : "-300px",
            		opacity : 0
                 }, {
                	 duration: 100,
                	 easing: "easeOutSine",
                	 complete: function() {
                	   container.css({
                			 "display" : "none"
                         });              
                     }
                });
            }
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

    
    
    $("a[class*='icon-search']").click(function(){
   
      var sc = $(".wi-dock-search");
      var visible = sc.css("opacity");
      
      if(visible == "0"){
        sc.css({
          "display" : "block",
          opacity : 1
          });
        
        sc.animate({
          "width" : "300px"
             }, {
             duration: 100,
             easing: "easeOutSine"
               
          });      
     }else{
        sc.animate({
          "width" : "0",
           }, {
             duration: 100,
             easing: "easeOutSine",
             complete: function() {
               sc.css({
                 "display" : "none",
                  "opacity" : "0"
                   
                   });              
               }
          });  
      }
    });
    
    // Search field toggle
    
    
    
    $(".icon-search").click(function(){
    	
    	var sc = $(".wi-dock-search");
      
    	sc.css({
    		"display" : "block",
    	     opacity : 1
        });
    	
    	sc.animate({width:300},{
    		duration : 100,
    		easing : "easeInOutElastic",
            complete: function(){
                var seeker = $("#seeker");
            	
    			seeker.focus();
    			seeker.blur(function(){
    				
    				sc.animate({width:0},{
    					duration : 100,
    					easing : "easeInOutElastic",
    				    complete : function(){
    				    	
    	    				sc.css({
    	    					"display" : "none",
    	    					 opacity : 0
    	    				});
    				    }
    				});
    				
    			});
    		}
    		
    	});

    });
    
    
    // Toooltip 
    
    
    $("div[class*='wi-dock-static-navi']").mouseenter(function() {
    	var tooltip = $(this).find("[class*='dock-navi-tt-container']");
    	var innerTooltip = tooltip.children('div');

    	tooltip.css({
    		"display" : "block"
    	     
        });

    	tooltip.animate({
    		height:"300px",
    		opacity:1
    	}, {
    		duration : 175,
    		easing: "easeInOutQuad",
    		complete : function(){
              // This is for added functions. In the future. Of mankind.
    		}      
    	});
    	
        // Offsets
        
        var iconOffset = tooltip.parent().offset().left + 15;
        var tOffset = tooltip.offset().left;
        var paddingOffset = tOffset + 20;
                  
        // Sets tooltip's inner elements padding-left same as tooltip's left position 
        // and sets background-position relative to icons position
        
        innerTooltip.css({
          paddingLeft: paddingOffset + 'px',
          backgroundPosition: iconOffset + 'px 0px'
        });
           
        // Sets tooltip's width same as view port width 
        // and left position is adjusted accordingly
        
        tooltip.css({
          width: $(window).width(),
          left:-tOffset + 'px'
        });      
    });

    $("div[class*='wi-dock-static-navi']").mouseleave(function() {
    	var tooltip =  $(this).find("[class*='dock-navi-tt-container']");
    	
//    	tooltip.clearQueue().stop();
    	
    	tooltip.clearQueue().finish().animate({
    		height:"0",
    		opacity:0
    	}, {
    		duration : 100,
    		easing: "easeInOutQuad",
    		complete : function(){
            	tooltip.css({
            		"display" : "none",
            	     opacity : 0,
            	    "left" : "0"
                });   			
    		}
    	});
    });
});



