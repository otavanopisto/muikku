module(function(){
  $.widget("custom.formWidget", {
    options: {
      "onSubmit": null
    },
    _create: function(){
      this.element.submit(this._onFormSubmit.bind(this));
    },
    _onFormSubmit: function(e){
      e.preventDefault();
      var form = this.element;

      if (!this.options.onSubmit){
        return false;
      }

      var fields = {};
      form.find("[name]").each(function(){
        var input = $(this);
        fields[input.attr("name")] = input.val();
      });
      this.options.onSubmit({
        "fields": fields
      });

      return false;
    }
  });
});