/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {
  'use strict';

  
  CKEDITOR.plugins.add('muikku-image-extra', {
    init: function(editor) {
      
    }
  });

  CKEDITOR.on( 'dialogDefinition', function( ev ) {
    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    
    if (dialogName == 'image2') {
      dialogDefinition.addContents({
        id: 'Extra',
        label: 'Extra', //lang.extraTab,
        elements: [{
            id : 'source',
            type : 'text',
            label : 'Source',
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-source'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-source', this.getValue());
            }
          }, {
            id : 'source-url',
            type : 'text',
            label : 'Source URL',
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-source-url'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-source-url', this.getValue());
            }
          }, {
            id : 'license',
            type : 'text',
            label : 'License',
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-license'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-license', this.getValue());
            }
          }, {
            id : 'license-url',
            type : 'text',
            label : 'License URL',
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-license-url'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-license-url', this.getValue());
            }
          }, {
            id : 'author',
            type : 'text',
            label : 'Author',
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-author'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-author', this.getValue());
            }
          }, {
            id : 'author-url',
            type : 'text',
            label : 'Author URL',
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-author-url'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-author-url', this.getValue());
            }
          }]
      });
    }
  });

}).call(this);
