WidgetController = $.klass({
  init : function () {
  },
  setup: function (widgetElement) {
  },
  destroy : function() {
  }
});

function addWidgetController(widgetClass, widgetControllerClass) {
  if (!window._widgetControllers)
    window._widgetControllers = {};
  window._widgetControllers[widgetClass] = widgetControllerClass;
}

$(document).ready(function () {
  if (window._widgetControllers) {
    $.each(window._widgetControllers, function (widgetClass, widgetControllerClass) {
      $('.' + widgetClass).each(function (index, widgetElement) {
        var widgetControllerClass = window._widgetControllers[widgetClass];
        var widgetController = new widgetControllerClass();
        widgetController.setup(widgetElement);
      });
    });
  } 
});

$(window).unload(function() {
  if (window._widgetControllers) {
    for (var i = 0, l = window._widgetControllers.length; i < l; i++) {
      window._widgetControllers[i].destroy();
      delete window._widgetControllers[i];
    }
  }  
});