import { ButtonView, Plugin, uid } from "ckeditor5";

/**
 * Journal field UI plugin
 */
export default class JournalFieldUI extends Plugin {
  /**
   * Initialize the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in JournalFieldUI");
    }

    // Add the toolbar button
    this._addToolbarButton();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-journalfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Journal Field",
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      button.on("execute", () => {
        this._insertJournalField();
      });

      return button;
    });
  }

  /**
   * Inserts a new sorter field at the current selection
   */
  private _insertJournalField() {
    const editor = this.editor;

    editor.model.change((writer) => {
      const journalField = writer.createElement("journalField", {
        name: `muikku-journal-${uid()}`,
      });
      editor.model.insertContent(journalField);
    });
  }
}
