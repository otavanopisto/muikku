(function() {
 
  $.widget("custom.announcementArchiveDialog", {
    options: {
      items: []
    },
    _create : function() {
      this._show();
    },
    _show : function() {
      var items = this.options.items;
      
      renderDustTemplate('announcer/announcer_archive_announcement.dust', {items: items}, $.proxy(function (text) {
        
        this.element.html(text);

        var calls=$.map(items, function(item){
          return mApi().announcer.announcements.del(item.id);
        });
        
        this.element.find("input[name='send']").on('click', function () {
          mApi().batch(calls).callback(function(err, results){
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.announcer.archiveannouncement.error'));
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.announcer.archiveannouncement.success'));
              window.location.reload(true);             
            }
          });         
        });

        this.element.find("input[name='cancel']").on('click', $.proxy(function (event) {
          event.preventDefault();
          this.element.remove();
        }, this));
      }, this));
    }
  });
 
  $.widget("custom.announcementCreateEditDialog", {
    
    options: {
      permissions: {
        environment: false,
        workspaces: false,
        groups: false
      },
      announcement: null,
      ckeditor: {
        uploadUrl: '/announcerAttachmentUploadServlet',
        toolbar: [
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
          { name: 'links', items: [ 'Link' ] },
          { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'styles', items: [ 'Format' ] },
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
          { name: 'tools', items: [ 'Maximize' ] }
        ],
        extraPlugins: {
          'widget': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/4.5.9/',
          'lineutils': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/4.5.9/',
          'filetools' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/4.5.9/',
          'notification' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/4.5.9/',
          'notificationaggregator' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/4.5.9/',
          'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
          'draft' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/draft/0.0.3/plugin.min.js',
          'uploadwidget' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/4.5.9/',
          'uploadimage' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/4.5.9/'
        }
      }
    },
    
    _create : function() {
      var extraPlugins = [];
      
      $.each($.extend(this.options.ckeditor.extraPlugins, {}, true), $.proxy(function (plugin, url) {
        CKEDITOR.plugins.addExternal(plugin, url);
        extraPlugins.push(plugin);
      }, this));
      
      this.options.ckeditor.extraPlugins = extraPlugins.join(',');
      
      this.element.on('click', 'input[name="send"]', $.proxy(this._onSendClick, this));
      this.element.on('click', 'input[name="cancel"]', $.proxy(this._onCancelClick, this));
      this.element.on('click', '.an-announcement-targetgroup', $.proxy(this._onTargetGroupClick, this));
      
      this._load($.proxy(function () {
        this._contentsEditor = CKEDITOR.replace(this.element.find('textarea[name="content"]')[0], $.extend(this.options.ckeditor, {
          draftKey: this.options.announcement ? 'announcement-edit-message-' + this.options.announcement.id : 'announcement-create-message',
          on: {
            instanceReady: $.proxy(this._onCKEditorReady, this)
          }
        }));

        var autocomplete = this.element.find('input#targetGroupContent').autocomplete({
          open: function(event, ui) {
            $(event.target).perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
          },  
          source: $.proxy(function (request, response) {
            this._searchTargets(request.term, function (err, results) {
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                response(results);
              }
            });
          }, this),
          select: $.proxy(function (event, ui) {
            var item = ui.item;
            if (!item.existing) {
              this._addTarget(item.category, item.label, item.id);
              $(event.target).val("");
            }
            return false;
          }, this),
          
          appendTo: '#msgTargetGroupsContainer'
        });
        
        if (autocomplete.data("ui-autocomplete") != null) {
          autocomplete.data("ui-autocomplete")._renderItem = function (ul, item) {
            var li = $("<li>")
              .text(item.label)
              .appendTo(ul);
          
            return li;
          };
        }
      }, this));
    },
    
    _destroy: function () {
      try {
        this._contentsEditor.destroy();
      } catch (e) {
      }
    },
    
    _load: function (callback) {
      var data = {};
      var dustFile = '/announcer/announcer_create_announcement.dust';
      
      if (this.options.announcement) {
        data.announcement = this.options.announcement;
        dustFile = '/announcer/announcer_edit_announcement.dust';
      } 
      
      renderDustTemplate(dustFile, data, $.proxy(function (text) {
        this.element.html(text);
        
        if (data.announcement) {
          this._setCaption(data.announcement.caption);
          this._setContent(data.announcement.content);
          this._setStartDate(data.announcement.startDate);
          this._setEndDate(data.announcement.endDate);
          
          for (var ugi = 0; ugi < data.announcement.userGroupEntityIds.length; ugi++) {
            var userGroupEntityId = data.announcement.userGroupEntityIds[ugi];
            this._addTargetGroupWithId(userGroupEntityId);
          }
          
          for (var wsi = 0; wsi < data.announcement.workspaceEntityIds.length; wsi++) {
            var workspaceEntityId = data.announcement.workspaceEntityIds[wsi];
            this._addTargetWorkspaceWithId(workspaceEntityId);
          }
        } else {
          var start = new Date();
          start.setMinutes(0);
          start.setHours(start.getHours() + 1);
          var end = new Date(start.getTime());
          end.setHours(end.getHours() + 1);

          this._setCaption("");
          this._setContent("");
          this._setStartDate(start);
          this._setEndDate(end);
          
          if (this.options.workspaceEntityId)
            this._addTargetWorkspaceWithId(this.options.workspaceEntityId);          
        }

        if (callback) {
          callback();
        }
      }, this));
    },
    
    _onTargetGroupClick: function (event) {
      $(event.target).closest('.an-announcement-targetgroup').remove();
    },
    
    _setCaption: function (caption) {
      this.element.find('input[name="caption"]').val(caption);
    },

    _setContent: function (content) {
      this.element.find('textarea[name="content"]').val(content);
    },
    
    _setStartDate: function (startDate) {
      startDate = moment(startDate, "YYYY-MM-DD").format("DD.MM.YYYY");
      this.element.find('input[name="startDate"]').datepicker({
          "dateFormat": "dd.mm.yy",
          onClose: $.proxy(function( selectedDate ) {
            if(moment(selectedDate, "DD.MM.YYYY").isBefore()){
              this.element.find('input[name="endDate"]').datepicker( "option", "minDate", 0 );
            }else{
              this.element.find('input[name="endDate"]').datepicker( "option", "minDate", selectedDate );
            }
            
          }, this)
      }).datepicker('setDate', startDate);
    },
    
    _setEndDate: function (endDate) {
      endDate = moment(endDate, "YYYY-MM-DD").format("DD.MM.YYYY");
      this.element.find('input[name="endDate"]').datepicker({
          "dateFormat": "dd.mm.yy",
          "minDate": 0,
          onClose: $.proxy(function( selectedDate ) {
            this.element.find('input[name="startDate"]').datepicker( "option", "maxDate", selectedDate );
          }, this)
      }).datepicker('setDate', endDate);
    },
    
    _getTargetGroupIds: function () {
      return $.map(this.element.find('input[name="userGroupEntityIds"]'), function (elem) {
        return Number($(elem).val());
      });
    },
     
    _getTargetWorkspaceIds: function () {
      return $.map(this.element.find('input[name="workspaceEntityIds"]'), function (elem) {
        return Number($(elem).val());
      });
    },
     
    _addTargetGroupWithId: function (id) {
      mApi().usergroup.groups.read(id).callback($.proxy(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._addTarget("GROUP", result.name + " (" + result.userCount + ")", result.id);
        }
      }, this));
    },
    _addTargetWorkspaceWithId: function (id) {
      mApi().workspace.workspaces.read(id).callback($.proxy(function (err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._addTarget("WORKSPACE", result.name + (result.nameExtension ? ' (' + result.nameExtension + ')' : ''), result.id);
        }
      }, this));
    },

    _addTarget: function (category, label, id) {
      switch (category) {
        case "WORKSPACE":
          var targetWorkspaceIds = this._getTargetWorkspaceIds();
          if (targetWorkspaceIds.indexOf(id) == -1) {
            var workspace = {
              id: id,
              name: label
            };
            renderDustTemplate('announcer/announcer_targetworkspace.dust', workspace, $.proxy(function (text) {
              this.element.find('#msgTargetGroupsContainer').prepend($.parseHTML(text));
            }, this));
          }
        break;
        
        case "GROUP":
          var targetGroupIds = this._getTargetGroupIds();
          if (targetGroupIds.indexOf(id) == -1) {
            var group = {
              id: id,
              name: label
            };

            renderDustTemplate('announcer/announcer_targetgroup.dust', group, $.proxy(function (text) {
              this.element.find('#msgTargetGroupsContainer').prepend($.parseHTML(text));
            }, this));
          }
          
        break;
      }
    },

    _searchTargets: function (term, callback) {
      var tasks = [this._searchTargetGroups(term), this._searchTargetWorkspaces(term)];

      async.parallel(tasks, function (err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, _.flatMap(results)); 
        }
      });
    },
    
    _searchTargetGroups: function (term) {
      if (!this.options.permissions.groups)
        return function (callback) { callback(null, []); };
      
      var inputs = $("#msgTargetGroupsContainer").find("input[name='userGroupEntityIds']");
      var existingIds = new Array();
      if (inputs.length > 0) {
        for (var i = 0; i < inputs.length; i++) {
          existingIds.push($(inputs[i]).val());
        }
      }

      return $.proxy(function (callback) {
        mApi().usergroup.groups
          .read({ 'searchString' : term })
          .callback(function(err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
               if(!(existingIds.indexOf(result.id.toString()) > -1)){
                  return {
                    label : result.name + " (" + result.userCount + ")",
                    id: result.id,
                    category: "GROUP"
                  }
                }
              }));
            }
          });
      });
    },
    
    _searchTargetWorkspaces: function (term) {
      if (!this.options.permissions.workspaces)
        return function (callback) { callback(null, []); };
      
      var targetWorkspaceIds = this._getTargetWorkspaceIds();

      return $.proxy(function (callback) {
        // coursepicker??
        mApi().coursepicker.workspaces
          .read({
            search: term,
            myWorkspaces: true,
          })
          .callback($.proxy(function (err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
                if(targetWorkspaceIds.indexOf(result.id) == -1){
                  return {
                    label : result.name + (result.nameExtension ? ' (' + result.nameExtension + ')' : ''),
                    id: result.id,
                    category: "WORKSPACE"
                  }
                }
              }));
            }
          }, this));
      });
    },

    _discardDraft: function () {
      try {
        this._contentsEditor.discardDraft();
      } catch (e) {
      }
    },
    
    _onSendClick: function (event) {
      this.element.addClass('loading');
      
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var caption = this.element.find('input[name="caption"]').val();
        var content = this._contentsEditor.getData();
        var startDate = this.element.find('input[name="startDate"]').val();
        var endDate = this.element.find('input[name="endDate"]').val();
        if (startDate) {
          startDate = moment(startDate, "DD.MM.YYYY").format("YYYY-MM-DD");
        } else {
          startDate = null;
        }
        
        if (endDate) {
          endDate = moment(endDate, "DD.MM.YYYY").format("YYYY-MM-DD");
        } else {
          endDate = null;
        }
        
        if (!caption || !caption.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.notitle'));
          return false;
        }
        
        if (!content || !content.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.nomessage'));
          return false;
        }
        
        var payload = {
          caption: caption,  
          content: content,
          startDate: startDate,
          endDate: endDate
        };
        
        payload.userGroupEntityIds = this._getTargetGroupIds();
        payload.workspaceEntityIds = this._getTargetWorkspaceIds();
          
        if (payload.userGroupEntityIds.length > 0) {
          payload.publiclyVisible = false;
        } else {
          payload.publiclyVisible = true;
        }
        
        if (!this.options.permissions.environment && (payload.workspaceEntityIds.length == 0)) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.workspaceNeeded'));
          return false;
        }
        
        if (!(this.options.announcement)) {
          mApi().announcer.announcements
          .create(payload)
          .callback($.proxy(function (err, result) {
            this._discardDraft();
            
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.announcer.createannouncement.error'));
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.announcer.createannouncement.success'));
              this.element.removeClass('loading');
              window.location.reload(true);
            }
          }, this));
        } else {
          var announcementId = this.options.announcement.id;

          mApi().announcer.announcements
            .update(announcementId, Object.assign(payload, {'archived': false}))
            .callback($.proxy(function (err, result) {
              this._discardDraft();
              
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.announcer.editannouncement.error'));
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.announcer.editannouncement.success'));
                this.element.removeClass('loading');
                window.location.reload(true);
              }
            }, this));
        }
      }
    },
    
    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    },
    
    _onRecipientClick: function (event) {
      $(event.target).closest('.an-announcement-targetgroup')
        .remove();
    },
    
    _onCKEditorReady: function (e) {
      this.element.find('input[name="send"]').removeAttr('disabled'); 
    }
    
  });

  $.widget("custom.announcerCategories", {
    options: {
      currentCategory: "active"
    },
  
    _create : function() {
      this.element.on('click', '.an-category', $.proxy(this._onCategoryClick, this));
      this._refreshSelection();
    },
     
    _onCategoryClick: function (event) {
      this.options.currentCategory = $(event.target).closest('.an-category').attr('data-folder-id');
      $('.an-announcements-view-container').announcer("setCategory", this.options.currentCategory);
      this._refreshSelection();
    },
     
    _refreshSelection: function () {
      this.element.find('.an-category').removeClass("selected");
      this.element.find('.an-category[data-folder-id="' + this.options.currentCategory + '"]').addClass("selected");       
    }
  });
  
  $.widget("custom.announcer", {
     options: {
       category: "active",
       workspaceEntityId: null,
       outerContainer: ".mf-content-master"
     },
    
    _create : function() {
      $(this.options.outerContainer).on('click', '.an-new-announcement', $.proxy(this._onCreateAnnouncementClick, this));
      this.element.on('click', '.an-announcement-edit-link', $.proxy(this._onEditAnnouncementClick, this));
      this.element.on('click', '.an-announcements-tool.archive', $.proxy(this._onArchiveAnnouncementsClick, this));
     
      this._loadAnnouncements();
    },
    
    setCategory: function (category) {
      this.options.category = category;
      this._loadAnnouncements();
    },
    
    _onCreateAnnouncementClick: function () {
      var dialog = $('<div>')
        .announcementCreateEditDialog({
          workspaceEntityId: this.options.workspaceEntityId,
          permissions: this.options.permissions
        });

      $("#socialNavigation")
        .empty()
        .append(dialog);
    },
    
    _onEditAnnouncementClick: function (event) {
      var announcementId = $(event.target)
        .closest(".an-announcement")
        .attr("data-announcement-id");
      
      mApi().announcer.announcements
        .read(announcementId)
        .callback($.proxy(function(err, announcement){
          var dialog = $('<div>').announcementCreateEditDialog({
            workspaceEntityId: this.options.workspaceEntityId,
            announcement: announcement,
            permissions: this.options.permissions
          });

          $("#socialNavigation")
            .empty()
            .append(dialog);
        }, this));
    },    
    
    _loadAnnouncements: function () {
      var options = {};
      options.onlyEditable = true;
      options.hideEnvironmentAnnouncements = !this.options.permissions.environment;

      switch (this.options.category) {
        case "past":
          options.timeFrame = "EXPIRED";
        break;
        case "archived":
          options.timeFrame = "ALL";
          options.onlyArchived = true;
        break;
        case "mine":
          options.timeFrame = "ALL";
          options.onlyMine = true;
        break;
        default:
          options.timeFrame = "CURRENTANDUPCOMING";
        break;
      }
      
      if (this.options.workspaceEntityId != null) {
        options.workspaceEntityId = this.options.workspaceEntityId;
      }
    
      mApi().announcer.announcements
        .read(options)
        .callback($.proxy(function(err, result) {
          if (err) {
            $(".notification-queue").notificationQueue('notification', 'error', err);
          } else {
            var data = {
                items: result,
                options: options
            };
            
            renderDustTemplate('announcer/announcer_items.dust', data, $.proxy(function (text) {
              $('.an-announcements-view-container').html(text);
            }, this));
          }
        }, this));
    },
    
    _onArchiveAnnouncementsClick: function (event) {
      var selected = $(".an-announcements")
        .find("input:checked");
      var items = [];
      
      $.each(selected, function(i, val) {
        var parent = $(val).parents(".an-announcement");
        var child = parent.find(".an-announcement-topic");
        var title = child.text();
        items.push({id: Number($(val).attr("value")), title: title});
      });
      
      var dialog = $('<div>').announcementArchiveDialog({
        items: items
      });

      $("#socialNavigation")
        .empty()
        .append(dialog);
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
    webshim.polyfill('forms');

    var options = {};
    
    options.permissions = {};
    options.category = "active";
    options.permissions.environment = $('#announcer').attr('data-penv') == "true";
    options.permissions.workspaces = $('#announcer').attr('data-pworks') == "true";
    options.permissions.groups = $('#announcer').attr('data-pgroups') == "true";
    
    if ($("#workspaceEntityId").val() != null) {
      options.workspaceEntityId = Number($("#workspaceEntityId").val());
    }
    
    $('.an-announcements-view-container').announcer(options);
    $('.an-categories').announcerCategories({
      currentCategory: options.category
    });
  });

}).call(this);

