(function() {
  
  function changePassword() {
    var username = "";
    
    mApi({async: false}).userplugin.credentials.read().callback(function(err, result) {
      username = result ? result.username||'' : '';
    });
    
    renderDustTemplate('profile/profile-change-password.dust', { username: username }, $.proxy(function (text) {
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
            // TODO: live validation of the two passwords

            var newPassword1 = $(this).find('input[name="newPassword1"]').val();
            var newPassword2 = $(this).find('input[name="newPassword2"]').val();
            
            if (newPassword1 && newPassword2 == "") {
              $('.notification-queue').notificationQueue('notification', 'error',
                  getLocaleText("plugin.profile.changePassword.dialog.notif.emptypass"));
              return;
            }
            
            if (newPassword1 != newPassword2) {
              $('.notification-queue').notificationQueue('notification', 'error', 
                  getLocaleText("plugin.profile.changePassword.dialog.notif.failconfirm"));
              return;
            }
            
            var values = {
              oldPassword: $(this).find('input[name="oldPassword"]').val(),
              username: $(this).find('input[name="username"]').val(),
              newPassword: $(this).find('input[name="newPassword1"]').val()
            };
            
            var erronous = false;
            
            mApi({async: false}).userplugin.credentials.update(values).callback(function(err, result) {
              if (erronous = err) {
                if (result.status == 403)
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.profile.changePassword.dialog.notif.unauthorized"));
                else
                  $('.notification-queue').notificationQueue('notification', 'error', err);
              } else {
                if (values.newPassword == '')
                  $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.profile.changePassword.dialog.notif.username.successful"));
                else
                  $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.profile.changePassword.dialog.notif.successful"));
              }
            });

            if (!erronous)
              $(this).dialog().remove();
          }
        }, {
          'text': dialog.data('button-cancel-text'),
          'class': 'cancel-button',
          'click': function(event) {
            $(this).dialog().remove();
          }
        }]
      });
    }, this));
  }
  
  $(document).on('click', '.profile-change-password', function (event, data) {
    changePassword();
  });
  
}).call(this);
