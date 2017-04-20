$(document.body).click(function(){
  $('.dropdown').cssAnimate({
    removeClass: 'dropdown-_visible_',
    callback: function(){
      $('.menu').removeClass('dropdown-_displayed_');
    }
  });
});

window.interaction.register(function(root){
	$(root).find('[data-interact-dropdown]').addBack('[data-interact-dropdown]').click(function(e){
		var target = $(e.currentTarget).attr('data-interact-dropdown');
		
		var position = $(e.currentTarget).position();
		var left = position.left - $(target).width() + $(e.currentTarget).width();
		var top = position.top + $(e.currentTarget).height() + 5;
		$(target).css({
			top: top,
			left: left
		});
		
		$(target).addClass('dropdown-_displayed_');
		setTimeout(function(){
			$(target).addClass('dropdown-_visible_');
		}, 10);
	});
});