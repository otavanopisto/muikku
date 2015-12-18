(function() {
  
  $.widget("custom.announcer", {
//    options: {    
//    },
    
    _create : function() {
      
      var mainfunction = ".mf-content-master";
      
     $(mainfunction).on('click', '.bt-mainFunction', $.proxy(this._onCreateAnnouncementClick, this));
     $('.an-announcements-view-container').on('click', '.an-announcement-edit-link', $.proxy(this._onEditAnnouncementClick, this));
     $(mainfunction).on('click', '.an-announcements-tool.archive', $.proxy(this._onArchiveAnnouncementsClick, this));
     
     
     $(document).on('focus', '#targetGroupContent', $.proxy(function(event) {
       this._onTargetGroupFocus(event);
     }, this));
     
     $(document).on('click', '.an-announcement-targetgroup', function(event) {
       $(this).remove();
     });
     
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
            "dateFormat": "dd.mm.yy"
          })
          .datepicker('setDate', start);
        
        $('#endDate')
          .datepicker({
            "dateFormat": "dd.mm.yy"
          })
          .datepicker('setDate', end);

      }
      
      var createAnnouncement = function(values){
        values.startDate = moment(values.startDate, "DD.MM.YYYY").format("YYYY-MM-DD");
        values.endDate = moment(values.endDate, "DD.MM.YYYY").format("YYYY-MM-DD");
        values.userGroupEntityIds = $.map($("input[name='userGroupEntityIds']"), function(element) {
          return $(element).val();
        });
        
        if (values.userGroupEntityIds.length) {
          values.publiclyVisible = false;
        } else {
          values.publiclyVisible = true;
        }
        

        mApi().announcer.announcements.create(values).callback($.proxy(function(err, result) {
          if (err) {
            $(".notification-queue").notificationQueue('notification','error',err);
          } else {
            $(".notification-queue").notificationQueue('notification','success',getLocaleText('plugin.announcer.createannouncement.success'));
            window.location.reload(true);      
          }
        }, this));

      }   
      openInSN('/announcer/announcer_create_announcement.dust', null, createAnnouncement, formFunctions);
    },
    
    _onEditAnnouncementClick: function (event) {
      var ann = event.target;
      
      var par = $(ann).parents(".an-announcement");
      var id = $(par).attr("data-announcement-id");
        
      var formFunctions = function() {        
        
        // Date and timepickers for start and end time/date
        mApi()
        .announcer
        .announcements
        .read(id).callback($.proxy(function(err, announcement){
          var start = moment(announcement.startDate, "YYYY-MM-DD").format("DD.MM.YYYY");
          var end = moment(announcement.endDate,  "YYYY-MM-DD").format("DD.MM.YYYY");
          var groups = [];
          var callbacks = [];
          
          var retrieveUserGroup = function(userGroupEntityId, callback) {
            mApi().usergroup.groups.read(userGroupEntityId).callback(function(err, result) {
              if (err) {
                callback(err);
              } else {
                callback(null, {
                  name : result.name + " (" + result.userCount + ")",
                  id : result.id,
                });
              }
            });
          };
          
          async.map(announcement.userGroupEntityIds, retrieveUserGroup, $.proxy(function(err, userGroups) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var targetGroupsContainerElement = $("#msgTargetGroupsContainer");      

              for (var i=0; i<userGroups.length; i++) {
                renderDustTemplate('announcer/announcer_targetgroup.dust', userGroups[i], function (text) {
                  targetGroupsContainerElement.prepend($.parseHTML(text));
                });
              }
              
              $('#startDate')
                .datepicker({
                  "dateFormat": "dd.mm.yy"
                })
                .datepicker('setDate', start);
              
              $('#endDate')
                .datepicker({
                  "dateFormat": "dd.mm.yy"
                })
                .datepicker('setDate', end);
              
              $("input[name='caption']").val(announcement.caption);  
              CKEDITOR.instances.textContent.setData(announcement.content);
                  
            }
          }, this));
        }, this));
      }
      
      var editAnnouncement = function(values){
        values.startDate = moment(values.startDate, "DD.MM.YYYY").format("YYYY-MM-DD");
        values.endDate = moment(values.endDate, "DD.MM.YYYY").format("YYYY-MM-DD");
        values.userGroupEntityIds = $.map($("input[name='userGroupEntityIds']"), function(element) {
          return $(element).val();
        });
        
        if (values.userGroupEntityIds.length) {
          values.publiclyVisible = false;
        } else {
          values.publiclyVisible = true;
        }
        
        mApi().announcer.announcements.update(id, values).callback($.proxy(function(err, result) {
          if (err) {
            $(".notification-queue").notificationQueue('notification','error',err);
          } else {
            $(".notification-queue").notificationQueue('notification','success',getLocaleText('plugin.announcer.editannouncement.success'));
            window.location.reload(true);      
          }
        }, this));
      }   
      openInSN('/announcer/announcer_edit_announcement.dust', null, editAnnouncement, formFunctions);
    },    
    
    _loadAnnouncements: function () {
        mApi().announcer.announcements.read().callback($.proxy(function(err, result) {
          if (err) {
            $(".notification-queue").notificationQueue('notification','error', err);
          } else {
            renderDustTemplate('announcer/announcer_items.dust',result,$.proxy(function (text) {
              var element = $(text);
              $('.an-announcements-view-container').append(element);
            }, this));
          }
        }, this));
    },
    _onArchiveAnnouncementsClick: function () {
      
      var selected = $(".an-announcements").find("input:checked");
      var values = [];
      var titles =[];
      
      $.each(selected, function(i, val){
        var parent = $(val).parents(".an-announcement");
        var child = parent.find(".an-announcement-topic");
        var title = child.text();
        
        values.push($(val).attr("value"));
        titles.push(title)
      });

      var formFunctions = function() {
         var titlesContainer = $('.an-archiving-ids-container');
         var idsInput = titlesContainer.find("input");

         if(titles.length > 0){
           $.each(titles, function(index,title){
             titlesContainer.append("<span>" + title + "</span>");
           });
         }else{
           titlesContainer.append("<span>" + getLocaleText('plugin.announcer.archiveannouncement.archiving.noneselected') + "</span>");
         }
         idsInput.val(values);

      }
      
      var archiveAnnouncements = function(values){

         var ids = values.ids;
         var arr = ids.split(',');
        
         var calls=$.map(arr, function(announcement){
           return mApi().announcer.announcements.del(announcement);
         });
         
         mApi().batch(calls).callback(function(err, results){
           if (err) {
             $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.announcer.archiveannouncement.error'));
           } else {
             $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.announcer.archiveannouncement.success'));
             window.location.reload(true);             
           }
           
         });         

      }   
      openInSN('/announcer/announcer_archive_announcement.dust', null, archiveAnnouncements, formFunctions);
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
    },

    _searchGroups: function (searchTerm, callback) {
      var groups = new Array();
    
      mApi().usergroup.groups.read({ 'searchString' : searchTerm }).callback(function(err, result) {
        if (result != undefined) {
          for (var i = 0, l = result.length; i < l; i++) {
            groups.push({
              label : result[i].name + " (" + result[i].userCount + ")",
              id : result[i].id,
            });
          }

          callback(groups);
        }
      });
    },

    _onTargetGroupFocus:function(event){
      $(event.target).autocomplete({
        create: $.proxy(function(event, ui){
          $('.ui-autocomplete').perfectScrollbar(); 
        }, this),  
        source: $.proxy(function (request, response) {
          this._searchGroups(request.term, response);
        }, this),
        select: $.proxy(function (event, ui) {
          this._selectRecipient(event, ui.item);
          $(event.target).val("");
          return false;
        }, this)
      });
    }, 

    _selectRecipient: function (event, item) {
      var element = $(event.target);
      var targetGroupsContainerElement = $("#msgTargetGroupsContainer");      
      var group = {
        id: item.id,
        name: item.label
      };

      renderDustTemplate('announcer/announcer_targetgroup.dust', group, function (text) {
        targetGroupsContainerElement.prepend($.parseHTML(text));
      });
    }
  });
  
  
  
  $(document).ready(function(){
    $('.an-announcements-view-container').announcer();

  });
  
 

}).call(this);

