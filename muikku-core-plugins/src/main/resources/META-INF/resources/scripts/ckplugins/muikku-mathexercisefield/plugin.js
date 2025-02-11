(function () {
  function isMuikkuMathExerciseField(element) {
    var attributes = element.attributes;
    return attributes.type == "application/vnd.muikku.field.mathexercise";
  }

  function createFakeParserElement(editor, realElement) {
    var fake = editor.createFakeParserElement(
      realElement,
      "muikku-mathexercise-field",
      "muikkumathexercisefield",
      true
    );
    fake.attributes.src =
      CKEDITOR.plugins.getPath("muikku-mathexercisefield") +
      "gfx/muikku-placeholder-mathexercise.gif";
    fake.attributes.title = editor.lang["muikku-mathexercisefield"].uiElement;
    return fake;
  }

  CKEDITOR.plugins.add("muikku-mathexercisefield", {
    requires: "muikku-fields",
    lang: "fi,en",
    icons: "muikku-mathexercisefield",
    hidpi: true,
    onLoad: function () {},
    init: function (editor) {
      editor.ui.addButton &&
        editor.ui.addButton("muikku-mathexercisefield", {
          label: editor.lang["muikku-mathexercisefield"].toolbarMenu,
          command: "createMuikkuMathExerciseField",
          toolbar: "insert,20",
        });

      editor.addCommand("createMuikkuMathExerciseField", {
        exec: function (editor) {
          // JSON representation

          var contentJson = {};
          contentJson.name = editor.createRandomMuikkuFieldName();

          // Object representation

          var object = new CKEDITOR.dom.element("cke:object");
          object.setAttribute(
            "type",
            "application/vnd.muikku.field.mathexercise"
          );
          var paramType = new CKEDITOR.dom.element("cke:param");
          paramType.setAttribute("name", "type");
          paramType.setAttribute("value", "application/json");
          var paramContent = new CKEDITOR.dom.element("cke:param");
          paramContent.setAttribute("name", "content");
          paramContent.setAttribute("value", JSON.stringify(contentJson));
          object.append(paramType);
          object.append(paramContent);

          // CKEditor UI representation

          var fakeElement = editor.createFakeElement(
            object,
            "muikku-mathexercise-field",
            "muikkumathexercisefield",
            true
          );
          fakeElement.setAttribute(
            "src",
            CKEDITOR.plugins.getPath("muikku-mathexercisefield") +
              "gfx/muikku-placeholder-mathexercise.gif"
          );
          fakeElement.setAttribute(
            "title",
            editor.lang["muikku-mathexercisefield"].uiElement
          );
          editor.insertElement(fakeElement);
        },
      });
    },

    afterInit: function (editor) {
      var dataProcessor = editor.dataProcessor,
        dataFilter = dataProcessor && dataProcessor.dataFilter;

      if (dataFilter) {
        dataFilter.addRules(
          {
            elements: {
              "cke:object": function (element) {
                if (isMuikkuMathExerciseField(element)) {
                  return createFakeParserElement(editor, element);
                }
              },
            },
          },
          5
        );
      }
    },
  });
})();
