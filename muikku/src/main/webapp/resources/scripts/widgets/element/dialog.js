module(function(){
  $.widget("custom.dialogWidget", {
    _create: function(){
      var self = this;
      self.element.click(function(e){
        if(e.target !== e.currentTarget) return;
        self.close();
      });
      self.element.find(".dialog-close, .dialog-button-close").click(self.close.bind(self));
    },
    close(){
      $(document.body).css({'overflow': ''});
      var self = this;
      self.element.cssAnimate({
        condition: ":visible",
        removeClass: 'visible',
        callback: function(){
          self.element.removeClass('displayed');
        }
      });
    },
    open(){
      var self = this;
      self.element.addClass('displayed');
      setTimeout(function(){
        self.element.addClass('visible');
      }, 10);
      setTimeout(function(){
        $(document.body).css({'overflow': 'hidden'});
      },310);
    }
  });
});