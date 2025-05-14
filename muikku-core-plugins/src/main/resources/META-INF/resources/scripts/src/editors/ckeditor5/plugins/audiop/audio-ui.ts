import { Plugin, Dialog, ButtonView, uid } from "ckeditor5";
import AudioFormView from "./audio-form-view";

/**
 * Audio UI plugin
 */
export default class AudioUI extends Plugin {
  private _form: AudioFormView;
  private _dialog: Dialog;

  /**
   * Initialize the plugin
   */
  init() {
    // Make sure editor is available
    if (!this.editor) {
      throw new Error("Editor instance is not available in AudioUI");
    }

    // Create dialog if not exists
    this._dialog = this.editor.plugins.get("Dialog");

    // Create the form view instance
    this._form = this._createFormView();

    // Add the toolbar button
    this._addToolbarButton();

    // Set up click handling for existing audio
    this._setupClickListener();
  }

  /**
   * Creates and configures the toolbar button
   */
  private _addToolbarButton(): void {
    this.editor.ui.componentFactory.add("muikku-audio", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Audio",
        tooltip: true,
        withText: true,
      });

      // Show form when button is clicked
      button.on("execute", () => {
        this._showUI();
        //this._insertAudioPlaceholder();
      });

      return button;
    });
  }

  /**
   * Creates and configures the form view. Here is event handlers defined.
   * @returns Configured AudioFormView instance
   */
  private _createFormView(): AudioFormView {
    const editor = this.editor;
    const form = new AudioFormView(editor.locale);

    // Handle form submission
    form.listenTo(form, "submit", () => {
      const formData = form.getData();
      const audio = this._getSelectedAudio();

      editor.model.change((writer) => {
        // Update existing audio element
        if (audio) {
          const id = audio.getAttribute("id") as string;

          writer.setAttribute("id", id, audio);
          writer.setAttribute("src", formData.src, audio);
          writer.setAttribute("type", formData.audioType, audio);
          writer.setAttribute("controls", formData.controls, audio);
          writer.setAttribute("autoplay", formData.autoplay, audio);
          writer.setAttribute("loop", formData.loop, audio);
        }
        // Create new with defaults
        else {
          const id = `muikku-audio-${uid()}`;

          // Create new audio element
          const audio = writer.createElement("muikkuAudio", {
            id,
            src: formData.src || "",
            type: formData.audioType || "audio/mpeg",
            controls: formData.controls || "active",
            autoplay: formData.autoplay || false,
            loop: formData.loop || false,
          });

          editor.model.insertContent(audio);
        }
      });

      this._hideUI();
    });

    // Handle form cancellation
    form.on("cancel", () => {
      this._hideUI();
    });

    return form;
  }

  /**
   * Shows the form UI and populates it with data if editing existing field
   */
  private _showUI() {
    const audio = this._getSelectedAudio();

    if (audio) {
      // Editing existing field - populate form
      this._form.setData({
        src: (audio.getAttribute("src") as string) || "",
        autoplay: (audio.getAttribute("autoplay") as boolean) || false,
        loop: (audio.getAttribute("loop") as boolean) || false,
        audioType:
          (audio.getAttribute("type") as "audio/mpeg" | "audio/wav") ||
          "audio/mpeg",
        controls:
          (audio.getAttribute("controls") as "active" | "hidden") || "active",
      });
    } else {
      // Creating new field - clear form
      this._form.setData({
        src: "",
        autoplay: false,
        loop: false,
        audioType: "audio/mpeg",
        controls: "active",
      });
    }

    // Show dialog with the form
    this._dialog.show({
      id: "muikku-audio-dialog",
      title: "Audio Properties",
      content: this._form,
      actionButtons: [
        {
          label: "Cancel",
          withText: true,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onExecute: () => {
            // Fires the cancel event on the form
            this._form.fire("cancel");
          },
        },
        {
          label: "Save",
          withText: true,
          // eslint-disable-next-line jsdoc/require-jsdoc
          onExecute: () => {
            // Fires the submit event on the form
            this._form.fire("submit");
          },
        },
      ],
    });

    this._form.focus();
  }

  /**
   * Hides the form UI and resets it
   */
  private _hideUI() {
    this._dialog.hide();
    this._form.reset();
  }

  /**
   * Sets up click listener for existing text fields
   */
  private _setupClickListener() {
    this.editor.editing.view.document.on("click", (evt, data) => {
      const element = data.target;

      // Check if clicked element is a text field
      if (element.is("element", "img") && element.hasClass("muikku-audio")) {
        this._showUI();
      }
    });
  }

  /**
   * Gets the currently selected audio element if any
   * @returns Selected audio element or null
   */
  private _getSelectedAudio() {
    const selection = this.editor.model.document.selection;
    const selectedElement = selection.getSelectedElement();

    return selectedElement?.name === "muikkuAudio" ? selectedElement : null;
  }
}
