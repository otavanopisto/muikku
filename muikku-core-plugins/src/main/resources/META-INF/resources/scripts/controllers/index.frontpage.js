//This controller is in charge of the non-logged view

loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/base.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/websocket.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/generic-environment.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/controllers/feed.js.jsf",
  
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/carousel.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dialog.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/form.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/link.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/menu.js.jsf"
], function(){
  $(document).muikkuWebSocket();
  $(document.body).baseControllerWidget();
  
  $.getWidgetContainerFor("generic-environment").genericEvironmentControllerWidget();
  
  $(".carousel").carouselWidget();
  $(".dropdown").dropdownWidget();
  $(".link").linkWidget();
  $(".menu").menuWidget();
  
  $.getWidgetContainerFor("feed", "frontpage-news-container").feedControllerWidget({
    feedItemTemplate: 'index-frontpage/feed-item.dust',
    queryOptions: {numItems: 5},
    feedReadTarget: "oonews"
  });
  
  $.getWidgetContainerFor("feed", "frontpage-events-container").feedControllerWidget({
    feedItemTemplate: 'index-frontpage/feed-item.dust',
    queryOptions: {numItems: 4, order: "ASCENDING"},
    feedReadTarget: "ooevents"
  });
  
  $.getWidgetContainerFor("feed", "frontpage-blogs-container").feedControllerWidget({
    feedItemTemplate: 'index-frontpage/feed-item.dust',
    queryOptions: {numItems: 6},
    feedReadTarget: "eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia"
  });

  function resetPassword(email){
    if (email === null) {
      $('.notification-queue').notificationQueue('notify', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));
    } else if (email === '') {
      $('.notification-queue').notificationQueue('notify', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.required"));
    }

    mApi({async: false}).forgotpassword.reset.read({ email: email }).callback(function (err, response) {
      if (err) {
        if (response.status == 404) {
          $('.notification-queue').notificationQueue('notify', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.noUserFound", email));
        } else { // most likely 400 - bad request
          $('.notification-queue').notificationQueue('notify', 'error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));
        }

      } else {
        $('.notification-queue').notificationQueue('notify', 'success', getLocaleText("plugin.forgotPassword.forgotPasswordDialog.mailSent", email));
        $('.frontpage-forgotpassword-dialog').dialogWidget('close');
      }
    });
  }

  var frontpageDialogCreated = false;
  $(".frontpage-interact-forgot-password").click(function(){
    if (!frontpageDialogCreated){
      renderDustTemplate("index-frontpage/forgotpassword-dialog.dust", {}, function(text){
        var dialog = $(text);
        dialog.appendTo(document.body);
        dialog.dialogWidget();
        dialog.find(".form").formWidget({
          "onSubmit": function(data){
            resetPassword(data.fields.email);
          }
        });
        dialog.dialogWidget('open');
        frontpageDialogCreated = true;
      });
    } else {
      $('.frontpage-forgotpassword-dialog').dialogWidget('open');
    }
  });

});
