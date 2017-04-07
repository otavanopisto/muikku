jQuery(document).ready(function(){
	$('[data-interact-menu]').click(function(e){
		var target = $(e.currentTarget).attr('data-interact-menu');
		$(target).addClass('menu-_displayed_');
		setTimeout(function(){
			$(target).addClass('menu-_visible_');
		}, 10);
		$(document.body).css({'overflow': 'hidden'});
	});
	
	function hideMenu($menu){
		$menu.cssAnimate({
			removeClass: 'menu-_visible_',
			callback: function(){
				$('.menu').removeClass('menu-_displayed_');
			}
		});
	};
	
	$('.menu').click(function(e){
		if(e.target !== e.currentTarget) return;
		hideMenu($(e.currentTarget));
		$(document.body).css({'overflow': ''});
	});
	
	$('.menu').bind('touchstart', function(e){
		$(e.currentTarget).addClass("menu-_dragging_")
			.data("touchCordX", e.originalEvent.changedTouches[0].pageX);
		if (e.currentTarget === e.target) {
			$(e.currentTarget).data("touchTime", (new Date()).getTime());
		}
		e.preventDefault();
	});
	
	$('.menu').bind('touchmove', function(e){
		var $menu = $(e.currentTarget);
		var startingPoint = $menu.data("touchCordX");
		$menuCont = $menu.children('.menu-container');
		var diff = e.originalEvent.changedTouches[0].pageX - startingPoint;
		if (diff > 0) {
			diff = 0;
		}
		$menuCont.css({'left': diff});
		e.preventDefault();
	});
	
	$('.menu').bind('touchend', function(e){
		var $menu = $(e.currentTarget);
		$menu.removeClass("menu-_dragging_");
		$menuCont = $menu.children('.menu-container');
		var width = $menuCont.width();
		var diff = parseInt($menuCont.css("left"));
		var timediff = (new Date()).getTime() - $menu.data("touchTime")
		setTimeout(function(){
			$menuCont.css({'left': ''});
			if (Math.abs(diff) >= width*0.33 || timediff <= 300) {
				hideMenu($menu);
			}
		},10);
	});
});