import { Plugin, Dialog } from "ckeditor5";
import SorterFieldEditing from "./sorterfield-editing";
import SorterFieldUI from "./sorterfield-ui";

/**
 * SorterField plugin
 */
export default class SorterField extends Plugin {
  /**
   * Requires the sorterfield editing and ui plugins
   */
  static get requires() {
    return [SorterFieldEditing, SorterFieldUI, Dialog];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuSorterField";
  }
}
