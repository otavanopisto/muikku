/* eslint-disable @typescript-eslint/ban-types */

/**
 * Function type should be change to more specific type
 */

/**
 * queueJax
 */
export function queueJax() {
  if ((window as any).MathJax) {
    (window as any).MathJax.Hub.Queue(["Typeset", (window as any).MathJax.Hub]);
  }
}

let queue: Array<Function> = [];

export const MATHJAXCONFIG = {
  TeX: {
    extensions: ["mhchem.js"],
  },
  SVG: {
    useFontCache: true,
    useGlobalCache: false,
    EqnChunk: 1000000,
    EqnDelay: 0,
    font: "STIX-Web",
    scale: "100",
    minScaleAdjust: "90",
    lineBreaks: { automatic: true },
  },
  showProcessingMessages: true,
  messageStyle: "normal",
  showMathMenu: true,
  menuSettings: {
    collapsible: false,
    autocollapse: false,
    explorer: false,
  },
  tex2jax: {
    inlineMath: [["\\(", "\\)"]],
  },
  mml2jax: {
    preview: "mathml",
  },
  skipStartupTypeset: true,
};

export const MATHJAXSRC =
  "//cdn.jsdelivr.net/npm/mathjax@2.7.7/MathJax.js?config=TeX-MML-AM_SVG";

/**
 * loadMathJax
 */
export function loadMathJax() {
  const mathjaxScriptTag = document.querySelector(
    `script[src="${MATHJAXSRC}"]`
  );
  if (mathjaxScriptTag || (window as any).MathJax) {
    return;
  }
  const script = document.createElement("script");
  script.src = MATHJAXSRC;
  script.async = true;
  // eslint-disable-next-line
  script.onload = () => {
    (window as any).MathJax.Hub.Config(MATHJAXCONFIG);
    if (queue.length) {
      queue.forEach((q) => q());
      queue = [];
    }
  };
  document.head.appendChild(script);
}

/**
 *
 * toSVG
 * @param element element
 * @param errorSrc errorSrc
 * @param cb cb
 * @param placeholderSrc placeholderSrc
 * @param placeholderCb placeholderCb
 */
export function toSVG(
  element: HTMLElement,
  errorSrc: string,
  cb?: (element: HTMLImageElement) => any,
  placeholderSrc?: string,
  placeholderCb?: (element: HTMLImageElement) => any
) {
  // Crummy duct tape fix to not bother with elements that are detached from DOM or are still to be lazy-loaded
  // Actual solution is to figure out why fields even go through a mount/unmount/mount cycle in materials
  if (!element || !element.isConnected || element.closest('div.material-lazy-loader-container')) {
    return;
  }
  if (!(window as any).MathJax) {
    queue.push(
      toSVG.bind(this, element, errorSrc, cb, placeholderSrc, placeholderCb)
    );
    return;
  }
  let formula = element.textContent || (element as HTMLImageElement).alt;
  // Apparently some elements coming to this method could have no content to render, so skip them
  if (!formula) {
    if (window.console) {
      console.error("Unable to render MathJax element " + element.outerHTML);
    }
    return;
  }
  if (!formula.startsWith("\\(")) {
    formula = "\\(" + formula + "\\)";
  }

  const container = document.createElement("div");
  container.textContent = formula.replace(/\\sum/g, "\\displaystyle\\sum");
  container.style.visibility = "hidden";
  document.body.appendChild(container);

  let actualUsedElementInTheDOM = element;
  const actualParentElement = element.parentElement;
  if (placeholderSrc && !(element as HTMLImageElement).src) {
    const placeholderImage = (element as HTMLImageElement).alt
      ? (element as HTMLImageElement)
      : document.createElement("img");
    placeholderImage.alt = formula;
    placeholderImage.className = element.className;
    placeholderImage.src = placeholderSrc;

    actualParentElement.replaceChild(placeholderImage, element);
    actualUsedElementInTheDOM = placeholderImage;

    placeholderCb && placeholderCb(placeholderImage);
  }
  (window as any).MathJax.Hub.Queue([
    "Typeset",
    (window as any).MathJax.Hub,
    container,
  ]);
  (window as any).MathJax.Hub.Queue(() => {
    document.body.removeChild(container);

    const mjOut = container.getElementsByTagName("svg")[0];
    const newImage = (element as HTMLImageElement).alt
      ? (element as HTMLImageElement)
      : document.createElement("img");
    newImage.alt = formula;
    newImage.className = element.className;

    if (mjOut) {
      mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      newImage.src =
        "data:image/svg+xml;base64," +
        window.btoa(unescape(encodeURIComponent(mjOut.outerHTML)));
    } else {
      newImage.src = errorSrc;
    }

    try {
      actualParentElement.replaceChild(newImage, actualUsedElementInTheDOM);
    } catch {
      // TODO there shouldn't be a try cactch here this is a bug
      // fix the bug properly later
    }

    cb && cb(newImage);
  });
}

/**
 * getMQInterface
 */
export function getMQInterface() {
  return (window as any).MathQuill.getInterface(2);
}
