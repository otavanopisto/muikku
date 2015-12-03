(function() {
  
  $.widget("custom.announcer", {
//    options: {    
//    },
    
    _create : function() {
      
      var mainfunction = ".mf-content-master";
      
     $(mainfunction).on('click', '.bt-mainFunction', $.proxy(this._onCreateAnnouncementClick, this));
      
      this._loadAnnouncements();
    },
    _onCreateAnnouncementClick: function () {
      var createAnnouncement = function(values){
        mApi().announcer.announcements.create(values);
      }   
      openInSN('/announcer/announcer_create_announcement.dust', null, createAnnouncement);
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
    $('.an-announcements-view-container').announcer();

  });
  
 

}).call(this);

