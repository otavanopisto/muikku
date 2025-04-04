import { ButtonView, Plugin, uid } from "ckeditor5";

/**
 * File field UI plugin
 */
export default class FileFieldUI extends Plugin {
  /**
   * Initialize the plugin
   */
  init() {
    if (!this.editor) {
      throw new Error("Editor instance is not available in FileFieldUI");
    }

    this._addToolbarButton();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-filefield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "File Field",
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      button.on("execute", () => {
        this._insertFileField();
      });

      return button;
    });
  }

  /**
   * Inserts a new sorter field at the current selection
   */
  private _insertFileField() {
    const editor = this.editor;

    editor.model.change((writer) => {
      const fileField = writer.createElement("fileField", {
        name: `muikku-file-${uid()}`,
      });
      editor.model.insertContent(fileField);
    });
  }
}
