(function() {
  
  DockCalendarWidgetController = $.klass(GenericMiniCalendarWidgetController, {
    init: function () {
      this._super(arguments);
    },
    
    setup: function (widgetElement) {
      this._super(arguments, widgetElement, $(widgetElement).find('.miniCalendarContainer'));
    },
    destroy: function () {
      this._super(arguments);
    }
  });
  
  addWidgetController('dockCalendarWidget', DockCalendarWidgetController);
  
}).call(this);