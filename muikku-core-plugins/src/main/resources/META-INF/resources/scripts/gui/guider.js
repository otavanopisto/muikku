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
      async.parallel([ this._loadFlags,this._loadWorkspaces], $.proxy(function(err, filters){
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
      mApi().user.flags
        .read({ ownerIdentifier: MUIKKU_LOGGED_USER })
        .callback(function (err, flags) {
          if (err) {
            callback(err);
          } else {
            callback(null, {
              title: getLocaleText('plugin.guider.filters.flags'),
              type: 'flag',
              data: $.map(flags, function (flag) {
                return {
                  'id': flag.id,
                  'name': flag.name,
                  'color': flag.color,
                  'iconClass': 'icon-flag'
                };
              })
            });
          }
        });
    },
    
    _loadWorkspaces: function (callback) {
      mApi().workspace.workspaces
        .read({
          userIdentifier: MUIKKU_LOGGED_USER,
          maxResults: 500,
          orderBy: 'alphabet'
        })
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
      canListHiddenStudents: false
    },
    
    _create : function() {
      this._page = 0;
      this._students = [];
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
      this._flags = null;
      
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
            case 'flag':
              if (!this._flags) {
                this._flags = [filter.id];
              } else {
                this._flags.push(filter.id);
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
      this._flags = null;
      this._reloadStudents();
    },
    
    flags: function (flags) {
      this._page = 0;
      this._workspaceIds = null;
      this._flags = flags;
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
      
      if (this._flags) {
        options['flags'] = this._flags;
      }
      
      if (this.options.canListHiddenStudents) {
        options['includeHidden'] = true;
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
          mApi().usergroup.groups.read({userIdentifier: userIdentifier}).callback($.proxy(function(err, groups) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.guider.errormessage.nouser', err));
            } else {
              var dustContext = user;
              dustContext.groups = groups;
              renderDustTemplate('guider/guider_item_details.dust', dustContext, $.proxy(function(text) {              
                userElement.find('.gt-user-details-content')
                  .html(text);

                userElement
                  .removeClass('loading closed')
                  .addClass('open');
              }, this));
            }
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
  
  $.widget("custom.guiderFlagShareDialog", {
    
    options: {
      flagId: null
    },
  
    _create : function() {
      this._dialog = null;
      
      async.parallel([this._createFlagLoad(), this._createSharesLoad()], $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var flag = results[0];
          var shares = results[1];

          renderDustTemplate('guider/guider_share_flag.dust', { flag: flag, shares: shares }, $.proxy(function(text) {
            this._dialog = $(text);
            $(this._dialog).dialog({
              modal : true,
              minHeight : 200,
              resizable : false,
              width : 560,
              dialogClass : "guider-share-flag-dialog",
              open: $.proxy(this._onDialogOpen, this),
              buttons : [ {
                'text' : this._dialog.attr('data-button-save'),
                'class' : 'save-button',
                'click' : $.proxy(this._onDialogSaveClick, this)
              }, {
                'text' : this._dialog.attr('data-button-cancel'),
                'class' : 'cancel-button',
                'click' : $.proxy(this._onDialogCancelClick, this)
              } ]
            });
          }, this));
        }
      }, this));
    },
        
    _createFlagLoad: function () {
      return $.proxy(function (callback) {
        return this._loadFlag(callback);
      }, this);
    },
    
    _createSharesLoad: function () {
      return $.proxy(function (callback) {
        return this._loadShares(callback);
      }, this);
    },
    
    _loadFlag: function (callback) {
      mApi().user.flags
        .read(this.options.flagId)
        .callback($.proxy(function (err, flag) {
          if (err) {
            callback(err);
          } else {
            callback(err, flag);
          }
        }, this));
    },
    
    _loadShares: function (callback) {
      mApi().user.flags.shares
        .read(this.options.flagId)
        .callback($.proxy(function (err, shares) {
          if (err) {
            callback(err);
          } else {
            var userLoads = $.map(shares, function (share) {
              return function (callback) {
                mApi().user.users.basicinfo
                  .read(share.userIdentifier)
                  .callback(callback)
              }
            });
            
            async.parallel(userLoads, function (userErr, users) {
              if (userErr) {
                callback(userErr);
              } else {
                for (var i = 0, l = users.length; i < l; i++) {
                  shares[i].name = users[i].firstName + ' ' + users[i].lastName;
                }  
                
                callback(err, shares);
              }
            });
          }
        }, this));
    },
    
    _createStaffMemberSearch: function (term, existingIds) {
      return $.proxy(function (callback) {
        mApi().user.staffMembers.read({ 'searchString' : term }).callback(function (err, staffMembers) {
          if (err) {
            callback(err);
          } else {
            callback(null, $.map(staffMembers, function (staffMember) {
              var label = (staffMember.firstName + " " + staffMember.lastName)||'';
              if (staffMember.email) {
                label += (label ? ' ' : '') + '<' + staffMember.email + '>';
              }
              
              return {
                type: 'USER',
                label: label,
                id: staffMember.id,
                existing: existingIds && existingIds.indexOf(staffMember.id) != -1
              }
              
            }));
          }
        });
      }, this);
    },
    
    _appendNewShare: function (targetId, type, name) {
      var removeLink = $('<a>')
        .addClass('remove')
        .attr('href', 'javascript:void(null)')
        .text(getLocaleText('plugin.guider.flags.shareFlagDialog.removeShare'));
      
      $('<div>')
        .addClass('share')
        .attr({
          'data-share-target-id': targetId,
          'data-share-status': 'NEW',
          'data-share-type': type 
        })
        .append($('<label>').text(name))
        .append(removeLink)
        .appendTo($(this._dialog).find('.shares'));
    },
    
    _onShareRemoveClick: function (event) {
      var shareElement = $(event.target).closest('.share');
      if (shareElement.attr('data-share-status') == 'NEW') {
        shareElement.remove(); 
      } else {
        shareElement.attr('data-share-status', 'REMOVED');
      }
    },
    
    _closeDialog: function () {
      this._dialog.dialog("destroy").remove();
      this.element.remove();
    },
    
    _getExistingStaffMemberIds: function () {
      return _.compact($.map(this._dialog.find('.shares .share'), function (share) {
        if ($(share).attr('data-share-type') == 'USER') {
          return $(share).attr('data-share-target-id');
        }
        
        return null;
      }));
    },
    
    _search: function (request, response) {
      var searches = [this._createStaffMemberSearch(request.term, this._getExistingStaffMemberIds())];
      async.parallel(searches, function (searchErr, results) {
        if (searchErr) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          response(_.flatten(results));  
        }
      });
    },
    
    _createNewShare: function (userIdentifier) {
      return $.proxy(function (callback) {
        mApi().user.flags.shares
          .create(this.options.flagId, {
            flagId: this.options.flagId,
            userIdentifier: userIdentifier
          })
          .callback($.proxy(function (err, flagShare) {
            if (err) {
              callback(err);
            } else {
              callback(err, flagShare);
            }
        }, this));
      }, this);
    },
    
    _createRemoveShare: function (id) {
      return $.proxy(function (callback) {
        mApi().user.flags.shares
          .del(this.options.flagId, id)
          .callback(callback);
      }, this);
    },
    
    _onDialogOpen: function (event, ui) {
      $(this._dialog).on("click", ".shares .remove", $.proxy(this._onShareRemoveClick, this));
      $(this._dialog).find('.add-user')
        .autocomplete({
          create: function(event, ui){
            $(this).perfectScrollbar(); 
          },  
          source: $.proxy(this._search, this),
          select: $.proxy(this._onAddUserSelect, this)
        });
      
      var autocompleteData = $(this._dialog).find('.add-user').data("ui-autocomplete");
      
      autocompleteData._renderItem = function (ul, item) {
        var li = $("<li>")
          .text(item.label)
          .appendTo(ul);
        
        if (item.existing) {
          li.attr("data-existing", "true");
        }
      
        return li;
      };
    },
    
    _onAddUserSelect: function (event, ui) {
      var item = ui.item;
      if (!item.existing) {
        this._appendNewShare(item.id, item.type, item.label);
        $(this._dialog).find('.add-user').val('');
      }
      
      return false;
    },
    
    _onDialogSaveClick: function (event) {
      var actions = $.map(this._dialog.find('.shares .share'), $.proxy(function (shareElement) {
        var shareType = $(shareElement).attr('data-share-type');
        var shareStatus = $(shareElement).attr('data-share-status');
        var shareTargetId = $(shareElement).attr('data-share-target-id');
        var shareId = $(shareElement).attr('data-share-id');
        
        switch (shareType) {
          case 'USER':
            if (shareStatus == 'NEW') {
              return this._createNewShare(shareTargetId);
            } else if (shareStatus == 'REMOVED') {
              return this._createRemoveShare(shareId);
            }
          break;
        }
      }, this));

      async.series(_.compact(actions), $.proxy(function (err) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._closeDialog();
          window.location.reload(true);
        }
      }, this));
      
    },
    
    _onDialogCancelClick: function (event) {
      this._closeDialog();
    }
  });
  

  $.widget("custom.guiderProfile", {
    options: {
      userIdentifier: null
    },
    
    _create : function() {
      this.element.addClass('gt-user-view-profile');
      
      this.element.on("click", ".gt-new-flag", $.proxy(this._onNewFlagClick, this));
      this.element.on("click", ".gt-edit-flag", $.proxy(this._onEditFlagClick, this));
      this.element.on("click", ".gt-share-flag", $.proxy(this._onShareFlagClick, this));
      this.element.on("click", ".gt-remove-flag", $.proxy(this._onRemoveFlagClick, this));
      this.element.on("click", ".gt-existing-flag", $.proxy(this._onExistingFlagClick, this));
      
      this.element.on("click", ".gt-course-details-container", $.proxy(this._onNameClick, this));
      $(document).on("mouseup", $.proxy(this._onDocumentMouseUp, this));
      
      this._loadFlags($.proxy(function (err, flags) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          this._loadUser(flags);
        }
      }, this));
    },

    _loadFlags: function (callback) {
      mApi().user.flags
        .read({ ownerIdentifier: MUIKKU_LOGGED_USER })
        .callback($.proxy(function (err, flags) {
          if (err) {
            callback(err);
          } else {
            callback(err, flags);
          }
        }, this));
    },
    
    _loadFlag: function (id, callback) {
      mApi().user.flags
        .read(id)
        .callback($.proxy(function (err, flag) {
          if (err) {
            callback(err);
          } else {
            callback(err, flag);
          }
        }, this));
    },
    
    _flagStudent: function (flagId, callback) {
      mApi().user.students.flags
        .create(this.options.userIdentifier, {
          flagId: flagId,
          studentIdentifier: this.options.userIdentifier
        })
        .callback(callback);
    },
    
    _unflagStudent: function (id, callback) {
      mApi().user.students.flags
        .del(this.options.userIdentifier, id)
        .callback(callback);
    },
    
    _onNameClick: function (event) {
      var element = $(event.target).closest('.gt-course');
      if (element.hasClass('open')) {
        element.removeClass('open');
      } else {
        element.addClass('open');
      }
    },
    
    _onNewFlagClick: function (event) {
      renderDustTemplate('guider/guider_new_flag.dust', { }, $.proxy(function(text) {
        var dialog = $(text);
        
        $(dialog).dialog({
          modal : true,
          minHeight : 200,
          resizable : false,
          width : 560,
          dialogClass : "guider-add-flag-dialog",
          buttons : [ {
            'text' : dialog.attr('data-button-create'),
            'class' : 'create-button',
            'click' : $.proxy(function(event) {
              var payload = {
                ownerIdentifier: MUIKKU_LOGGED_USER
              };
              
              $.each(['name', 'color', 'description'], $.proxy(function (index, property) {
                payload[property] = $(this).find('*[name="' + property + '"]').val();
              }, dialog));
              
              mApi().user.flags
                .create(payload)
                .callback($.proxy(function (err, flag) {
                  if (err) {
                    $('.notification-queue').notificationQueue('notification', 'error', err);
                  } else {
                    this._flagStudent(flag.id, function (flagErr, studentFlag) {
                      if (flagErr) {
                        $('.notification-queue').notificationQueue('notification', 'error', flagErr);
                      } else {
                        $(dialog).dialog("destroy").remove();
                        window.location.reload();
                      }                      
                    });
                  }
                }, this));
            }, this)
          }, {
            'text' : dialog.attr('data-button-cancel'),
            'class' : 'cancel-button',
            'click' : function(event) {
              $(this).dialog("destroy").remove();
            }
          } ]
        });
      }, this));
    },
    
    _onEditFlagClick: function (event) {
      var flagElement = $(event.target).closest('.gt-flag');
      var flagId = flagElement.attr('data-flag-id');
      
      this._loadFlag(flagId, $.proxy(function (err, flag) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          renderDustTemplate('guider/guider_edit_flag.dust', { flag: flag }, $.proxy(function(text) {
            var dialog = $(text);
            $(dialog).dialog({
              modal : true,
              minHeight : 200,
              resizable : false,
              width : 560,
              dialogClass : "guider-edit-flag-dialog",
              buttons : [ {
                'text' : dialog.attr('data-button-save'),
                'class' : 'save-button',
                'click' : function(event) {
                  $.each(['name', 'color', 'description'], $.proxy(function (index, property) {
                    flag[property] = $(this).find('*[name="' + property + '"]').val();
                  }, this));
                  
                  mApi().user.flags
                    .update(flagId, flag)
                    .callback($.proxy(function (err) {
                      if (err) {
                        $('.notification-queue').notificationQueue('notification', 'error', err);
                      } else {
                        $(this).dialog("destroy").remove();
                        window.location.reload(true);
                      }
                    }, this));
                }
              }, {
                'text' : dialog.attr('data-button-cancel'),
                'class' : 'cancel-button',
                'click' : function(event) {
                  $(this).dialog("destroy").remove();
                }
              } ]
            });
          }, this));
        }
      }, this));
    },
    
    _onShareFlagClick: function (event) {
      var flagElement = $(event.target).closest('.gt-flag');
      var flagId = flagElement.attr('data-flag-id');
      
      $('<div>').guiderFlagShareDialog({
        flagId: flagId   
      });
    },
    
    _onExistingFlagClick: function (event) {
      var flagElement = $(event.target).closest('.gt-existing-flag');
      var flagId = $(flagElement).attr('data-flag-id');
      this._flagStudent(flagId, function () {
        window.location.reload(true);
      });
    },
    
    _onRemoveFlagClick: function (event) {
      var flagElement = $(event.target).closest('.gt-flag');
      var id = $(flagElement).attr('data-id');
      
      this._unflagStudent(id, function () {
        window.location.reload(true);
      });
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
              callback(null, flags);
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
        mApi().workspace.workspaces.forumStatistics
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
    
    _loadUser: function (flags) {
      this.element.addClass('loading');
      var flagMap = {};
      $.each(flags, function (index, flag) {
        flagMap[flag.id] = flag;
      });
      
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
              user.studentFlags = $.map(studentFlags, function (studentFlag) {
                return $.extend(studentFlag, {
                  flag: flagMap[studentFlag.flagId]
                });
              });
              
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
            renderDustTemplate('guider/guider_view_profile.dust', { student: user, flags: flags }, $.proxy(function(text) {    
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
    var flags = null;
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
                    case 'flag':
                      flags = [setting[2]];
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
      
      if (flags) {
        selectedFilters = (selectedFilters||[]).concat($.map(flags, function (id) {
          return {
            type:"flag",
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
      flags: flags,
      openStudentProfile: openStudentProfile,
      canListHiddenStudents: $('input[name="canListHiddenStudents"]').val() == 'true'
    });
   
  });
  
}).call(this);
