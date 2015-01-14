$(document).ready(function(){
	
  mApi().forum.areas.read()
    .on('$', function (item, itemCallback) {
//      mApi().communicator.communicatormessages.sender.read(item.id)
//        .callback(function (err, user) {  
//          item.senderFullName = user.firstName + ' ' + user.lastName;
//          item.senderHasPicture = user.hasImage;
//        });
//      mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
//        .callback(function (err, count) {
//          item.messageCount = count;
//        });
  
      itemCallback();
    })
    .callback(function (err, result) {
      renderDustTemplate('forum/areas.dust', result, function (text) {
        $('.forumContent').append($.parseHTML(text));
      });
    });

  

});
