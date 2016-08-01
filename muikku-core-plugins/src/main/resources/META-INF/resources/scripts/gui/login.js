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
            } else if (emailField.val() == '') {
              $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.required"));  
            } 
            
            mApi({async: false}).forgotpassword.reset.read({ email: emailField.val() }).callback(function (err, response) {
              if (err) {
                if (response.status == 404) {
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.noUserFound", emailField.val()));
                } else { // most likely 400 - bad request
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
                } 
                
              } else {
                $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.forgotPassword.forgotPasswordDialog.mailSent", emailField.val()));
                dlog.dialog().remove();
              }
            });
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
  
  $(document).on('click', '.forgotpassword-link', function (event, data) {
	  event.preventDefault,
    confirmForgotpasswordRequest();
  });

}).call(this);
