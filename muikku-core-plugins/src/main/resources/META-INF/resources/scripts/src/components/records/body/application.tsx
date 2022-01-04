import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import Records from "./application/records";
import CurrentRecord from "./application/current-record";
// import Vops from './application/vops';
import Hops from "./application/hops";
import Summary from "./application/summary";
import YO from "./application/yo";
import { StateType } from "~/reducers";

interface StudiesApplicationProps {
  aside: React.ReactElement<any>;
  i18n: i18nType;
}

interface StudiesApplicationState {}

class StudiesApplication extends React.Component<
  StudiesApplicationProps,
  StudiesApplicationState
> {
  constructor(props: StudiesApplicationProps) {
    super(props);
  }

  render() {
    let title = (
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesApplication);
