(function($){

  $.fn.m3modal = function(prop){
    
    var options = $.extend({

     // Modal options
    	
      height : "200",
      modalgrid : 24,
      contentgrid : "24",
      conditionalContent : "none",
      conditional : false,
      title:"Muikku 3 Modal",
      description: "Lorem ipsum dolor sit amet.",
      top: "10px",
      content : $('<div> Default content. Nulla ut eleifend lacus, sed aliquam arcu. Cras condimentum id mi vitae porttitor. Curabitur efficitur aliquam ligula semper eleifend. Sed lacinia neque rhoncus ultrices varius. Donec bibendum in lorem quis ultrices. Nunc ultrices sem velit, vel congue dolor dignissim ut. Mauris in sapien mauris. Phasellus venenatis porta risus, a ullamcorper risus venenatis quis. Nunc sit amet venenatis ipsum. Suspendisse sit amet posuere magna, vitae bibendum magna. Donec ullamcorper mauris at velit consectetur consectetur. Praesent varius dolor egestas nibh posuere, non egestas purus ultricies. Ut facilisis arcu et eleifend placerat. Nullam quis semper dui. Suspendisse laoreet sit amet neque sit amet accumsan.</div>'),
      onBeforeOpen: undefined

    },prop);
        
    var _this = this;
    
    return this.on("click", function(e){
      e.stopPropagation();	
      bgrElement();
      boxElement();
      elemStyles();
      if (options.onBeforeOpen)
        options.onBeforeOpen(_this);
      $('.md-box').fadeIn();  
      
    });

    function bgrElement(){
    	
    	var bgE = $('<div class="md-background"><span class="md-close"></span></div>');   	
    	$(bgE).appendTo('body');

//    	$('.md-background').click(function(e){
//    		e.stopPropagation();	   	
//             	 $(this).fadeOut().remove();	
//         });
    	$('.md-close').click(function() {
    	  closeModal();
      });     
    }

    function closeModal() {
      $('.md-background').fadeOut().remove();
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
       var mLeft = ($(window).width() - $(".md-box").width()) / 2 + $(window).scrollLeft() + "px";
      
       // Box 		
      
       box.css({
        'position' : 'absolute',
        'top' :options.top,
        'padding' : '15px',
        'left' : mLeft,
        'display' : 'none',
        'margin-left' :options.marginLeft,
        'min-height' : options.height +'px',
 //       'width' : options.width + 'px',     
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
          'z-index' : '100'
        });      
    }
    
    function createButton(buttonOptions, contentElement) {
      return $('<input>')
        .addClass('bt-generic bt-modal')
        .attr({
          type: 'button',
          name: buttonOptions.name,
          value: buttonOptions.caption
        }).click(function (e) {
          buttonOptions.action({
            contentElement: contentElement
          });
        });
    }
    
    function boxElement(){
    	var _this = this;
    	var loGridSize = options.modalgrid - options.contentgrid;
    	var bE = $('<div class="md-box container_24"></div>') ;
    	var dE = $('<div class="md-description grid_24"><h2>' + options.title + '</h2><p>' + options.description + '</p></div>') ;
    	var cE = $('<div class="md-content grid_24 nomargin nolid"></div>') ;
      if(options.conditional == true){
        options.content.prepend(options.conditionalContent);
      }    
      options.content.addClass(' md-content-primary grid_' + options.contentgrid );
      cE.append(options.content);
      bE.append(dE,cE);

        if (loGridSize > 0){
        	var scndCE = $('<div class="md-content-secondary ' + "grid_" + loGridSize + '"></div>') ;
        	cE.append(scndCE);
        }else{
        	var scndCE = $('<div class="md-content-secondary ' + "grid_" + options.modalgrid + '"></div>') ;
        	cE.append(scndCE);
        }
        
    	if (options.buttons) {
    	  var contentButtons = $('<div>').addClass('md-content-buttons');
    	  
    	  for (var i = 0, l = options.buttons.length; i < l; i++) {
    	    contentButtons.append(createButton(options.buttons[i], cE));
    	  }
    	  
    	  contentButtons.appendTo(scndCE);
    	}
    	
    	if (options.options) {
      	  var oSE = $('<div class="md-content-options"></div>') ;
      	  
      	  
      	  for (var i = 0; i < options.options.length; i++) {
      	    var oPuT = $('<input type="' + options.options[i].type + '" name="' + options.options[i].name + i + '" value="' + options.options[i].caption + '">' + options.options[i].caption + '</input>');
      	    oSE.append(oPuT);
    	    oSE.prependTo(scndCE)
      	  }
      	}
    	bE.appendTo('.md-background');
    	
    }
        
    
    return this;
  };
  
})(jQuery);
