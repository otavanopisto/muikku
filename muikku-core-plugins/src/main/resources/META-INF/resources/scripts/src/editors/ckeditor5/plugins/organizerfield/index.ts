import { Plugin, Dialog } from "ckeditor5";
import OrganizerFieldEditing from "./organizerfield-editing";
import OrganizerFieldUI from "./organizerfield-ui";

/**
 * Organizer field plugin
 * @module muikku-organizerfield
 */
export default class OrganizerField extends Plugin {
  /**
   * Requires the organizer field editing and ui plugins
   */
  static get requires() {
    return [OrganizerFieldEditing, OrganizerFieldUI, Dialog];
  }

  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "MuikkuOrganizerField";
  }
}
