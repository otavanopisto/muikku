window.interaction.dialog = {};
window.interaction.dialog.close = function(dialog){
  $(document.body).css({'overflow': ''});
  var $dialog = $(dialog);
  $dialog.cssAnimate({
    removeClass: 'dialog-_visible_',
    callback: function(){
      $dialog.removeClass('dialog-_displayed_');
    }
  });
}
window.interaction.dialog.open = function(dialog){
  var $dialog = $(dialog);
  $dialog.addClass('dialog-_displayed_');
  setTimeout(function(){
    $dialog.addClass('dialog-_visible_');
  }, 10);
  setTimeout(function(){
    $(document.body).css({'overflow': 'hidden'});
  },310);
}

window.interaction.register(function(root){	
	$(root).find("[data-interact-dialog]").addBack("[data-interact-dialog]").click(function(e){
		var target = $(e.currentTarget).data("interact-dialog");
		window.interaction.dialog.open(target);
	});
	$(root).find("[data-interact-dialog-close]").addBack("[data-interact-dialog-close]").click(function(){
	  var target = $(e.currentTarget).data("interact-dialog-close")
    window.interaction.dialog.close(target);
  });
	$(root).find(".dialog-close").addBack(".dialog-close").click(function(e){
	  window.interaction.dialog.close($(e.currentTarget).closest(".dialog"));
	});
	$(root).find("[data-interact-dialog-hide]").addBack("[data-interact-dialog-hide]").click(function(e){
	  var elem = $(e.currentTarget).attr("data-interact-dialog-hide") || $(e.currentTarget).closest(".dialog");
	  window.interaction.dialog.close(elem);
	});
	$(root).find('.dialog').addBack('.dialog').click(function(e){
    if(e.target !== e.currentTarget) return;
    window.interaction.dialog.close($(e.currentTarget));
  });
});