import React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import { WorkspaceAssessmentState } from "~/generated/client/models/WorkspaceAssessmentState";

/**
 * workspaceEvaluationPanelProps
 */
interface workspaceEvaluationPanelProps {
  evaluation: WorkspaceAssessmentState[];
}

/**
 * WorkspaceEvaluationPanel
 * @param props workspaceEvaluationPanelProps
 * @returns JSX.Element
 */
const WorkspaceEvaluationPanel = (props: workspaceEvaluationPanelProps) => {
  const { t } = useTranslation("workspace");

  if (!props.evaluation || props.evaluation.length === 0) {
    return null;
  }

  return (
    <div className="panel panel--workspace-evaluation">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--workspace-evaluation icon-star"></div>
        <h2 className="panel__header-title">Evaluation</h2>
      </div>
      <div className="panel__body">
        <div className="workspace-evaluation">
          <div className="workspace-evaluation__grade">
            <span className="workspace-evaluation__grade-label">Grade:</span>
            <span className="workspace-evaluation__grade-value">
              {props.evaluation[0]?.grade}
            </span>
          </div>
          {props.evaluation[0]?.text && (
            <div className="workspace-evaluation__text">
              <span className="workspace-evaluation__text-label">Text:</span>
              <span className="workspace-evaluation__text-value">
                {props.evaluation[0]?.text}
              </span>
            </div>
          )}
          <div className="workspace-evaluation__date">
            <span className="workspace-evaluation__date-label">Date:</span>
            <span className="workspace-evaluation__date-value">
              {props.evaluation[0]?.date}
            </span>
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
    evaluation: state.workspaces.currentWorkspace?.activity?.assessmentStates,
  };
}

export default connect(mapStateToProps)(WorkspaceEvaluationPanel);
