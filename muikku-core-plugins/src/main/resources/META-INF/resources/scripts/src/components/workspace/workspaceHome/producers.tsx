import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/producers.scss";

interface ProducersProps {
  workspace: WorkspaceType;
  i18n: i18nType;
}

interface ProducersState {}

class Producers extends React.Component<ProducersProps, ProducersState> {
  render() {
    if (
      !this.props.workspace ||
      !this.props.workspace.producers ||
      !this.props.workspace.producers.length
    ) {
      return null;
    }

    return (
      <div className="producers">
        <span className="producers__title">
          {this.props.i18n.text.get("plugin.workspace.index.producersLabel")}:
        </span>
        {this.props.workspace.producers.map((producer, index) => {
          let textForTheName = producer.name;
          if (index !== this.props.workspace.producers.length - 1) {
            textForTheName += ", ";
          }
          return (
            <span className="producers__item" key={"producer" + index}>
              {textForTheName}
            </span>
          );
        })}
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Producers);
