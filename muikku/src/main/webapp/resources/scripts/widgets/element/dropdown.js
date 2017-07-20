module(function(){
  $.widget("custom.dropdownWidget", {
    _create: function(){
      var self = this;
      self.parent = self.element.parent();
      self.lastDisplayTime = 0;
      self.arrow = $('<span class="arrow"></span>');
      self.arrow.appendTo(self.element);
      self.arrowWidth = this.arrow.width();
      $(document.body).click(self.close.bind(self));
    },
    close: function(e){
      var self = this;

      //avoid immediate closing as this is triggered by the same element that wishes
      //to display it
      var diffTime = (new Date()).getTime() - self.lastDisplayTime;
      if (diffTime < 300 || (
          $(e.target).is("select, input, [data-keep-dropdown]") &&
          $(e.target).parents(self.element).size()
      )){
        return;
      }

      self.element.cssAnimate({
        condition: ":visible",
        removeClass: 'visible',
        callback: function(){
          self.element.removeClass('displayed');
          if (self.parent){
            self.element.appendTo(self.parent);
          } else {
            self.element.remove();
          }
        }
      });
    },
    open: function(element){
      var self = this;
      var target = $(element);
      self.lastDisplayTime = (new Date()).getTime();
      self.element.appendTo(document.body);

      self.element.addClass('displayed');
      
      var position = target.offset();
      var windowWidth = $(window).width();
      var renderReverse = windowWidth - position.left > position.left;
      var left;
      if (renderReverse){
        left = position.left;
      } else {
        left = position.left - self.element.outerWidth() + target.outerWidth();
      }
      var top = position.top + target.outerHeight() + 5;
      self.element.css({
        top: top,
        left: left
      });
      
      if (renderReverse){
        self.arrow.css({
          left: (target.outerWidth() / 2) + (self.arrowWidth/2),
          right: undefined
        });
      } else {
        self.arrow.css({
          right: (target.outerWidth() / 2) + (self.arrowWidth/2),
          left: undefined
        });
      }

      setTimeout(function(){
        self.element.addClass('visible');
      }, 10);
    }
  });
});