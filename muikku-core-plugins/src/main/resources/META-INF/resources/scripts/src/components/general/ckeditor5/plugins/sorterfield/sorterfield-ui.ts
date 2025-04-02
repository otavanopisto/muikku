import { Plugin, ButtonView } from "ckeditor5";

/**
 * SorterField UI plugin
 */
export default class SorterFieldUI extends Plugin {
  /**
   * Initialize the plugin
   */
  init() {
    if (!this.editor) {
      throw new Error("Editor instance is not available in SorterFieldUI");
    }

    this._addToolbarButton();
    this._setupClickListener();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-sorterfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Sorter Field",
        tooltip: true,
        withText: true,
      });

      button.on("execute", () => {
        this._insertSorterField();
      });

      return button;
    });
  }

  /**
   * Sets up click listener for existing sorter fields
   */
  private _setupClickListener() {
    this.editor.editing.view.document.on("click", (evt, data) => {
      const element = data.target;

      if (
        element.is("element", "img") &&
        element.hasClass("muikku-sorter-field")
      ) {
        // TODO: Implement edit functionality
      }
    });
  }

  /**
   * Inserts a new sorter field at the current selection
   */
  private _insertSorterField() {
    const editor = this.editor;

    editor.model.change((writer) => {
      const sorterField = writer.createElement("sorterField", {
        name: `muikku-sorter-${Date.now()}`,
      });
      editor.model.insertContent(sorterField);
    });
  }

  /**
   * Gets the currently selected text field element if any
   * @returns Selected text field element or null
   */
  private _getSelectedSorterField() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "sorterField" ? selectedElement : null;
  }
}
