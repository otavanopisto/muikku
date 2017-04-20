window.interaction.register(function(root){
	$(root).find(".form").addBack(".form").submit(function(e){
		e.preventDefault();
		var form = $(e.currentTarget);
		var event = form.data("interact-form-event");
		
		if (!event){
			return false;
		}
		
		var fields = {};
		form.find("[name]").each(function(){
			var input = $(this);
			fields[input.attr("name")] = input.val();
		});
		$(document).trigger(event, {
			fields: fields
		});
		
		return false;
	});
	
	$(root).find("[data-interact-form-submit]").addBack("[data-interact-form-submit]").click(function(e){
		var target = $(e.currentTarget).data("interact-form-submit");
		$(target).submit();
	});
});