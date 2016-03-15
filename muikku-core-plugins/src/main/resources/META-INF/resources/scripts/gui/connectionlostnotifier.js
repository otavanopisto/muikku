      
$.widget("custom.connectionLostNotifier", {
  
  options: {
    noConnectionTimeout: 5000
  },
  
  _create: function() {
    this._connectionLostOverlay = null;
    this._connectionLostDialog = null;
    this._notifyNoConnectionTimeout = null;
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
      .text(getLocaleText('connectionlost.dialog.title'))
      .appendTo(connectionLostDialogContainer);
    
    $('<div>')
      .addClass('connection-lost-dialog-description')
      .text(getLocaleText('connectionlost.dialog.description'))
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
          }, this), this.options.noConnectionTimeout);
    }
  },
  
  _notifyNoConnection: function() {
    this._spinner.remove();

    $('<div>')
      .addClass('connection-lost-dialog-reconnectButton')
      .text(getLocaleText('connectionlost.dialog.reconnectButtonLabel'))
      .click(function(){
        location.reload();
      })
      .appendTo('.connection-lost-dialog-container')
      .css({display: 'none'})
      .fadeIn(100);
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
    
    $(".notification-queue").show();
  }
});

$(document).ready(function() {
  $(document).connectionLostNotifier();
});