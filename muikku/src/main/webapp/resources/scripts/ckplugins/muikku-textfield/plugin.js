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
		 					  fakeElement.attributes['src'] = 'https://placehold.it/100x20';
		 					  fakeElement.attributes['style'] = 'margin-left: 1em; margin-right: 1em;';
		 					  element.replaceWith(fakeElement);
		 					}
		 				}
		 			]
		 		]
      );
    },
  });
}).call(this);