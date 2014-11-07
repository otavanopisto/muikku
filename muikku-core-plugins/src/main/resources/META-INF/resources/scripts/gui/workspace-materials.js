(function() {

  $(document).ready(function() {
    $('.workspace-material-node').each(function(index, node) {
      var materialType = $(node).data('material-type');
      switch (materialType) {
      case 'html':
        var materialId = $(node).data('material-id');
        break;
      case 'folder':
        $(node).html('<p>' + $(node).data('material-title') + '</p>');
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