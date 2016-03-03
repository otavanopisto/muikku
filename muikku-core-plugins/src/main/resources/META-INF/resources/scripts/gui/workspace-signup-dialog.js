(function() {
  
  $.widget("custom.workspaceSignUpDialog", {
    
    options: {
      workspaceName: null,
      workspaceNameExtension: null,
      hasEvaluationFee: false,
      workspaceEntityId: null,
      signUpRedirectUrl: null
    },
    
    _create : function() {
      this._dialog = $('<div>');
      
      $('<div>')
        .addClass('flex-row')
        .append($('<div>')
          .addClass("flex-cell-full")
          .append([
            $('<label>').html(getLocaleText("plugin.workspaceSignUp.messageLabel")),
            $('<textarea>').attr({ 'name': "signUpMessage"})  
          ]))
        .appendTo(this._dialog);
      
      if (this.options.hasEvaluationFee) {
        $('<div>')
          .addClass('flex-row')
          .append(
            $('<div>')
              .addClass("flex-cell-full")
              .append([
                $('<label>').html(getLocaleText("plugin.workspaceSignUp.fee.label")),
                $('<div>').html(getLocaleText("plugin.workspaceSignUp.fee.content"))
              ]))
          .prependTo(this._dialog);
      }
      
      this._dialog.dialog({
        title: getLocaleText("plugin.workspaceSignUp.title", this.options.workspaceName, this.options.workspaceNameExtension),
        draggable: false,
        modal: true,
        resizable: false,
        open: $.proxy(function () {
          this._disablePageScrolling();
        }, this),
        beforeClose: $.proxy(function () {
          this.element.remove();
          this._enablePageScrolling();
        }, this),
        buttons: [ 
          {
            'class': 'send-button',
            'text': getLocaleText("plugin.workspaceSignUp.signupButtonLabel"),
            'click': $.proxy(function () {
              this._dialog.dialog("widget").find(".send-button").attr("disabled", "disabled");
              var signUpMessage = this._dialog.find('textarea[name="signUpMessage"]').val();
              this._signUp(signUpMessage);
            }, this)
          }
        ]
      });  
      
      this._dialog.dialog( "widget" ).addClass("flex-row").removeAttr("style");
      this._dialog.dialog( "widget" ).find(".ui-dialog-titlebar").addClass("lg-flex-cell-full md-flex-cell-full sm-flex-cell-full");
      this._dialog.dialog( "widget" ).find(".ui-dialog-content").addClass("lg-flex-cell-full md-flex-cell-full sm-flex-cell-full").removeAttr("style");
      this._dialog.dialog( "widget" ).find(".ui-dialog-buttonpane").addClass("lg-flex-cell-full md-flex-cell-full sm-flex-cell-full");
      
      this.element
        .appendTo(document.body)
        .addClass("flex-dialog main-functionality-dialog")
        .append(this._dialog.dialog( "widget" ));
    },

    _disablePageScrolling: function () {
      $("body").addClass("disable-page-scrolling");
    },
    
    _enablePageScrolling: function () {
      $("body").removeClass("disable-page-scrolling");
    },
    
    _signUp: function (joinMessage) {
      mApi().coursepicker.workspaces.signup.create(this.options.workspaceEntityId, {
        message: joinMessage
      })
      .callback($.proxy(function (err) {
        if (err) {
          $('.notification-queue').notificationQueue('notification', 'error', err);
        } else {
          if (this.options.signUpRedirectUrl) {
            window.location = this.options.signUpRedirectUrl;
          } else {
            window.location.reload(true);
          }
        }
      }, this));
    }   
    
  });

}).call(this);