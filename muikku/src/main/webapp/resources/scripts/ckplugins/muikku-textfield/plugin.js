(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add( 'muikku-textfield', {
    icons: 'muikkutextfield',
    init: function(editor) {
      /* stash the type */
      editor.filter.addTransformations(
        [
          [
		 				{
		 					element: 'object',
		 					left: function(element) {
                return (element.attributes['type'] == 'application/vnd.muikku.field.text');
		 					},
		 					right: function(element,tools) {
		 					  var fakeElement = editor.createFakeParserElement(element, 'muikku-text-field', 'object');
		 					  element.replaceWith(fakeElement);
		 					}
		 				}
		 			]
		 		]
      );
    },
  });
}).call(this);