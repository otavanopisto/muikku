/**
 * The ConnectField plugin for CKEditor 5.
 *
 * This plugin allows users to create and manage connection fields in the editor,
 * where users can create matching pairs of items that can be connected.
 *
 * @module connectfield/connectfield
 */

import { Plugin, Dialog } from "ckeditor5";
import { ConnectFieldEditing } from "./connectfield-editing";
import { ConnectFieldUI } from "./connectfield-ui";

/**
 * The main plugin class that integrates the Connect Field feature with the editor.
 * It loads the editing and UI components of the feature.
 */
export default class ConnectField extends Plugin {
  /**
   * Required plugins for the Connect Field feature.
   */
  static get requires() {
    return [ConnectFieldEditing, ConnectFieldUI, Dialog];
  }

  /**
   * The plugin name used for identification in the editor.
   */
  static get pluginName() {
    return "MuikkuConnectField";
  }
}
