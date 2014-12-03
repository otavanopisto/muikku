

$(document).ready(function(){
	
	$(".bt-mainFunction").m3modal({
		title : "Uusi viesti ",
		description : "Voit lähettää uuden viestin opettajillesi tai opiskelutovereillesi.",
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
            var subject = e.contentElement.find("input[name='msgSubject']").val();
            var content = e.contentElement.find("textarea[name='msgContent']").val();
            var tagStr = "tagi viesti"; // TODO: Tag content
            var tags = tagStr != undefined ? tagStr.split(' ') : [];
            var recipientIds = [10];
            var groupIds = [];
            
            mApi().communicator.messages.create({
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
          $('.cm-messages-container').append($.parseHTML(text));
        });
      });

 
    $('.cm-messages-container').on('click','.cm-message:not(.open)', function(){
 
    	var mId = $(this).attr('id');
    	var mCont = $('.cm-messages-container');
        var _this = $(this); 

        
        
        mApi().communicator.messages.read(mId).on('$', function(msg, msgCallback){
        	 
	        mApi().communicator.communicatormessages.sender.read(mId)
	        .callback(function (err, user) {  
	          msg.senderFullName = user.firstName + ' ' + user.lastName;
	          msg.senderHasPicture = user.hasImage;
	        });
       	
	        
        	msgCallback();
        }) 
        .callback(function (err, result){
        	renderDustTemplate('communicator/communicator_items_open.dust', result, function (text) {
               
               mCont.empty();
	           mCont.append($.parseHTML(text));
               
	           
	           
	           $(".cm-message-reply-link").click(function(event){
	               var fCont = $('.mf-item-content-tools');
	               mApi().communicator.communicatormessages.read(mId).on('$', function(reply, replyCallback){
	            	   
	       	        mApi().communicator.communicatormessages.sender.read(mId)
	    	        .callback(function (err, user) {  
	    	          reply.senderFullName = user.firstName + ' ' + user.lastName;
	    	          reply.senderHasPicture = user.hasImage;
	    	        });            	   
	            	   
	               
	                replyCallback(); 
	               })
	               
	               
	               .callback(function (err, result){
	               	renderDustTemplate('communicator/communicator_replymessage.dust', result, function (text) {
	   //                var cBtn = ;
	               		
	               	   fCont.empty();
	       	           fCont.append($.parseHTML(text));
	       	           
	       	          
                         
	       	           
	       	           
	       	         //  $('.cm-message-reply').addClass('mf-item-load');
	       	           
	                   });	               	
	               	});
	               });	           
	           
              });
        });
    });


    
  

});