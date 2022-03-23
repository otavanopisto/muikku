import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/message.scss";
import { RecordsType } from "~/reducers/main-function/records";
import HopsGraph from "~/components/base/hops_editable";
import { SetHopsToTriggerType, setHopsTo } from "~/actions/main-function/hops";
import { bindActionCreators } from "redux";
import { HOPSDataType, HOPSType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import CompulsoryEducationHopsWizard from "../../hops-compulsory-education-wizard";
import { AnyActionType } from "~/actions";

/**
 * HopsProps
 */
interface HopsProps {
  i18n: i18nType;
  records: RecordsType;
  hops: HOPSType;
  setHopsTo: SetHopsToTriggerType;
}

/**
 * HopsState
 */
interface HopsState {}

/**
 * Hops
 */
class Hops extends React.Component<HopsProps, HopsState> {
  timeout: NodeJS.Timer;

  /**
   * constructor
   * @param props props
   */
  constructor(props: HopsProps) {
    super(props);

    this.setHopsToWithDelay = this.setHopsToWithDelay.bind(this);
  }

  /**
   * setHopsToWithDelay
   * @param hops hops
   */
  setHopsToWithDelay(hops: HOPSDataType) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(
      this.props.setHopsTo.bind(null, hops),
      1000
    ) as any;
  }

  /**
   * renderUpperSecondaryHops
   * @returns JSX.Element
   */
  renderUpperSecondaryHops = () => (
    <section>
      <h2 className="application-panel__content-header">
        {this.props.i18n.text.get("plugin.records.hops.title")}
      </h2>
      <HopsGraph onHopsChange={this.setHopsToWithDelay} />
    </section>
  );

  /**
   * renderHops
   * @returns JSX.Element
   */
  renderHops = () => {
    if (
      this.props.hops.hopsPhase === undefined ||
      this.props.hops.hopsPhase === "0"
    ) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100px",
            fontSize: "2rem",
            fontStyle: "italic",
          }}
        >
          Hopsia ei ole aktivoitu ohjaajan toimesta!
        </div>
      );
    }

    return (
      <CompulsoryEducationHopsWizard
        phase={parseInt(this.props.hops.hopsPhase)}
        user="student"
        disabled={false}
        superVisorModifies={false}
      />
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (this.props.records.location !== "hops") {
      return null;
    } else if (this.props.hops.status === "ERROR") {
      // TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      // message but here we got to put something
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    } else if (this.props.hops.status !== "READY") {
      return null;
    }

    if (
      this.props.hops.eligibility &&
      this.props.hops.eligibility.upperSecondarySchoolCurriculum === true
    ) {
      return this.renderUpperSecondaryHops();
    }

    return this.renderHops();
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: (state as any).records,
    hops: state.hops,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ setHopsTo }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Hops);
