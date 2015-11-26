      
$.widget("custom.connectionLostNotifier", {
  
  options: {
    noConnectionTimeout: 10000
  },
  
  _create: function() {
    this._connectionLostOverlay = null;
    this._connectionLostDialog = null;
    this._notifyNoConnectionTimeout = null;
    this._noConnection = false;
  },
  
  notifyConnectionLost: function() { 
    if (this._connectionLostOverlay !== null) {
      return;
    }
    if (this._connectionLostDialog !== null) {
      return;
    }

    $(".notification-queue").hide();

    this._connectionLostOverlay = $('<div>')
      .addClass('connection-lost-overlay')
      .appendTo('body')
      .fadeIn(500);
    
    this._connectionLostDialog = $('<div>')
      .addClass('connection-lost-dialog')
      .appendTo('body')
      .fadeIn('50');
    
    var connectionLostDialogContainer = $('<div>')
      .addClass('connection-lost-dialog-container')
      .appendTo(this._connectionLostDialog);
  
    $('<div>')
      .addClass('connection-lost-dialog-title')
      .text(getLocaleText('plugin.workspace.connectionlost.dialog.title'))
      .appendTo(connectionLostDialogContainer);
    
    $('<div>')
      .addClass('connection-lost-dialog-description')
      .text(getLocaleText('plugin.workspace.connectionlost.dialog.description'))
      .appendTo(connectionLostDialogContainer);
    
    this._spinner = $('<div>')
      .addClass('loader')
      .append($('<div>')
        .addClass('inner one'))
      .append($('<div>')
        .addClass('inner two') )
      .append($('<div>')
        .addClass('inner three'));
    
    this._spinner.appendTo(connectionLostDialogContainer);
    
    if (this._notifyNoConnectionTimeoutId == null) {
      this._notifyNoConnectionTimeoutId = setTimeout(
          $.proxy(function() {
            this._notifyNoConnection();
          }, this), 10000);
    }
  },
  
  _notifyNoConnection: function() {
    this._spinner.remove();
    $('.connection-lost-dialog-description')
    .animate({
        opacity: 0
      }, {
        duration : 150,
        easing : "easeInOutQuint",
        complete: function() {
          $('.connection-lost-dialog-description').text(getLocaleText('plugin.workspace.connectionlost.dialog.automaticReconnectFailed'));
          
          $('.connection-lost-dialog-description').animate({
            opacity: 1
          }, {
            duration : 150,
            easing : "easeInOutQuint",
            complete: function() {
             
            }
          });
          
          $('<div>')
            .addClass('connection-lost-dialog-reconnectButton')
            .text(getLocaleText('plugin.workspace.connectionlost.dialog.reconnectButtonLabel'))
            .click(function(){
              location.reload();
            })
            .appendTo('.connection-lost-dialog-container');
        }
    });
  },
  
  notifyReconnected: function() {
    if (this._notifyNoConnectionTimeoutId !== null) {
      clearTimeout(this._notifyNoConnectionTimeoutId);
      this._notifyNoConnectionTimeoutId = null;
    }
    
    if (this._connectionLostOverlay !== null) {
      this._connectionLostOverlay.remove();
      this._connectionLostOverlay = null;
    }

    if (this._connectionLostDialog !== null) {
      this._connectionLostDialog.remove();
      this._connectionLostDialog = null;
    }

    this._noConnection = false;
    
    $(".notification-queue").show();
  }
});

$(document).ready(function() {
  $(document).connectionLostNotifier();
});