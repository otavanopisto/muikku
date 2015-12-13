(function() {
  
  $.widget("custom.guiderSearch", {
    _create : function() {
      this.element.on('keyup', '.search', $.proxy(this._inputKeyUp, this));
    },
    
    _inputKeyUp: function (event) {
      $('.gt-students-view-container').guiderStudents('searchTerm', this.element.find('.search').val());
    }
  });

  $.widget("custom.guiderFilters", {
    
    _create : function() {
      this._filters = [];
      this._loadFilters($.proxy(function () {
        this.element.on('click', '.gu-filter-link', $.proxy(this._onFilterLink, this));
      }, this));
    },
    
    _onFilterLink: function (event) {
      var element = $(event.target).closest('.gu-filter-link');
      $('.gt-students-view-container').guiderStudents('workspaces', [ element.attr('data-id') ]);
    },
    
    _loadFilters: function (callback) {
      this._loadWorkspaces($.proxy(function (workspaces) {
        var filters = [{
          title: getLocaleText('plugin.guider.filters.workspaces'),
          type: 'workspace',
          data: workspaces
        }];
        
        renderDustTemplate('guider/guider_user_filters.dust', { filters: filters }, $.proxy(function (text) {
          this.element.html(text);
          callback();
        }, this));
      }, this));
    },
    
    _loadWorkspaces: function (callback) {
      mApi().workspace.workspaces
        .read({ userId: MUIKKU_LOGGED_USER_ID })
        .callback($.proxy(function (err, workspaces) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.filters', err));
          } else {
            callback(workspaces);
          }
        }, this));
    }
    
  });
  
  $.widget("custom.guiderStudents", {
    
    options: {
      studentsPerPage: 25,
      openStudentProfile: null,
      workspaceIds: null
    },
    
    _create : function() {
      this._page = 0;
      this._searchString = '';
      this._userGroupIds = null;
      this._workspaceIds = this.options.workspaceIds;
      this._loading = false;
      this._loadPending = false;
      
      if (this.options.openStudentProfile) {
        this._openStudentProfile(this.options.openStudentProfile);
      } else {
        this._loadStudents();
      }
      
      this.element.on('click', '.gt-user-name', $.proxy(this._onUserNameClick,this));
      this.element.on('click', '.gt-tool-view-profile', $.proxy(this._onUserViewProfileClick,this));
    },
    
    nextPage: function () {
      this._page++;
      this._reloadStudents();
    },
    
    prevPage: function () {
      this._page--;
      this._reloadStudents();
    },
    
    searchTerm: function (searchTerm) {
      this._searchString = searchTerm;
      this._reloadStudents();
    },
    
    workspaces: function (workspaceIds) {
      this._workspaceIds = workspaceIds;
      this._reloadStudents();
    },
    
    _reloadStudents: function () {
      if (!this._loading) {
        this.element
          .empty()
          .addClass('loading');
        this._loadStudents();
      } else {
        this._loadPending = true;
      }
    },
    
    _loadStudents: function () {
      this._loading = true;
      
      var options = {
        archetype : 'STUDENT',
        firstResult: this._page * this.options.studentsPerPage,
        maxResults : this.options.studentsPerPage
      };
      
      if (this._searchString) {
        options['searchString'] = this._searchString;
      }
      
      if (this._userGroupIds) {
        options['userGroupIds'] = this._userGroupIds;
      }
      
      if (this._workspaceIds) {
        options['workspaceIds'] = this._workspaceIds.join(',');
      }

      mApi()
        .user.users.read(options)
        .callback($.proxy(function (err, users) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
          } else {
            renderDustTemplate('guider/guider_items.dust', users, $.proxy(function(text) {
              this.element
                .html(text)
                .removeClass('loading');
            }, this));
          }
          
          this._loading = false;
          
          if (this._loadPending) {
            this._loadPending = false;
            this._reloadStudents();
          }
        }, this));
    },
    
    _onUserNameClick: function (event) {
      var element = $(event.target).closest(".gt-user");
      var userEntityId = $(element).attr("data-user-entity-id");
      if (element.hasClass('open')) {
        this._hideUserDetails(userEntityId);
      } else {
        this._showUserDetails(userEntityId);
      }
    },
    
    _onUserViewProfileClick: function (event) {
      var element = $(event.target).closest(".gt-user");
      var userEntityId = $(element).attr("data-user-entity-id");
      this._openStudentProfile(userEntityId);
    },
    
    _openStudentProfile: function (userEntityId) {
      this.element.find('.gt-users-pages').hide();
      $('<div>')
        .appendTo(this.element)
        .guiderProfile({
          userEntityId: userEntityId
        });
      
      window.location.hash = "userprofile/" + userEntityId;
    },
    
    _showUserDetails : function(userEntityId) { 
      var userElement = this.element.find(".gt-user[data-user-entity-id=" + userEntityId + "]");
      
      userElement
        .removeClass('open closed')
        .addClass('loading');
      
      mApi().user.users.read(userEntityId).callback($.proxy(function(err, user) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
        } else {        
          renderDustTemplate('guider/guider_item_details.dust', user, $.proxy(function(text) {              
            userElement.find('.gt-user-details-content')
              .html(text);

            userElement
              .removeClass('loading closed')
              .addClass('open');
            
          }, this));
        } 
      }, this)); 
    },
    
    _hideUserDetails: function(userEntityId) {
      this.element.find(".gt-user[data-user-entity-id=" + userEntityId + "]") 
        .removeClass('open loading')
        .addClass('closed');
    },  
    
  });

  $.widget("custom.guiderProfile", {
    options: {
      userEntityId: null
    },
    
    _create : function() {
      this._loadUser();
    },
    
    _loadUser: function () {
      this.element.addClass('loading');
      
      mApi().user.users.read(this.options.userEntityId).callback($.proxy(function(err, user){
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
        } else {
          renderDustTemplate('guider/guider_view_profile.dust', user, $.proxy(function(text) {    
            this.element.html(text);
            
            mApi().workspace.workspaces.read({ userId: this.options.userEntityId }).callback($.proxy(function(err, workspaces) {               
              renderDustTemplate('coursepicker/coursepickercourse.dust', workspaces, $.proxy(function(text){
                this.element.find(".gt-data-container-1 div.gt-data").html(text);
                this.element.removeClass('loading');
              }, this));
            }, this));
          }, this));
        }
      }, this));
    }
  });

  $(document).ready(function() {
    var workspaceIds = null;
    var openStudentProfile = null;
    
    var hash = window.location.hash;
    if (hash && hash.length > 1) {
      var settings = hash.substring(1).split(',');
      for (var i = 0, l = settings.length; i < l; i++) {
        var setting = settings[i].split('/');
        if (setting.length > 0) {
          switch (setting[0]) {
            case 'filter':
              if (setting.length === 3) {
                switch (setting[1]) {
                  case 'workspace':
                    workspaceIds = [setting[2]];
                  break;
                  default:
                    console.warn('Could not understand filter ' + setting[1]);
                  break;
                }
              } else {
                console.warn('Could not understand filter ' + settings[i]);
              }
            break;
            case 'userprofile':
              if (setting.length === 2) {
                openStudentProfile = setting[1];
              } else {
                console.warn('Could not understand filter ' + settings[i]);
              }
            break;
            default:
              console.warn('Could not understand hash setting ' + setting[0]);
            break;
          }
        }
      }
    }
    
    $('.gu-filters').guiderFilters();
    $('.gt-search').guiderSearch();
    $('.gt-students-view-container').guiderStudents({
      workspaceIds: workspaceIds,
      openStudentProfile: openStudentProfile
    });
   
  });
  
}).call(this);