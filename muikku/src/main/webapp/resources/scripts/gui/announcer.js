(function() {
  
  $.widget("custom.announcer", {
//    options: {
//    },
    
    _create : function() {
      this._loadAnnouncements();
    },
    
    _loadAnnouncements: function () {
       alert('TODO: LOAD ANNOUNCEMENTS!');
    },
    
    _load: function(){
      this.element.empty();      
      $(this.element).append('<div class="mf-loading"><div class"circle1"></div><div class"circle2"></div><div class"circle3"></div></div>');      
    },    
    _clear: function(){
      this.element.empty();      
    },
    _destroy: function () {
    }
  });
  
  $(document).ready(function(){
    $('.an-announcements-view-container').records({
    });
  });
  
 

}).call(this);

