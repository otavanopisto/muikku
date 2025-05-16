import { Plugin, Dialog } from "ckeditor5";
import DivBlockEditing from "./divblock-editing";
import DivBlockUI from "./divblock-ui";

/**
 * Divblock plugin
 */
export default class DivBlock extends Plugin {
  /**
   * Requires the divblock editing and ui plugins
   */
  static get requires() {
    return [DivBlockUI, DivBlockEditing, Dialog];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuDivBlock";
  }
}
