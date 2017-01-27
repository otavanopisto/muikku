$(document).ready(function(){
  mApi().user.students.read(MUIKKU_LOGGED_USER).callback(
      function(err, student) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error',
              err);
        }
        if (student && !student.updatedByStudent) {
          mApi().user.students.addresses
            .read(MUIKKU_LOGGED_USER)
            .callback(function(err, addresses) {
              if (err) {
                $('.notification-queue').notificationQueue('notification',
                    'error', err);
              }
              var address = null;
              for (var i = 0; i < addresses.length; i++) {
                if (addresses[i].defaultAddress) {
                  address = addresses[i];
                }
              }
              renderDustTemplate('frontpage/check-contact-info-dialog.dust',
                {
                  street : address.street,
                  postalCode : address.postalCode,
                  city : address.city,
                  country : address.country,
                  municipality : student.municipality
                }, function(text) {
                  var dialog = $(text);
                  dialog.dialog({
                    modal : true,
                    resizable : false,
                    width : 400,
                    appendTo: '#header',
                    position: {my: 'top', at: 'top', of: $('#staticNavigationWrapper')},
                    dialogClass : "check-contact-info-dialog",
                    buttons : [
                      {
                        'text' : dialog.data('button-confirm-text'),
                        'class' : 'send-button',
                        'click' : function(event) {
                          mApi().user.students.addresses.update(MUIKKU_LOGGED_USER,
                              address.identifier,
                              address).callback(function (err, address) {
                            if (err) {
                              $('.notification-queue').notificationQueue('notification',
                                  'error', err);
                            } else {
                              window.location.href = "/";
                            }
                          });
                        }
                      },
                      {
                        'text' : dialog.data('button-ok-text'),
                        'class' : 'cancel-button',
                        'click' : function(event) {
                          window.location.href = "/profile";
                        }
                      }
                    ]
                  });
                });
            });
        }
      });
});