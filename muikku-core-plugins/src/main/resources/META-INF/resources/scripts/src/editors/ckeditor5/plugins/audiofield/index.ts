import { Plugin } from "ckeditor5";
import AudioFieldEditing from "./audiofield-editing";
import AudioFieldUI from "./audiofield-ui";

/**
 * Audio field plugin
 */
export default class AudioField extends Plugin {
  /**
   * Requires the audio field editing and ui plugins
   */
  static get requires() {
    return [AudioFieldEditing, AudioFieldUI];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuAudioField";
  }
}
