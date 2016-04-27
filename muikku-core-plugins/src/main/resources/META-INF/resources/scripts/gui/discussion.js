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
            $(this).dialog().remove();
            confirmCallback();
          }
        }, {
          'text' : dialog.attr('data-button-cancel-text'),
          'class' : 'cancel-button',
          'click' : function(event) {
            $(this).dialog().remove();
          }
        } ]
      });
    }, this));
  }

  DiscImpl = $.klass({

    init : function() {
      // todo: parse url
      this._refreshAreas();
      $(DiscImpl.msgContainer).on("click", '.di-message:not(.open) .di-message-meta-topic > span', $.proxy(this._onMessageClick, this));
      $(DiscImpl.msgContainer).on("click", '.icon-goback', $.proxy(this._onBackClick, this));
      $(DiscImpl.msgContainer).on("click", '.di-page-link-load-more-messages:not(.disabled)', $.proxy(this._onMoreClick, this));
      $(DiscImpl.msgContainer).on("click", '.di-page-link-load-more-replies:not(.disabled)', $.proxy(this._onMoreRepliesClick, this));
      $(DiscImpl.msgContainer).on("click", '.di-message-reply-link', $.proxy(this._replyMessage, this));
      $(DiscImpl.msgContainer).on("click", '.di-reply-answer-link', $.proxy(this._replyToReply, this));
      $(DiscImpl.msgContainer).on("click", '.di-message-edit-link', $.proxy(this._editMessage, this));      
      $(DiscImpl.msgContainer).on("click", '.di-reply-edit-link', $.proxy(this._editMessageReply, this));      
      $(DiscImpl.msgContainer).on("click", '.di-remove-thread-link', $.proxy(this._onRemoveThreadClick, this));
      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      $(window).trigger("hashchange");
     
    },

    _refreshLatest : function() {
      this._clearMessages();       
      this._addLoading(DiscImpl.msgContainer);  
      mApi({async: false}).forum.latest.read().on('$', $.proxy(function(msgs, msgsCallback) {
        mApi({async: false}).forum.areas.read(msgs.forumAreaId).callback(function(err, area) {
          msgs.areaName = area.name;
        });
        mApi({async: false}).user.users.basicinfo.read(msgs.creator).callback($.proxy(function(err, user) {
          msgs.creatorFullName = user.firstName + ' ' + user.lastName;
          var d = new Date(msgs.created);
          msgs.prettyDate = formatDate(d) + ' ' + formatTime(d);
          msgs.userRandomNo = Math.floor(Math.random() * 6) + 1;
          msgs.nameLetter = user.firstName.substring(0,1);
          msgsCallback();
          
        },this));
      }, this)).callback($.proxy(function(err, threads) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          this._clearLoading();  
          renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {
            $(DiscImpl.msgContainer).append($.parseHTML(text));
          });
        }
      },this));
    },

    _refreshAreas : function() {

      mApi({async: false}).forum.areas.read().callback($.proxy(function(err, areas) {

        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.selectarea.empty', err));
        } else {

          var select = $("#discussionAreaSelect");

          $(select).empty();

          if (areas && (areas.length != 0)) {
            $(".di-new-message-button").removeClass("disabled");
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
            $(".di-new-message-button").addClass("disabled");            
            $("<option>" + getLocaleText('plugin.discussion.selectarea.empty') + "</option>").appendTo(select);
          }

        }
      }, this));

    },

    _refreshThread : function(aId, tId) {
     this._clearMessages();
     this._addLoading(DiscImpl.msgContainer);
     var fromView = '';
     if (window.location.hash && window.location.hash.length > 1) {
       var parts = window.location.hash.substring(1).split('/');
       if (parts.length > 3) {
         fromView = parts[3];
       }
     }
     
     if (!fromView) {
       fromView = 'all';
     }
     
      mApi({async: false}).forum.areas.threads.read(aId, tId).on('$', $.proxy(function(thread, threadCallback) {
        mApi({async: false}).forum.areas.read(thread.forumAreaId).callback($.proxy(function(err, area) {
          thread.areaName = area.name;
          thread.fromView = fromView;
          mApi({async: false}).user.users.basicinfo.read(thread.creator).callback($.proxy(function(err, user) {
            thread.creatorFullName = user.firstName + ' ' + user.lastName;
            var d = new Date(thread.created);
            thread.prettyDate = formatDate(d) + ' ' + formatTime(d);
            thread.canEdit = thread.creator === MUIKKU_LOGGED_USER_ID ? true : false;
            threadCallback();          
          }, this));
        }, this));
      }, this)).callback($.proxy(function(err, threads) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          this._clearLoading();
          var areaPermissions = $.parseJSON($('input[name="areaPermissions"]').val());
          var mayRemoveThread = areaPermissions[aId] && areaPermissions[aId].removeThread;

          renderDustTemplate('/discussion/discussion_items_open.dust', {
            threads : threads,
            mayRemoveThread : mayRemoveThread
          }, function(text) {
            $(DiscImpl.msgContainer).append($.parseHTML(text));
          });
        }
      }, this));

      this._loadThreadReplies(aId, tId);
    },

    _filterMessagesByArea : function(val) {

      this._clearMessages();
      this._addLoading(DiscImpl.msgContainer);

      if (val == 'all') {
        this._refreshLatest();
      } else {
        mApi({async: false}).forum.areas.threads.read(val).on('$', $.proxy(function(thread, threadCallback) {

          mApi({async: false}).forum.areas.read(thread.forumAreaId).callback($.proxy(function(err, area) {
            thread.areaName = area.name;
            mApi({async: false}).user.users.basicinfo.read(thread.creator).callback($.proxy(function(err, user) {
              thread.creatorFullName = user.firstName + ' ' + user.lastName;
              var d = new Date(thread.created);
              thread.prettyDate = formatDate(d) + ' ' + formatTime(d);
              thread.userRandomNo = Math.floor(Math.random() * 6) + 1;
              thread.nameLetter = user.firstName.substring(0,1);              
              threadCallback();
            },this));
          }, this));
        }, this)).callback($.proxy(function(err, threads) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          } else {
            this._clearLoading();
            renderDustTemplate('/discussion/discussion_items.dust', threads, function(text) {
              $(DiscImpl.msgContainer).append($.parseHTML(text));
            });
            var loadMoreButton = $(".di-page-link-load-more-messages");
            loadMoreButton.attr('data-area-id', val);
          }
        }, this));
      }
    },

    _onMessageClick : function(event){
      var element = $(event.target);
      var hash = window.location.hash.substring(1);         
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');    
      var fId = hash.indexOf("area/") === 0 ? hash.substring(5) : "all";
      window.location.hash =  "#thread/" + aId + "/" + tId + "/" + fId;
    },

    _onBackClick : function(event){
      var element = $(event.target);
      var areaId = element.attr('data-from-view');
      if (!areaId) {
        window.location.hash =  '';
      } else {
        window.location.hash = "#area/" + areaId;
      } 
    },   
    
    _onMoreClick : function(event){
      var element = $(event.target);
      var areaId = element.attr("data-area-id");
      element = element.parents(".di-messages-paging");
      var pageElement = $(".di-messages-pages");
      this._addLoading(pageElement);
      
      $(element).remove();

      var loadedMsgs = $(DiscImpl.msgContainer).find('.di-message');
      var msgsCount = loadedMsgs.length;
      
      if (areaId == undefined){
        mApi({async: false}).forum.latest.read({'firstResult' : msgsCount}).on('$', $.proxy(function(msgs, msgsCallback) {
          mApi({async: false}).forum.areas.read(msgs.forumAreaId).callback($.proxy(function(err, area) {
            msgs.areaName = area.name;
            mApi({async: false}).user.users.basicinfo.read(msgs.creator).callback($.proxy(function(err, user) {
              msgs.creatorFullName = user.firstName + ' ' + user.lastName;            
              var d = new Date(msgs.created);
              msgs.prettyDate = formatDate(d) + ' ' + formatTime(d);
              msgs.userRandomNo = Math.floor(Math.random() * 6) + 1;
              msgs.nameLetter = user.firstName.substring(0,1);              
              msgsCallback();
            }, this));            
          },this));
        }, this)).callback($.proxy(function(err, threads) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          } else {
	          this._clearLoading(); 
        	  renderDustTemplate('/discussion/discussion_page.dust', threads, function(text) {
                pageElement.append($.parseHTML(text));
            });
          }
        }, this));     
      
      }else{
        mApi({async: false}).forum.areas.threads.read(areaId, {'firstResult' : msgsCount}).on('$', $.proxy(function(thread, threadCallback) {
          mApi({async: false}).forum.areas.read(thread.forumAreaId).callback($.proxy(function(err, area) {
            thread.areaName = area.name;
            mApi({async: false}).user.users.basicinfo.read(thread.creator).callback($.proxy(function(err, user) {
                thread.creatorFullName = user.firstName + ' ' + user.lastName;
                var d = new Date(thread.created);
                thread.prettyDate = formatDate(d) + ' ' + formatTime(d);
                threadCallback();
              }, this));
          }, this));
        }, this)).callback($.proxy(function(err, threads) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
          }else{
            this._clearLoading();
            renderDustTemplate('/discussion/discussion_page.dust', threads, function(text) {
              $(".di-messages-pages").append($.parseHTML(text));
            });
          }
        }, this));
			}
    },

    _onMoreRepliesClick : function(event){
      var element = $(event.target);
      var areaId = element.attr("data-area-id");
      var threadId = element.attr("data-thread-id");
      element = element.parents(".di-replies-paging");
      var pageElement = $(".di-replies-container");
      this._addLoading(pageElement);      
      $(element).remove();
      var pgs = $(DiscImpl.msgContainer).find('.di-replies-page');
      var pgCount = pgs.length;
      var newPg = pgCount + 1;
      var pgId = "#page-" + newPg;
      var msgs = $(DiscImpl.msgContainer).find('.di-message');
      var msgsCount = msgs.length;   
      var fRes = msgsCount - 1;
      
    mApi({async: false}).forum.areas.threads.replies.read(areaId, threadId, {'firstResult' : fRes}).on('$', $.proxy(function(replies, repliesCallback) {
        mApi({async: false}).forum.areas.read(replies.forumAreaId).callback($.proxy(function(err, area) {
          replies.areaName = area.name;

          mApi({async: false}).user.users.basicinfo.read(replies.creator).callback($.proxy(function(err, user) {
              replies.creatorFullName = user.firstName + ' ' + user.lastName;
              var d = new Date(replies.created);
              replies.prettyDate = formatDate(d) + ' ' + formatTime(d);
              replies.canEdit = replies.creator === MUIKKU_LOGGED_USER_ID ? true : false;
              replies.userRandomNo = Math.floor(Math.random() * 6) + 1;
              replies.nameLetter = user.firstName.substring(0,1);
              
              repliesCallback();
            }, this));          
        },this));
      }, this)).callback($.proxy(function(err, replies) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
        } else {
          this._clearLoading();
          if(replies){
            replies.pageNo = newPg;
            replies.areaId = areaId;
            replies.threadId = threadId;
            renderDustTemplate('/discussion/discussion_replies_page.dust', replies, function(text) {
              $(".di-replies-container").append($.parseHTML(text));
            });
          }

        }
      }, this));
    },       
    _loadThread : function(aId, tId, from) {
      mApi({async: false}).forum.areas.threads.read(aId, tId).on('$', $.proxy(function(thread, threadCallback) {

        mApi({async: false}).forum.areas.read(thread.forumAreaId).callback($.proxy(function(err, area) {
          thread.areaName = area.name;
          thread.fromView = from;
          mApi({async: false}).user.users.basicinfo.read(thread.creator).callback($.proxy(function(err, user) {
            thread.creatorFullName = user.firstName + ' ' + user.lastName;
            thread.canEdit = thread.creator === MUIKKU_LOGGED_USER_ID ? true : false;
            var d = new Date(thread.created);
            thread.prettyDate = formatDate(d) + ' ' + formatTime(d);
            thread.userRandomNo = Math.floor(Math.random() * 6) + 1;
            thread.nameLetter = user.firstName.substring(0,1);
            threadCallback();
          },this));          
        }, this));
      }, this)).callback($.proxy(function(err, threads) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          var areaPermissions = $.parseJSON($('input[name="areaPermissions"]').val());
          var mayRemoveThread = areaPermissions[aId] && areaPermissions[aId].removeThread;
          this._clearMessages();
          renderDustTemplate('/discussion/discussion_items_open.dust', {
            threads : threads,
            mayRemoveThread : mayRemoveThread
          }, function(text) {
            $(DiscImpl.msgContainer).append($.parseHTML(text));
          });
          this._loadThreadReplies(aId, tId);
        }
      },this));
    },
    _loadThreadReplies : function(areaId, threadId) {
      var pageNo = 1;
      this._clearReplies();
      this._addLoading(DiscImpl.msgContainer);
      mApi({async: false}).forum.areas.threads.replies.read(areaId, threadId).on('$', $.proxy(function(replies, repliesCallback) {
       
        mApi({async: false}).forum.areas.read(replies.forumAreaId).callback($.proxy(function(err, area) {
          replies.areaName = area.name;
          mApi({async: false}).user.users.basicinfo.read(replies.creator).callback($.proxy(function(err, user) {
            replies.creatorFullName = user.firstName + ' ' + user.lastName;
            replies.canEdit = replies.creator === MUIKKU_LOGGED_USER_ID ? true : false;
            var d = new Date(replies.created);
            replies.prettyDate = formatDate(d) + ' ' + formatTime(d);
            replies.threadId = threadId;
            replies.userRandomNo = Math.floor(Math.random() * 6) + 1;
            replies.nameLetter = user.firstName.substring(0,1);
            replies.isReply = replies.parentReplyId ? true : false;
            repliesCallback();
          },this));          
        }, this));
      }, this)).callback($.proxy(function(err, replies) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noreplies', err));
        } else {
          this._clearLoading();
          if(replies){
            replies.areaId = areaId;
            replies.threadId = threadId;
            replies.pageNo = pageNo;
            renderDustTemplate('/discussion/discussion_replies.dust', replies, function(text) {
              $(DiscImpl.msgContainer).append($.parseHTML(text));
            });            
          }
        }
      }, this));
    },

    _onRemoveThreadClick : function(event) {
      confirmThreadRemoval($.proxy(function() {
        var areaId = $('input[name="areaId"]').val();
        var threadId = $('input[name="threadId"]').val();

        mApi({async: false}).forum.areas.threads.del(areaId, threadId).callback($.proxy(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            window.location.hash = "#area/" + areaId;
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.threadremoved'));
          }
        }, this));
      }, this));
    },

    _replyMessage : function(event) {
      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendReply = function(values) {
        
        if (values.message.trim() === '') {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return false;
        } else {
        
          mApi({async: false}).forum.areas.threads.replies.create(aId, tId, values).callback($.proxy(function(err, result) {
            window.discussion._refreshThread(aId, tId);
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newreply'));
          },this));
        
        }
        
      }
  
      mApi({async: false}).forum.areas.threads.read(aId, tId).on('$', $.proxy(function(thread, threadCallback) {
        mApi({async: false}).forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;
          thread.actionType = "reply"
          threadCallback();
        });
      }, this)).callback($.proxy(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_create_reply.dust', thread, sendReply);
        }
      }, this));
    },
    _replyToReply : function(event) {
      var element = $(event.target);
      element = element.parents(".di-message");
      var parentId = $(element).attr("id");
      var tId = $(element).find("input[name='threadId']").attr('value');
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendReply = function(values) {
        
        if (values.message.trim() === '') {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
          return false;
        } else {
          values.parentReplyId = parentId;
          mApi({async: false}).forum.areas.threads.replies.create(aId, tId, values).callback($.proxy(function(err, result) {
            window.discussion._refreshThread(aId, tId);
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newreply'));
          },this));
        
        }
        
      }
  
      mApi({async: false}).forum.areas.threads.read(aId, tId).on('$', $.proxy(function(thread, threadCallback) {
        mApi({async: false}).forum.areas.read(thread.forumAreaId).callback(function(err, area) {
          thread.areaName = area.name;
          thread.actionType = "reply"
          threadCallback();
        });
      }, this)).callback($.proxy(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_create_reply.dust', thread, sendReply);
        }
      }, this));
    },
    _editMessage : function(event) {
      var element = $(event.target);
      element = element.parents(".di-message");
      var tId = $(element).attr("id");
      var aId = $(element).find("input[name='areaId']").attr('value');
      
      var sendEditedMsg= function(values) {
        values.id = tId;
        mApi({async: false}).forum.areas.threads.update(aId, tId, values).callback($.proxy(function(err, result) {
          window.discussion._refreshThread(aId, tId);
        }, this));
      }

      mApi({async: false}).forum.areas.threads.read(aId, tId).on('$', $.proxy(function(thread, threadCallback) {
        mApi({async: false}).forum.areas.read(thread.forumAreaId).callback($.proxy(function(err, area) {
          thread.areaName = area.name;
          thread.actionType = "edit"
          threadCallback();
        },this));

      }, this)).callback($.proxy(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_edit_message.dust', thread, sendEditedMsg);
        }
      }, this));
    },
    
    _editMessageReply : function(event) {

      var element = $(event.target);
      element = element.parents(".di-message");
      var rId = $(element).attr("id");
      var tId = $(element).find("input[name='threadId']").attr('value');
      var aId = $(element).find("input[name='areaId']").attr('value');

      var sendEditedReply= function(values) {
        values.id = rId
        mApi({async: false}).forum.areas.threads.replies.update(aId, tId, rId, values).callback($.proxy(function(err, result) {
          window.discussion._refreshThread(aId, tId);
        }, this));
      }

     mApi({async: false}).forum.areas.threads.replies.read(aId, tId, rId).on('$', $.proxy(function(thread, threadCallback) {

        mApi({async: false}).forum.areas.read(thread.forumAreaId).callback($.proxy(function(err, area) {
          thread.areaName = area.name;
          thread.actionType = "edit"
          threadCallback();
        }, this));
      },this)).callback($.proxy(function(err, thread) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nothreads', err));
        } else {
          openInSN('/discussion/discussion_edit_reply.dust', thread, sendEditedReply);
        }
      }, this));
    }, 
    
    
    _clearMessages : function() {
      $(DiscImpl.msgContainer).empty();
    },
  
    _addLoading : function(parentEl){
      $(parentEl).append('<div class="mf-loading"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div></div>');  
      
    },
    
    _clearLoading : function() {
      var loadingDivs = $(DiscImpl.msgContainer).find("div.mf-loading");
      
      loadingDivs.remove();
      
    },  
 
    _clearReplies : function() {
      $(DiscImpl.subContainer).empty();
    },
    
    _scrollToElement : function(el){
        var offT =  $(el).offset().top;
        var offH =  $(el).height();
        var offS = offT + offH;
       $("html,body").scrollTop(offS);
    },
    
    _onHashChange: function (event) {
      var hash = window.location.hash.substring(1);
       
        if (hash.indexOf("thread/") === 0) {
          var areaId = hash.substring(7,hash.indexOf("/",7));
          var hashEnd = hash.substring(hash.indexOf("/",7) + 1);
          var threadId = hashEnd.substring(0, hashEnd.indexOf("/",0));
          var from = hashEnd.substring(hashEnd.indexOf("/",0) + 1);
          var hI = hash.indexOf('/');
          var cHash = hash.substring(0, hI);
          this._loadThread(areaId,threadId,from);
 
        }else if(hash.indexOf("area/") === 0){
          if (hash.indexOf("all") == -1){
           
            var areaId = hash.substring(5);
           
          }else{
           var areaId = "all";
          }
          this._filterMessagesByArea(areaId);
          $("#discussionAreaSelect").val(areaId);
        }else{
          this._refreshLatest();
        }

    },    

    _klass : {
      // Variables for the class
      msgContainer : ".di-content-main",
      subContainer : ".di-submessages-container"
    }

  });

  window.discussion = new DiscImpl();
  
  $("#discussionAreaSelect").change(function() {
    window.location.hash =  "#area/" + $(this).val() ;
  });

  $(".di-new-message-button").click(function() {
    var disabled = $(this).hasClass("disabled");
    
    if(disabled === true){
      return false;
    }
      
    var selArea = $("#discussionAreaSelect").val();
    var createMessage = function(values) {
      var forumAreaId = null;

      for (value in values) {
        if (value == "forumAreaId") {
          var forumAreaId = values[value];
          delete values[value];
        }
      }
      
      if (values.title.trim() === '') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.notitle'));
        return false;
      }
      if (values.message.trim() === '') {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.nomessage'));
        return false;
      } else {
       mApi({async: false}).forum.areas.threads.create(forumAreaId, values).callback(function(err, result) {
          if (err) {
            $('.notification-queue').notificationQueue('notification', 'error', err);
          } else {
            // Refresh selected area
            window.discussion._filterMessagesByArea($("#forumAreaIdSelect").val());
            $("#discussionAreaSelect").val(forumAreaId);
            $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newmessage'));
          }
        });
      }
    }

    mApi({async: false}).forum.areas.read().callback($.proxy(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_create_message.dust', areas, createMessage);
      }
    }, this));

  });

  $(".di-new-area-button").click(function() {

    var createArea = function(values) {
      
      mApi({async: false}).forum.areas.create(values).callback(function(err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.newarea', err));
        } else {        
          window.discussion._refreshLatest();
          window.discussion._refreshAreas();
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.newarea'));
        }
      });

    }

    mApi({async: false}).forum.areas.read().callback($.proxy(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_create_area.dust', areas, createArea);
      }
    }, this));
  });
  
  $(".di-edit-area-button").click(function() {
    var editArea = function(values) {
      var areaId = values.forumAreaId;
      delete values.forumAreaId;
      mApi({async: false}).forum.areas.update(areaId, values).callback(function(err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.editarea', err));
        } else {        
          window.discussion._refreshLatest();
          window.discussion._refreshAreas();
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.editarea'));
        }
      });

    }

    mApi({async: false}).forum.areas.read().callback(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_edit_area.dust', areas, editArea);
      }
    });

  });  
  
  $(".di-delete-area-button").click(function() {
    var deleteArea = function(values) {
      var areaId = values.forumAreaId;
      mApi({async: false}).forum.areas.del(areaId).callback(function(err, result) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.areadelete', err));
        } else {                  
          window.discussion._refreshLatest();
          window.discussion._refreshAreas();
          $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.discussion.infomessage.areadeleted'));
        } 
      });
    }

    mApi({async: false}).forum.areas.read().callback($.proxy(function(err, areas) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.discussion.errormessage.noareas', err));
      } else {
        openInSN('/discussion/discussion_delete_area.dust', areas, deleteArea);
      }
    }, this));

  });  
});
