(function() {
  'use strict';
  
  $.widget("custom.discussion", {
    
    _create : function() {
      this._areaId = null;
      
      this.element.on("change", "#discussionAreaSelect", $.proxy(this._onAreaSelectChange, this));
      this.element.on("click", ".di-new-area-button", $.proxy(this._onNewAreaClick, this));
      this.element.on("click", ".di-new-message-button", $.proxy(this._onNewMessageClick, this));
      this.element.on("click", ".di-edit-area-button", $.proxy(this._onEditMessageClick, this));
      this.element.on("click", ".di-delete-area-button", $.proxy(this._onDeleteMessageClick, this));
      this.element.find('.di-content-main').discussionMessages();
      
      this._load($.proxy(function () {
        this.loadArea('all');
      }, this)); 
    },
    
    loadArea: function (areaId) {
      this._areaId = parseInt(areaId);
      $(this.element.find("#discussionAreaSelect")).val(areaId);
      
      var editAreaButton = this.element.find('.di-edit-area-button');
      this._loadMessages(areaId);
    },
    
    reloadAreas: function () {
      var tasks = [this._createAreaLoad()];
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var areas = results[0];
          this._buildAreaSelect(areas);
          this.loadArea(_.flatMap(areas, 'id').indexOf(this._areaId) != -1 ? this._areaId : 'all');
        }
      }, this));
    },
        
    newAreaDialog: function () {
      var dialog = $('<div>')
        .discussionNewAreaDialog();
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
        
    editAreaDialog: function (areaId) {
      var dialog = $('<div>')
        .discussionEditAreaDialog({
          areaId: areaId
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
        
    deleteAreaDialog: function (areaId) {
      var dialog = $('<div>')
        .discussionDeleteAreaDialog({
          areaId: areaId
        });
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    newMessageDialog: function (options) {
      var dialog = $('<div>')
        .discussionNewMessageDialog(options||{});
      
      $('#socialNavigation')
        .empty()
        .append(dialog);
    },
    
    _load: function (callback) {
      var tasks = [this._createAreaLoad()];
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var areas = results[0];
          this._buildAreaSelect(areas);
          callback();
        }
      }, this));
    },
    
    _createAreaLoad: function () {
      return $.proxy(function (callback) {
        mApi().forum.areas
          .read()
          .callback(callback);
      }, this);
    },
    
    _buildAreaSelect: function (areas) {
      var areaSelect = $(this.element)
        .find("#discussionAreaSelect")
        .empty();
        
      if (areas && areas.length) {
        $(this.element).find(".di-new-message-button").removeClass("disabled");          
        
        $('<option>')
          .text(getLocaleText('plugin.discussion.browseareas.all'))
          .attr('value', 'all')
          .appendTo(areaSelect);
        
        $.each(areas, function (index, area) {
          if (!area.groupId) {
            $('<option>')
              .attr('value', area.id)
              .text(area.name) 
              .appendTo(areaSelect);
          }
        });
      } else {
        $(this.element).find(".di-new-message-button").addClass("disabled");          
        
        $('<option>')
          .text(getLocaleText('plugin.discussion.selectarea.empty'))
          .appendTo(areaSelect);
      }
    },
    
    _loadMessages: function (areaId) {
      this.element.find('.di-content-main').discussionMessages('loadMessages', areaId); 
    },
    
    _onAreaSelectChange: function (event) {
      event.preventDefault();
      this.loadArea($(event.target).val());
    },
    
    _onNewAreaClick: function (event) {
      this.newAreaDialog();
    },
    
    _onNewMessageClick: function (event) {
      var options = {};
      
      if (this._areaId != 'all') {
        options.areaId = this._areaId;
      }
      
      this.newMessageDialog(options);
    },
    
    _onEditMessageClick: function (event) {
      this.editAreaDialog(this._areaId);
    },
    
    _onDeleteMessageClick: function (event) {
      this.deleteAreaDialog(this._areaId);
    }
    
  });
  
  $.widget("custom.discussionMessages", {
    
    options: {
      maxThreadCount: 25
    },
    
    _create : function() {
      this._firstResults = 0;
      this._threads = [];
      
      this.element.on("click", ".di-page-link-load-more-messages", $.proxy(this._onLoadMoreClick, this));
    },
    
    loadMessages: function (areaId) {
      this._areaId = areaId;
      this._reloadMessages();
    },
    
    _loadMoreMessages: function () {
      this._firstResults += this.options.maxThreadCount;
      this._loadMessages(this._areaId);
    },
    
    _reloadMessages: function () {
      this._firstResults = 0;
      this._threads = [];
      this._loadMessages(this._areaId);
    },
    
    _loadMessages: function (areaId) {
      var parameters = {
        firstResult: this._firstResults,
        maxResults: this.options.maxThreadCount + 1
      };
        
      var request = areaId == 'all' ? mApi().forum.latest.read(parameters) : mApi().forum.areas.threads.read(areaId, parameters);
      
      request
        .on('$', $.proxy(function(message, messageCallback) {
          this._loadMessageDetails(message, function (err, details) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              message = $.extend(message, details);
              messageCallback();
            }
          });
        }, this))
        .callback($.proxy(function(err, response) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            var threads = _.clone(response);
            
            var hasMore = false;
            if (threads.length > this.options.maxThreadCount) {
              hasMore = true;
              threads.pop();
            }
            
            this._threads = this._threads.concat(threads);
            
            renderDustTemplate('/discussion/discussion_items.dust', { 
              threads: this._threads, 
              hasMore: hasMore 
            }, $.proxy(function(text) {
              $(this.element).html(text);
            }, this))
          }
        }, this));
    },
    
    _loadArea: function (forumAreaId, callback) {
      mApi().forum.areas
        .read(forumAreaId)
        .callback(callback);
    },
    
    _loadUserInfo: function (userEntityId, callback) {
      mApi().user.users.basicinfo
        .read(userEntityId)
        .callback(callback);
    },
    
    _createLoadArea: function (forumAreaId) {
      return $.proxy(function (callback) {
        this._loadArea(forumAreaId, callback);
      }, this);
    },
    
    _createUserInfoLoad: function (userEntityId) {
      return $.proxy(function (callback) {
        this._loadUserInfo(userEntityId, callback);
      }, this);
    },
    
    _loadMessageDetails: function(message, callback) {
      var tasks = [this._createUserInfoLoad(message.creator), this._createLoadArea(message.forumAreaId)];
      
      async.parallel(tasks, function (err, results) {
        if (err) {
          callback(err);
        } else {
          var user = results[0];
          var area = results[1];
          var d = new Date(message.created);
          var ud = new Date(message.updated);          
          // TODO: remove prettyDates...
          callback(null, {
            areaName: area.name,
            creatorFullName: user.firstName + ' ' + user.lastName,
            prettyDate: formatDate(d) + ' ' + formatTime(d),
            prettyDateUpdated: formatDate(ud) + ' ' + formatTime(ud),
            userRandomNo: (user.id % 6) + 1,
            nameLetter: user.firstName.substring(0,1)
          });
        }
      });
    },
    
    _onLoadMoreClick: function (event) {
      this._loadMoreMessages();
    }
  });
  
  $.widget("custom.discussionNewAreaDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      var data = {};
      renderDustTemplate('/discussion/discussion_create_area.dust', data, $.proxy(function (text) {
        this.element.html(text);
        
        if (callback) {
          callback();
        }
      }, this));
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        mApi().forum.areas
          .create({
            name: this.element.find('input[name="name"]').val()
          })
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
            } else {        
              $('#discussion').discussion('loadArea', 'all');
            }
            
            this.element.remove();
          }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $.widget("custom.discussionEditAreaDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      this.element.on('change', "select[name='forumAreaId']", $.proxy(this._onAreaChange, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      mApi().forum.areas
        .read()
        .callback($.proxy(function(err, areas) {
          renderDustTemplate('/discussion/discussion_edit_area.dust', areas, $.proxy(function (text) {
            this.element.html(text);
            
            if (this.options.areaId && this.options.areaId != 'all') {
              var areaSelect = this.element.find("select[name='forumAreaId']");
              areaSelect.val(this.options.areaId)
              this.element.find('input[name="name"]').val(areaSelect.find(':selected').text());
            }
            
            if (callback) {
              callback();
            }
          }, this));
        }, this));
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var areaId = this.element.find("select[name='forumAreaId']").val();
        
        mApi().forum.areas
          .update(areaId, {
            name: this.element.find('input[name="name"]').val()
          })
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
            } else {
              $('#discussion').discussion('reloadAreas');
            }
            
            this.element.remove();
          }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    },
    
    _onAreaChange: function (event) {
      this.element.find('input[name="name"]').val($(event.target).find(':selected').text());
    }
  });
  
  $.widget("custom.discussionDeleteAreaDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      mApi().forum.areas
        .read()
        .callback($.proxy(function(err, areas) {
          renderDustTemplate('/discussion/discussion_delete_area.dust', areas, $.proxy(function (text) {
            this.element.html(text);
            
            if (this.options.areaId && this.options.areaId != 'all') {
              this.element.find("select[name='forumAreaId']")
                .val(this.options.areaId)
            }
            
            if (callback) {
              callback();
            }
          }, this));
        }, this));
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var areaId = this.element.find("select[name='forumAreaId']").val();
        
        mApi().forum.areas
          .del(areaId)
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              $('#discussion').discussion('reloadAreas');
            }
            
            this.element.remove();
          }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    },
    
    _onAreaChange: function (event) {
      this.element.find('input[name="name"]').val($(event.target).find(':selected').text());
    }
  });
  
  $.widget("custom.discussionNewMessageDialog", {
    _create : function() {
      this.element.on('click', "input[name='send']", $.proxy(this._onSendClick, this));
      this.element.on('click', "input[name='cancel']", $.proxy(this._onCancelClick, this));
      
      this._load($.proxy(function () {
        
      }, this));
    },
    
    _load: function (callback) {
      var tasks = [this._createAreasLoad()];
      
      async.parallel(tasks, $.proxy(function (err, results) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          var areas = results[0];
          
          renderDustTemplate('/discussion/discussion_create_message.dust', areas, $.proxy(function (text) {
            this.element.html(text);
            
            if (this.options.areaId) {
              this.element.find('*[name="forumAreaId"]').val(this.options.areaId);
            }
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));
    },
    
    _createAreasLoad: function () {
      return $.proxy(function (callback) {
        mApi().forum.areas
          .read()
          .callback(callback);
      }, this);
    },
    
    _onSendClick: function (event) {
      var form = $(event.target).closest('form')[0];
      if (form.checkValidity()) {
        var forumAreaId = this.element.find('*[name="forumAreaId"]').val();
        
        var title = this.element.find('*[name="title"]').val();
        if (!title && !title.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.notitle'));
          return;
        }
        
        var message = this.element.find('*[name="message"]').val();
        if (!message || !message.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return;
        }

        var sticky = this.element.find('*[name="sticky"]').val() == 'true';
        var locked = this.element.find('*[name="locked"]').val() == 'true';

        var payload = {
          title: title,
          message: message,
          forumAreaId: forumAreaId,
          sticky: sticky,
          locked: locked
        };
        
        mApi().forum.areas.threads
          .create(forumAreaId, payload)
          .callback($.proxy(function(err, result) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newmessage'));
              $('#discussion').discussion('loadArea', forumAreaId);
              this.element.remove();
            }
          }, this));
      }
    },

    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.remove();
    }
  });
  
  $(document).ready(function() {
    $('#discussion').discussion();
    
    webshim.polyfill('forms');
  });

}).call(this);