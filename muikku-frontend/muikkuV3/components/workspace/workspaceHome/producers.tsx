import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import "~/sass/elements/producers.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ProducersProps
 */
interface ProducersProps extends WithTranslation {
  workspace: WorkspaceDataType;
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
    const { t } = this.props;

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
          {t("labels.producers", { ns: "workspace" })}:
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
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(Producers)
);
