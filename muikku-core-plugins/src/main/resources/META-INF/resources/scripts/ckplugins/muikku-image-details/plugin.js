/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben, Otavan
 *          opisto. All rights reserved.
 */

(function() {
  'use strict';

  CKEDITOR.plugins.add('muikku-image-details', {
    lang: 'fi,en',
    init: function(editor) {
      
    }
  });

  CKEDITOR.on( 'dialogDefinition', function( ev ) {
    var editor = ev.editor;
    var lang = editor.lang['muikku-image-details'];

    var dialogName = ev.data.name;
    var dialogDefinition = ev.data.definition;
    
    if (dialogName == 'image2') {
      dialogDefinition.addContents({
        id: 'details',
        label: lang.detailsTab,
        elements: [{
            id : 'source',
            type : 'text',
            label : lang.sourceLabel,
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-source'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-source', this.getValue());
            }
          }, {
            id : 'source-url',
            type : 'text',
            label : lang.sourceUrlLabel,
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-source-url'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-source-url', this.getValue());
            }
          }, {
            id : 'license',
            type : 'text',
            label : lang.licenseLabel,
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-license'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-license', this.getValue());
            }
          }, {
            id : 'license-url',
            type : 'text',
            label : lang.licenseUrlLabel,
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-license-url'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-license-url', this.getValue());
            }
          }, {
            id : 'author',
            type : 'text',
            label : lang.authorLabel,
            setup: function(widget) {
              this.setValue(widget.parts.image.getAttribute('data-author'));
            },
            commit: function(widget) {
              widget.parts.image.setAttribute('data-author', this.getValue());
            }
          }, {
            id : 'author-url',
            type : 'text',
            label : lang.authorUrlLabel,
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
