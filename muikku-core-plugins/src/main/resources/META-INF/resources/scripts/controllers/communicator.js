loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
  
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/navigation.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/toolbar.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/body.js.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
  
  function getApiIdFromLocation(currentLocation){
    switch(currentLocation.id){
      case "inbox":
        mapiLocation = "items";
        break;
      case "unread":
        mapiLocation = "items";
        break;
      case "sent":
        mapiLocation = "sentitems";
        break;
      case "trash":
        mapiLocation = "trash";
        break;
    }
    if (!mapiLocation){
      if (console && console.warn){
        console.warn("Invalid mapi location for deletetion", currentLocation);
      }
    }
    return mapiLocation;
  }
  
  var body;
  var toolbar;
  var navigation;
  
  toolbar = $.getWidgetContainerFor("communicator-toolbar").communicatorToolbarControllerWidget({
    onDeleteClick: function(){
      var messages = body.communicatorBodyControllerWidget('getSelectedMessages');
      var currentLocation = navigation.communicatorNavigationControllerWidget('getCurrentLocation');
      
      var mapiLocation = getApiIdFromLocation(currentLocation);
      
      var calls = messages.map(function(element){
        return function(callback){mApi().communicator[mapiLocation].del(element.communicatorMessageId).callback(callback)};
      });
      
      async.series(calls, function(){
        mApi().communicator.cacheClear();
        body.communicatorBodyControllerWidget('reload');
        toolbar.communicatorToolbarControllerWidget('deactivate');
      });
    },
    onToggleMarkAsReadClick(){
      var messages = body.communicatorBodyControllerWidget('getSelectedMessages');
      var currentLocation = navigation.communicatorNavigationControllerWidget('getCurrentLocation');
      var mapiLocation = getApiIdFromLocation(currentLocation);
      
      var unreadMessages = messages[0].unreadMessagesInThread;
      var calls = messages.map(function(element){
        return function(callback){
          if (unreadMessages){
            mApi().communicator[mapiLocation].markasread.create(element.communicatorMessageId).callback(callback);
          } else {
            mApi().communicator[mapiLocation].markasunread.create(element.communicatorMessageId).callback(callback);
          }
        };
      });
      
      async.series(calls, function(){
        mApi().communicator.cacheClear();
        $(document).muikkuWebSocket("trigger", "Communicator:messageread");
        body.communicatorBodyControllerWidget('reload');
        toolbar.communicatorToolbarControllerWidget('deactivate');
      });
    }
  });
  body = $.getWidgetContainerFor("communicator-body").communicatorBodyControllerWidget({
    onSelect: function(message){
      console.log("selected", message);
    },
    onSelectManyChange: function(messages){
      var unreadMessages = messages.length ? messages[0].unreadMessagesInThread : false;
      if (messages.length){
        toolbar.communicatorToolbarControllerWidget('activate');
      } else {
        toolbar.communicatorToolbarControllerWidget('deactivate');
      }
      toolbar.communicatorToolbarControllerWidget('setCurrentMessageHasUnreadMessages', unreadMessages);
    }
  });
  navigation = $.getWidgetContainerFor("communicator-navigation").communicatorNavigationControllerWidget({
    onLocationChange: function(newLocation){
      toolbar.communicatorToolbarControllerWidget('updateFolder', newLocation ? newLocation.text : null);
      if (newLocation.type === "folder"){
        body.communicatorBodyControllerWidget('loadFolder', newLocation.id);
      } else if (newLocation.type === "label"){
        body.communicatorBodyControllerWidget('loadLabel', newLocation.id);
      }
    }
  });
});