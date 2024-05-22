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
interface workspaceEvaluationPanelProps {
  evaluation: WorkspaceAssessmentState[];
  subjects: WorkspaceSubject[];
}

/**
 * Gets assessment variables on request for a component
 * @param assessment state of the assessment
 * @returns an object with assessment variables
 */
const getAssessmentVariables = (assessment: WorkspaceAssessmentState) => {
  let evalStateModifier = "";
  let evalStateIcon = "";
  let assessmentIsIncomplete = false;

  switch (assessment.state) {
    case "pass":
      evalStateModifier = "passed";
      evalStateIcon = "icon-thumb-up";
      break;
    case "incomplete":
      evalStateModifier = "incomplete";
      assessmentIsIncomplete = true;
      break;
  }

  return { evalStateModifier, evalStateIcon, assessmentIsIncomplete };
};

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

  // const isCombinationWorkspace = props.subjects && props.subjects.length > 1;

  const { evalStateModifier, evalStateIcon, assessmentIsIncomplete } =
    getAssessmentVariables(props.evaluation[0]);

  /**
   * getAssessmentData
   * @param assessment assessment
   */

  return (
    <div className="panel panel--workspace-evaluation">
      <div className="panel__header">
        <div
          className={`panel__header-icon panel__header-icon--workspace-evaluation ${
            evalStateModifier ? "STATE-" + evalStateModifier : ""
          }  ${evalStateIcon}`}
        >
          {assessmentIsIncomplete && (
            <span className="panel__header-icon-text">T</span>
          )}
        </div>
        <h2 className="panel__header-title">
          {assessmentIsIncomplete
            ? t("labels.evaluated", {
                context: "incomplete",
              })
            : t("labels.evaluated", {
                context: "in",
                date: localize.date(props.evaluation[0]?.date),
              })}
        </h2>
      </div>
      <div className="panel__body">
        <div
          className={`workspace-assessment workspace-assessment--${evalStateModifier} workspace-assessment--workspace-panel`}
        >
          {props.evaluation[0]?.text ? (
            <div className="workspace-assessment__literal">
              <div className="workspace-assessment__literal-label">
                {t("labels.evaluation", {
                  ns: "evaluation",
                  context: "literal",
                })}
                :
              </div>
              <div
                className="workspace-assessment__literal-data"
                dangerouslySetInnerHTML={{ __html: props.evaluation[0]?.text }}
              ></div>
            </div>
          ) : (
            <div className="empty">
              {t("content.empty", {
                ns: "evaluation",
              })}
            </div>
          )}
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
    subjects: state.workspaces.currentWorkspace?.additionalInfo?.subjects,
  };
}

export default connect(mapStateToProps)(WorkspaceEvaluationPanel);
