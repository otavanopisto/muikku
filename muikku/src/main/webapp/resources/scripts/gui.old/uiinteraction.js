
/* "Parallax" - scrolling elements */

ParallaxScrolling = Class.create({
  initialize: function () {
    this._windowScrollListener = this._onWindowScroll.bindAsEventListener(this);
    
    Event.observe(window, "scroll", this._windowScrollListener);
  },

  deinitialize: function () {
    Event.stopObserving(window, "scroll", this._windowScrollListener);
  },
  
  _onWindowScroll: function (event) {
    var viewportScrollOffsets = document.viewport.getScrollOffsets();
    var headerElement = $('header');
    var staticNavigationElement = $('staticNavigation');
    var naviDockElement = $('naviDockPrimary');
    var staticNavigationFadeElement = $('staticNavigationFade');
    var staticNavigationLayout = staticNavigationElement.getLayout();

    var fromTop = viewportScrollOffsets.top;
    var headerHeight = headerElement.getHeight();
    var staticNaviMarginTop = staticNavigationLayout.get('margin-top');
    var staticNaviMarginBottom = staticNavigationLayout.get('margin-bottom');
    // TODO: Padding, Border, Outline?
    var staticNaviHeight = naviDockElement.getHeight() + staticNaviMarginTop + staticNaviMarginBottom; 
    var dynamicNaviTop = headerHeight + staticNaviHeight;
    
    if (fromTop > headerHeight) {
      staticNavigationFadeElement.addClassName('fixedNavigation');
    } else {
      staticNavigationFadeElement.removeClassName('fixedNavigation');
    }
   
    if (fromTop < headerHeight) {     
      $$('div.xDyn').invoke('setStyle', {
        'top': (dynamicNaviTop - fromTop) + 'px'
      });
    } else {
      $$('div.xDyn').invoke('setStyle', {
        'top': staticNaviHeight + 'px'
      });        
    }
  }
});

Event.observe(window, "load", function(){
  window._parallaxScrolling = new ParallaxScrolling();
});

Event.observe(window, "unload", function(){ 
  window._parallaxScrolling.deinitialize();
  delete window._parallaxScrolling;
  window._parallaxScrolling = undefined;
});

