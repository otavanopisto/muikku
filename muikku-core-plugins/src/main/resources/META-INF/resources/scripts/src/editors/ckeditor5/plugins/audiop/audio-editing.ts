import { Plugin, uid, Widget } from "ckeditor5";
import placeholderImage from "./gfx/placeholder.png";

/**
 * Audio editing plugin
 */
export default class MuikkuAudioEditing extends Plugin {
  /**
   * Requires the widget plugin
   */
  static get requires() {
    return [Widget];
  }

  /**
   * Initializes the plugin
   */
  init() {
    if (!this.editor) {
      throw new Error("Editor instance is not available in MuikkuAudioEditing");
    }

    // Define the schema
    this._defineSchema();
    // Define the converters
    this._defineConverters();
  }

  /**
   * Defines the schema for the audio element
   */
  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("muikkuAudio", {
      isInline: true,
      allowWhere: "$text", // Can be placed wherever text is allowed
      allowAttributes: ["id", "src", "controls", "autoplay", "loop", "type"],
    });
  }

  /**
   * Defines the converters for the audio element
   */
  _defineConverters() {
    const conversion = this.editor.conversion;

    // Upcast converter (HTML to model)
    conversion.for("upcast").elementToElement({
      view: "audio",
      // eslint-disable-next-line jsdoc/require-jsdoc
      model: (viewElement, { writer: modelWriter }) => {
        const audioElement = viewElement;

        // Because Ckeditor 5 probably doesn't know what to do with source element,
        // it is included in the custom properties of the audio element.
        // We need to extract the content from the audio element manually.
        const rawContentArray = viewElement.getCustomProperties().next().value;

        if (!audioElement.is("element") || !rawContentArray[1]) {
          return;
        }

        // Create a temporary div to parse the HTML
        // and insert custom properties into it because it is html tags (at least in this case)
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = rawContentArray[1];

        const sourceElement = tempDiv.querySelector("source");

        return modelWriter.createElement("muikkuAudio", {
          id: audioElement.getAttribute("id") || `muikku-audio-${uid()}`,
          src: sourceElement.getAttribute("src"),
          controls:
            audioElement.getAttribute("controls") === "controls"
              ? "active"
              : "hidden",
          autoplay: audioElement.getAttribute("autoplay") === "autoplay",
          loop: audioElement.getAttribute("loop") === "loop",
          type: sourceElement.getAttribute("type"),
        });
      },
    });

    // Downcast converter (model to HTML)
    conversion.for("dataDowncast").elementToElement({
      model: "muikkuAudio",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) => {
        // Audio with default attributes
        const audio = viewWriter.createContainerElement("audio", {
          id: modelElement.getAttribute("id") || `muikku-audio-${uid()}`,
        });

        // Optional attributes, that are added to the audio element
        // if they are present in the model element and explicitly set to true
        if (modelElement.getAttribute("autoplay") === true) {
          audio._setAttribute("autoplay", "autoplay");
        }

        if (modelElement.getAttribute("loop") === true) {
          audio._setAttribute("loop", "loop");
        }

        if (modelElement.getAttribute("controls") === "active") {
          audio._setAttribute("controls", "controls");
        }

        // Source element
        const source = viewWriter.createContainerElement("source", {
          src: modelElement.getAttribute("src"),
          type: modelElement.getAttribute("type"),
        });

        viewWriter.insert(viewWriter.createPositionAt(audio, 0), source);

        return audio;
      },
    });

    // EditingDowncast remains the same (showing as img)
    conversion.for("editingDowncast").elementToElement({
      model: "muikkuAudio",
      // eslint-disable-next-line jsdoc/require-jsdoc
      view: (modelElement, { writer: viewWriter }) =>
        // Create the placeholder image element
        viewWriter.createEmptyElement("img", {
          src: placeholderImage,
          class: "muikku-audio",
          alt: "Audio",
          type: "application/vnd.muikku.field.audioEmbedded",
        }),
    });
  }
}
