import { ButtonView, Plugin, uid } from "ckeditor5";

/**
 * Audio field UI plugin
 */
export default class AudioFieldUI extends Plugin {
  /**
   * Initialize the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in AudioFieldUI");
    }

    // Add the toolbar button
    this._addToolbarButton();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-audiofield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Audio Field",
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      button.on("execute", () => {
        this._insertAudioField();
      });

      return button;
    });
  }

  /**
   * Inserts a new sorter field at the current selection
   */
  private _insertAudioField() {
    const editor = this.editor;

    editor.model.change((writer) => {
      const audioField = writer.createElement("audioField", {
        name: `muikku-audio-${uid()}`,
      });
      editor.model.insertContent(audioField);
    });
  }
}
