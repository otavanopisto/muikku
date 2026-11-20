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
   * Check if the element is a details element.
   */
  function isDetailsElement(el) {
    return el && String(el.tagName).toLowerCase() === "details";
  }

  /**
   * Never persist the native open state. Viewer/MaterialLoader owns that.
   */
  function stripOpenAttribute(el) {
    if (el && el.attributes) {
      delete el.attributes.open;
    }
    return el;
  }

  /**
   * Re-typeset MathJax widgets nested in a details block.
   * Native <details> uses display:none on closed content, so MathJax
   * measures Infinity/NaN on first load; a second typeset after layout works.
   */
  function refreshNestedMath(editor, detailsEl) {
    if (!detailsEl || !detailsEl.open) {
      return;
    }

    /**
     * Rerender the MathJax widgets nested in the details element.
     */
    function rerender() {
      if (!detailsEl.open) {
        return;
      }

      var id;
      for (id in editor.widgets.instances) {
        if (!editor.widgets.instances.hasOwnProperty(id)) {
          continue;
        }

        var widget = editor.widgets.instances[id];
        if (
          widget.name !== "muikku-mathjax" ||
          !widget.wrapper ||
          !detailsEl.contains(widget.wrapper.$)
        ) {
          continue;
        }

        CKEDITOR.plugins.muikkuMathjax.reinitWidget(widget);
      }
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(function () {
        setTimeout(rerender, 0);
      });
    } else {
      setTimeout(rerender, 50);
    }
  }

  /**
   * Bind details listeners to the editor.
   */
  function bindDetailsListeners(editor) {
    var editable = editor.editable();
    if (
      !editable ||
      !editable.$ ||
      editable.$.getAttribute("data-muikku-details-math") === "1"
    ) {
      return;
    }
    editable.$.setAttribute("data-muikku-details-math", "1");

    editable.$.addEventListener(
      "toggle",
      function (ev) {
        if (isDetailsElement(ev.target) && ev.target.open) {
          refreshNestedMath(editor, ev.target);
        }
      },
      true,
    );

    // contenteditable often swallows details "toggle"; click still happens.
    editable.$.addEventListener(
      "click",
      function (ev) {
        var summary =
          ev.target &&
          ev.target.closest &&
          ev.target.closest("summary.details__summary");
        if (!summary) {
          return;
        }
        var details = summary.parentElement;
        if (!isDetailsElement(details)) {
          return;
        }
        setTimeout(function () {
          refreshNestedMath(editor, details);
        }, 0);
      },
      true,
    );
  }

  /**
   * Adding plugin to CKE
   */
  CKEDITOR.plugins.add("muikku-details", {
    requires: "widget,muikku-mathjax",
    icons: "muikku-details",
    hidpi: true,
    lang: "en,fi",
    init: function (editor) {
      /**
       * Adding widget
       */
      var lang = editor.lang["muikku-details"];

      editor.on("contentDom", function () {
        bindDetailsListeners(editor);
      });

      editor.dataProcessor.htmlFilter.addRules({
        elements: {
          details: stripOpenAttribute,
        },
      });

      editor.widgets.add("muikku-details", {
        button: lang.toolbarMenu,
        template:
          '<details class="details"><summary class="details__summary">' +
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
          if (element.name == "details" && element.hasClass("details")) {
            stripOpenAttribute(element);
            return element;
          }
        },
        downcast: function (element) {
          return stripOpenAttribute(element);
        },
        init: function () {
          var summary = this.element.findOne("summary.details__summary");

          this.element.removeAttribute("open");

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
