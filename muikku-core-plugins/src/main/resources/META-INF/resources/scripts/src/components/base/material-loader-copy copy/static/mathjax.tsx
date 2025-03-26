import * as React from "react";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { MATHJAXSRC, MATHJAXCONFIG } from "~/lib/mathjax";
import MathjaxReactLoader from "./mathjax-react-loader";
import { WithTranslation, withTranslation } from "react-i18next";

const disableMathjax = localStorage.getItem("DISABLE_MATHJAX") === "true";

/**
 * MathJaxProps
 */
interface MathJaxProps extends WithTranslation {
  invisible?: boolean;
  children: React.ReactNode;
}

/**
 * MathJAX
 */
class MathJAX extends React.Component<MathJaxProps, Record<string, unknown>> {
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
    if (this.props.invisible) {
      return (
        <>
          <ReadspeakerMessage
            text={this.props.t("messages.assignment", {
              ns: "readSpeaker",
              context: "mathJax",
            })}
          />
          <span className="math-tex rs_skip_always">{this.props.children}</span>
        </>
      );
    }
    return (
      <>
        <ReadspeakerMessage
          text={this.props.t("messages.assignment", {
            ns: "readSpeaker",
            context: "mathJax",
          })}
        />
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

export default withTranslation(["workspace", "readSpeaker"])(MathJAX);
