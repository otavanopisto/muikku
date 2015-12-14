(function() {
  
  $.widget("custom.announcer", {
//    options: {    
//    },
    
    _create : function() {
      
      var mainfunction = ".mf-content-master";
      
     $(mainfunction).on('click', '.bt-mainFunction', $.proxy(this._onCreateAnnouncementClick, this));
     $('.an-announcements-view-container').on('click', '.an-announcement-edit-link', $.proxy(this._onEditAnnouncementClick, this));
     
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
          .datepicker({
            "dateFormat": "dd. mm. yyyy"
          })
          .datepicker('setDate', start);
        
        $('#endDate')
          .datepicker({
            "dateFormat": "dd. mm. yyyy"
          })
          .datepicker('setDate', end);

      }
      
      var createAnnouncement = function(values){
        values.startDate = moment(values.startDate, "DD. MM. YYYY").format("YYYY-MM-DD");
        values.endDate = moment(values.endDate, "DD. MM. YYYY").format("YYYY-MM-DD");
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
                    window.location.reload(true);      
              }
          }, this));
      }   
      openInSN('/announcer/announcer_create_announcement.dust', null, createAnnouncement, formFunctions);
    },
    
    
    _onEditAnnouncementClick: function (event) {
      var ann = event.target;
      
      var par = $(ann).parents(".an-announcement");
      var id = $(par).attr("id");
        
      var formFunctions = function() {        
        
        // Date and timepickers for start and end time/date
        mApi()
        .announcer
        .announcements
        .read(id).callback($.proxy(function(err, announcement){
          var start = moment(announcement.startDate, "YYYY-MM-DD").format("DD. MM. YYYY");
          var end = moment(announcement.endDate,  "YYYY-MM-DD").format("DD. MM. YYYY");

          
          $('#startDate')
            .datepicker({
              "dateFormat": "dd. mm. yy"
            })
            .datepicker('setDate', start);
          
          $('#endDate')
            .datepicker({
              "dateFormat": "dd. mm. yy"
            })
            .datepicker('setDate', end);
          
          $("input[name='caption']").val(announcement.caption);
          $("textarea[id='textContent']").val(announcement.content);          
          
        }, this));


      }
      
      var editAnnouncement = function(values){
        values.startDate = moment(values.startDate, "DD. MM. YYYY").format("YYYY-MM-DD");
        values.endDate = moment(values.endDate, "DD. MM. YYYY").format("YYYY-MM-DD");
        mApi()
          .announcer
          .announcements
          .update(id, values)
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
                    getLocaleText('plugin.announcer.editannouncement.success'));
                    window.location.reload(true);      
              }
          }, this));
      }   
      openInSN('/announcer/announcer_edit_announcement.dust', null, editAnnouncement, formFunctions);
    },    
    
    _loadAnnouncements: function () {
        mApi()
          .announcer
          .announcements
          .read()
          .callback($.proxy(function(err, result) {
              if (err) {
                $(".notification-queue").notificationQueue(
                    'notification',
                    'error',
                    err);
              } else {
                renderDustTemplate(
                    'announcer/announcer_items.dust',
                    result,
                    $.proxy(function (text) {
                      var element = $(text);
                      $('.an-announcements-view-container').append(element);
                    }, this));
              }
          }, this));
    },
    
    _load: function(){
      this.element.empty();      
      $(this.element).append('<div class="mf-loading"><div class"circle1"></div><div class"circle2"></div><div class"circle3"></div></div>');      
    },    
    _reload: function(){
      window.location.reload(true);      
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

