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
		 					  console.log("object type: %o", element.attributes['type']);
                return (element.attributes['type'] == 'application/vnd.muikku.field.text');
		 					},
		 					right: function(element,tools) {
                var metaType;
                var metaContent;
                for (var i=0, l=element.children.length; i<l; i++) {
                  var child = element.children[i];
		 					    console.log("child: %o", child);
                  if (child.name == 'cke:param') {
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
                element.replaceWith(result);
		 					}
		 				}
		 			]
		 		]
      );
    }
  });
}).call(this);