import * as React from "react";
import AnimateHeight from "react-animate-height";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import WorkspaceAssignmentsAndDiaryDialog from "~/components/records/dialogs/workspace-assignments-and-diaries";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { Assessment, WorkspaceType } from "~/reducers/workspaces";
import ActivityIndicator from "../records-indicators/activity-indicator";
import AssessmentRequestIndicator from "../records-indicators/assessment-request-indicator";
import RecordsAssessmentIndicator from "../records-indicators/records-assessment-indicator";

/**
 * RecordsGroupItemProps
 */
interface RecordsGroupItemProps {
  i18n: i18nType;
  workspace: WorkspaceType;
  isCombinationWorkspace: boolean;
}

/**
 * RecordsGroupItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroupItem: React.FC<RecordsGroupItemProps> = (props) => {
  const { workspace, isCombinationWorkspace } = props;

  const [showE, setShowE] = React.useState(false);

  /**
   * getAssessmentData
   * @param assessment assessment
   */
  const getAssessmentData = (assessment: Assessment) => {
    let evalStateClassName = "";
    let evalStateIcon = "";
    let assessmentIsPending = null;
    let assessmentIsIncomplete = null;
    let assessmentIsUnassessed = null;

    switch (assessment.state) {
      case "pass":
        evalStateClassName = "workspace-assessment--passed";
        evalStateIcon = "icon-thumb-up";
        break;
      case "pending":
      case "pending_pass":
      case "pending_fail":
        evalStateClassName = "workspace-assessment--pending";
        evalStateIcon = "icon-assessment-pending";
        assessmentIsPending = true;
        break;
      case "fail":
        evalStateClassName = "workspace-assessment--failed";
        evalStateIcon = "icon-thumb-down";
        break;
      case "incomplete":
        evalStateClassName = "workspace-assessment--incomplete";
        evalStateIcon = "";
        assessmentIsIncomplete = true;
        break;
      case "unassessed":
        assessmentIsUnassessed = true;
    }

    const literalAssessment =
      assessment && assessment.text ? assessment.text : null;

    return {
      evalStateClassName,
      evalStateIcon,
      assessmentIsPending,
      assessmentIsUnassessed,
      assessmentIsIncomplete,
      literalAssessment,
    };
  };

  /**
   * Renders assessment information block per subject
   * @returns JSX.Element
   */
  const renderAssessmentsInformations = () => {
    const { i18n, workspace } = props;

    if (!workspace.activity) {
      return null;
    }

    return (
      <>
        {workspace.activity.assessmentState.map((a) => {
          const {
            evalStateClassName,
            evalStateIcon,
            assessmentIsPending,
            assessmentIsIncomplete,
            assessmentIsUnassessed,
            literalAssessment,
          } = getAssessmentData(a);

          /**
           * Find subject data, that contains basic information about that subject
           */
          const subjectData = workspace.subjects.find(
            (s) => s.identifier === a.workspaceSubjectIdentifier
          );

          /**
           * If not found, return nothing
           */
          if (!subjectData) {
            return;
          }

          const subjectCodeString = subjectData.subject
            ? `(${subjectData.subject.name.toUpperCase()}, ${subjectData.subject.code.toUpperCase()}${
                subjectData.courseNumber ? subjectData.courseNumber : ""
              })`
            : undefined;

          return !assessmentIsUnassessed && !assessmentIsPending ? (
            <div
              key={a.workspaceSubjectIdentifier}
              className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
            >
              <div
                className={`workspace-assessment__icon ${evalStateIcon}`}
              ></div>
              {subjectCodeString && (
                <div className="workspace-assessment__date">
                  <span className="workspace-assessment__date-data">
                    {subjectCodeString}
                  </span>
                </div>
              )}

              <div className="workspace-assessment__date">
                <span className="workspace-assessment__date-label">
                  {i18n.text.get(
                    "plugin.records.workspace.assessment.date.label"
                  )}
                  :
                </span>

                <span className="workspace-assessment__date-data">
                  {i18n.time.format(a.date)}
                </span>
              </div>
              <div className="workspace-assessment__grade">
                <span className="workspace-assessment__grade-label">
                  {i18n.text.get(
                    "plugin.records.workspace.assessment.grade.label"
                  )}
                  :
                </span>
                <span className="workspace-assessment__grade-data">
                  {assessmentIsIncomplete
                    ? i18n.text.get(
                        "plugin.records.workspace.assessment.grade.incomplete.data"
                      )
                    : a.grade}
                </span>
              </div>
              <div className="workspace-assessment__literal">
                <div className="workspace-assessment__literal-label">
                  {i18n.text.get(
                    "plugin.records.workspace.assessment.literal.label"
                  )}
                  :
                </div>
                <div
                  className="workspace-assessment__literal-data rich-text"
                  dangerouslySetInnerHTML={{ __html: literalAssessment }}
                ></div>
              </div>
            </div>
          ) : (
            <div
              key={a.workspaceSubjectIdentifier}
              className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
            >
              <div
                className={`workspace-assessment__icon ${evalStateIcon}`}
              ></div>
              <div className="workspace-assessment__date">
                <span className="workspace-assessment__date-label">
                  {i18n.text.get(
                    "plugin.records.workspace.assessment.date.label"
                  )}
                  :
                </span>
                <span className="workspace-assessment__date-data">
                  {i18n.time.format(a.date)}
                </span>
              </div>
              <div className="workspace-assessment__literal">
                <div className="workspace-assessment__literal-label">
                  {i18n.text.get(
                    "plugin.records.workspace.assessment.request.label"
                  )}
                  :
                </div>
                <div
                  className="workspace-assessment__literal-data rich-text"
                  dangerouslySetInnerHTML={{ __html: literalAssessment }}
                ></div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  /**
   * handleShowEvaluationClick
   */
  const handleShowEvaluationClick = () => {
    setShowE((showE) => !showE);
  };

  const animateOpen = showE ? "auto" : 0;

  return (
    <ApplicationListItem
      key={workspace.id}
      className="course course--studies"
      onClick={handleShowEvaluationClick}
    >
      <ApplicationListItemHeader
        key={workspace.id}
        modifiers={
          isCombinationWorkspace ? ["course", "combination-course"] : ["course"]
        }
      >
        <span className="application-list__header-icon icon-books"></span>
        <span className="application-list__header-primary">
          {workspace.name}{" "}
          {workspace.nameExtension ? `(${workspace.nameExtension})` : null}
        </span>
        <div className="application-list__header-secondary">
          <span>
            <WorkspaceAssignmentsAndDiaryDialog
              workspaceId={workspace.id}
              workspace={workspace}
            >
              <Button buttonModifiers="info">
                {props.i18n.text.get(
                  "plugin.records.assignmentsAndExercisesButton.label"
                )}
              </Button>
            </WorkspaceAssignmentsAndDiaryDialog>
          </span>

          {!isCombinationWorkspace ? (
            // So "legasy" case where there is only one module, render indicator etc next to workspace name
            <>
              <AssessmentRequestIndicator
                assessment={workspace.activity.assessmentState[0]}
              />
              <RecordsAssessmentIndicator
                assessment={workspace.activity.assessmentState[0]}
                isCombinationWorkspace={isCombinationWorkspace}
              />
            </>
          ) : null}
          <ActivityIndicator workspace={workspace} />
        </div>
      </ApplicationListItemHeader>

      {isCombinationWorkspace ? (
        // If combinatin workspace render module assessments below workspace name
        <ApplicationListItemContentContainer modifiers="combination-course">
          {workspace.activity.assessmentState.map((a) => {
            /**
             * Find subject data, that contains basic information about that subject
             */
            const subjectData = workspace.subjects.find(
              (s) => s.identifier === a.workspaceSubjectIdentifier
            );

            /**
             * If not found, return nothing
             */
            if (!subjectData) {
              return;
            }

            const codeSubjectString = `${subjectData.subject.code.toUpperCase()}${
              subjectData.courseNumber ? subjectData.courseNumber : ""
            } (${subjectData.courseLength} ${
              subjectData.courseLengthSymbol.symbol
            }) - ${subjectData.subject.name}`;

            return (
              <div
                key={a.workspaceSubjectIdentifier}
                className="application-list__item-content-single-item"
              >
                <span className="application-list__item-content-single-item-primary">
                  {codeSubjectString}
                </span>

                <AssessmentRequestIndicator assessment={a} />

                <RecordsAssessmentIndicator
                  assessment={a}
                  isCombinationWorkspace={isCombinationWorkspace}
                />
              </div>
            );
          })}
        </ApplicationListItemContentContainer>
      ) : null}
      <AnimateHeight height={animateOpen}>
        {renderAssessmentsInformations()}
      </AnimateHeight>
    </ApplicationListItem>
  );
};

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
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RecordsGroupItem);
