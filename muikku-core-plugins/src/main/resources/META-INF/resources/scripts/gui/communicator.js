 
$(document).ready(function(){

	$(".bt-mainFunction").m3modal({
		title : "Veistin! ",
		description : "Voit lähettää veistejä kaikille kavereillesi tai muuten vaan jos ei sellaisia ole!",
		content: $('<div><div><select name="msgTemplates"><option>Ei pohjia</option></select></div><div><div><input type="textfield" value="vastaanottajat" name="msgRecipients"></input></div><div><input type="textfield" value="aihe" name="msgSubject"></input></div></div><div><textarea value="" name="msgContent"></textarea></div></div>'),
		modalgrid : 24,
		contentgrid : 24,

		options: [
 				{
          caption : "Lähetä myös itselle",
          name : "mailSelf",
          type : "checkbox",
          action : function(e) {
          }
        }, {
          caption : "Lisää allekirjoitus",
          name : "addSignature",
          type : "checkbox",
          action : function(e) {
          }
        }, 
      ],

      buttons : [ 
        {
          caption : "Lähetä",
          name : "sendMail",
          action : function(e) {
            var recipientIds = [1];
            var groupIds = [];
            
            mApi().communicator.messages.create({
              categoryName: "message",
              caption : "captio",
              content : "contentti",
              tags : ["tagi", "viesti"],
              recipientIds : recipientIds,
              recipientGroupIds : groupIds
            })
            .callback(function (err, result) {
            });
          }
        }, {
          caption : "Tallenna luonnos",
          name : "saveMail",
          action : function(e) {
          }
        } 
      ]
    });

    var msgC = $('mf-content-main');
    
    mApi().communicator.items.read()
      .on('$', function (item, itemCallback) {
        mApi().communicator.communicatormessages.sender.read(item.id)
          .callback(function (err, user) {
            item.senderFullName = user.firstName + ' ' + user.lastName;
            item.senderHasPicture = user.hasImage;
          });
        mApi().communicator.messages.messagecount.read(item.communicatorMessageId)
          .callback(function (err, count) {
            item.messageCount = count;
          });

        itemCallback();
      })
      .callback(function (err, result) {
        renderDustTemplate('communicator/communicator_items.dust', result, function (text) {
          $('#communicatorContent').append($.parseHTML(text));
        });
      });

    
});