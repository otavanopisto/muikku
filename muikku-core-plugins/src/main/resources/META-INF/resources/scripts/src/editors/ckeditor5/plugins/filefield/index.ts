import { Plugin } from "ckeditor5";
import FileFieldEditing from "./filefield-editing";
import FileFieldUI from "./filefield-ui";

/**
 * File field plugin
 */
export default class FileField extends Plugin {
  /**
   * Requires the file field editing and ui plugins
   */
  static get requires() {
    return [FileFieldEditing, FileFieldUI];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuFileField";
  }
}
