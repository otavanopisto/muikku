/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin, ButtonView, uid } from "ckeditor5";

/**
 * Organizer field UI plugin
 * @module muikku-organizerfield
 */
export default class OrganizerFieldUI extends Plugin {
  /**
   * Initializes the plugin
   */
  init() {
    this._addToolbarButton();
  }

  /**
   * Adds a toolbar button
   */
  private _addToolbarButton(): void {
    const editor = this.editor;

    editor.ui.componentFactory.add("muikku-organizerfield", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Organizer Field",
        tooltip: true,
        withText: true,
      });

      button.on("execute", () => {
        editor.model.change((writer) => {
          const organizerField = writer.createElement("organizerField", {
            name: `muikku-organizer-${uid()}`,
          });
          editor.model.insertContent(organizerField);
        });
      });

      return button;
    });
  }
}
