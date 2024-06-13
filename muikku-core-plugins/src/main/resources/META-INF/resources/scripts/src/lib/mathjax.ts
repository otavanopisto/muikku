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
};

export const MATHJAXSRC =
  "//cdn.jsdelivr.net/npm/mathjax@2.7.7/MathJax.js?config=TeX-MML-AM_SVG";

/**
 * loadMathJax
 */
export function loadMathJax() {
  console.log('LOAD MATHJAX CALLED!');
  const mathjaxScriptTag = document.querySelector(
    `script[src="${MATHJAXSRC}"]`
  );
  if (mathjaxScriptTag || (window as any).MathJax) {
    console.log('MATHJAX ALREADY PRESENT!');
    return;
  }
  console.log('LET US DO A MATHJAX SCRIPT!');
  const script = document.createElement("script");
  script.src = MATHJAXSRC;
  script.async = true;
  // eslint-disable-next-line
  script.onload = () => {
    console.log('MATHJAX SCRIPT ONLOAD!');
    (window as any).MathJax.Hub.Config(MATHJAXCONFIG);
    if (queue.length) {
      queue.forEach((q) => q());
      queue = [];
    }
  };
  document.head.appendChild(script);
}

/**
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
  if (!(window as any).MathJax) {
    console.log(element.outerHTML + ' TOSVG BUT QUEUED BECAUSE MATHJAX NOT YET AVAILABLE');
    queue.push(
      toSVG.bind(this, element, errorSrc, cb, placeholderSrc, placeholderCb)
    );
    return;
  }
  console.log(element.outerHTML + ' TOSVG');
  let formula = element.textContent || (element as HTMLImageElement).alt;
  // TODO Tässä jos formula on undefined niin kaatuu koko pasha
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
      console.log('BASE64 CODING...');
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
