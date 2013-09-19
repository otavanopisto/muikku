(function() {
  
  UserWallWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      this._wallId = widgetElement.find("input[name='wallId']").val();
      this._userId = widgetElement.find("input[name='userId']").val();
      this._wallEntriesContainer = widgetElement.find(".wallEntries");
      this._wallEntriesContainer.on("click", ".wallEntryReplyLink", $.proxy(this._onEntryElementClick, this));
      this._wallEntriesContainer.on("submit", ".wallEntryCommentFormForm", $.proxy(this._onPostCommentClick, this));
      
      
      widgetElement.find("input[name='newWallEntryButton']").click($.proxy(this._onNewWallEntryButtonClick, this));
      widgetElement.find("input[name='newGuidanceRequestButton']").click($.proxy(this._onNewGuidanceRequestButtonClick, this));

      this._listUserFeedItems();
      
      this._tabsContainer = widgetElement.find('.newWallEntryTabs');
//      this._tabControl = new S2.UI.Tabs(this._tabsContainer);
    },
    deinitialize: function () {
    },
    _listUserFeedItems: function () {
      var _this = this;

      RESTful.doGet(CONTEXTPATH + "/rest/wall/{wallId}/listWallEntries", {
        parameters: {
          'wallId': this._wallId
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('wall/wallentries.dust', data, function (text) {
          _this._wallEntriesContainer.append($.parseHTML(text));
        });
      });
    },
    _onEntryElementClick: function (event) {
      var _this = this;
      var element = $(event.target);
      element = element.hasClass("wallEntry") ? element : element.parents(".wallEntry");
  
      if (!this._commentRoot) {
        var data = {
          wallEntryId: element.find("input[name='wallEntryId']").val()
        };
        
        renderDustTemplate('wall/newcomment.dust', data, function (text) {
          _this._commentRoot = $($.parseHTML(text));

          if (_this._commentRoot.parentNode != element) {
            var wallEntryId = element.find("input[name='wallEntryId']").val();
            
            _this._commentRoot.find("input[name='wallEntryId']").val(wallEntryId);
            _this._commentRoot.find("input[name='wallEntryCommentText']").val("");
            
            element.append(_this._commentRoot);
          }
        });
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
        renderDustTemplate('wall/wallentryreply.dust', data, function (text) {
          commentsContainer.append($.parseHTML(text));
        });
      });
    },
    _toggleUserRolePermission: function (event) {
  //    var _this = this;
      
      var element = Event.element(event);
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
    },
    _onNewWallEntryButtonClick: function () {
      var _this = this;
      var wallId = this._wallId;
      var text = this._widgetElement.find("input[name='newWallEntryText']").val();
      var visibility = "PUBLIC";
      
      RESTful.doPost(CONTEXTPATH + '/rest/wall/{wallId}/addTextEntry', {
        parameters: {
          'wallId': wallId,
          'text': text,
          'visibility': visibility
        }
      }).success(function (data, textStatus, jqXHR) {
        renderDustTemplate('wall/wallentry.dust', data, function (text) {
          _this._wallEntriesContainer.append($.parseHTML(text));
        });
      });
    }
  });
  
  addWidgetController('userWallWidget', UserWallWidgetController);
}).call(this);