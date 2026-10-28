CKEDITOR.plugins.add("muikku-comment-popup", {
  setupCommentPreview: function (editor) {
    var hideTimer = null;
    var panel = CKEDITOR.document.createElement("div");
    panel.addClass("cke-muikku-comment-preview");
    panel.setAttribute("role", "tooltip");
    panel.setStyle("display", "none");
    CKEDITOR.document.getBody().append(panel);
    function clearHide() {
      if (hideTimer) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
    }
    function hide() {
      clearHide();
      panel.setStyle("display", "none");
      panel.setText("");
    }
    function positionPanel(mark) {
      var rect = mark.getClientRect();
      var size = panel.getClientRect();
      var gap = 8;
      var top = rect.bottom + gap;
      var left = rect.left;
      if (top + size.height > window.innerHeight) {
        top = Math.max(gap, rect.top - size.height - gap);
      }
      if (left + size.width > window.innerWidth) {
        left = Math.max(gap, window.innerWidth - size.width - gap);
      }
      panel.setStyles({
        position: "fixed",
        top: top + "px",
        left: left + "px",
      });
    }
    function showForMark(mark) {
      var text = mark.getAttribute("data-text");
      if (!text) {
        hide();
        return;
      }
      clearHide();
      panel.setText(text);
      panel.setStyle("display", "block");
      positionPanel(mark);
    }
    function commentMarkFromEvent(evt) {
      var target = evt.data.getTarget();
      return target.getAscendant(function (el) {
        return (
          el.type === CKEDITOR.NODE_ELEMENT &&
          el.getName() === "mark" &&
          el.getAttribute("data-type") === "comment"
        );
      }, true);
    }
    editor.on("contentDom", function () {
      var editable = editor.editable();
      editable.attachListener(editable, "mouseover", function (evt) {
        var mark = commentMarkFromEvent(evt);
        if (mark) {
          showForMark(mark);
        }
      });
      editable.attachListener(editable, "mouseout", function () {
        hideTimer = window.setTimeout(hide, 150);
      });
    });
    panel.on("mouseover", function () {
      clearHide();
    });
    panel.on("mouseout", function () {
      hideTimer = window.setTimeout(hide, 150);
    });
    editor.on("dialogShow", hide);
    editor.on("destroy", function () {
      hide();
      panel.remove();
    });
  },
  init: function (editor) {
    this.setupCommentPreview(editor);
  }
});
