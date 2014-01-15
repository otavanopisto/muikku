(function() {
  
  NewGuidanceRequestWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      
      this._context = widgetElement.find("input[name='newGuidanceRequestContext']").val();
      this._contextId = widgetElement.find("input[name='newGuidanceRequestContextId']").val();
      
      widgetElement.on("click", "input[name='newGuidanceRequestSubmit']", $.proxy(this._onCreateNewGuidanceRequestClick, this));
    },
    deinitialize: function () {
    },
    _onCreateNewGuidanceRequestClick: function (event) {
      var _this = this;
      var element = $(event.target);
      
      var message = this._widgetElement.find("textarea[name='newGuidanceRequestMessage']").val(); 
      
      var target = "createGuidanceRequest";
      var params = {
          message: message
      };
      
      if (this._context == "WORKSPACE") {
        target = "createWorkspaceGuidanceRequest";
        params['workspaceId'] = this._contextId;
      }
      
//      {
//        'userId': this._userId,
//        'subject': newMessageElement.find("input[name='subject']").val(),
//        'content': newMessageElement.find("textarea[name='content']").val(),
//        'recipients': recipientIds,
//        'recipientGroups': recipientGroupIds,
//        'tags': newMessageElement.find("input[name='tags']").val()
//      }
      
      RESTful.doPost(CONTEXTPATH + "/rest/guidancerequest/" + target, {
        parameters: params
      }).success(function (data, textStatus, jqXHR) {
      });
    }
  });
  
  addWidgetController('newGuidanceRequest', NewGuidanceRequestWidgetController);

}).call(this);