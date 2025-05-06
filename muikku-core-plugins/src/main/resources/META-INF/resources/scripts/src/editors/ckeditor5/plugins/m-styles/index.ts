import { Plugin } from "ckeditor5";
import MStylesEditing from "./m-styles-editing";
import MStylesUI from "./m-styles-ui";

/**
 * MStyles plugin
 */
export default class MStyles extends Plugin {
  /**
   * Requires the m-styles editing and ui plugins
   */
  static get requires() {
    return [MStylesEditing, MStylesUI];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuMStyles";
  }
}
