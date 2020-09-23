/* global moment */
/* global MUIKKU_LOGGED_USER */

(function() {
  
  $.widget("custom.chatVisibility", {
    _create: function() {
      mApi().chat.status.read({}).callback($.proxy(function (err, status) {
        if (err) { 
          $('.notification-queue').notificationQueue('notification', 'error', err);
          return;
        }
        
        if (!status.chatSettingsVisible) { 
          return; 
        }
        
        mApi().chat.settings.read({}).callback($.proxy(function (err, settings) {
          var data = {};
          if (settings == null || settings.visibility == null){
            settings.visibility === "DISABLED"
            data.disabled_selected = "selected";
            this._setVisibility("DISABLED");
          }
          if (settings && settings.visibility === "VISIBLE_TO_ALL") {
            data.visible_to_all_selected = "selected";
          }
          if (settings && settings.visibility === "DISABLED"){
            data.disabled_selected = "selected";
          }
          renderDustTemplate('profile/profile-chat-visibility.dust', data, $.proxy(function (text) {
            this.element.html(text);
            this.element.find("select").on('change', $.proxy(function(event) {
              this._setVisibility(event.target.value);
              $('.notification-queue').notificationQueue('notification', 'success', getLocaleText("plugin.profile.chat.visibilityChange"));
            }, this));
          }, this));
        }, this));
      }, this));
    },
    
    _setVisibility: function(visibility) {
      mApi().chat.settings.update({visibility: visibility}).callback($.proxy(function () {
        location.reload();
      }, this));
    }
  });
  
  $.widget("custom.profileImage", {
    _create : function() {
      $('.profile-image-input').on('change', $.proxy(this._onFileInputChange, this));
    },
    _onFileInputChange : function (event) {
      var file = event.target.files[0];
      var formData = new FormData($('.profile-image-form')[0]);
      
      // Upload source image
      
      $.ajax({
        url: CONTEXTPATH + '/tempFileUploadServlet',
        type: 'POST',
        data: formData,
        success: $.proxy(function(xhr) {
          mApi().user.files
            .create({
              contentType: xhr.fileContentType,
              fileId: xhr.fileId,
              identifier: 'profile-image-original',
              name: file.name,
              visibility: 'PUBLIC'
            })
            .callback($.proxy(function(err, result) {

              // Create cropping dialog
              
              renderDustTemplate('profile/profile-image.dust', {}, $.proxy(function (text) {
                var dialog = $(text);
                
                // Show cropping dialog
                
                $(text).dialog({
                  modal: true, 
                  resizable: false,
                  width: 320,
                  height: 460,
                  dialogClass: "profile-image-dialog",
                  close: function() {
                    $(this).dialog().remove();
                    $('.profile-image-input').val('');
                  },
                  open: function() {

                    // Initialize Croppie
                    
                    var rnd = Math.floor(Math.random() * 1000) + 1
                    $(this).find('.profile-image-container').croppie({
                      url: '/rest/user/files/user/' + MUIKKU_LOGGED_USER_ID  + '/identifier/profile-image-original?h=' + rnd,
                      viewport: {
                        width: 128,
                        height: 128,
                        type: 'square'
                      },
                      boundary: {
                        width: 256,
                        height: 256
                      }
                    });
                  },
                  buttons: [{
                    'text': dialog.data('button-ok-text'),
                    'class': 'send-button',
                    'click': function(event) {
                      
                      // Create thumbnails

                      var saveImage = $.proxy(function(size) {
                        $(this).find('.profile-image-container').croppie('result', {
                          type: 'base64',
                          size: {width: size},
                          format: 'jpeg',
                          quality: 0.8,
                          circle: false
                        }).then(function(data) {
                          mApi().user.files
                            .create({
                              contentType: 'image/jpeg',
                              base64Data: data,
                              identifier: 'profile-image-' + size,
                              name: 'profile-' + size + '.jpg',
                              visibility: 'PUBLIC'
                            });
                        });
                      }, this);
                      
                      var sizes = [96, 256];
                      for (var i = 0;  i < sizes.length; i++) {
                        saveImage(sizes[i]);
                      }
                      $(this).dialog('close');
                      window.location.reload(true);
                    }
                  }, {
                    'text': dialog.data('button-cancel-text'),
                    'class': 'cancel-button',
                    'click': function(event) {
                      $(this).dialog('close');
                    }
                  }]
                });
              }, this));
              
            }, this));
        }, this),
        cache: false,
        contentType: false,
        processData: false
      })
    }
  });
  
  function changeLink(event){
    var clickedLink = $(event.target).closest(".profile-section-link");
    var allLinks = $(event.target).closest(".profile-section-links").find(".profile-section-link");
    $(allLinks).removeClass("active");
    $(clickedLink).addClass("active");
  }
  
  function changeAddressMunicipality() {

    mApi().user.students.read(MUIKKU_LOGGED_USER).callback(function (err, oldStudent) {
      if (err) {
        $('.notification-queue').notificationQueue('notification', 'error', err);
        return;
      }
      mApi().user.students.addresses.read(MUIKKU_LOGGED_USER).callback(function(err, addresses) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
          return;
        }
        var address = null;
        for (var i=0; i<addresses.length; i++) {
          if (addresses[i].defaultAddress) {
            address = addresses[i];
          }
        }
        renderDustTemplate('profile/profile-change-address-hometown.dust', {
              address: address,
              municipality: oldStudent.municipality
            },
            function (text) {
              var dialog = $(text);
              $(text).dialog({
                modal: true, 
                resizable: false,
                width: 400,
                dialogClass: "profile-change-address-hometown-dialog",
                buttons: [{
                  'text': dialog.data('button-send-text'),
                  'class': 'send-button',
                  'click': function(event) {
                    var that = this;
                    function updateAddress() {
                      address.street = $(that).find('input[name="street"]').val();
                      address.postalCode = $(that).find('input[name="postalCode"]').val();
                      address.city = $(that).find('input[name="city"]').val();
                      address.country = $(that).find('input[name="country"]').val();
                      mApi().user.students.addresses.update(MUIKKU_LOGGED_USER, address.identifier, address).callback(function (err, address) {
                        if (err) {
                          $('.notification-queue').notificationQueue('notification', 'error', err);
                          return;
                        }
                        
                        $(that).dialog().remove();
                        window.location.reload();
                      });
                    }
                    mApi().user.students.read(MUIKKU_LOGGED_USER).callback(function (err, student) {
                      if (err) {
                        $('.notification-queue').notificationQueue('notification', 'error', err);
                        return;
                      }
                      var municipality = $(that).find('input[name="municipality"]').val();
                      if (municipality && municipality !== "") {
                        student.municipality = municipality;
                        mApi().user.students.update(MUIKKU_LOGGED_USER, student).callback(function (err, student) {
                          if (err) {
                            $('.notification-queue').notificationQueue('notification', 'error', err);
                            return;
                          }
                          
                          updateAddress();
                        });
                      } else {
                        updateAddress();
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
        });
      });
    });
  }
  
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
                else if (result.status == 409)
                  $('.notification-queue').notificationQueue('notification', 'error', getLocaleText("plugin.profile.changePassword.dialog.notif.alreadyinuse"));
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
  
  $(document).on('click', '.profile-section-link', function (event, data) {
    changeLink(event);
  });

  $(document).on('click', '.profile-change-password', function (event, data) {
    changePassword();
  });
  
  $(document).on('click', '.profile-change-address-municipality', function (event, data) {
    changeAddressMunicipality();
  });

  $(document).ready(function() {
    
    // Chat visibility
    
    $('.profile-chat-visibility').chatVisibility();
    
    // Profile image support
    
    $('.profile-image-uploader').profileImage();
    $('.profile-change-picture').on('click', $.proxy(function() {
      $('.profile-image-input').click();
    }, this));
    
    // Profile vacation fields initialization
    

    $('input[name="profile-vacation-start"]').datepicker({
      "dateFormat": getLocaleText('datePattern')
    });
    $('input[name="profile-vacation-end"]').datepicker({
      "dateFormat": getLocaleText('datePattern')
    });
    
    // Load profile field values
    
    mApi().user.properties.read(
      MUIKKU_LOGGED_USER_ID, {
        properties: 'profile-phone,profile-vacation-start,profile-vacation-end, profile-chat-enabled'  
      })
      .callback($.proxy(function(err, properties) {

        var props = {};
        for (var i = 0; i < properties.length; i++) {
          props[properties[i].key] = properties[i].value;
        }

        $('input[name="profile-phone"]').val(props['profile-phone']);
        
        if (props['profile-vacation-start']) {
          $('input[name="profile-vacation-start"]').datepicker('setDate', moment(props['profile-vacation-start']).toDate());
        }
        
        if (props['profile-vacation-end']) {
          $('input[name="profile-vacation-end"]').datepicker('setDate', moment(props['profile-vacation-end']).toDate());
        }
        
        $('select[name="profile-chat-enabled"]').val(props['profile-chat-enabled']);

      }, this));
    
    // Save profile field values
    
    $('.save-profile-fields').on('click', $.proxy(function() {
      
      mApi().user.property.create({key: 'profile-phone', value: $('input[name="profile-phone"]').val()});
      
      var vacationStartDate = $('input[name="profile-vacation-start"]').datepicker('getDate');
      mApi().user.property.create({key: 'profile-vacation-start', value: vacationStartDate == null ? null : vacationStartDate.toISOString()});
      
      var vacationEndDate = $('input[name="profile-vacation-end"]').datepicker('getDate');
      mApi().user.property.create({key: 'profile-vacation-end', value: vacationEndDate == null ? null : vacationEndDate.toISOString()});
      
      mApi().user.property.create({key: 'profile-chat-enabled', value: $('select[name="profile-chat-enabled"]').val()});
      
      $('.notification-queue').notificationQueue('notification', 'info', getLocaleText("plugin.profile.properties.saved"));      
    }, this));
  });
  
}).call(this);
