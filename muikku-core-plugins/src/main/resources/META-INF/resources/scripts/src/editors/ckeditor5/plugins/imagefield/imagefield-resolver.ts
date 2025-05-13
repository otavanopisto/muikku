import {
  Plugin,
  DowncastConversionApi,
  DowncastAttributeEvent,
  EventInfo,
} from "ckeditor5";

/**
 * Image src resolver plugin
 */
export default class ImageSrcResolver extends Plugin {
  /**
   * Gets the plugin name
   */
  static get pluginName() {
    return "ImageSrcResolver";
  }

  /**
   * Init
   */
  init() {
    const editor = this.editor;
    const conversion = editor.conversion;
    const config = editor.config;

    const baseImageUrl =
      config.get("baseImageUrl") || "https://your-app.com/images/";

    const origin = window.location.origin;

    conversion.for("editingDowncast").add((dispatcher) => {
      /**
       * Sets the full src for the image
       * @param evt - The event info
       * @param data - The data
       * @param conversionApi - The conversion api
       */
      const setFullSrc = (
        evt: EventInfo,
        data: DowncastAttributeEvent["args"][0],
        conversionApi: DowncastConversionApi
      ) => {
        const viewWriter = conversionApi.writer;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const viewFigure = conversionApi.mapper.toViewElement(data.item as any);
        const viewImage = viewFigure.getChild(0);

        if (!viewImage.is("element")) {
          return;
        }

        const originalSrc = data.attributeNewValue;

        let newSrc = null;

        // If the src is a relative path, modify it
        if (originalSrc && !/^https?:\/\//.test(originalSrc as string)) {
          newSrc = origin + baseImageUrl + originalSrc;
        }

        viewWriter.setAttribute("src", newSrc, viewImage);
        viewWriter.setAttribute("alt", "Image Field 1", viewImage);
      };

      // Set listener for image block and inline models and specifically for the src attribute
      // Priority is set to low to ensure it is processed after the image is created and any
      // default converters have run
      dispatcher.on("attribute:src:imageBlock", setFullSrc, {
        priority: "low",
      });
      dispatcher.on("attribute:src:imageInline", setFullSrc, {
        priority: "low",
      });
    });
  }
}
