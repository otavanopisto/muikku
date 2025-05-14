import { Plugin } from "ckeditor5";
import AudioEditing from "./audio-editing";
import AudioUI from "./audio-ui";

/**
 * File field plugin
 */
export default class MuikkuAudio extends Plugin {
  /**
   * Requires the file field editing and ui plugins
   */
  static get requires() {
    return [AudioEditing, AudioUI];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuAudio";
  }
}
