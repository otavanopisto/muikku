import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import WorkspaceAssignmentsAndDiaryDialog from "~/components/general/records-history/dialogs/workspace-assignments-and-diaries";
import { localize } from "~/locales/i18n";
import AssessmentRequestIndicator from "./assessment-request-indicator";
import RecordsAssessmentIndicator from "./records-assessment-indicator";
import ActivityIndicator from "./activity-indicator";
import { RecordWorkspaceActivityByLine } from "./types";
import { useRecordsInfoContext } from "./context/records-info-context";
import { getAssessmentData } from "~/helper-functions/shared";
import { useWorkspaceAssignmentInfo } from "~/hooks/useWorkspaceAssignmentInfo";
import AssignmentDetails from "~/components/general/assignment-info-details";

/**
 * RecordsGroupItemProps
 */
interface RecordsGroupItemProps {
  credit: RecordWorkspaceActivityByLine;
  isCombinationWorkspace: boolean;
}

/**
 * RecordsGroupItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroupItem: React.FC<RecordsGroupItemProps> = (props) => {
  const { credit, isCombinationWorkspace } = props;

  const { identifier, userEntityId, displayNotification } =
    useRecordsInfoContext();

  const { t } = useTranslation([
    "studies",
    "evaluation",
    "materials",
    "workspace",
    "common",
  ]);

  const [showE, setShowE] = React.useState(false);

  const { assignmentInfo, assignmentInfoLoading } = useWorkspaceAssignmentInfo({
    workspaceId: credit.activity.id,
    userEntityId,
    enabled: showE, // Only load data when expanded
    displayNotification,
  });

  /**
   * Renders assessment information block per subject
   * @returns JSX.Element
   */
  const renderAssessmentsInformations = () => {
    const { credit } = props;

    return (
      <>
        {credit.activity.assessmentStates.map((a, i) => {
          const {
            evalStateClassName,
            evalStateIcon,
            assessmentIsPending,
            assessmentIsIncomplete,
            assessmentIsUnassessed,
            literalAssessment,
            assessmentIsInterim,
          } = getAssessmentData(a);

          // Find subject data, that contains basic information about that subject
          const subjectData = credit.activity.subjects.find(
            (s) => s.identifier === a.subject.identifier
          );

          // If not found, return nothing
          if (!subjectData) {
            return null;
          }

          const subjectCodeString = `(${subjectData.subjectName}, ${
            subjectData.subjectCode ? subjectData.subjectCode : ""
          }${subjectData.courseNumber ? subjectData.courseNumber : ""})`;

          // Interim assessments use same style as reqular assessment requests
          // Only changing factor is whether is it pending or not and its indicated by
          // label "Interim evaluation request" or "Interim evaluation"
          if (assessmentIsInterim) {
            return (
              <div
                key={subjectData.identifier}
                className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
              >
                <div
                  className={`workspace-assessment__icon ${evalStateIcon}`}
                ></div>
                <div className="workspace-assessment__date">
                  <span className="workspace-assessment__date-label">
                    {t("labels.date")}:
                  </span>
                  <span className="workspace-assessment__date-data">
                    {localize.date(a.date)}
                  </span>
                </div>
                <div className="workspace-assessment__literal">
                  <div className="workspace-assessment__literal-label">
                    {assessmentIsPending
                      ? t("labels.interimEvaluationRequest", {
                          ns: "evaluation",
                        })
                      : t("labels.interimEvaluation", {
                          ns: "materials",
                        })}
                    :
                  </div>
                  <div
                    className="workspace-assessment__literal-data rich-text"
                    dangerouslySetInnerHTML={{ __html: literalAssessment }}
                  ></div>
                </div>
              </div>
            );
          }
          // Else block only happens for regular workspace assessments
          else {
            if (
              !assessmentIsUnassessed &&
              !assessmentIsPending &&
              !assessmentIsInterim
            ) {
              return (
                <div key={subjectData.identifier}>
                  {/*
                   * If it's first assessment element, show loader until assignment info is loaded and then show assignment details if available
                   * This is to avoid showing multiple assignment details components as one assignment details is for whole workspace
                   */}
                  {i === 0 && assignmentInfoLoading && (
                    <div className="loader-empty" />
                  )}
                  {i === 0 && assignmentInfo.length > 0 && (
                    <div className="form__row">
                      <AssignmentDetails assignmentInfoList={assignmentInfo} />
                    </div>
                  )}
                  <div
                    className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
                  >
                    <div
                      className={`workspace-assessment__icon ${evalStateIcon}`}
                    ></div>
                    <div className="workspace-assessment__subject">
                      <span className="workspace-assessment__subject-data">
                        {subjectCodeString}
                      </span>
                    </div>

                    <div className="workspace-assessment__date">
                      <span className="workspace-assessment__date-label">
                        {t("labels.date")}:
                      </span>

                      <span className="workspace-assessment__date-data">
                        {localize.date(a.date)}
                      </span>
                    </div>
                    <div className="workspace-assessment__grade">
                      <span className="workspace-assessment__grade-label">
                        {t("labels.grade", {
                          ns: "workspace",
                        })}
                        :
                      </span>
                      <span className="workspace-assessment__grade-data">
                        {assessmentIsIncomplete
                          ? t("labels.incomplete", {
                              ns: "workspace",
                            })
                          : a.grade}
                      </span>
                    </div>

                    <div className="workspace-assessment__literal">
                      <div className="workspace-assessment__literal-label">
                        {t("labels.evaluation", {
                          ns: "evaluation",
                          context: "literal",
                        })}
                        :
                      </div>
                      <div
                        className="workspace-assessment__literal-data rich-text"
                        dangerouslySetInnerHTML={{ __html: literalAssessment }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={subjectData.identifier}
                  className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
                >
                  <div
                    className={`workspace-assessment__icon ${evalStateIcon}`}
                  ></div>
                  <div className="workspace-assessment__date">
                    <span className="workspace-assessment__date-label">
                      {t("labels.date")}:
                    </span>
                    <span className="workspace-assessment__date-data">
                      {localize.date(a.date)}
                    </span>
                  </div>
                  <div className="workspace-assessment__literal">
                    <div className="workspace-assessment__literal-label">
                      {t("labels.evaluationRequest", {
                        ns: "evaluation",
                      })}
                      :
                    </div>
                    <div
                      className="workspace-assessment__literal-data rich-text"
                      dangerouslySetInnerHTML={{ __html: literalAssessment }}
                    ></div>
                  </div>
                </div>
              );
            }
          }
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

  /**
   * handleMaterialKeyUp
   * @param e e
   */
  const handleShowEvaluationKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowE((showE) => !showE);
    }
  };

  const animateOpen = showE ? "auto" : 0;

  return (
    <ApplicationListItem className="course course--studies" tabIndex={-1}>
      <ApplicationListItemHeader
        modifiers={
          isCombinationWorkspace ? ["course", "combination-course"] : ["course"]
        }
        onClick={handleShowEvaluationClick}
        onKeyDown={handleShowEvaluationKeyDown}
        role="button"
        aria-label={
          showE
            ? t("wcag.collapseRecordInfo", {
                ns: "studies",
              })
            : t("wcag.expandRecordInfo", {
                ns: "studies",
              })
        }
        aria-expanded={showE}
        aria-controls={"record" + credit.activity.id}
        tabIndex={0}
      >
        <span className="application-list__header-icon icon-books"></span>
        <div className="application-list__header-primary">
          <div className="application-list__header-primary-title">
            {credit.activity.name}
          </div>

          <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
            <div className="label">
              <div className="label__text">{credit.lineName}</div>
            </div>
            {credit.activity.curriculums.map((curriculum) => (
              <div key={curriculum.identifier} className="label">
                <div className="label__text">{curriculum.name} </div>
              </div>
            ))}
          </div>
        </div>
        <div className="application-list__header-secondary">
          <span>
            <WorkspaceAssignmentsAndDiaryDialog
              credit={credit.activity}
              userIdentifier={identifier}
              userEntityId={userEntityId}
            >
              <Button buttonModifiers={["info", "assignments-and-exercises"]}>
                {t("actions.assignments", {
                  ns: "studies",
                })}
              </Button>
            </WorkspaceAssignmentsAndDiaryDialog>
          </span>

          {!isCombinationWorkspace ? (
            // So "legasy" case where there is only one module, render indicator etc next to workspace name
            <>
              <AssessmentRequestIndicator
                assessment={credit.activity.assessmentStates[0]}
              />
              <RecordsAssessmentIndicator
                assessment={credit.activity.assessmentStates[0]}
                isCombinationWorkspace={isCombinationWorkspace}
              />
            </>
          ) : null}
          <ActivityIndicator credit={credit.activity} />
        </div>
      </ApplicationListItemHeader>

      {isCombinationWorkspace ? (
        // If combinatin workspace render module assessments below workspace name
        <ApplicationListItemContentContainer modifiers="combination-course">
          {credit.activity.assessmentStates.map((a) => {
            /**
             * Find subject data, that contains basic information about that subject
             */
            const subjectData = credit.activity.subjects.find(
              (s) => s.identifier === a.subject.identifier
            );

            /**
             * If not found, return nothing
             */
            if (!subjectData) {
              return;
            }

            const codeSubjectString = `${
              subjectData.subjectCode ? subjectData.subjectCode : ""
            }${subjectData.courseNumber ? subjectData.courseNumber : ""} (${
              subjectData.courseLength
            } ${subjectData.courseLengthSymbol}) - ${subjectData.subjectName}`;

            return (
              <div
                key={subjectData.identifier}
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
      <AnimateHeight height={animateOpen} id={"record" + credit.activity.id}>
        {renderAssessmentsInformations()}
      </AnimateHeight>
    </ApplicationListItem>
  );
};

export default RecordsGroupItem;
