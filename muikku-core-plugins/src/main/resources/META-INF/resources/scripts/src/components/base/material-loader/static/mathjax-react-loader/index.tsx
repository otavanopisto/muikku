import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { MathJaxCollector } from "./mathjax-collector";

const baseConfig = {
  showMathMenu: true,
  menuSettings: {
    collapsible: true,
    autocollapse: false,
    explorer: true,
  },
  tex2jax: {
    inlineMath: [["\\(", "\\)"]],
  },
  mml2jax: {
    preview: "mathml",
  },
  skipStartupTypeset: true,
};

/**
 * MathJaxPreviewProps
 */
interface MathJaxPreviewProps {
  script: string;
  config: any;
  className?: string;
  math: React.ReactNode;
  style?: any;
  parentCollectorSelector: string;
}

/**
 * MathjaxReactLoader
 * @param props props
 */
const MathjaxReactLoader = (props: MathJaxPreviewProps) => {
  const { script, config, className, math, style } = { ...props };
  const previewRef = useRef<HTMLDivElement>();
  const [loadingState, setLoadingState] = useState(
    (window as any).MathJax ? "loaded" : "loading"
  );

  useEffect(() => {
    let mathjaxScriptTag: HTMLScriptElement = document.querySelector(
      `script[src="${script}"]`
    );
    if (!mathjaxScriptTag) {
      mathjaxScriptTag = document.createElement("script");
      mathjaxScriptTag.async = true;
      mathjaxScriptTag.src = script;

      for (const [k, v] of Object.entries(config || {})) {
        mathjaxScriptTag.setAttribute(k, v as any);
      }
      const node = document.head || document.getElementsByTagName("head")[0];
      node.appendChild(mathjaxScriptTag);
    }

    /**
     * onloadHandler
     */
    const onloadHandler = () => {
      setLoadingState("loaded");
      (window as any).MathJax.Hub.Config({ ...baseConfig, ...config });
    };

    /**
     * onerrorHandler
     */
    const onerrorHandler = () => {
      setLoadingState("failed");
    };

    mathjaxScriptTag.addEventListener("load", onloadHandler);
    mathjaxScriptTag.addEventListener("error", onerrorHandler);

    return () => {
      mathjaxScriptTag.removeEventListener("load", onloadHandler);
      mathjaxScriptTag.removeEventListener("error", onloadHandler);
    };
  }, [setLoadingState, config, baseConfig]);

  useEffect(() => {
    if (loadingState !== "loaded") {
      return;
    }
    const closestAncestor: HTMLElement =
      previewRef.current.closest(props.parentCollectorSelector) ||
      previewRef.current;
    const collector = MathJaxCollector.getCollectorForNode(closestAncestor);
    collector.resetTimer();
  }, [loadingState, previewRef]);

  return (
    <span className={className} style={style}>
      {loadingState === "failed" && <span>failed loading mathjax lib</span>}
      <span
        className="mathjax-preview-result"
        id="react-mathjax-preview-result"
        ref={previewRef}
      >
        {props.math}
      </span>
    </span>
  );
};

export default MathjaxReactLoader;
