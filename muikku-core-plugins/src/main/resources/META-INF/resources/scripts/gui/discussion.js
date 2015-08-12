$(document).ready(function() {

  function confirmThreadRemoval(confirmCallback) {
    renderDustTemplate('discussion/discussion-confirm-thread-removal.dust', {}, $.proxy(function(text) {
      var dialog = $(text);
      $(text).dialog({
        modal : true,
        resizable : false,
        width : 360,
        dialogClass : "discussion-management-dialog",
        buttons : [ {
          'text' : dialog.attr('data-button-confirm-text'),
          'class' : 'delete-button',
          'click' : function(event) {
            $(this).dialog("close");
            confirmCallback();
          }
        }, {
          'text' : dialog.attr('data-button-cancel-text'),
          'class' : 'cancel-button',
          'click' : function(event) {
            $(this).dialog("close");
          }
        } ]
      });
    }, this));
  }

  DiscImpl = $.klass({

    init : function() {
      // todo: parse url
      this.refreshLatest();
      this.refreshAreas();
      $(DiscImpl.msgContainer).on("click", '.di-message:not(.open) .di-message-meta-topic span', $.proxy(this.loadThread, this));
      $(DiscImpl.msgContainer).on("click", '.icon-goback', $.proxy(this.refreshLatest, this));
      $(DiscImpl.msgContainer).on("click", '.di-message-reply-link', $.proxy(this.replyMessage, this));
      $(DiscImpl.msgContainer).on("click", '.di-message-edit-link', $.proxy(this.editMessage, this));         
      $(DiscImpl.msgContainer).on("click", '.di-reply-edit-link', $.proxy(this.editMessageReply, this));
      $(DiscImpl.msgContainer).on("click", '.di-remove-thread-link', $.proxy(this._onRemoveThreadClick, this));
    },

    refreshLatest : function() {

      this.clearMessages();
      ;

      mApi().forum.latest.read().on('$', function(msgs, msgsCallback) {
        mApi().forum.areas.read(msgs.forumAreaId).callback(function(err, area) {
          msgs.areaName = area.name;

        });

        var d = new Date(msgs.created);

        msgs.prettyDate = d.toLocaleString();

        msgsCallback();

      }).callback(function(err, threads) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {

          renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {
            $(DiscImpl.msgContainer).append($.parseHTML(text));

          });
        }
      });

    },

    refreshAreas : function() {

      mApi().forum.areas.read().callback(function(err, areas) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.selectarea.empty', err));
        } else {

          var select = $("#discussionAreaSelect");

          $(select).empty();

          if (areas && (areas.length != 0)) {
            var allAreas = $("<option value='all'>" + getLocaleText('plugin.discussion.browseareas.all', err) + "</option>");
            allAreas.appendTo(select);
            for (var i = 0; i < areas.length; i++) {
              var name = areas[i].name;
              var id = areas[i].id;
              var groupId = areas[i].groupId;

              if (groupId == null) {
                $("<option value='" + id + "'>" + name + "</option>").appendTo(select);
              }

            }
          } else {
            $("<option>" + getLocaleText('plugin.discussion.selectarea.empty') + "</option>").appendTo(select);

          }

        }
      });

    },

    refreshThread : function(aId, tId) {

      this.clearMessages();

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {
        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });

        mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
          thread.creatorFullName = user.firstName + ' ' + user.lastName;

        });

        var d = new Date(thread.created);

        thread.prettyDate = d.toLocaleString();

        threadCallback();

      }).callback(function(err, threads) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {

          var areaPermissions = $.parseJSON($('input[name="areaPermissions"]').val());
          var mayRemoveThread = areaPermissions[aId] && areaPermissions[aId].removeThread;

          renderDustTemplate('/discussion/discussion_items_open.dust', {
            threads : threads,
            mayRemoveThread : mayRemoveThread
          }, function(text) {
            $(DiscImpl.msgContainer).append($.parseHTML(text));
          });
        }
      });

      this.loadThreadReplies(aId, tId);
    },

    filterMessagesByArea : function(val) {

      //        var element = $(event.target); 
      //          element = element.parents(".di-message");
      //          var aId = $(element).find("input[name='areaId']").attr('value') ;

      this.clearMessages();
      if (val == 'all') {
        this.refreshLatest();
      } else {
        mApi().forum.areas.threads.read(val).on('$', function(thread, threadCallback) {

          mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
            thread.areaName = area.name;

          });

          mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
            thread.creatorFullName = user.firstName + ' ' + user.lastName;

          });

          var d = new Date(thread.created);

          thread.prettyDate = d.toLocaleString();

          threadCallback();
        }).callback(function(err, threads) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          } else {

            renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {

              $(DiscImpl.msgContainer).append($.parseHTML(text));

            });
          }

        });

      }
    },

    loadThread : function(event) {

      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');

      this.clearMessages();

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {

        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });

        mApi().user.users.basicinfo.read(thread.creator).callback(function(err, user) {
          thread.creatorFullName = user.firstName + ' ' + user.lastName;

        });

        var d = new Date(thread.created);

        thread.prettyDate = d.toLocaleString();

        threadCallback();
      }).callback(function(err, threads) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          
          var areaPermissions = $.parseJSON($('input[name="areaPermissions"]').val());
          var mayRemoveThread = areaPermissions[aId] && areaPermissions[aId].removeThread;

          renderDustTemplate('/discussion/discussion_items_open.dust', {
            threads : threads,
            mayRemoveThread : mayRemoveThread
          }, function(text) {

            $(DiscImpl.msgContainer).append($.parseHTML(text));

          });
        }

      });

      this.loadThreadReplies(aId, tId);

    },

    loadThreadReplies : function(areaId, threadId) {

      this.clearReplies();

      mApi().forum.areas.threads.replies.read(areaId, threadId).on('$', function(replies, repliesCallback) {

        mApi().forum.areas.read(replies.forumAreaId).callback(function(err, area) {
          replies.areaName = area.name;

        });

        mApi().user.users.basicinfo.read(replies.creator).callback(function(err, user) {
          replies.creatorFullName = user.firstName + ' ' + user.lastName;

        });
        var d = new Date(replies.created);

        replies.prettyDate = d.toLocaleString();
        replies.threadId = threadId;
        repliesCallback();
        
      }).callback(function(err, replies) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
        } else {

          renderDustTemplate('/discussion/discussion_subitems.dust', replies, function(text) {

            $(DiscImpl.msgContainer).append($.parseHTML(text));

          });
        }
      });
    },

    _onRemoveThreadClick : function(event) {
      confirmThreadRemoval($.proxy(function() {
        var areaId = $('input[name="areaId"]').val();
        var threadId = $('input[name="threadId"]').val();

        mApi().forum.areas.threads.del(areaId, threadId).callback($.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            window.location.reload(true);
          }
        }, this));
      }, this));
    },

    replyMessage : function(event) {

      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendReply = function(values) {
        mApi().forum.areas.threads.replies.create(aId, tId, values).callback(function(err, result) {
        });

        window.discussion.refreshThread(aId, tId);

      }

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {

        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });
        
         thread.actionType = "reply"
        threadCallback();
      }).callback(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_create_reply.dust', thread, sendReply);
        }
      });
    },
   editMessage : function(event) {

      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendEditedMsg= function(values) {
        
        alert("Message edited");
      }

      mApi().forum.areas.threads.read(aId, tId).on('$', function(thread, threadCallback) {

        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });
        thread.actionType = "edit"
          
        threadCallback();
      }).callback(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_edit_message.dust', thread, sendEditedMsg);
        }
      });
    },
    editMessageReply : function(event) {

      var element = $(event.target);
      element = element.parents(".di-message");
      var rId = $(element).attr("id");
      var tId = $(element).find("input[name='threadId']").attr('value');
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendEditedReply= function(values) {
        
        alert("Message reply edited");


      }

      mApi().forum.areas.threads.replies.read(aId, tId, rId).on('$', function(thread, threadCallback) {

        mApi().forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;

        });
        thread.actionType = "edit"
        threadCallback();
      }).callback(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_edit_reply.dust', thread, sendEditedReply);
        }
      });
    },   
    clearMessages : function() {
      $(DiscImpl.msgContainer).empty();
    },

    clearReplies : function() {
      $(DiscImpl.subContainer).empty();
    },

    _klass : {
      // Variables for the class
      msgContainer : ".di-messages-container",
      subMsgContainer : ".di-submessages-container"

    }

  });

  window.discussion = new DiscImpl();
  
  $("#discussionAreaSelect").change(function() {
    window.discussion.filterMessagesByArea($(this).val());
  });

  $(".di-new-message-button").click(function() {
    var selArea = $("#discussionAreaSelect").val();

    var createMessage = function(values) {
      var forumAreaId = null;

      for (value in values) {
        if (value == "forumAreaId") {
          var forumAreaId = values[value];
          delete values[value];
        }
      }
      
      if (values.title =='') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.notitle'));
        return false;
      }
      if (values.message =='') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
        return false;
      } else {
        mApi().forum.areas.threads.create(forumAreaId, values).callback(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            // Refresh selected area
            window.discussion.filterMessagesByArea($("#forumAreaIdSelect").val());
            $("#discussionAreaSelect").val(forumAreaId);
          }
        });
      }

    }

    mApi().forum.areas.read().callback(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_create_message.dust', areas, createMessage);
      }
    });

  });

  $(".di-new-area-button").click(function() {

    var createArea = function(values) {
      mApi().forum.areas.create(values).callback(function(err, result) {
      });

      window.discussion.refreshLatest();
      window.discussion.refreshAreas();
    }

    mApi().forum.areas.read().callback(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_create_area.dust', areas, createArea);
      }
    });

  });
});
