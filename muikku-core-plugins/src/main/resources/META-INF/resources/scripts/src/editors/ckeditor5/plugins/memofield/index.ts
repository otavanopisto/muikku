import { Plugin, Dialog } from "ckeditor5";
import MemoFieldEditing from "./memofield-editing";
import MemoFieldUI from "./memofield-ui";

/**
 * Memo field plugin
 */
export default class MemoField extends Plugin {
  /**
   * Requires the memo field editing and ui plugins
   */
  static get requires() {
    return [MemoFieldEditing, MemoFieldUI, Dialog];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuMemoField";
  }
}
