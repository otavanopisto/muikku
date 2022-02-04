import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import Records from "./application/records";
import CurrentRecord from "./application/current-record";
// import Vops from './application/vops';
import Hops from "./application/hops";
import Summary from "./application/summary";
import YO from "./application/yo";
import { StateType } from "~/reducers";

/**
 * StudiesApplicationProps
 */
interface StudiesApplicationProps {
  aside: React.ReactElement<any>;
  i18n: i18nType;
}

/**
 * StudiesApplicationState
 */
interface StudiesApplicationState {}

/**
 * StudiesApplication
 */
class StudiesApplication extends React.Component<
  StudiesApplicationProps,
  StudiesApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: StudiesApplicationProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    const title = (
      <h1 className="application-panel__header-title">
        {this.props.i18n.text.get("plugin.records.pageTitle")}
      </h1>
    );
    return (
      <div className="application-panel-wrapper">
        <ApplicationPanel
          modifier="studies"
          title={title}
          asideBefore={this.props.aside}
        >
          <Records />
          <CurrentRecord />
          {/* Removed until it works <Vops/> */}
          <Hops />
          <Summary />
          <YO />
        </ApplicationPanel>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesApplication);
