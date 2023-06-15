/**
 * Details Widget
 *
 * @author Otavia
 */
'use strict';

(function (CKEDITOR) {
  /**
   * DTD, adding summary to DTD so it can be edited
   */
  CKEDITOR.dtd.$editable['summary'] = 1;

  /**
   * Plugin
   */
  CKEDITOR.plugins.add('muikku-details', {
    requires: 'widget',
    icons: 'muikku-details',
    hidpi: true,
    lang: 'en,fi',
    init: function (editor) {
      /**
       * Widget
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
      });
    }
  });
})(CKEDITOR);
