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
    });
            
    function bgrElem(){
    	var bgE = $('<div class="md-background"></div>');   	
    	$(bgE).appendTo('body');
    }
    
    function elemStyles(){
     // Content box 	
      $('md-box').css({
        'position' : 'absolute',
        'left' :options.left,
        'top' :options.top,
        'display' : 'none',
        'height' : options.height +'px',
        'width' : options.width + 'px',     
      });
      //  Close button 
      $('md-close').css({
          'position' : 'relative',
          'right' : '10px',
          'top' : '10px',
          'display' : 'block', 
        });
      $('md-close').addClass('icon-close');     
      
     // Background
      
      var pH = $(document).height; 
      var pW = $(window).width; 
      
      $('md-background').css({
          'position' : 'absolute',
          'left' : '0',
          'top' : '0',
          'height' : pageHeight,
          'width' : pageWidth,
          'z-index' : '1+'
        });      
    }
    
    function contElem(){}
        
    
    return this;
  };
  
})(jQuery);