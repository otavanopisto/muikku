$(function() {
	RESTful.doGet(CONTEXTPATH + "/rest/fish/messages/").success(function(data, textStatus, jqXHR) {
		var index = 0;
		setInterval(function() {
			renderDustTemplate("/fish/restfish.dust", data.messages[index], function (text) {
				$("#fishContainer").html(text);
				index = (index + 1) % data.count;
			});
		}, 5000);
	});
});