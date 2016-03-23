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
    
    options: {
      filters: null
    },
    
    _create : function() {
      this._filters = this.options.filters;
      this._loadFilters($.proxy(function () {
        this.filters(this._filters);
        this.element.on('click', '.gt-filter-link', $.proxy(this._onFilterLink, this));
      }, this));
    },
    
    filters: function (filters) {
      if (filters === undefined) {
        return this._filters;
      } else {
        this._filters = filters;
        
        this.element
          .find('.gt-filter-link.selected')
          .removeClass('selected');
        
        if (filters) {
          window.location.hash = 'filters/' + btoa(JSON.stringify(filters));
          
          $.each(filters, $.proxy(function (index, filter) {
            this.element.find('.gt-filter-link[data-id="' + filter.id + '"][data-type="' + filter.type + '"]').addClass('selected');
          }, this));
          
          $('.gt-students-view-container').guiderStudents('applyFilters', filters);
        }
      }
    },
    
    addFilter: function (type, id) {
      var filters = this.filters()||[];
      
      filters.push({
        type: type,
        id: id
      });
      
      this.filters(filters);
    },
    
    removeFilter: function (type, id) {
      var filters = this.filters();
      if (filters) {
        var after = $.map(filters, function (filter) {
          if (filter.type == type && filter.id == id) {
            return null;
          }

          return filter;
        });
        
        this.filters(after);
      }
    },
    
    _onFilterLink: function (event) {
      var element = $(event.target).closest('.gt-filter-link');
      if (element.hasClass('selected')) {
        this.removeFilter(element.attr('data-type'), element.attr('data-id'));
      } else {
        this.addFilter(element.attr('data-type'), element.attr('data-id'));
      }
    },
    
    _loadFilters: function (callback) {
      async.parallel([this._loadWorkspaces, this._loadFlags], $.proxy(function(err, filters){
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.filters', err));
        } else {
          renderDustTemplate('guider/guider_user_filters.dust', { filters: filters }, $.proxy(function (text) {
            this.element.html(text);
            callback();
          }, this));
        }
      }, this));
    },
    
    _loadFlags: function (callback) {
      mApi().user.studentFlagTypes
        .read({ ownerIdentifier: MUIKKU_LOGGED_USER })
        .callback(function (err, studentFlagTypes) {
          if (err) {
            callback(err);
          } else {
            callback(null, {
              title: getLocaleText('plugin.guider.filters.studentFlagTypes'),
              type: 'studentFlagType',
              data: $.map(studentFlagTypes, function (studentFlagType) {
                return {
                  'id': studentFlagType.type,
                  'name': getLocaleText('plugin.guider.studentFlags.' + studentFlagType.type),
                  'iconClass': 'icon-flag'
                };
              })
            });
          }
        });
    },
    
    _loadWorkspaces: function (callback) {
      mApi().workspace.workspaces
        .read({ ownerIdentifier: MUIKKU_LOGGED_USER })
        .callback(function (err, workspaces) {
          if (err) {
            callback(err);
          } else {
            callback(null, {
              title: getLocaleText('plugin.guider.filters.workspaces'),
              type: 'workspace',
              data: workspaces
            });
          }
        });
    }
    
  });
  
  $.widget("custom.guiderStudents", {
    
    options: {
      studentsPerPage: 25,
      openStudentProfile: null,
      workspaceIds: null,
      studentFlagTypes: null
    },
    
    _create : function() {
      this._page = 0;
      this._students = [];
      this._searchString = '';
      this._userGroupIds = null;
      this._workspaceIds = this.options.workspaceIds;
      this._studentFlagTypes = this.options.studentFlagTypes;
      this._loading = false;
      this._loadPending = false;
      
      if (this.options.openStudentProfile) {
        this._openStudentProfile(this.options.openStudentProfile);
      } else {
        this._loadStudents();
      }
      
      this.element.on('click', '.gt-user-name', $.proxy(this._onUserNameClick,this));
      this.element.on('click', '.gt-tool-view-profile', $.proxy(this._onUserViewProfileClick,this));
      this.element.on('click', '.gt-page-link-load-more', $.proxy(this._onLoadMoreClick,this));
    },
    
    loadNextPage: function () {
      this._page++;
      this._loadStudents();
    },
    
    searchTerm: function (searchTerm) {
      this._page = 0;
      this._searchString = searchTerm;
      this._reloadStudents();
    },
    
    applyFilters: function (filters) {
      this._page = 0;
      this._workspaceIds = null;
      this._studentFlagTypes = null;
      
      if (filters) {
        $.each(filters, $.proxy(function (index, filter) {
          switch (filter.type) {
            case 'workspace':
              if (!this._workspaceIds) {
                this._workspaceIds = [filter.id];
              } else {
                this._workspaceIds.push(filter.id);
              }
            break;
            case 'studentFlagType':
              if (!this._studentFlagTypes) {
                this._studentFlagTypes = [filter.id];
              } else {
                this._studentFlagTypes.push(filter.id);
              }
            break;
            default:
              $('.notification-queue').notificationQueue('notification', 'error', 'Unknown filter type:' + filter.type);
            break;
          }
        }, this));
      }
      
      this._reloadStudents();
    },
    
    workspaces: function (workspaceIds) {
      this._page = 0;
      this._workspaceIds = workspaceIds;
      this._studentFlagTypes = null;
      this._reloadStudents();
    },
    
    studentFlagTypes: function (studentFlagTypes) {
      this._page = 0;
      this._workspaceIds = null;
      this._studentFlagTypes = studentFlagTypes;
      this._reloadStudents();
    },
    
    _reloadStudents: function () {
      if (!this._loading) {
        this._students = [];
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
        options['workspaceIds'] = this._workspaceIds;
      }
      
      if (this._studentFlagTypes) {
        options['studentFlagTypes'] = this._studentFlagTypes;
      }

      mApi()
        .user.students.read(options)
        .callback($.proxy(function (err, students) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nousers', err));
          } else {
            var hasMore = students.length == this.options.studentsPerPage;
            
            this._students = this._students.concat(students);
            renderDustTemplate('guider/guider_items.dust', { hasMore : hasMore, students: this._students }, $.proxy(function(text) {
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
      var userIdentifier = $(element).attr("data-user-identifier");
      if (element.hasClass('open')) {
        this._hideUserDetails(userIdentifier);
      } else {
        this._showUserDetails(userIdentifier);
      }
    },
    
    _onUserViewProfileClick: function (event) {
      var element = $(event.target).closest(".gt-user");
      var userIdentifier = $(element).attr("data-user-identifier");
      this._openStudentProfile(userIdentifier);
    },
    
    _onLoadMoreClick: function (event) {
      this.loadNextPage();
    },
    
    _openStudentProfile: function (userIdentifier) {
      this.element.find('.gt-users-pages').hide();
      $('<div>')
        .appendTo(this.element)
        .guiderProfile({
          userIdentifier: userIdentifier
        });
      
      window.location.hash = "userprofile/" + userIdentifier;
    },
    
    _showUserDetails : function(userIdentifier) { 
      var userElement = this.element.find(".gt-user[data-user-identifier='" + userIdentifier + "']");
      
      userElement
        .removeClass('open closed')
        .addClass('loading');
      
      mApi().user.students.read(userIdentifier).callback($.proxy(function(err, user) {
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
    
    _hideUserDetails: function(userIdentifier) {
      this.element.find(".gt-user[data-user-identifier='" + userIdentifier + "']") 
        .removeClass('open loading')
        .addClass('closed');
    },  
    
  });

  $.widget("custom.guiderProfile", {
    options: {
      userIdentifier: null
    },
    
    _create : function() {
      this.element.addClass('gt-user-view-profile');
      
      
      this.element.on("click", ".gt-user-view-flags-select", $.proxy(this._onFlagSelectClick, this));
      this.element.on("click", ".gt-user-view-flag", $.proxy(this._onFlagClick, this));
      this.element.on("click", ".gt-course-details-container", $.proxy(this._onNameClick, this));
      $(document).on("mouseup", $.proxy(this._onDocumentMouseUp, this));
      
      this._loadFlags($.proxy(function (err, studentFlagTypes) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._loadUser(studentFlagTypes);
        }
      }, this));
    },

    _loadFlags: function (callback) {
      mApi().user.studentFlagTypes
        .read()
        .callback($.proxy(function (err, studentFlagTypes) {
          if (err) {
            callback(err);
          } else {
            callback(err, $.map([{type: 'NONE'}].concat(studentFlagTypes), function (studentFlagType) {
              return {
                type: studentFlagType.type,
                name: getLocaleText('plugin.guider.studentFlags.' + studentFlagType.type)
              }
            }));
          }
        }, this));
    },
    
    _onNameClick: function (event) {
      var element = $(event.target).closest('.gt-course');
      if (element.hasClass('open')) {
        element.removeClass('open');
      } else {
        element.addClass('open');
      }
    },
    
    _onFlagSelectClick: function (event) {
      var element = $(event.target);
      var container = element.closest('.gt-user-view-flags-container');
      container.find('.gt-user-view-flags-dropdown-container').show();
    },
    
    _onFlagClick: function (event) {
      var element = $(event.target).closest('.gt-user-view-flag');
      var type = $(element).attr("data-type");
      
      mApi().user.students.flags
        .read(this.options.userIdentifier, {ownerIdentifier: MUIKKU_LOGGED_USER })
        .callback($.proxy(function(err, flags) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            if (flags && flags.length) {
              if (type == 'NONE') {
                mApi().user.students.flags
                  .del(this.options.userIdentifier, flags[0].id)
                  .callback($.proxy(function(deleteErr, flags) {
                    if (deleteErr) {
                      $('.notification-queue').notificationQueue('notification', 'error', deleteErr);
                    } else {
                      window.location.reload();
                    }
                  }, this))
              } else {
                mApi().user.students.flags
                  .update(this.options.userIdentifier, flags[0].id, $.extend(flags[0], {
                    type: type
                  }))
                  .callback($.proxy(function(updateErr, flags) {
                    if (updateErr) {
                      $('.notification-queue').notificationQueue('notification', 'error', updateErr);
                    } else {
                      window.location.reload();
                    }
                  }, this))
              }
            } else {
              mApi().user.students.flags
                .create(this.options.userIdentifier, {
                  studentIdentifier: this.options.userIdentifier,
                  ownerIdentifier: MUIKKU_LOGGED_USER,
                  type: type
                })
                .callback($.proxy(function(createErr, flags) {
                  if (createErr) {
                    $('.notification-queue').notificationQueue('notification', 'error', createErr);
                  } else {
                    window.location.reload();
                  }
                }, this))
            }
          }
        }, this));
    },
    
    _onDocumentMouseUp: function (event) {
      var flagsContainer = $(event.target).closest('.gt-user-view-flags-container');
      if (!flagsContainer.length) {
        $('.gt-user-view-flags-dropdown-container').hide();
      }
    },
    
    _createStudentFlagsLoad: function () {
      return $.proxy(function (callback) {
        mApi().user.students.flags
          .read(this.options.userIdentifier, {ownerIdentifier: MUIKKU_LOGGED_USER })
          .callback($.proxy(function(flagErr, flags) {
            if (flagErr) {
              $('.notification-queue').notificationQueue('notification', 'error', flagErr);
            } else {
              var studentFlagType = (flags && flags.length ? flags[0].type : 'NONE')||'NONE';
              var studentFlagName = getLocaleText('plugin.guider.studentFlags.' + studentFlagType);
              callback(null, {
                studentFlagType: studentFlagType,
                studentFlagName: studentFlagName
              });
            }
          }, this));
      }, this);
    },
    
    _createStudentLoginsLoad: function () {
      return $.proxy(function (callback) {
        mApi().user.students.logins
          .read(this.options.userIdentifier, { maxResults: 1 })
          .callback($.proxy(function(err, loginDetails) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              callback(null, {
                lastLogin: loginDetails && loginDetails.length ? loginDetails[0].time : null
              });
            }
          }, this));
      }, this);
    },
    
    _createStudentLoginsLoad: function () {
      return $.proxy(function (callback) {
        mApi().user.students.logins
          .read(this.options.userIdentifier, { maxResults: 1 })
          .callback($.proxy(function(err, loginDetails) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              callback(null, {
                lastLogin: loginDetails && loginDetails.length ? loginDetails[0].time : null
              });
            }
          }, this));
      }, this);
    },
    
    _createStudentWorkspaceForumStatisticsLoad: function (workspaceEntityId) {
      return $.proxy(function (callback) {
        mApi().forum.workspace.statistics
          .read(workspaceEntityId, { userIdentifier: this.options.userIdentifier })
          .callback($.proxy(function(err, statistics) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              callback(null, {
                statistics: statistics||{
                  messageCount: 0,
                  latestMessage: null 
                }
              });
            }
          }, this));
      }, this);
    },
    
    _createStudentActivityLoad: function (workspaceEntityId) {
      return $.proxy(function (callback) {
        mApi().guider.workspaces.studentactivity
          .read(workspaceEntityId, this.options.userIdentifier )
          .callback($.proxy(function(err, activity) {  
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              callback(null, {
                activity: activity
              });
            }
          }, this));
      }, this);
    },
    
    _loadUser: function (studentFlagTypes) {
      this.element.addClass('loading');
      
      mApi().user.students
        .read(this.options.userIdentifier)
        .on('$', $.proxy(function(user, userCallback) {
          
          async.parallel([this._createStudentFlagsLoad(), this._createStudentLoginsLoad()], $.proxy(function(err, loads){
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var studentFlags = loads[0];
              var studentLogins = loads[1];
              
              user.lastLogin = studentLogins.lastLogin;
              user.studentFlagType = studentFlags.studentFlagType;
              user.studentFlagName = studentFlags.studentFlagName;
              userCallback();
            }
          }, this));
        }, this))
        .on('$', $.proxy(function(user, userCallback) {
          mApi().user.students.phoneNumbers
            .read(this.options.userIdentifier)
            .callback($.proxy(function(phoneNumberErr, phoneNumbers) {
              if (phoneNumberErr) {
                $('.notification-queue').notificationQueue('notification', 'error', phoneNumberErr);
              } else {
                user.phoneNumbers = phoneNumbers;
                userCallback();
              }
            }, this))
        }, this))
        .on('$', $.proxy(function(user, emailCallback) {
          mApi().user.students.emails
            .read(this.options.userIdentifier)
            .callback($.proxy(function(emailErr, emails) {
              if (emailErr) {
                $('.notification-queue').notificationQueue('notification', 'error', emailErr);
              } else {
                user.emails = emails;
                emailCallback();
              }
            }, this))
        }, this))
        .on('$', $.proxy(function(user, addressesCallback) {
          mApi().user.students.addresses
            .read(this.options.userIdentifier)
            .callback($.proxy(function(addressesErr, addresses) {
              if (addressesErr) {
                $('.notification-queue').notificationQueue('notification', 'error', addressesErr);
              } else {
                user.addresses = addresses;
                addressesCallback();
              }
            }, this))
        }, this))
        .callback($.proxy(function(err, user){
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
          } else {
            renderDustTemplate('guider/guider_view_profile.dust', { student: user, studentFlagTypes: studentFlagTypes }, $.proxy(function(text) {    
              this.element
                .removeClass('loading')
                .html(text);
              
              mApi().workspace.workspaces
                .read({ userIdentifier: this.options.userIdentifier })
                .on('$', $.proxy(function(workspace, workspaceCallback) {
                  
                  async.parallel([this._createStudentWorkspaceForumStatisticsLoad(workspace.id), this._createStudentActivityLoad(workspace.id)], $.proxy(function(err, loads){
                    if (err) {
                      $('.notification-queue').notificationQueue('notification', 'error', err);
                    } else {
                      var forumStatistics = loads[0];
                      var studentActivity = loads[1];
                      
                      workspace.activity = studentActivity.activity;
                      workspace.forumStatistics = forumStatistics.statistics;
                      
                      workspaceCallback();
                    }
                  }, this));
                  
                }, this)) 
                .callback($.proxy(function(err, workspaces) {             
                  renderDustTemplate('guider/guider_profile_workspaces.dust', workspaces, $.proxy(function(text){
                    this.element.find(".gt-data-container-1 div.gt-data").html(text);
                  }, this));
                }, this))
              }, this)); 
          }
        }, this));
    }
  });

  $(document).ready(function() {
    var workspaceIds = null;
    var studentFlagTypes = null;
    var openStudentProfile = null;
    var selectedFilters = null;
    try {
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
                    case 'studentFlagType':
                      studentFlagTypes = [setting[2]];
                    break;
                    default:
                      console.warn('Could not understand filter ' + setting[1]);
                    break;
                  }
                } else {
                  console.warn('Could not understand filter ' + settings[i]);
                }
              break;
              case 'filters':
                if (setting.length === 2) {
                  if (setting[1]) {
                    selectedFilters = $.parseJSON(atob(setting[1]));
                  }
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
      
      if (studentFlagTypes) {
        selectedFilters = (selectedFilters||[]).concat($.map(studentFlagTypes, function (id) {
          return {
            type:"studentFlagType",
            id: id
          };
        }));
      }
      
      if (workspaceIds) {
        selectedFilters = (selectedFilters||[]).concat($.map(workspaceIds, function (id) {
          return {
            type:"workspace",
            id: id
          };
        }));
      }
    } catch (e) {
      
    }
    
    $('.gt-filters-container').guiderFilters({
      filters: selectedFilters
    });
    
    $('.gt-search').guiderSearch();
    $('.gt-students-view-container').guiderStudents({
      workspaceIds: workspaceIds,
      studentFlagTypes: studentFlagTypes,
      openStudentProfile: openStudentProfile
    });
   
  });
  
}).call(this);
