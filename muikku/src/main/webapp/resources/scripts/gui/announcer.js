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
      
      var formFunctions = function() {
        
        // Date and timepickers for start and end time/date
        
        var start = new Date();
        start.setMinutes(0);
        start.setHours(start.getHours() + 1);
        var end = new Date(start.getTime());
        end.setHours(end.getHours() + 1);
        
        $('#startDate')
          .datepicker()
          .datepicker('setDate', start);
        
        $('#endDate')
          .datepicker()
          .datepicker('setDate', end);

      }
      
      var createAnnouncement = function(values){
        mApi()
          .announcer
          .announcements
          .create(values)
          .callback($.proxy(function(err, result) {
              if (err) {
                $(".notification-queue").notificationQueue(
                    'notification',
                    'error',
                    err);
              } else {
                $(".notification-queue").notificationQueue(
                    'notification',
                    'success',
                    getLocaleText('plugin.announcer.createannouncement.success'));
              }
          }, this));
      }   
      openInSN('/announcer/announcer_create_announcement.dust', null, createAnnouncement, formFunctions);
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

