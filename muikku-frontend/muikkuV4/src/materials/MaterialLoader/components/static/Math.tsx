import { useMemo } from "react";
import "mathlive";

/**
 * MathRendererBaseProps
 */
interface MathRendererBaseProps {
  mode: "inline" | "display";
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
function MathJAX(_props: MathJAXProps) {
  return <div>MathJAX</div>;
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
function Katex(_props: KatexProps) {
  return <div>Katex</div>;
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
  const { mode, invisible, children } = props;
  // Register MathLive custom elements on the client
  /* useEffect(() => {
    // This registers <math-span> and <math-div>
    import("mathlive");
  }, []); */

  const latex = useMemo(() => extractLatex(children).trim(), [children]);

  if (!latex) return null;
  const Tag =
    mode === "display" ? ("math-div" as const) : ("math-span" as const);
  // If you want to preserve your old “invisible” behavior later,
  // you can branch here (e.g. show plain LaTeX when invisible).
  if (invisible) {
    return <span className="math-tex rs_skip_always">{latex}</span>;
  }
  return <Tag className="math-tex rs_skip_always">{latex}</Tag>;
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
