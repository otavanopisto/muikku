$(function() {
	RESTful.doGet(CONTEXTPATH + "/rest/fish/messages/").success(function(data, textStatus, jqXHR) {
		var index = 0;
		function updateFish() {
			renderDustTemplate("/fish/restfish.dust", data.messages[index], function (text) {
				$("#fishContainer").html(text);
				index = (index + 1) % data.count;
			});
		};
		
		updateFish();
		setInterval(updateFish, +($("#fishContainer").data('update-interval')));
	});
});