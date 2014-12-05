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
		 					left: function( el ) {
		 					  console.log("left: %o", el);
		 					  console.log("left: %o", el.attributes);
		 					  console.log("left: %o", el.attributes.type);
		 						return true;
		 					},
		 					right: function( el, tools ) {
		 					  console.log("right: %o", el);
		 					}
		 				}
		 			]
		 		]
      );

      console.log(editor.config.protectedSource);
      var dataFilter = editor.dataProcessor
                     && editor.dataProcessor.dataFilter;
      
      if (dataFilter) {
        console.log("dataFilter löytyy");
        dataFilter.addRules({
          text: function(value) {
            console.log("dataFilter text");
            console.log(value);
          },
          elements: {
            'cke:object': function(element) {
              console.log("dataFilter");
              console.log(element);
              // TODO: move to addTransformations
              if (element.attributes['type'] == 'application/vnd.muikku.field.text') {
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
          }
          
        }, {priority: 1, applyToAll: true});
      }
      
      var htmlFilter = editor.dataProcessor
                     && editor.dataProcessor.htmlFilter;
      if (htmlFilter) {
        htmlFilter.addRules({
          elements: {
            'object': function(element) {
              console.log("htmlFilter");
              console.log(element);
            }
          }
          
        }, {priority: 1000000});
      }
    }
  });
}).call(this);