

$(document).ready(function(){
	
	$(".bt-mainFunction").m3modal({
		title : "Uusi viesti ",
		description : "Voit lähettää uuden viestin opettajillesi tai opiskelutovereillesi.",
		content: $('<div><div><select name="msgTemplates"><option>Ei pohjia</option></select></div><div><div><input type="text" value="vastaanottajat" name="msgRecipients"></input></div><div><input type="text" value="aihe" name="msgSubject"></input></div></div><div><textarea value="" name="msgContent"></textarea></div></div>'),
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
            var subject = e.contentElement.find("input[name='msgSubject']").val();
            var content = e.contentElement.find("textarea[name='msgContent']").val();
            var tagStr = "tagi viesti"; // TODO: Tag content
            var tags = tagStr != undefined ? tagStr.split(' ') : [];
            var recipientIds = [10];
            var groupIds = [];
            
            mApi({async: false}).communicator.messages.create({
              categoryName: "message",
              caption : subject,
              content : content,
              tags : tags,
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

    
    mApi({async: false}).communicator.items.read()
      .on('$', function (item, itemCallback) {
        mApi({async: false}).communicator.communicatormessages.sender.read(item.id)
          .callback(function (err, user) {  
            item.senderFullName = user.firstName + ' ' + user.lastName;
            item.senderHasPicture = user.hasImage;
          });
        mApi({async: false}).communicator.messages.messagecount.read(item.communicatorMessageId)
          .callback(function (err, count) {
            item.messageCount = count;
          });

        itemCallback();
      })
      .callback(function (err, result) {
        renderDustTemplate('communicator/communicator_items.dust', result, function (text) {
          $('.cm-messages-container').append($.parseHTML(text));
        });
      });

 
    $(".cm-messages-container").on('click','.mf-item:not(.open)', function(){
 
    	var mId = $(this).attr('id');
    	var mCont = $('.cm-messages-container');
    	
        mApi({async: false}).communicator.messages.read(mId).on('$', function(item, msgCallback){
        	
	        mApi({async: false}).communicator.communicatormessages.sender.read(mId)
	        .callback(function (err, user) {  
	          item.senderFullName = user.firstName + ' ' + user.lastName;
	          item.senderHasPicture = user.hasImage;
	        });
       	
        	msgCallback();
        }) 
        .callback(function (err, result){
        	renderDustTemplate('communicator/communicator_items_open.dust', result, function (text) {
               mCont.empty();
	           mCont.append($.parseHTML(text));           
	           
	           $(".cm-message-reply-link").click(function(){
	               
	        	   
	               var fCont = $('.mf-item-content-tools');
	               mApi({async: false}).communicator.messages.read(mId).callback(function (err, pMsg){
	               	renderDustTemplate('communicator/communicator_replymessage.dust', pMsg, function (text) {
	                   fCont.empty();
	       	           fCont.append($.parseHTML(text));
	                   });	               	
	               	});
	               });	           
	           
              });
        });
    });

    
  

});