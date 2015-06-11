(function() {
  
  function changePassword() {
    renderDustTemplate('profile/profile-change-password.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 400,
        dialogClass: "profile-change-password-dialog",
        buttons: [{
          'text': dialog.data('button-send-text'),
          'class': 'send-button',
          'click': function(event) {
            $(this).dialog("close");
            if (err) {
              $('.notification-queue').notificationQueue('notification', 'error', err);
            } else {
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.profile.changePassword.dialog.notif.successful"));
            }
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog("close");
          }
        }]
      });
    }, this));
  }
  
  $(document).on('click', '.profile-change-password', function (event, data) {
    changePassword();
  });
  
}).call(this);
