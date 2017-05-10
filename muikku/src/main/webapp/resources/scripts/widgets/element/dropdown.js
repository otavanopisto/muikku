module(function(){
  $.widget("custom.dropdownWidget", {
    _create: function(){
      var self = this;
      self.lastDisplayTime = 0;
      $(document.body).click(self.close.bind(self));
    },
    close: function(){
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

      var position = target.position();
      var left = position.left - this.element.width() + target.width();
      var top = position.top + target.height() + 5;
      this.element.css({
        top: top,
        left: left
      });

      self.element.addClass('displayed');
      setTimeout(function(){
        self.element.addClass('visible');
      }, 10);
    }
  });
});