(function() {
  
  WallWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      this._wallId = widgetElement.find("input[name='wallId']").val();
      this._wallEntriesContainer = widgetElement.find(".wallEntries");
      this._wallEntriesContainer.on("click", ".wallEntryReplyLink", $.proxy(this._onMessageClick, this));
      
      this._listWallEntries();
      
      this._tabsContainer = widgetElement.find('.newWallEntryTabs');
      this._tabControl = new S2.UI.Tabs(this._tabsContainer);
      
    },
    deinitialize: function () {
    },
    _listWallEntries: function () {
      var _this = this;
      
      RESTful.doGet(CONTEXTPATH + "/rest/wall/{wallId}/listWallEntries", {
        parameters: {
          'wallId': this._wallId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('wall/wallentries.dust', data, function (text) {
          _this._wallEntriesContainer.insert({
            bottom: text
          });
        });
      });
    },
    _onEntryElementClick: function (event) {
      var _this = this;
      var element = $(event.target);
      element = element.hasClass("wallEntry") ? element : element.parents(".wallEntry");
  
      if (!this._commentRoot) {
        alert("eihä tää toimi prkl.");
        
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
//        Event.observe(form, "submit", this._postCommentClickListener);
        form.on("submit", $.proxy(this._postCommentClickListener, this));
      }
  
      if (this._commentRoot.parentNode != element) {
        var wallEntryId = element.find("input[name='wallEntryId']").val();
        this._commentRoot.find("input[name='wallEntryId']").val(wallEntryId);
        this._commentRoot.find("input[name='wallEntryCommentText']").val("");
    
        element.appendChild(this._commentRoot);
      }
    },
    _onPostCommentClick: function (event) {
      var wallEntryId = this._commentRoot.find("input[name='wallEntryId']").val();
      var wallId = this._wallId;
      var commentText = this._commentRoot.find("input[name='wallEntryCommentText']").val();
      var commentsContainer = this._commentRoot.parents('.wallEntry').find('.wallEntryComments');
      
      RESTful.doPost(CONTEXTPATH + '/rest/wall/{wallId}/addWallEntryComment', {
        parameters: {
          'wallId': wallId,
          'wallEntryId': wallEntryId,
          'text': commentText
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('wallentryreply.dust', data, function (text) {
          commentsContainer.insert({
            bottom: text
          });
        });
      });
    },
    _toggleUserRolePermission: function (event) {
  //    var _this = this;
      
      var element = $(event.target);
      var cell = element.parents("td");
      
      var userRoleId = cell.find("input[name='userRoleId']").val();
      var permissionId = cell.find("input[name='permissionId']").val();
  
      var path = element.checked == true ? "/rest/permission/addEnvironmentUserRolePermission" : "/rest/permission/deleteEnvironmentUserRolePermission";
      
      RESTful.doPost(CONTEXTPATH + path, {
        parameters: {
          'userRoleId': userRoleId,
          'permissionId': permissionId
        }
      }).success(function (data, textStatus, jqXHR) {
  //        _this._fullCalendar.redraw();
  //        var events = response.responseJSON;
  //        for (var i = 0, l = events.length; i < l; i++) {
  //          var event = events[i];
  //          _this._addEvent(event.id, event.name, event.startTime, event.endTime);
  //        }
      });
    }
  });
  
  addWidgetController('wallWidget', WallWidgetController);

}).call(this);