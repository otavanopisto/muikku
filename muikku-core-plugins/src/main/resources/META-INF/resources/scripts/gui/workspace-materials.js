(function() {

  $(document).ready(function() {
    $('.workspace-material-node').each(function(index, node) {
      var materialType = $(node).data('material-type');
      switch (materialType) {
      case 'html':
        var materialId = $(node).data('material-id');
        mApi().materials.html.read(materialId).callback(
          function (err, html) {
            $(node).html(html.html);
          });
        break;
      case 'folder':
        $(node).append($('<p>').html($(node).data('material-title')));
        break;
      default:
        break;
      }
    });
  });

// TODO enable?
//  jsPlumb.ready(function() {
//    $(".muikku-connect-field-table").muikkuConnectField();
//  });

}).call(this);