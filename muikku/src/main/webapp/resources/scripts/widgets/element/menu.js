module(function(){
  $.widget("custom.menuWidget", {
    _create: function(){
      var self = this;
      self.element.click(function(e){
        if(e.target !== e.currentTarget) return;
        self.close();
      });
      self.element.find(".menu-header-button-close, .menu-items").click(function(e){
        self.close();
      });

      this.touchCordX;
      this.touchMovementX;
      this.touchCordY;
      this.touchMovementY;
      this.touchTarget;

      this.element.bind('touchstart',this._touchstart.bind(this));
      this.element.bind('touchmove',this._touchmove.bind(this));
      this.element.bind('touchend',this._touchend.bind(this));
    },

    _touchstart: function(e){
      var self = this;
      var $touchTarget = $(e.target);
      $touchTarget.addClass("active").parent('.link, .button').addClass("active");

      self.element.addClass("dragging");
      self.touchCordX = e.originalEvent.changedTouches[0].pageX;
      self.touchMovementX = 0;
      self.touchCordY = e.originalEvent.changedTouches[0].pageY;
      self.initialScrollY = self.element.find(".menu-body").scrollTop();
      self.touchTarget = $touchTarget;

      e.preventDefault();
    },

    _touchmove: function(e){
      var self = this;
      $menuCont = self.element.children('.menu-container');
      var diffX = e.originalEvent.changedTouches[0].pageX - self.touchCordX;

      var absoluteDifferenceX = Math.abs(diffX - parseInt($menuCont.css('left')));
      self.touchMovementX = self.touchMovementX + absoluteDifferenceX;

      if (diffX > 0) {
        diffX = 0;
      }
      $menuCont.css({'left': diffX});
      
      var $menuBody = self.touchTarget.parents(".menu-body");
      if ($menuBody.length === 1){
        var diffY = e.originalEvent.changedTouches[0].pageY - self.touchCordY;
        if (Math.abs(diffY) >= 3){
          self.lockX = true;
        }
        $menuBody.scrollTop(self.initialScrollY-diffY);
      }

      e.preventDefault();
    },

    _touchend: function(e){
      var self = this;
      self.element.removeClass("dragging");
      $menuCont = self.element.children('.menu-container');
      var width = self.element.width();
      var diff = parseInt($menuCont.css("left"));
      var movement = self.touchMovementX;

      self.touchTarget.removeClass("active").parent('.link, .button').removeClass("active");

      setTimeout(function(){
        $menuCont.css({'left': ''});
        $etarget = $(e.target);
        var targetShouldTriggerCloseIfClicked =
          $etarget.hasClass("menu-header-button-close") || //You pressed the button to close the menu
          $etarget.parents(".menu-items").length === 1 || //You pressed one of the items in the list
          $etarget.hasClass("menu"); //You pressed the overlay
        
        var targetIsActuallyBeingClicked = movement <= 5; //The total movement of the finger over a pressed target is just 5 pixels max
        var menuHasSlidedEnoughForClosing = Math.abs(diff) >= width*0.33; //The difference of movement is a third of the menu width
        if ((targetIsActuallyBeingClicked && targetShouldTriggerCloseIfClicked) || menuHasSlidedEnoughForClosing) {
          if (targetIsActuallyBeingClicked){
            $etarget.trigger("click");

            var href = $etarget.attr("href");
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
      self.element.addClass('displayed');
      setTimeout(function(){
        self.element.addClass('visible');
      }, 10);
      $(document.body).css({'overflow': 'hidden'});
      self.element.find(".menu-body").scrollTop(0);
    },
    close: function(){
      var self = this;
      $(document.body).css({'overflow': ''});
      self.element.cssAnimate({
        condition: ":visible",
        removeClass: 'visible',
        callback: function(){
          self.element.removeClass('displayed');
        }
      });
    }
  });

});