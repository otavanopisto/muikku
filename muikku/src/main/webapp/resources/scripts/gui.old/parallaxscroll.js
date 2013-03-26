

function xScrolling() {
  Event.observe(window, 'scroll', function() {	
	var fromTop = document.viewport.getScrollOffsets().top,
	    headerHeight = $('header').getHeight(),
	    staticNaviMarginTop = parseInt($('staticNavigation').getStyle('margin-top').replace('px' , '')),
	    staticNaviMarginBottom = parseInt($('staticNavigation').getStyle('margin-bottom').replace('px' , '')),
	    staticNaviHeight = parseInt($('naviDock').getHeight()) + staticNaviMarginTop + staticNaviMarginBottom,
        dynamicNaviTop = headerHeight + staticNaviHeight;
        
	if (fromTop > headerHeight){
      $('staticNavigationFade').addClassName('fixedNavigation');
	}else{
	  $('staticNavigationFade').removeClassName('fixedNavigation');
	
	}
	
	if (fromTop < headerHeight) {			

			$$('div.xDyn').invoke('setStyle' , 
						{
							top: dynamicNaviTop - fromTop +'px'
							
						}
						);
	}else{
		$$('div.xDyn').invoke('setStyle' , 
				{
					top: staticNaviHeight + 'px'
					
				}
				);				
	}
} );
	

}

Event.observe(window, "load", function(){
	xScrolling();
	});
