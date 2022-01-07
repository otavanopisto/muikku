import * as React from "react";
import { MATHJAXSRC, MATHJAXCONFIG } from "~/lib/mathjax";
import MathjaxReactLoader from "./mathjax-react-loader";

const disableMathjax = localStorage.getItem("DISABLE_MATHJAX") === "true";

interface MathJaxProps {
  invisible?: boolean;
  children: React.ReactNode;
}

export default class MathJAX extends React.Component<
  MathJaxProps,
  Record<string, unknown>
> {
  constructor(props: MathJaxProps) {
    super(props);
  }
  public shouldComponentUpdate(nextProps: MathJaxProps) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.invisible !== this.props.invisible
    );
  }
  render() {
    if (disableMathjax) {
      return null;
    }
    //TODO remove the data-muikku-word-definition thing, it's basically used for styling alone
    if (this.props.invisible) {
      return <span className="math-tex">{this.props.children}</span>;
    }
    return (
      <span className="math-tex">
        <MathjaxReactLoader
          script={MATHJAXSRC}
          config={MATHJAXCONFIG}
          math={this.props.children}
          parentCollectorSelector=".material-page"
        />
      </span>
    );
  }
}

export function StrMathJAX(props: {
  children: string;
  invisible?: boolean;
  html?: boolean;
}) {
  if (!props.children || typeof props.children !== "string") {
    return null;
  }
  const trimmed = props.children.trim();
  if (trimmed.indexOf("`") === 0 || trimmed.indexOf("\\(") === 0) {
    return <MathJAX invisible={props.invisible}>{props.children}</MathJAX>;
  }
  if (props.html) {
    return <span dangerouslySetInnerHTML={{ __html: trimmed }} />;
  }

  return <>{trimmed}</>;
}
