(function() {
  'use strict'
  
  /* global CKEDITOR */

  CKEDITOR.plugins.add( 'muikku-textfield', {
    icons: 'muikkutextfield',
    init: function(editor) {
        editor.filter.addTransformations( [
		 			[
		 				{
		 					element: 'object',
		 					left: function(element) {
                return (element.attributes['type'] == 'application/vnd.muikku.field.text');
		 					},
		 					right: function(element,tools) {
                var metaType;
                var metaContent;
                for (var i=0, l=element.children; i<l; i++) {
                  var child = element.children[i];
                  if (child.name == 'param') {
                    switch(child.attributes['name']) {
                      case 'type':
                        metaType = child.attributes['value'];
                        break;
                      case 'content':
                        metaContent = child.attributes['value'];
                        break;
                    }
                  }
                }
                var result = new CKEDITOR.htmlParser.element(
                    'input',
                    {
                      'type': 'text',
                      'data-muikku-meta-type': metaType,
                      'data-muikku-meta-content': metaContent
                    }
                );
		 					}
		 				}
		 			]
		 		]
      );
    }
  });
}).call(this);