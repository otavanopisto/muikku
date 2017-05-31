loadModules([
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/carousel.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dialog.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/dropdown.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/form.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/link.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/menu.js.jsf",
  CONTEXTPATH + "/javax.faces.resource/scripts/widgets/element/notification-queue.js.jsf"
], function(){
  $(".carousel").carouselWidget();
  $(".dropdown").dropdownWidget();
  $(".link").linkWidget();
  $(".menu").menuWidget();
  $(".notification-queue").notificationQueue();

  $(".frontpage-interact-show-language-picker").click(function(e){
    $("#language-picker").dropdownWidget('open', e.currentTarget);
  });

  $(".frontpage-interact-show-menu").click(function(e){
    $("#main-menu").menuWidget('open');
  });

  $(document).ready(function() {
    mApi().feed.feeds.read("oonews", {numItems: 5}).callback(function (err, news) {
      renderDustTemplate('frontpage/feed_item.dust', {entries: news}, function(text) {
        $(".frontpage-news-container").html(text);
      });
    });
  });

  $(document).ready(function() {
    mApi().feed.feeds.read("ooevents", {numItems: 4, order: "ASCENDING"}).callback(function (err, events) {
      renderDustTemplate('frontpage/feed_item.dust', {entries: events}, function(text) {
        $(".frontpage-events-container").html(text);
      });
    });
  });

  $(document).ready(function() {
    mApi().feed.feeds.read("avoimet_verkostot,eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia", {numItems: 6}).callback(function (err, blogs) {
      renderDustTemplate('frontpage/feed_item.dust', {entries: blogs}, function(text) {
        $(".frontpage-posts-container").html(text);
      });
    });
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
      renderDustTemplate("frontpage/forgotpassword_dialog.dust", {}, function(text){
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
