import { Plugin, Dialog } from "ckeditor5";
import TextFieldEditing from "./textfield-editing";
import TextFieldUI from "./textfield-ui";

/**
 * Textfield plugin
 */
export default class TextField extends Plugin {
  /**
   * Requires the textfield editing and ui plugins
   */
  static get requires() {
    return [TextFieldEditing, TextFieldUI, Dialog];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuTextField";
  }
}
