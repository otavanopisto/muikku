/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import { useMemo } from "react";
import katex from "katex";
import "mathlive";
import "katex/dist/katex.min.css";
import { MathJax } from "better-react-mathjax";

/**
 * MathRendererBaseProps
 */
interface MathRendererBaseProps {
  key?: number | string;
  invisible?: boolean;
  children: React.ReactNode;
}

/**
 * MathRendererProps
 */
interface MathRendererProps extends MathRendererBaseProps {
  engine?: "mathjax" | "katex" | "mathlive";
}

/**
 * MathRenderer
 * @param props props
 * @returns MathRenderer
 */
function MathRenderer(props: MathRendererProps) {
  const { engine } = props;
  switch (engine) {
    case "mathjax":
      return <MathJAX {...props} />;
    case "katex":
      return <Katex {...props} />;
    case "mathlive":
    default:
      return <MathLive {...props} />;
  }
}

export default MathRenderer;

/**
 * MathJAXProps
 */
interface MathJAXProps extends MathRendererBaseProps {}

/**
 * MathJAX
 * @param props props
 * @returns MathJAX
 */
function MathJAX(props: MathJAXProps) {
  const { invisible, children } = props;

  const unwrapped = useMemo(
    () => unwrapDelimiters(extractLatex(children).trim()),
    [children]
  );

  if (!unwrapped.latex) return null;

  if (invisible) {
    return <span className="math-tex rs_skip_always">{unwrapped.latex}</span>;
  }

  const wrapped =
    unwrapped.mode === "display"
      ? `\\[${unwrapped.latex}\\]`
      : `\\(${unwrapped.latex}\\)`;

  return (
    <MathJax key={props.key} dynamic inline={unwrapped.mode === "inline"}>
      <span className="math-tex rs_skip_always">{wrapped}</span>
    </MathJax>
  );
}

/**
 * KatexProps
 */
interface KatexProps extends MathRendererBaseProps {}

/**
 * Katex
 * @param props props
 * @returns Katex
 */
function Katex(props: KatexProps) {
  const { invisible, children } = props;
  const unwrapped = useMemo(
    () => unwrapDelimiters(extractLatex(children).trim()),
    [children]
  );
  if (!unwrapped.latex) return null;

  if (invisible) {
    return <span className="math-tex rs_skip_always">{unwrapped.latex}</span>;
  }

  const html = katex.renderToString(unwrapped.latex, {
    displayMode: unwrapped.mode === "display",
    throwOnError: false,
    strict: "warn",
  });
  return (
    <span
      className="math-tex rs_skip_always"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * MathLiveProps
 */
interface MathLiveProps extends MathRendererBaseProps {}

/**
 * MathLive
 * @param props props
 * @returns MathLive
 */
function MathLive(props: MathLiveProps) {
  const { invisible, children } = props;

  const unwrapped = useMemo(
    () => unwrapDelimiters(extractLatex(children).trim()),
    [children]
  );

  if (!unwrapped.latex) return null;
  const Tag =
    unwrapped.mode === "display"
      ? ("math-div" as const)
      : ("math-span" as const);
  // If you want to preserve your old “invisible” behavior later,
  // you can branch here (e.g. show plain LaTeX when invisible).
  if (invisible) {
    return <span className="math-tex rs_skip_always">{unwrapped.latex}</span>;
  }
  return <Tag className="math-tex rs_skip_always">{unwrapped.latex}</Tag>;
}

/**
 * extractLatex
 * @param children children
 * @returns string
 */
function extractLatex(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractLatex).join("");
  // If it’s a React element etc, you can choose to ignore or stringify
  return "";
}

/**
 * unwrapDelimiters
 * @param s s
 * @returns { latex: string; mode: "inline" | "display" }
 */
function unwrapDelimiters(s: string): {
  latex: string;
  mode: "inline" | "display";
} {
  const t = s.trim();
  if (t.startsWith("\\(") && t.endsWith("\\)")) {
    return { latex: t.slice(2, -2).trim(), mode: "inline" };
  }
  if (t.startsWith("\\[") && t.endsWith("\\]")) {
    return { latex: t.slice(2, -2).trim(), mode: "display" };
  }
  if (t.startsWith("$$") && t.endsWith("$$")) {
    return { latex: t.slice(2, -2).trim(), mode: "display" };
  }
  return { latex: t, mode: "inline" };
}
