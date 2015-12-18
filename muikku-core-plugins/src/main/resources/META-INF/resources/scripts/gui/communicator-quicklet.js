(function() {
  
  CommunicatorQuickletWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;
      
      $(".tt-menu-link-communicator-msg").click(function (event) {
        $(".ui-dialog-content").dialog().remove();

        var dTitle = $(this).text();
        
        renderDustTemplate("communicator/communicator_newmessage.dust", {}, function (text) {
          $(text).dialog({
            title: dTitle,
            
            show: {
              effect: "fade",
              duration: 500
              },
            hide: {
              effect: "fade",
              duration: 500
              },
            open: function(event, ui) {
//              $(this).on("click", "input[name='newGuidanceRequestSubmit']", _this._onCreateNewGuidanceRequestClick);
            }
          });
        });      
      });

      $(".tt-menu-link-communicator-req").click(function (event) {
        $(".ui-dialog-content").dialog().remove();

        var context = {
          newGuidanceRequestContext: $(this).find("input[name='newGuidanceRequestContext']").val(),
          newGuidanceRequestContextId: $(this).find("input[name='newGuidanceRequestContextId']").val()
        };

        var dTitle = $(this).text();
        
        renderDustTemplate("communicator/communicator_guidancerequest.dust", context, function (text) {
          $(text).dialog({
            title: dTitle,
            
            show: {
              effect: "fade",
              duration: 500
              },
            hide: {
              effect: "fade",
              duration: 500
              },
            open: function(event, ui) {
              $(this).on("click", "input[name='newGuidanceRequestSubmit']", _this._onCreateNewGuidanceRequestClick);
            }
          });
        });      
      });
      
      this._refreshUnreadMessagesFlappidiFlap();
      
      $(document).on("Communicator:newmessagereceived", function (event, data) {
        _this._refreshUnreadMessagesFlappidiFlap();
      });
      $(document).on("Communicator:messageread", function (event) {
        _this._refreshUnreadMessagesFlappidiFlap();
      });
    },
    deinitialize: function () {
    },
    _refreshUnreadMessagesFlappidiFlap: function () {
      var _this = this;
      mApi({async: false}).communicator.receiveditemscount.read()
        .callback(function (err, result) {
          var newMessagesCounterFlap = _this._widgetElement.find(".wi-dock-notification");
          if (result > 0) {
            newMessagesCounterFlap.text(result);
            newMessagesCounterFlap.show();
          } else {
            newMessagesCounterFlap.hide();
          }
        });
    },
    _onCreateNewGuidanceRequestClick: function (event) {
      var _this = this;
      var element = $(event.target);
      
      element = element.parents(".cm-newGuidanceRequest");
      
      var message = element.find("textarea[name='newGuidanceRequestMessage']").val(); 
      var context = element.find("input[name='newGuidanceRequestContext']").val();
      var contextId = element.find("input[name='newGuidanceRequestContextId']").val();
      
      var target = "createGuidanceRequest";
      var params = {
          message: message
      };
      
      if (context == "WORKSPACE") {
        target = "createWorkspaceGuidanceRequest";
        params['workspaceId'] = contextId;
      }
      
      RESTful.doPost(CONTEXTPATH + "/rest/guidancerequest/" + target, {
        parameters: params
      }).success(function (data, textStatus, jqXHR) {
      });
      
      $(".ui-dialog-content").dialog().remove();
    }
  });
  
  addWidgetController('wi-dock-static-navi-button-communicator', CommunicatorQuickletWidgetController);

}).call(this);