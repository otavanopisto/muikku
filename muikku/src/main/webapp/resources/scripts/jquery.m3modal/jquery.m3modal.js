(function($){

  $.fn.m3modal = function(prop){
    
    var options = $.extend({

     // Modal options
    	
      height : "200",
      width : "960",
      title:"Muikku 3 Modal",
      description: "Lorem ipsum dolor sit amet.",
      top: "10px",
      content : $('<div> Default content. Nulla ut eleifend lacus, sed aliquam arcu. Cras condimentum id mi vitae porttitor. Curabitur efficitur aliquam ligula semper eleifend. Sed lacinia neque rhoncus ultrices varius. Donec bibendum in lorem quis ultrices. Nunc ultrices sem velit, vel congue dolor dignissim ut. Mauris in sapien mauris. Phasellus venenatis porta risus, a ullamcorper risus venenatis quis. Nunc sit amet venenatis ipsum. Suspendisse sit amet posuere magna, vitae bibendum magna. Donec ullamcorper mauris at velit consectetur consectetur. Praesent varius dolor egestas nibh posuere, non egestas purus ultricies. Ut facilisis arcu et eleifend placerat. Nullam quis semper dui. Suspendisse laoreet sit amet neque sit amet accumsan.</div>')

    },prop);
        
    return this.on("click", function(e){
      e.stopPropagation();	
      bgrElement();
      boxElement();
      elemStyles();     
      $('.md-box').fadeIn();  
      
    });

    function bgrElement(){
    	
    	var bgE = $('<div class="md-background"><span class="md-close"></span></div>');   	
    	$(bgE).appendTo('body');
    //  Does not work as intended
    //	$('.md-background').click(function(){
 
      //       	 $(this).fadeOut().remove();

        	
        // });
    	$('.md-close').click(function(){
        	 $(this).fadeOut().remove();
           	 $('.md-background').fadeOut().remove();
    		
    	});     
    }
    
    function elemStyles(){
       
       var box = $('.md-box');
       var closeB = $('.md-close');
       var content = $('.md-content');
       var descr = $('.md-description');
       var bgr = $('.md-background');
       var pH = $(document).height(); 
       var pW = $(window).width();    
       var bw = box.outerWidth()
       var mLeft = ($(window).width() - options.width) / 2 + $(window).scrollLeft() + "px";
       
       // Box 		
      
       box.css({
        'position' : 'fixed',
        'top' :options.top,
        'padding' : '15px',
        'left' : mLeft,
        'display' : 'none',
        'margin-left' :options.marginLeft,
        'min-height' : options.height +'px',
        'width' : options.width + 'px',     
      });
 
      
      content.css({
	    'margin-top' : '15px'
      });

      descr.css({
  	    'padding' : '25px'	
        });      
      
      //  Close button 
      
       closeB.css({
          'position' : 'fixed',
          'right' : '30px',
          'top' : '10px',	
          'display' : 'block',
          'height' : '10px',
          'cursor': 'pointer'
        	  
        });
      closeB.addClass('icon-close');     
      
     // Background
      

      
      bgr.css({
          'position' : 'absolute',
          'left' : '0',
          'top' : '0',
          'height' : pH,
          'z-index' : '15'
        });      
    }
    
    function boxElement(){
    	
    	var bE = $('<div class="md-box"></div>') ;
    	var dE = $('<div class="md-description"><h2>' + options.title + '</h2><p>' + options.description + '</p></div>') ;
        var cE = $('<div class="md-content"></div>') ;

        cE.append(options.content);
        bE.append(dE,cE);
    	bE.appendTo('.md-background');
    }
        
    
    return this;
  };
  
})(jQuery);