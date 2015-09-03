(function() {
  
  function confirmForgotpasswordRequest(confirmCallback) {
    renderDustTemplate('forgotpassword/forgotpassword-request-confirm.dust', { }, $.proxy(function (text) {
      var dialog = $(text);
      $(text).dialog({
        modal: true, 
        resizable: false,
        width: 460,
        dialogClass: "forgotpassword-dialog",
        buttons: [{
          'text': dialog.data('button-send-text'),
          'class': 'send-button',
          'click': function(event) {
            
            var emailField = $("#forgotpassword-email");
            var dlog = $(this);

            if (emailField == 'invalid') {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
            } else if (emailField.val() == '' || emailField == null) {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.required"));  
            } 
            
            mApi().forgotpassword.reset.read({ email: emailField.val() }).callback(function (err, response) {
              if (err) {
                if (response.status == 404) {
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.noUserFound"));
                } else { // most likely 400 - bad request
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
                } 
                
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.forgotPassword.forgotPasswordDialog.mailSent"));
                dlog.dialog("close");
              }
            });
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
  
  $(document).on('click', '.bt-forgotpassword', function (event, data) {
    confirmForgotpasswordRequest();
  });

}).call(this);
