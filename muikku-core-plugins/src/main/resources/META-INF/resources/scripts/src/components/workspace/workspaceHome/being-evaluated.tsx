import React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import { WorkspaceAssessmentState } from "~/generated/client/models/WorkspaceAssessmentState";
import { WorkspaceSubject } from "~/generated/client/models/WorkspaceSubject";
import { localize } from "~/locales/i18n";
import "~/sass/elements/workspace-assessment.scss";

/**
 * workspaceEvaluationPanelProps
 */
interface BeingEvaluatedPanelProps {
  workspaceIsBeingEvaluated: boolean;
}

/**
 * BeingEvaluatedPanel
 * @param props workspaceEvaluationPanelProps
 * @returns JSX.Element
 */
const BeingEvaluatedPanel = (props: BeingEvaluatedPanelProps) => {
  const { workspaceIsBeingEvaluated } = props;
  const { t } = useTranslation("workspace");

  if (!workspaceIsBeingEvaluated) {
    return null;
  }

  return (
    <div className="panel panel--workspace-evaluation">
      <div className="panel__header">
        <div
          className={`panel__header-icon panel__header-icon--workspace-evaluation STATE-unassessed`}
        >
          <span className="panel__header-icon-text">i</span>
        </div>

        <h2 className="panel__header-title">Arvioitavana</h2>
      </div>
      <div className="panel__body">
        <div
          className={`workspace-assessment workspace-assessment--unassessed workspace-assessment--workspace-panel`}
        >
          <div className="workspace-assessment__literal">
            <div className="workspace-assessment__literal-data">
              Työtilaa on arvioitavana. Tänä aikana työtilan materiaalit on
              käytettävissä vain lukutilassa.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspaceIsBeingEvaluated: state.workspaces.workspaceIsBeingEvaluated,
  };
}

export default connect(mapStateToProps)(BeingEvaluatedPanel);
