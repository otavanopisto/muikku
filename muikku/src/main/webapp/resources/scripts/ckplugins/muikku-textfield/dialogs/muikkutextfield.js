/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {
  CKEDITOR.dialog
      .add(
          'muikkutextfield',
          function(editor) {
            return {
              title : "Muikku Text Field",
              minWidth : 420,
              minHeight : 310,
              onShow : function() {
                // Try to detect any embed or object tag that has Flash
                // parameters.
                var fakeImage = this.getSelectedElement();
                if (fakeImage
                    && fakeImage.data('cke-real-element-type')
                    && fakeImage.data('cke-real-element-type') == 'muikkutextfield') {
                }
              },
              onOk : function() {
              },
              onHide : function() {
              },
              contents : [ {
                id : 'info',
                label : editor.lang.common.generalTab,
                accessKey : 'I',
                elements : []
              } ]
            };
          });
})();