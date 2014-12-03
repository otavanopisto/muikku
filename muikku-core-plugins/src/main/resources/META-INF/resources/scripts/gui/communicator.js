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
    var imageUrl = CONTEXTPATH + "/themes/default/gfx/fish.jpg";
    if (item.image)
      imageUrl = item.image;
    
    var inner_html = 
      '<a><div class="communicator_autocomplete_item_container">' + 
      '<span class="communicator_autocomplete_item_image"><img width="25" height="25" src="' + imageUrl + '"></span>' +
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
		title : "Veistin! ",
		description : "Voit lähettää veistejä kaikille kavereillesi tai muuten vaan jos ei sellaisia ole!",
		content: $('<div><div><select name="msgTemplates"><option>Ei pohjia</option></select></div><div><div><input type="textfield" value="vastaanottajat" name="msgRecipients" id="msgRecipients"></input></div><div><input type="textfield" value="aihe" name="msgSubject"></input></div></div><div><textarea value="" name="msgContent"></textarea></div></div>'),
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
//          _this._selectRecipient(event, ui.item);
//          $(this).val("");
          return false;
        }
      });
		  
		},

    _searchUsers: function (searchTerm) {
      var _this = this;
      var users = new Array();

      console.log("searchUsers");
      
      RESTful.doGet(CONTEXTPATH + "/rest/user/searchUsers", {
        parameters: {
          'searchString': searchTerm
        }
      }).success(function (data, textStatus, jqXHR) {
        for (var i = 0, l = data.length; i < l; i++) {
          var img = undefined;
          
          if (data[i].hasImage)
            img = CONTEXTPATH + "/picture?userId=" + data[i].id;
          
          users.push({
            category: getLocaleText("plugin.communicator.users"),
            label: data[i].firstName + " " + data[i].lastName,
            id: data[i].id,
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
		
		options: [
 				{
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
        }, 
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
            var recipientIds = [10];
            var groupIds = [];
            
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
          }
        }, {
          caption : "Tallenna luonnos",
          name : "saveMail",
          action : function(e) {
          }
        } 
      ]
    });

    
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
          $('.cm-messages-container').append($.parseHTML(text));
        });
      });

 
    $(".cm-messages-container")
    
    .on('click','.mf-item', function(){
    	var mId = $(this).attr('id');
    	var mCont = $('.cm-messages-container');
        mApi().communicator.messages.read(mId).callback(function (err, result){
        	renderDustTemplate('communicator/communicator_items_open.dust', result, function (text) {
               mCont.empty();
	           mCont.append($.parseHTML(text));
              });
        });
    })
    .on('click','.cm-message-reply-link', function(){
        var pMsg = {
                communicatorMessageId: $(this).attr('id'),
                subject: "Aihe",
                content: "Sisalto",
                recipients: "vast1",
              };
        
        var fCont = $('.mf-item-content-tools');

        	renderDustTemplate('communicator/communicator_replymessage.dust', pMsg, function (text) {
               fCont.empty();
	           fCont.append($.parseHTML(text));
            });
        });
    
  

});