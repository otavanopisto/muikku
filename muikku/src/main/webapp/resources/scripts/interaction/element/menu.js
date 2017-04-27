$.defineWidget(
  ".menu",
  "menuWidget",
  [],
  $.widget("custom.menuWidget", {
    _create: function(){
      var self = this;
      self.element.click(function(e){
        if(e.target !== e.currentTarget) return;
        self.close();
      });

      this.touchCordX;
      this.touchMovementX;
      this.touchTarget;

      this.element.bind('touchstart',this._touchstart.bind(this));
      this.element.bind('touchmove',this._touchmove.bind(this));
      this.element.bind('touchend',this._touchend.bind(this));
    },

    _touchstart: function(e){
      var self = this;
      var $touchTarget = $(e.target);
      $touchTarget.addClass("active").parent('.link, .button').addClass("active");

      self.element.addClass("menu-_dragging_");
      self.touchCordX = e.originalEvent.changedTouches[0].pageX;
      self.touchMovementX = 0;
      self.touchTarget = $touchTarget;

      e.preventDefault();
    },

    _touchmove: function(e){
      var self = this;
      var startingPoint = self.touchCordX;
      $menuCont = self.element.children('.menu-container');
      var diff = e.originalEvent.changedTouches[0].pageX - startingPoint;
      console.log(diff);

      var absoluteDifference = Math.abs(diff - parseInt($menuCont.css('left')));
      self.touchMovementX = self.touchMovementX + absoluteDifference;;

      if (diff > 0) {
        diff = 0;
      }
      $menuCont.css({'left': diff});

      e.preventDefault();
    },

    _touchend: function(e){
      var self = this;
      self.element.removeClass("menu-_dragging_");
      $menuCont = self.element.children('.menu-container');
      var width = self.element.width();
      var diff = parseInt($menuCont.css("left"));
      var movement = self.touchMovementX;

      self.touchTarget.removeClass("active").parent('.link, .button').removeClass("active");

      setTimeout(function(){
        $menuCont.css({'left': ''});
        if (Math.abs(diff) >= width*0.33 || movement <= 5) {
          if (movement <= 5){
            $(e.target).trigger("click");

            var href = $(e.target).attr("href");
            if (href){
              window.location.href = href;
            }
          }
          self.close();
        }
      },10);
    },
    open: function(){
      var self = this;
      self.element.addClass('menu-_displayed_');
      setTimeout(function(){
        self.element.addClass('menu-_visible_');
      }, 10);
      $(document.body).css({'overflow': 'hidden'});
    },
    close: function(){
      var self = this;
      $(document.body).css({'overflow': ''});
      self.element.cssAnimate({
        removeClass: 'menu-_visible_',
        callback: function(){
          self.element.removeClass('menu-_displayed_');
        }
      });
    }
  })
);