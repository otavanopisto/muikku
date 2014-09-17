(function($){

  $.fn.m3modal = function(prop){
    
    var options = $.extend({
      height : "600",
      width : "960",
      title:"Muikku 3 Modal",
      description: "Lorem ipsum dolor sit amet.",
      top: "20%",
      left: "20%",
    },prop);
        
    return this.click(function(e){
      bgrElem();
      contElem();
      elemStyles();     
      
      $('md-box').fadeIn();
      
    });


    
    function bgrElem(){
    	var bgE = $('<div class="md-background"><span class="md-close"></span></div>');   	
    	$(bgE).appendTo('body');
        $('.md-background').click(function(){
 
             	 $(this).fadeOut().remove();

        	
        });
    	$('.md-close').click(function(){
        	 $(this).fadeOut().remove();

    		
    	});     
    }
    
    function elemStyles(){
    	
     // Content box 	
    	
      $('.md-box').css({
        'position' : 'absolute',
        'left' :options.left,
        'top' :options.top,
        'display' : 'none',
        'height' : options.height +'px',
        'width' : options.width + 'px',     
      });
      
      //  Close button 
      
      $('.md-close').css({
          'position' : 'relative',
          'right' : '10px',
          'top' : '10px',
          'display' : 'block', 
        });
      $('md-close').addClass('icon-close');     
      
     // Background
      
      var pH = $(document).height(); 
      var pW = $(window).width(); 
      
      $('.md-background').css({
          'position' : 'absolute',
          'left' : '0',
          'top' : '0',
          'height' : pH,
          'width' : pW,
          'z-index' : '10'
        });      
    }
    
    function contElem(){
    	var cE = $('<div class="md-box"></div>') ;
    	cE.appendTo('.md-background');
    }
        
    
    return this;
  };
  
})(jQuery);