(function() {
  
  MiniCalendarWidgetController = $.klass(GenericMiniCalendarWidgetController, {
    init: function () {
      this._super(arguments);
    },
    
    setup: function (widgetElement) {
      this._super(arguments, widgetElement, widgetElement);
    },
    destroy: function () {
      this._super(arguments);
    }
  });
  
  addWidgetController('miniCalendarWidget', MiniCalendarWidgetController);
  
}).call(this);