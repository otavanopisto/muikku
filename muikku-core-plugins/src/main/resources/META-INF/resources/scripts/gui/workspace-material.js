(function() {
  
  $(document).ready(function () {
    $('iframe').load(function () {
      var contentDocument = this.contentDocument || this.contentWindow.document;
      var scrollHeight = $(contentDocument).find('body').prop('scrollHeight');
      $(this).css("height", scrollHeight);
    });
  });
  
}).call(this);