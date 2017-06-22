(function() {
  'use strict';
  
  $.widget("custom.communicatorCreateMessageDialog", {
    options: {
      groupMessagingPermission: false,
      isStudent: true,
      replyMessageId: undefined,
      userRecipients: undefined,
      initialCaption: undefined,
      initialMessage: undefined,
      ckeditor: {
        uploadUrl: '/communicatorAttachmentUploadServlet',
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
      this.element.on('click', '.cm-message-recipient', $.proxy(this._onRecipientClick, this));
      
      this._load($.proxy(function () {
        this._contentsEditor = CKEDITOR.replace(this.element.find('textarea[name="content"]')[0], $.extend(this.options.ckeditor, {
          draftKey: 'communicator-new-message',
          on: {
            instanceReady: $.proxy(this._onCKEditorReady, this)
          }
        }));

        var autocomplete = this.element.find('input[name="recipient"]').autocomplete({
          open: function(event, ui) {
            $(event.target).perfectScrollbar({
              wheelSpeed:3,
              swipePropagation:false
            });
          },  
          source: $.proxy(function (request, response) {
            this._searchRecipients(request.term, function (err, results) {
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
              this._addRecipient(item.type, item.id, item.label);
              $(event.target).val("");
            }
            return false;
          }, this),
          
          appendTo: '#msgRecipientsContainer'
        });
        
        autocomplete.data("ui-autocomplete")._renderItem = function (ul, item) {
          var li = $("<li>")
            .text(item.label)
            .appendTo(ul);
          
          if (item.existing) {
            li.attr("data-existing", "true");
          }
        
          return li;
        };
      }, this));
    },
    
    _destroy: function () {
      try {
        this._contentsEditor.destroy();
      } catch (e) {
      }
    },
    
    _load: function (callback) {
      var replyMessageId = this.options.replyMessageId;
      this._signature = undefined;
      var hasSignature = false; 

      mApi().communicator.signatures.read().callback($.proxy(function (err, signatures) {
        if(signatures.length > 0){
          this._signature = "<br/> <i class='mf-signature'>" + signatures[0].signature + "</i>";            
          hasSignature = true;
        }        
        
        if (replyMessageId) {
          mApi().communicator.communicatormessages.read(replyMessageId).callback($.proxy(function (err, message) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              var isStudent = this.options.isStudent;
              var data = {
                replyMessage: message,
                hasSignature: hasSignature
              };
              
              renderDustTemplate('communicator/communicator_create_message.dust', data, $.proxy(function (text) {
                this.element.html(text);
                
                // #2821: Prevent form submit when pressing enter in a text field 
                var captionField = $(this.element).find('input[name="caption"]');
                captionField.on('keypress', function(event) {
                  if (event.keyCode == 13) {
                    event.preventDefault();
                  }
                });
                if (this.options.initialCaption) {
                  $(captionField).val(this.options.initialCaption);
                }
                if (this.options.initialMessage) {
                  $(this.element).find('textarea[name="content"]').val(this.options.initialMessage);
                }
                
                // If the message was sent by 'me', reply defaults for the other recipients
                var mode = (message.senderId == MUIKKU_LOGGED_USER_ID) ? "replyall" : this.options.mode;
                
                if (mode == "replyall") {
                  var recipients = [];
                  
                  // Add sender if it's not the logged user
                  if ((message.senderId != MUIKKU_LOGGED_USER_ID) && (message.sender)) {
                    var notMeSenderFullName = isStudent
                      ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
                      : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName;
                    recipients.push(this._recipient('USER', message.sender.id, notMeSenderFullName));
                  }

                  // Add all the recipients
                  $.each(message.recipients,  $.proxy(function (index, recipient) {
                    var recipientFullName = isStudent
                      ? (recipient.nickName ? recipient.nickName : recipient.firstName) + ' ' + recipient.lastName
                      : (recipient.nickName ? recipient.firstName + ' "' + recipient.nickName + '"' : recipient.firstName) + ' ' + recipient.lastName;
                    
                    if ((recipient.userId != message.senderId) && (recipient.userId != MUIKKU_LOGGED_USER_ID)) {
                      recipients.push(this._recipient('USER', recipient.userId, recipientFullName));
                    }
                  }, this));
                  
                  // Add all the usergroups if the user is allowed to message groups
                  if (this.options.groupMessagingPermission == true) {
                    $.each(message.userGroupRecipients,  $.proxy(function (index, recipient) {
                      recipients.push(this._recipient('GROUP', recipient.id, recipient.name));
                    }, this));
                  }
                  
                  // Add all the workspace groups if the user is allowed to message groups
                  if (this.options.groupMessagingPermission == true) {
                    $.each(message.workspaceRecipients,  $.proxy(function (index, recipient) {
                      recipients.push(this._recipient('WORKSPACE', recipient.workspaceEntityId, recipient.workspaceName));
                    }, this));
                  }
                  
                  // If there's 0 recipients the reply is for own message so just add the sender anyways
                  if ((recipients.length == 0) && (message.sender)) {
                    var senderFullName = isStudent
                      ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
                      : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName;
                    recipients.push(this._recipient('USER', message.sender.id, senderFullName));
                  }
                  
                  $.each(recipients, $.proxy(function (ind, recipient) {
                    this._addRecipientObj(recipient);
                  }, this));
                  
                  this.options.replyToGroupMessage = ((message.userGroupRecipients.length | 0) + (message.workspaceRecipients.length | 0)) > 0;
                } else {
                  if (message.sender) {
                    var replySenderFullName = isStudent
                      ? (message.sender.nickName ? message.sender.nickName : message.sender.firstName) + ' ' + message.sender.lastName
                      : (message.sender.nickName ? message.sender.firstName + ' "' + message.sender.nickName + '"' : message.sender.firstName) + ' ' + message.sender.lastName;
                    this._addRecipient('USER', message.sender.id, replySenderFullName);
                  }
                }
                
                if (callback) {
                  callback();
                }
              }, this));
            }
          }, this));
        } else {
          var data = {
            hasSignature: hasSignature
          };
          
          renderDustTemplate('communicator/communicator_create_message.dust', data, $.proxy(function (text) {
            this.element.html(text);

            // #2821: Prevent form submit when pressing enter in a text field 
            var captionField = $(this.element).find('input[name="caption"]');
            captionField.on('keypress', function(event) {
              if (event.keyCode == 13) {
                event.preventDefault();
              }
            });
            if (this.options.initialCaption) {
              $(captionField).val(this.options.initialCaption);
            }
            if (this.options.initialMessage) {
              $(this.element).find('textarea[name="content"]').val(this.options.initialMessage);
            }
            
            if (this.options.userRecipients) {
              $.each(this.options.userRecipients, $.proxy(function (index, recipient) {
                var recipientFullName = this.options.isStudent
                  ? (recipient.nickName ? recipient.nickName : recipient.firstName) + ' ' + recipient.lastName
                  : (recipient.nickName ? recipient.firstName + ' "' + recipient.nickName + '"' : recipient.firstName) + ' ' + recipient.lastName;
                
                this._addRecipient('USER', recipient.id, recipientFullName);
              }, this));
            }
            
            if (callback) {
              callback();
            }
          }, this));
        }
      }, this));    
    },

    _recipient: function(type, id, label) {
      return {
        id: id,
        name: label,
        type: type
      };
    },
    
    _addRecipient: function(type, id, label) {
      this._addRecipientObj(this._recipient(type, id, label));
    },
    
    _addRecipientObj: function (recipient) {
      switch (recipient.type) {
        case 'USER':
          renderDustTemplate('communicator/communicator_messagerecipient.dust', recipient, $.proxy(function (text) {
            this.element.find('.cm-message-recipients').prepend(text);
          }, this));
        break;
        case 'GROUP':
          renderDustTemplate('communicator/communicator_messagerecipientgroup.dust', recipient, $.proxy(function (text) {
            this.element.find('.cm-message-recipients').prepend(text);
          }, this));
        break;
        case 'WORKSPACE':
          renderDustTemplate('communicator/communicator_messagerecipientworkspace.dust', recipient, $.proxy(function (text) {
            this.element.find('.cm-message-recipients').prepend(text);
          }, this));
        break;
      }
    },
    
    _getRecipientIds: function () {
      return $.map(this.element.find('input[name="recipientIds"]'), function (input) {
        return parseInt($(input).val());
      });
    },
    
    _getRecipientGroupIds: function () {
      return $.map(this.element.find('input[name="recipientGroupIds"]'), function (input) {
        return parseInt($(input).val());
      });
    },
    
    _getExistingWorkspaceIds: function () {
      return $.map(this.element.find('input[name="recipientStudentsWorkspaceIds"],input[name="recipientTeachersWorkspaceIds"]'), function (input) {
        return parseInt($(input).val());
      });
    },
    
    _createWorkspaceSearch: function (term) {
      var existingWorkspaceIds = this._getExistingWorkspaceIds();
      
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
                return {
                  category: getLocaleText("plugin.communicator.workspaces"),
                  label : result.name + (result.nameExtension ? ' (' + result.nameExtension + ')' : ''),
                  id: result.id,
                  type : "WORKSPACE",
                  existing: existingWorkspaceIds.indexOf(result.id) != -1
                };
              }));
            }
          }, this));
      }, this);
    },
    
    _createGroupSearch: function (term) {
      var existingGroupIds = this._getRecipientGroupIds();
      
      return $.proxy(function (callback) {
        mApi().usergroup.groups
          .read({ 'searchString' : term })
          .callback(function(err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
                return {
                  category: getLocaleText("plugin.communicator.usergroups"),
                  label : result.name + " (" + result.userCount + ")",
                  id: result.id,
                  type : "GROUP",
                  existing: existingGroupIds.indexOf(result.id) != -1
                };
              }));
            }
          });
      }, this);
    },
    
    _createUserSearch: function (term) {
      var isStudent = this.options.isStudent;
      var existingUserIds = this._getRecipientIds();
      return $.proxy(function (callback) {
        mApi().user.users
          .read({ 'searchString' : term, 'onlyDefaultUsers': true })
          .callback(function(err, results) {
            if (err) {
              callback(err);
            } else {
              callback(null, $.map(results||[], function (result) {
                var label;
                if (isStudent) {
                  label = (result.nickName ? result.nickName : result.firstName) + ' ' + result.lastName;
                }
                else {
                  label = (result.nickName ? result.firstName + ' "' + result.nickName + '" ' : result.firstName) + ' ' + result.lastName; 
                }
                if (result.email) {
                  label = label + " (" + result.email + ")"
                }
                
                return {
                  category: getLocaleText("plugin.communicator.users"),
                  label : label,
                  id: result.id,
                  type: "USER",
                  img: result.hasImage ? "/picture?userId=" + result.id : null,
                  existing: existingUserIds.indexOf(result.id) != -1
                };
              }));
            }
          });
      }, this);
    },
    
    _searchRecipients: function (term, callback) {
      var tasks = [this._createUserSearch(term), this._createWorkspaceSearch(term)];

      if (this.options.groupMessagingPermission) {
        tasks.push(this._createGroupSearch(term));
      }
      
      async.parallel(tasks, function (err, results) {
        if (err) {
          callback(err);
        } else {
          callback(null, _.flatMap(results)); 
        }
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
        var buttonElement = $(event.target);
        buttonElement.attr('disabled','disabled');
        
        var caption = this.element.find('input[name="caption"]').val();
        var content = this._contentsEditor.getData();
        var signatureLen = this.element.find('input[name="signature"]:checked').length;

        
 
        
        if (!caption || !caption.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.notitle'));
          buttonElement.removeAttr('disabled');
          return false;
        }
        
        if (!content || !content.trim()) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.nomessage'));
          buttonElement.removeAttr('disabled');          
          return false;
        }
        
        if(signatureLen > 0){
          content = content + this._signature;          
        }
        
        var payload = {
          caption: caption,  
          content: content,
          categoryName: "message" 
        };
        
        $.each(['recipientIds', 'recipientGroupIds', 'recipientStudentsWorkspaceIds', 'recipientTeachersWorkspaceIds'], $.proxy(function (index, name) {
          var values = $.map(this.element.find('input[name="' + name + '"]'), function (input) {
            return $(input).val();
          });
          
          payload[name] = values;
        }, this));
            
        if (!payload.recipientIds.length && !payload.recipientGroupIds.length && !payload.recipientStudentsWorkspaceIds.length && !payload.recipientTeachersWorkspaceIds.length) {
          $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.errormessage.validation.norecipients'));
          buttonElement.removeAttr('disabled');
          return false;
        }
        
        var replyThreadId = this.options.replyThreadId;
        if (replyThreadId) {
          // Replying to a message that was group message but isn't anymore will be directed to new thread
          if (this.options.replyToGroupMessage) {
            var len1 = payload.recipientGroupIds.length | 0;
            var len2 = payload.recipientStudentsWorkspaceIds.length | 0;
            var len3 = payload.recipientTeachersWorkspaceIds.length | 0;
            
            if (len1 + len2 + len3 == 0)
              replyThreadId = undefined;
          }
        }
        
        if (replyThreadId) {
          mApi().communicator.messages
          .create(this.options.replyThreadId, payload)
          .callback($.proxy(function (err, result) {
            this._discardDraft();
            
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
              buttonElement.removeAttr('disabled');
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
              this.element.removeClass('loading');
              window.location.reload(true);
            }
          }, this));
        } else {
          mApi().communicator.messages
            .create(payload)
            .callback($.proxy(function (err, result) {
              this._discardDraft();
              
              if (err) {
                $('.notification-queue').notificationQueue('notification', 'error', getLocaleText('plugin.communicator.infomessage.newMessage.error'));
                buttonElement.removeAttr('disabled');
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText('plugin.communicator.infomessage.newMessage.success'));
                this.element.removeClass('loading');
                window.location.reload(true);
              }
            }, this));
        }
      }
    },
    
    _onCancelClick: function (event) {
      event.preventDefault();
      this.element.trigger('dialogClose');
      this.element.remove();
    },
    
    _onRecipientClick: function (event) {
      $(event.target).closest('.cm-message-recipient')
        .remove();
    },
    
    _onCKEditorReady: function (e) {
      this.element.find('input[name="send"]').removeAttr('disabled');
      this.element.trigger('dialogReady');
    }
  });
  
}).call(this);