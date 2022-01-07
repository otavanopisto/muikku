/* eslint-disable @typescript-eslint/ban-types */

/**
 * Function type should be change to more specific type
 */

export function queueJax() {
  if ((window as any).MathJax) {
    (window as any).MathJax.Hub.Queue(["Typeset", (window as any).MathJax.Hub]);
  }
}

let queue: Array<Function> = [];

export const MATHJAXCONFIG = {
  jax: ["input/TeX", "output/SVG"],
  extensions: [
    "toMathML.js",
    "tex2jax.js",
    "MathMenu.js",
    "MathZoom.js",
    "fast-preview.js",
    "AssistiveMML.js",
  ],
  TeX: {
    extensions: [
      "AMSmath.js",
      "AMSsymbols.js",
      "noErrors.js",
      "noUndefined.js",
      "mhchem.js",
    ],
  },
  SVG: {
    useFontCache: true,
    useGlobalCache: false,
    EqnChunk: 1000000,
    EqnDelay: 0,
    font: "STIX-Web",
    scale: "80",
    lineBreaks: { automatic: true },
  },
};

export const MATHJAXSRC =
  "//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG";

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
  script.onload = () => {
    (window as any).MathJax.Hub.Config(MATHJAXCONFIG);
    if (queue.length) {
      queue.forEach((q) => q());
      queue = [];
    }
  };
  document.head.appendChild(script);
}

export function toSVG(
  element: HTMLElement,
  errorSrc: string,
  cb?: (element: HTMLImageElement) => any,
  placeholderSrc?: string,
  placeholderCb?: (element: HTMLImageElement) => any
) {
  if (!(window as any).MathJax) {
    queue.push(
      toSVG.bind(this, element, errorSrc, cb, placeholderSrc, placeholderCb)
    );
    return;
  }
  let formula = element.textContent || (element as HTMLImageElement).alt;
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
        window.btoa(decodeURIComponent(encodeURIComponent(mjOut.outerHTML)));
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

export function getMQInterface() {
  return (window as any).MathQuill.getInterface(2);
}
