import * as React from "react";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { MATHJAXSRC, MATHJAXCONFIG } from "~/lib/mathjax";
import MathjaxReactLoader from "./mathjax-react-loader";

const disableMathjax = localStorage.getItem("DISABLE_MATHJAX") === "true";

/**
 * MathJaxProps
 */
interface MathJaxProps {
  invisible?: boolean;
  children: React.ReactNode;
}

/**
 * MathJAX
 */
export default class MathJAX extends React.Component<
  MathJaxProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MathJaxProps) {
    super(props);
  }

  /**
   * shouldComponentUpdate
   * @param nextProps nextProps
   */
  public shouldComponentUpdate(nextProps: MathJaxProps) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.invisible !== this.props.invisible
    );
  }

  /**
   * render
   */
  render() {
    if (disableMathjax) {
      return null;
    }
    //TODO remove the data-muikku-word-definition thing, it's basically used for styling alone
    if (this.props.invisible) {
      return (
        <>
          {/* TODO: lokalisointi*/}
          <ReadspeakerMessage text="Matematiikkakaava" />
          <span className="math-tex rs_skip_always">{this.props.children}</span>
        </>
      );
    }
    return (
      <>
        {/* TODO: lokalisointi*/}
        <ReadspeakerMessage text="Matematiikkakaava" />
        <span className="math-tex rs_skip_always">
          <MathjaxReactLoader
            script={MATHJAXSRC}
            config={MATHJAXCONFIG}
            math={this.props.children}
            parentCollectorSelector=".material-page"
          />
        </span>
      </>
    );
  }
}

/**
 * StrMathJAX
 * @param props props
 * @param props.children children
 * @param props.invisible invisible
 * @param props.html html
 */
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
