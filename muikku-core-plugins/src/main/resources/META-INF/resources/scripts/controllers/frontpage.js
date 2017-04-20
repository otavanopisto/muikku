(function() {
  
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/carousel.js.jsf");
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/dialog.js.jsf");
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/dropdown.js.jsf");
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/form.js.jsf");
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/link.js.jsf");
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/menu.js.jsf");
  window.interaction.require(CONTEXTPATH + "/javax.faces.resource/scripts/interaction/element/notification-queue.js.jsf");

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

  $(document).on("reset-password", function(e, data){
    var email = data.fields.email;

    if (email === null) {
      window.interaction.notificationQueue.notificate('error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
    } else if (email === '') {
      window.interaction.notificationQueue.notificate('error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.required"));  
    } 

    mApi({async: false}).forgotpassword.reset.read({ email: email }).callback(function (err, response) {
      if (err) {
        if (response.status == 404) {
          window.interaction.notificationQueue.notificate('error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.noUserFound", email));
        } else { // most likely 400 - bad request
          window.interaction.notificationQueue.notificate('error', getLocaleText("plugin.forgotpassword.forgotPasswordDialog.email.invalid"));  
        } 

      } else {
        window.interaction.notificationQueue.notificate('success', getLocaleText("plugin.forgotPassword.forgotPasswordDialog.mailSent", email));
        window.interaction.dialog.close('.frontpage-forgotpassword-dialog');
      }
    });
  });
  
  var frontpageDialogCreated = false;
  $(".frontpage-forgotpassword").click(function(){
    if (!frontpageDialogCreated){
      renderDustTemplate("frontpage/forgotpassword_dialog.dust", {}, function(text){
        var html = $(text);
        html.appendTo(document.body);
        window.interaction.setUpInteraction(html);
        window.interaction.dialog.open('.frontpage-forgotpassword-dialog');
        frontpageDialogCreated = true;
      });
    } else {
      window.interaction.dialog.open('.frontpage-forgotpassword-dialog');
    }
  });

}).call(this);
