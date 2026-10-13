/**
 * Details Widget
 *
 * @author Otavia
 */
"use strict";

(function (CKEDITOR) {
  /**
   * Adding summary to DTD so it can be edited
   */
  CKEDITOR.dtd.$editable["summary"] = 1;

  /**
   * Re-typeset MathJax widgets nested in a details block.
   * Native <details> uses display:none on closed content, so MathJax
   * measures Infinity/NaN on first load; a second typeset after layout works.
   */
  function refreshNestedMath(editor, detailsWidget) {
    var detailsEl = detailsWidget.element.$;
    var id;

    for (id in editor.widgets.instances) {
      if (!editor.widgets.instances.hasOwnProperty(id)) {
        continue;
      }

      var widget = editor.widgets.instances[id];

      if (
        widget.name === "muikku-mathjax" &&
        widget.frameWrapper &&
        detailsEl.contains(widget.wrapper.$)
      ) {
        widget.frameWrapper.setValue(widget.data.math);
      }
    }
  }

  /**
   * Adding plugin to CKE
   */
  CKEDITOR.plugins.add("muikku-details", {
    requires: "widget",
    icons: "muikku-details",
    hidpi: true,
    lang: "en,fi",
    init: function (editor) {
      /**
       * Adding widget
       */
      var lang = editor.lang["muikku-details"];

      editor.widgets.add("muikku-details", {
        button: lang.toolbarMenu,
        template:
          '<details class="details" open="open"><summary class="details__summary">' +
          lang.summary +
          '</summary><div class="details__content">' +
          lang.content +
          "</div></details>",
        editables: {
          summary: {
            selector: "summary.details__summary",
          },
          content: {
            selector: "div.details__content",
          },
        },
        allowedContent:
          "details(!details)[open]; summary(!details__summary); div(!details__content)",
        requiredContent: "details(details)",
        upcast: function (element) {
          return element.name == "details" && element.hasClass("details");
        },
        init: function () {
          var widget = this;
          var summary = this.element.findOne("summary.details__summary");

          // Keep content laid out in the editor so nested math iframes can measure.
          // Authors can still close it; downcast will store the current open state.
          this.element.setAttribute("open", "open");

          this.element.on("toggle", function () {
            refreshNestedMath(editor, widget);
          });

          if (!summary) {
            return;
          }

          summary.on("blur", function () {
            if (!summary.getText().trim()) {
              summary.setText(lang.summary);
            }
          });
          // This is to prevent spacebar to open and close details element, basically overriding normal browser behavior
          // and essentially ripping out accessibility feature of details/summary html component, so sorry!
          summary.on("keyup", function (ev) {
            if (ev.data["$"].key === " " || ev.data["$"].keyCode === 32) {
              ev.data["$"].preventDefault();
              editor.insertText(" ");
            }
          });
        },
      });
    },
  });
})(CKEDITOR);
