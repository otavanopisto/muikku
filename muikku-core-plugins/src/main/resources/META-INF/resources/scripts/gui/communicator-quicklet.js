(function() {
  
  CommunicatorQuickletWidgetController = $.klass(WidgetController, {
    initialize: function () {
    },
    setup: function (widgetElement) {
      var _this = this;
      widgetElement = $(widgetElement);
      this._widgetElement = widgetElement;

      $(".tt-menu-communicator-link-req").click(function (event) {
        $(".ui-dialog-content").dialog("close");

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
    },
    deinitialize: function () {
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
      
      $(".ui-dialog-content").dialog("close");
    }
  });
  
  addWidgetController('wi-dock-static-navi-button-communicator', CommunicatorQuickletWidgetController);

}).call(this);