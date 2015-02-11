$.widget("custom.communicatorautocomplete", $.ui.autocomplete, {
  _renderMenu: function(ul, items) {
    var _this = this;
    var currentCategory = "";
  
    $.each(items, function(index, item) {
      if (item.category != currentCategory) {
        if (item.category)
          ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
        currentCategory = item.category;
      }
      _this._renderItemData(ul, item);
    });
  },
  _renderItem: function(ul, item) {
    var inner_html = 
      '<a><div class="communicator_autocomplete_item_container">' + 
      '<span class="communicator_autocomplete_item_label">' + item.label + '</span></div></a>';
    return $( "<li></li>" ).data( "item.autocomplete", item ).append(inner_html).appendTo( ul );
  }
});

$.fn.extend({
  /**
   * Thanks to
   * https://github.com/Kasheftin/jquery-textarea-caret/blob/master/jquery.textarea.caret.js
   */
  
  insertAtCaret: function(myValue) {
    return this.each(function(i) {
      if (document.selection) {
        this.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        this.focus();
      }
      else 
      if (this.selectionStart || this.selectionStart == "0") {
        var startPos = this.selectionStart;
        var endPos = this.selectionEnd;
        var scrollTop = this.scrollTop;
        this.value = this.value.substring(0,startPos) + myValue + this.value.substring(endPos,this.value.length);
        this.focus();
        this.selectionStart = startPos + myValue.length;
        this.selectionEnd = startPos + myValue.length;
        this.scrollTop = scrollTop;
      }
      else {
        this.value += myValue;
        this.focus();
      }
    }
  )}
});


$(document).ready(function(){
	
	$(".bt-mainFunction").m3modal({
		title : "Uusi viesti ",
		description : "Voit lähettää uuden viestin opettajillesi tai opiskelutovereillesi.",
		content: $('<div class="cm-message-new"><div><div class="cm-message-new-recipients" id="msgRecipientsContainer"></div><div><input type="textfield" value="Vastaanottajat" name="msgRecipients" id="msgRecipients"></input></div><div><input type="textfield" value="aihe" name="msgSubject"></input></div></div><div><textarea value="" name="msgContent"></textarea></div></div>'),
		modalgrid : 24,
		contentgrid : 24,

    onBeforeOpen: function (modal) {
      var resps = $("#msgRecipients");
      var _this = this;
      
      resps.communicatorautocomplete({
        source: function (request, response) {
          response(_this._doSearch(request.term));
        },
        select: function (event, ui) {
          _this._selectRecipient(event, ui.item);
          $(this).val("");
          return false;
        }
      });
      
      $('.cm-message-new').on('focus', 'input', function(){
        var dval = this.defaultValue;
        var cval = $(this).val();
         
        if (dval == cval){
          $(this).val('');
        } 
      });
      
   	  $('.cm-message-new').on('blur', 'input', function(){
        var dval = this.defaultValue;
        var cval = $(this).val();
  	 
        if (!cval ){ 
          $(this).val(dval);	 
        }        	
      });	 
      
      $("#msgRecipientsContainer").on("click", ".cm-message-recipient-name", $.proxy(_this._onRemoveRecipientClick, _this));
    },

    _searchUsers: function (searchTerm) {
    	var _this = this;
    	var users = new Array();

    	mApi().user.users.read({ 'searchString' : searchTerm }).callback(
    	 function (err, result) {
    	   for (var i = 0, l = result.length; i < l; i++) {
    		 var img = undefined;
             if (result[i].hasImage)
              img = CONTEXTPATH + "/picture?userId=" + result[i].id;
              users.push({
                category: getLocaleText("plugin.communicator.users"),
                label: result[i].firstName + " " + result[i].lastName,
                id: result[i].id,
                image: img,
                type: "USER"
               });
             }
     }); 

      return users;
    },
//    _searchGroups: function (searchTerm) {
//      var _this = this;
//      var userGroups = new Array();
//
//      RESTful.doGet(CONTEXTPATH + "/rest/usergroup/searchGroups", {
//        parameters: {
//          'searchString': searchTerm
//        }
//      }).success(function (data, textStatus, jqXHR) {
//        for (var i = 0, l = data.length; i < l; i++) {
//          userGroups.push({
//            category: getLocaleText("plugin.communicator.usergroups"),
//            label: data[i].name,
//            id: data[i].id,
//            memberCount: data[i].memberCount,
//            image: undefined, // TODO usergroup image
//            type: "GROUP"
//          });
//        }
//      });
//
//      return userGroups;
//    },
    _doSearch: function (searchTerm) {
//      var groups = this._searchGroups(searchTerm);
//      var users = this._searchUsers(searchTerm);
//      
//      return $.merge(groups, users);
      return this._searchUsers(searchTerm);
    },
    _selectRecipient: function (event, item) {
      var _this = this;
      var element = $(event.target);
      var recipientListElement = $("#msgRecipientsContainer"); 
      
      var prms = {
        id: item.id,
        name: item.label
      };
  
      if (item.type == "USER") {
        renderDustTemplate('communicator/communicator_messagerecipient.dust', prms, function (text) {
          recipientListElement.append($.parseHTML(text));
        });
      } else {
        if (item.type == "GROUP") {
//          prms.memberCount = item.memberCount;
//          
//          renderDustTemplate('communicator/communicator_messagerecipientgroup.dust', prms, function (text) {
//            recipientListElement.append($.parseHTML(text));
//          });
        }
      }
        
    },
    _onRemoveRecipientClick : function (event) {
      var element = $(event.target);
      if (!element.hasClass("cm-message-recipient"))
        element = element.parents(".cm-message-recipient");
      element.remove();
    },
    
		options: [
 /*				{
          caption : "Lähetä myös itselle",
          name : "mailSelf",
          type : "checkbox",
          action : function(e) {
          }
        }, {
          caption : "Lisää allekirjoitus",
          name : "addSignature",
          type : "checkbox",
          action : function(e) {
          }
        }, */
      ],

      buttons : [ 
        {
          caption : "Lähetä",
          name : "sendMail",
          action : function(e) {
            var subject = e.contentElement.find("input[name='msgSubject']").val();
            var content = e.contentElement.find("textarea[name='msgContent']").val();
            var tagStr = "tagi viesti"; // TODO: Tag content
            var tags = tagStr != undefined ? tagStr.split(' ') : [];
            var recipientIds = [];
            var groupIds = [];

            var recipientListElement = $("#msgRecipientsContainer");
            $(recipientListElement.children(".cm-message-recipient")).each(function (index) {
              recipientIds.push($(this).find("input[name='userId']").val());
            });

            mApi().communicator.messages.create({
              categoryName: "message",
              caption : subject,
              content : content,
              tags : tags,
              recipientIds : recipientIds,
              recipientGroupIds : groupIds
            })
            .callback(function (err, result) {
            });
            
            $('.md-background').fadeOut().remove();
          }
        } /* , {
          caption : "Tallenna luonnos",
          name : "saveMail",
          action : function(e) {
          }
        } */
      ]
  });


  CommunicatorImpl = $.klass({
    init: function () {
      $('.cm-messages-container').on('click','.cm-message:not(.open)', $.proxy(this._onMessageClick, this));
      $('.cm-messages-container').on('click','.icon-goback', $.proxy(this._onMessageBackClick, this));

      $(window).on("hashchange", $.proxy(this._onHashChange, this));
      
      $(window).trigger("hashchange");
    },
    _showNewMessageView : function () {
    },
    _showInbox : function () {
      mApi().communicator.items.read()
      .on('$', function (item, itemCallback) {
        mApi().communicator.communicatormessages.sender.read(item.id)
          .callback(function (err, user) {  
            item.senderFullName = user.firstName + ' ' + user.lastName;
            item.senderHasPicture = user.hasImage;
          });
        mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
          .callback(function (err, count) {
            item.messageCount = count;
          });

        itemCallback();
      })
      .callback(function (err, result) {
        renderDustTemplate('communicator/communicator_items.dust', result, function (text) {
          $('.cm-messages-container').empty();
          $('.cm-messages-container').append($.parseHTML(text));
        });
      });
    },
    _showMessage : function (communicatorMessageId) {
      var mCont = $('.cm-messages-container');
      var _this = $(this); 
      
      mApi().communicator.messages.read(communicatorMessageId).callback(function (err, result) {
        for (var i = 0; i < result.length; i++) {
          var sId = result[i].id;
          mApi().communicator.communicatormessages.sender.read(sId)
            .callback(function (err, user) {  

            if (MUIKKU_LOGGED_USER_ID == user.id){
              result[i].isOwner = true;         
            } else {
              result[i].isOwner = false;    
            }               

            result[i].senderFullName = user.firstName + ' ' + user.lastName;
            result[i].senderHasPicture = user.hasImage;
          });
        } 
            
        renderDustTemplate('communicator/communicator_items_open.dust', result, function(text) {
          mCont.empty();
          mCont.append($.parseHTML(text));

          $(".cm-message-reply-link").click(function(event) {
            var element = $(event.target);
            element = element.parents(".cm-message");
            var eId = element.attr('id');
            var fCont = element.find('.cm-message-content-tools-reply-container');
            var tCont = element.find('.cm-message-content-tools-container');
            var messageId = element.find('input[name="communicatorMessageId"]').val();

            mApi().communicator.communicatormessages.read(eId).on('$', function(reply, replyCallback) {
              mApi().communicator.communicatormessages.sender.read(messageId).callback(function(err, user) {
                reply.senderFullName = user.firstName + ' ' + user.lastName;
                reply.senderHasPicture = user.hasImage;
              });

              replyCallback();
            })

            .callback(function(err, result) {
              renderDustTemplate('communicator/communicator_replymessage.dust', result, function(text) {

                tCont.hide();
                fCont.append($.parseHTML(text));

                var cBtn = $(fCont).find("input[name='cancel']");
                var sBtn = $(fCont).find("input[name='send']");

                $(sBtn).click(function() {
                  var cmId = $(fCont).find("input[name='communicatorMessageId']").val();
                  var subject = $(fCont).find("input[name='subject']").val();
                  var content = $(fCont).find("textarea[name='content']").val();
                  var tagStr = "tagi viesti"; // TODO: Tag content
                  var tags = tagStr != undefined ? tagStr.split(' ') : [];
                  var recipientIdStr = $(fCont).find("input[name='recipientIds']").val();
                  var recipientIds = recipientIdStr != undefined ? recipientIdStr.split(',') : [];
                  var groupIds = [];

                  mApi().communicator.messages.create(cmId, {
                    categoryName : "message",
                    caption : subject,
                    content : content,
                    tags : tags,
                    recipientIds : recipientIds,
                    recipientGroupIds : groupIds
                  }).callback(function(err, result) {
                  });

                  // Go to inbox
                  window.location.reload();
                });

                $(cBtn).click(function() {
                  tCont.show();
                  fCont.empty();

                });

              });
            });
          });
        });

        mApi().communicator.messages.markasread.create(communicatorMessageId).callback(function (err, result) {});
      });
    },
    _showSentItems : function () {
    },
    _showSettingsView : function () {
    },
    _onMessageClick: function (event) {
      var element = $(event.target);
      element = element.parents(".cm-message");
      var cmId = element.find("input[name='communicatorMessageIdId']").val();

      var box = "#in";
      
      if (window.location.hash) {
        if (window.location.hash.startsWith("#sent"))
          box = "#sent";
      }
      
      window.location.hash = box + "/" + cmId;
    },
    _onMessageBackClick: function (event) {
      var box = "#in";
      
      if (window.location.hash) {
        if (window.location.hash.startsWith("#sent"))
          box = "#sent";
      }
      
      window.location.hash = box;
      return false;
    },
    _onHashChange: function (event) {
      var hash = window.location.hash.substring(1);
      var _this = this;
      
      if (hash == "new") {
        _this._showNewMessageView();
      } else if (hash == "settings") {
        _this._showSettingsView();
      } else if (hash.startsWith("in/")) {
        var messageId = hash.substring(3);
        _this._showMessage(messageId);
      } else if (hash == "sent") {
        _this._showSentItems();
      } else if (hash.startsWith("sent/")) {
        var messageId = hash.substring(5);
        _this._showMessage(messageId);
      } else
        _this._showInbox();
    }
  });

  window.mCommunicator = new CommunicatorImpl();
  
});
