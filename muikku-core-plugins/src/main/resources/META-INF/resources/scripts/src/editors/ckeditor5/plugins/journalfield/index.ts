import { Plugin } from "ckeditor5";
import JournalFieldEditing from "./journalfield-editing";
import JournalFieldUI from "./journalfield-ui";

/**
 * Journal field plugin
 */
export default class JournalField extends Plugin {
  /**
   * Requires the journal field editing and ui plugins
   */
  static get requires() {
    return [JournalFieldEditing, JournalFieldUI];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "JournalField";
  }
}
