(function() {
  'use strict';

  $(document).on('click', '.upload-button', function (event) {
    event.preventDefault();
    var uploadMeta = $('.muikku-file-input-field').muikkuFileField('files');
    $('.upload-meta').val(JSON.stringify(uploadMeta));
    $('.hidden-upload-command')[0].click();
  });
  
}).call(this);