loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
  
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/navigation.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/toolbar.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/body.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/communicator/new-message.js.jsf"
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
  var newMessage;
  
  newMessage = $.getWidgetContainerFor("communicator-new-message").communicatorNewMessageControllerWidget();
  $('.communicator-interact-new-message').click(function(){
    newMessage.communicatorNewMessageControllerWidget('open');
  });
  
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
    },
    onLabelsUpdated: function(){
      navigation.communicatorNavigationControllerWidget('reloadLabels');
    },
    onLabelAdded: function(label){
      var self = this;
      var messages = body.communicatorBodyControllerWidget('getSelectedMessages');
      
      var calls = messages.map(function(element){
        return function(callback){
          mApi().communicator.messages.labels.create(element.communicatorMessageId, { labelId: label.id }).callback(function (err, label) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.add"));
            }
            callback();
          });
        };
      });
      
      async.series(calls, function(){
        mApi().communicator.cacheClear();
        body.communicatorBodyControllerWidget('addLabelToSelected', label);
      });
    },
    onLabelRemoved: function(label){
      var self = this;
      var messages = body.communicatorBodyControllerWidget('getSelectedMessages');
      
      var calls = messages.map(function(element){
        return function(callback){
          mApi().communicator.messages.labels.del(element.communicatorMessageId, label.id).callback(function (err, label) {
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.communicator.label.create.error.add"));
            }
            callback();
          });
        };
      });
      
      async.series(calls, function(){
        mApi().communicator.cacheClear();
        body.communicatorBodyControllerWidget('removeLabelToSelected', label);
      });
    }
  });
  body = $.getWidgetContainerFor("communicator-body").communicatorBodyControllerWidget({
    onSelect: function(message){
      console.log("selected", message);
    },
    onSelectManyChange: function(messages){
      console.log(messages);
      var unreadMessages = messages.length ? messages[0].unreadMessagesInThread : false;
      if (messages.length){
        toolbar.communicatorToolbarControllerWidget('activate');
      } else {
        toolbar.communicatorToolbarControllerWidget('deactivate');
      }
      toolbar.communicatorToolbarControllerWidget('setCurrentMessageHasUnreadMessages', unreadMessages);
      toolbar.communicatorToolbarControllerWidget('setCurrentActiveLabels', messages.length ? messages[0].labels : []);
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