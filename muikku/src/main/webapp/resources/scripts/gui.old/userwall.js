UserWallWidgetController = Class.create(WidgetController, {
  initialize: function () {
    this._entryElementClickListener = this._onEntryElementClick.bindAsEventListener(this);
    this._postCommentClickListener = this._onPostCommentClick.bindAsEventListener(this);
  },
  setup: function (widgetElement) {
    this._wallId = widgetElement.down("input[name='wallId']").value;
    this._userId = widgetElement.down("input[name='userId']").value;
    this._wallEntriesContainer = widgetElement.down(".wallEntries");
    
    this._listUserFeedItems();
    
    this._tabsContainer = widgetElement.down('.newWallEntryTabs');
    this._tabControl = new S2.UI.Tabs(this._tabsContainer);
    
  },
  deinitialize: function () {
    var _this = this;
    
    widgetElement.select('.wallEntryReplyLink').forEach(function (entryElement) {
      Event.stopObserving(entryElement, 'click', _this._entryElementClickListener);
    });
  },
  _listUserFeedItems: function () {
    var _this = this;
    
    RESTful.doGet(CONTEXTPATH + "/rest/wall/listUserFeedItems", {
      parameters: {
        'userId': this._userId
      },
      onSuccess: function (response) {
        renderDustTemplate('userfeeditems.dust', response.responseJSON, function (text) {
          _this._wallEntriesContainer.insert({
            bottom: text
          });
          
          _this._wallEntriesContainer.select('.wallEntryReplyLink').invoke("observe", "click", _this._entryElementClickListener);
        });
      }
    });
  },
  _onEntryElementClick: function (event) {
    var element = Event.element(event);
    element = element.hasClassName("wallEntry") ? element : element.up(".wallEntry");

    if (!this._commentRoot) {
      var root = new Element("div", { className: "wallEntryCommentForm" });
      
      var form = new Element("form", { onsubmit: "return false;" });
      
      form.appendChild(new Element("input", { type: "hidden", name: "wallEntryId" }));
      
      form.appendChild(new Element("input", { name: "wallEntryCommentText" }));
      var submitBtn = new Element("input", { type: "submit", name: "wallEntryCommentBtn", value: "Kommentoi" });
      form.appendChild(submitBtn);
      
//      var postLink = new Element("a", { onclick: "RESTful.postEventListener(event);" });
//      postLink.update("Kommentoi");
//      form.appendChild(postLink);
      
      root.appendChild(form);
      this._commentRoot = root;
      Event.observe(form, "submit", this._postCommentClickListener);
    }

    if (this._commentRoot.parentNode != element) {
      var wallEntryId = element.down("input[name='wallEntryId']").value;
      this._commentRoot.down("input[name='wallEntryId']").value = wallEntryId;
      this._commentRoot.down("input[name='wallEntryCommentText']").value = "";
  
      element.appendChild(this._commentRoot);
    }
  },
  _onPostCommentClick: function (event) {
    var wallEntryId = this._commentRoot.down("input[name='wallEntryId']").value;
    var wallId = this._wallId;
    var commentText = this._commentRoot.down("input[name='wallEntryCommentText']").value;
    var commentsContainer = this._commentRoot.up('.wallEntry').down('.wallEntryComments');
    
    RESTful.doPost(CONTEXTPATH + '/rest/wall/{wallId}/addWallEntryComment', {
      parameters: {
        'wallId': wallId,
        'wallEntryId': wallEntryId,
        'text': commentText
      },
      onSuccess: function (response) {
        renderDustTemplate('wallentryreply.dust', response.responseJSON, function (text) {
          commentsContainer.insert({
            bottom: text
          });
        });
      }
    });
  },
  _toggleUserRolePermission: function (event) {
//    var _this = this;
    
    var element = Event.element(event);
    var cell = element.up("td");
    
    var userRoleId = cell.down("input[name='userRoleId']").value;
    var permissionId = cell.down("input[name='permissionId']").value;

    var path = element.checked == true ? "/rest/permission/addEnvironmentUserRolePermission" : "/rest/permission/deleteEnvironmentUserRolePermission";
    
    RESTful.doPost(CONTEXTPATH + path, {
      parameters: {
        'userRoleId': userRoleId,
        'permissionId': permissionId
      },
      onSuccess: function (response) {
//        _this._fullCalendar.redraw();
//        var events = response.responseJSON;
//        for (var i = 0, l = events.length; i < l; i++) {
//          var event = events[i];
//          _this._addEvent(event.id, event.name, event.startTime, event.endTime);
//        }
      }
    });
  }
});

addWidgetController('userWallWidget', UserWallWidgetController);
