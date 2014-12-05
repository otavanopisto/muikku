 
$(document).ready(function(){

	$(".bt-mainFunction").m3modal({
	        		title : "Uusi tapahtuma! ",
	        		description : "Uuden tapahtuman luonti",
	        		content: $('<div><div><select name="eventTemplates"><option>Ei pohjia</option></select></div><div><div><input type="textfield" value="osallistujat" name="eventParticipants"></input></div><div><input type="textfield" value="Tapahtuman nimi" name="eventSubject"></input></div></div><div><textarea value="Tapahtuman kuvaus" name="eventContent"></textarea></div></div>'),
	        		modalgrid : 24,
	        		contentgrid : 24,
	     		
	        		options: [
						{
						    caption: "Koko päivän tapahtuma",
							name : "whole day",
							type : "checkbox",
							action: function (e) {			
											}
						},
								
							 ],
	            		
	        	    buttons: [
	        		  {
	        		    caption: "Luo tapahtuma",
	        		    name : "sendMail",
	        		    action: function (e) {
	        
	        		    }
	        		  },
	        		  {
	            		 caption: "Älä luo tapahtumaa",
	            		 name : "saveMail",
	            		 action: function (e) {
	            
	            		}
	        		  }
	        		]
	        	});
	});

