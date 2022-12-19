import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18nOLD";

import "~/sass/elements/producers.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ProducersProps
 */
interface ProducersProps extends WithTranslation<["common"]> {
  workspace: WorkspaceType;
  i18nOLD: i18nType;
}

/**
 * ProducersState
 */
interface ProducersState {}

/**
 * Producers
 */
class Producers extends React.Component<ProducersProps, ProducersState> {
  /**
   * render
   */
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
          {this.props.i18nOLD.text.get("plugin.workspace.index.producersLabel")}
          :
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(Producers)
);
