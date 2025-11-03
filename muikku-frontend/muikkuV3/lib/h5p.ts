/* eslint-disable @typescript-eslint/ban-types */

/**
 * Function type should be change to more specific type
 */

// Map actions to handlers
const actionHandlers: any = {};

/**
 * Prepare iframe resize.
 *
 * @private
 * @param {Object} iframe Element
 * @param {Object} data Payload
 * @param {Function} respond Send a response to the iframe
 */
actionHandlers.hello = (
  iframe: HTMLIFrameElement,
  data: any,
  respond: Function
) => {
  // Make iframe responsive
  iframe.style.width = "100%";

  // Bugfix for Chrome: Force update of iframe width. If this is not done the
  // document size may not be updated before the content resizes.
  iframe.getBoundingClientRect();

  /**
   * Tell iframe that it needs to resize when our window resizes
   */
  const resize = function () {
    if (iframe.contentWindow) {
      // Limit resize calls to avoid flickering
      respond("resize");
    } else {
      // Frame is gone, unregister.
      window.removeEventListener("resize", resize);
    }
  };
  window.addEventListener("resize", resize, false);

  // Respond to let the iframe know we can resize it
  respond("hello");
};

/**
 * Prepare iframe resize.
 *
 * @private
 * @param {Object} iframe Element
 * @param {Object} data Payload
 * @param {Function} respond Send a response to the iframe
 */
actionHandlers.prepareResize = (
  iframe: HTMLIFrameElement,
  data: any,
  respond: Function
) => {
  // Do not resize unless page and scrolling differs
  if (
    iframe.clientHeight !== data.scrollHeight ||
    data.scrollHeight !== data.clientHeight
  ) {
    // Reset iframe height, in case content has shrinked.
    iframe.style.height = data.clientHeight + "px";
    respond("resizePrepared");
  }
};

/**
 * Resize parent and iframe to desired height.
 *
 * @private
 * @param {Object} iframe Element
 * @param {Object} data Payload
 * @param {Function} respond Send a response to the iframe
 */
actionHandlers.resize = (iframe: HTMLIFrameElement, data: any) => {
  // Resize iframe so all content is visible. Use scrollHeight to make sure we get everything
  iframe.style.height = data.scrollHeight + "px";

  if (
    iframe.parentElement &&
    iframe.parentElement.classList.contains("material-page__iframe-wrapper")
  ) {
    iframe.parentElement.style.height = data.scrollHeight + "px";
  }
};

// Listen for messages from iframes
window.addEventListener(
  "message",
  (event) => {
    if (event.data.context !== "h5p") {
      return; // Only handle h5p requests.
    }

    // Find out who sent the message
    let iframe;
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      if (iframes[i].contentWindow === event.source) {
        iframe = iframes[i];
        break;
      }
    }

    if (!iframe) {
      return; // Cannot find sender
    }

    // Find action handler handler
    if (actionHandlers[event.data.action]) {
      actionHandlers[event.data.action](
        iframe,
        event.data,
        (action: string, data: any) => {
          if (data === undefined) {
            data = {};
          }
          data.action = action;
          data.context = "h5p";
          (event.source.postMessage as any)(data, event.origin);
        }
      );
    }
  },
  false
);

/**
 * Let h5p iframes know we're ready!
 * @param iframe iframe
 */
export function prepareH5POn(iframe: HTMLIFrameElement) {
  const ready = {
    context: "h5p",
    action: "ready",
  };
  if (iframe.src.indexOf("h5p") !== -1) {
    iframe.contentWindow.postMessage(ready, "*");
  }
}
