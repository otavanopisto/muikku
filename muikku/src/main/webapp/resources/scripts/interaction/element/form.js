$.defineWidget(
  ".form",
  "formWidget",
  [],
  $.widget("custom.formWidget", {
    _create: function(){
      var self = this;
      var submitEvent = $(self.element).data("form-submit-event");

      if (!submitEvent && console && console.warn){
        console.warn("No submit event was set for ", self.element);
      }

      $(self.element).submit(function(e){
        e.preventDefault();
        var form = $(self.element);

        if (!submitEvent){
          return false;
        }

        var fields = {};
        form.find("[name]").each(function(){
          var input = $(this);
          fields[input.attr("name")] = input.val();
        });
        $(document).trigger(submitEvent, {
          fields: fields
        });

        return false;
      });
    }
  })
);