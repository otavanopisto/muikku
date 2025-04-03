import { Plugin, Dialog } from "ckeditor5";
import SelectionFieldEditing from "./selectionfield-editing";
import SelectionFieldUI from "./selectionfield-ui";

/**
 * Selection field plugin for CKEditor 5
 */
export default class SelectionField extends Plugin {
  /**
   * Required plugins
   */
  static get requires() {
    return [SelectionFieldEditing, SelectionFieldUI, Dialog];
  }

  /**
   * Plugin name
   */
  static get pluginName() {
    return "MuikkuSelectionField";
  }
}
