/**
 * Details Widget
 *
 * @author Otavia
 */
'use strict';

(function (CKEDITOR) {
  /**
   * Adding summary to DTD so it can be edited
   */
  CKEDITOR.dtd.$editable['summary'] = 1;

  /**
   * Adding plugin to CKE
   */
  CKEDITOR.plugins.add('muikku-details', {
    requires: 'widget',
    icons: 'muikku-details',
    hidpi: true,
    lang: 'en,fi',
    init: function (editor) {
      /**
       * Adding widget
       */
      var lang = editor.lang['muikku-details'];

      editor.widgets.add('muikku-details', {
        button: lang.toolbarMenu,
        template: '<details class="details"><summary class="details__summary">' + lang.summary + '</summary><div class="details__content">' + lang.content + '</div></details>',
        editables: {
          summary: {
            selector: 'summary.details__summary',
          },
          content: {
            selector: 'div.details__content',
          }
        },
        allowedContent: 'details(!details); summary(!details__summary); div(!details__content)',
        requiredContent: 'details(details)',
        upcast: function (element) {
            return element.name == 'details' && element.hasClass( 'details' );
        },
        init: function () {
          var summary = this.element.getChild(0);

          summary.on('blur', function () {
              if (!summary.getText().trim()) {
                  summary.setText(lang.summary);
              }
          });
          // This is to prevent spacebar to open and close details element, basically overriding normal browser behavior
          // and essentially ripping out accessibility feature of details/summary html component, so sorry!
          summary.on('keyup', function (ev) {
              if (ev.data['$'].key === ' ' || ev.data['$'].keyCode === 32) {
                  ev.data['$'].preventDefault();
                  editor.insertText(' ');
              }
          });
      }
      });
    }
  });
})(CKEDITOR);
