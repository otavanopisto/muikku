function actualDoProcess(){
  (window as any).MathJax.Hub.Queue(["Typeset",(window as any).MathJax.Hub]);
}

let queue:Array<Function> = [];

export function loadMathJax(triggerOnLoad: boolean){
  if  ((window as any).MathJax){
    return;
  }
  let script = document.createElement('script');
  script.src = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_SVG';
  script.onload = ()=>{
    (window as any).MathJax.Hub.Config({
      jax: ["input/TeX", "output/SVG"],
      extensions: ["toMathML.js", "tex2jax.js", "MathMenu.js", "MathZoom.js", "fast-preview.js", "AssistiveMML.js"],
      TeX: {
        extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js", "mhchem.js"]
      },
      SVG: {useFontCache: true, useGlobalCache: false, EqnChunk: 1000000, EqnDelay: 0, font: 'STIX-Web'}
    });
    if (queue.length){
      queue.forEach(q=>q());
      queue = [];
    }
    if (triggerOnLoad){
      processMathInPage();
    }
  }
  document.head.appendChild(script);
}

export function processMathInPage(){
  if ((window as any).MathJax){
    actualDoProcess();
  } else {
    loadMathJax(true);
  }
}

export function toSVG(element: HTMLImageElement){
  if (!(window as any).MathJax){
    queue.push(toSVG.bind(this, element));
    return;
  }
  let container = document.createElement('div');
  container.innerHTML = element.alt;
  (window as any).MathJax.Hub.Queue(["Typeset", (window as any).MathJax.Hub, container]);
  (window as any).MathJax.Hub.Queue(()=>{
    let mjOut = container.getElementsByTagName("svg")[0];
    mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    element.src = 'data:image/svg+xml;base64,' + window.btoa(decodeURIComponent(encodeURIComponent(mjOut.outerHTML)));
  });
}