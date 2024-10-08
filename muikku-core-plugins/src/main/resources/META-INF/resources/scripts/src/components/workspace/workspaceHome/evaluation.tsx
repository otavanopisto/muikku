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
  const notLoaded = !props.evaluation;
  const hasNoGrade =
    props.evaluation &&
    !props.evaluation.some(
      (e) => e.state === "pass" || e.state === "incomplete"
    );

  if (notLoaded || hasNoGrade) {
    return null;
  }

  const isCombinationWorkspace = props.subjects && props.subjects.length > 1;

  return (
    <>
      {props.evaluation.map((assessment, index) => {
        const { evalStateModifier, evalStateIcon, assessmentIsIncomplete } =
          getAssessmentVariables(props.evaluation[index]);

        if (assessment.state !== "pass" && assessment.state !== "incomplete") {
          return null;
        }
        return (
          <div
            key={assessment.date + index}
            className="panel panel--workspace-evaluation"
          >
            <div className="panel__header">
              <div
                className={`panel__header-icon panel__header-icon--workspace-evaluation ${
                  evalStateModifier ? "STATE-" + evalStateModifier : ""
                }  ${!isCombinationWorkspace ? evalStateIcon : ""}`}
              >
                {assessmentIsIncomplete && (
                  <>
                    <span
                      id={assessment.subject.identifier}
                      className="panel__header-icon-text"
                    >
                      T
                    </span>
                  </>
                )}
                {isCombinationWorkspace && (
                  <>
                    <label
                      htmlFor={assessment.subject.identifier}
                      className="visually-hidden"
                    >
                      {t("labels.grade")}
                    </label>
                    <span
                      id={assessment.subject.identifier}
                      className="panel__header-icon-text"
                    >
                      {assessment.grade}
                    </span>
                  </>
                )}
              </div>

              <h2 className="panel__header-title">
                {isCombinationWorkspace &&
                  props.subjects.find(
                    (subject) =>
                      subject.identifier === assessment.subject.identifier
                  ).subject.name + " "}

                {assessmentIsIncomplete
                  ? t("labels.evaluated", {
                      context: "incomplete",
                    })
                  : t("labels.evaluated", {
                      context: "in",
                      date: localize.date(assessment.date),
                    })}
              </h2>
            </div>
            <div className="panel__body">
              <div
                className={`workspace-assessment workspace-assessment--${evalStateModifier} workspace-assessment--workspace-panel`}
              >
                {assessment.text ? (
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
                      dangerouslySetInnerHTML={{
                        __html: assessment.text,
                      }}
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
      })}
    </>
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
