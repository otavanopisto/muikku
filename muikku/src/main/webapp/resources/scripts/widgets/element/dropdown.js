module(function(){
  $.widget("custom.dropdownWidget", {
    _create: function(){
      var self = this;
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
      if (diffTime < 300){
        return;
      }

      self.element.cssAnimate({
        condition: ":visible",
        removeClass: 'visible',
        callback: function(){
          self.element.removeClass('displayed');
        }
      });
    },
    open: function(element){
      var self = this;
      var target = $(element);
      self.lastDisplayTime = (new Date()).getTime();

      self.element.addClass('displayed');
      
      var position = target.position();
      var left = position.left - self.element.width() + target.width();
      var top = position.top + target.height() + 5;
      self.element.css({
        top: top,
        left: left
      });
        
      self.arrow.css({
        right: (target.width() / 2) + (self.arrowWidth/2)
      });

      setTimeout(function(){
        self.element.addClass('visible');
      }, 10);
    }
  });
});