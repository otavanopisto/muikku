function actualDoProcess(){
  (window as any).MathJax.Hub.Config({
    "HTML-CSS": {
      scale: 90
    },
    NativeMML: {
      scale: 90
    }
  });
  (window as any).MathJax.Hub.Queue(["Typeset",(window as any).MathJax.Hub]);
}

export function loadMathJax(triggerOnLoad: boolean){
  if  ((window as any).MathJax){
    return;
  }
  let script = document.createElement('script');
  script.src = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML';
  script.onload = ()=>{
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