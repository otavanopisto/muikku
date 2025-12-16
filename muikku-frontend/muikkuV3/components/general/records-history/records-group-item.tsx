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
import AssignmentDetails from "~/components/general/evaluation-assessment-details/assigments-details";
import { suitabilityMapHelper } from "~/@shared/suitability";

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

                    {a.evaluatorName && (
                      <div className="workspace-assessment__evaluator">
                        <span className="workspace-assessment__evaluator-label">
                          {t("labels.assessor", {
                            ns: "evaluation",
                          })}
                          :
                        </span>

                        <span className="workspace-assessment__evaluator-data">
                          {a.evaluatorName}
                        </span>
                      </div>
                    )}
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

  /**
   * getSumOfCredits
   * @returns string
   */
  const getSumOfCredits = () => {
    if (!credit.activity.subjects) {
      return null;
    }

    const sumOfCredits = credit.activity.subjects.reduce(
      (acc, curr) => acc + curr.courseLength,
      0
    );

    return `${sumOfCredits} ${credit.activity.subjects[0].courseLengthSymbol}`;
  };

  /**
   * Depending what mandatority value is, returns description
   *
   * @returns mandatority description
   */
  const renderMandatorityDescription = () => {
    // Get first OPS from curriculums there should be only one OPS per workspace
    // Some old workspaces might have multiple OPS, but that is rare case
    const OPS = credit.activity.curriculums[0];

    // If OPS data and workspace mandatority property is present
    if (
      OPS &&
      credit.activity.mandatority &&
      credit.activity.educationTypeName
    ) {
      const suitabilityMap = suitabilityMapHelper(t);

      // Create map property from education type name and OPS name that was passed
      // Strings are changes to lowercase form and any empty spaces are removed
      const education = `${credit.activity.educationTypeName
        .toLowerCase()
        .replace(/ /g, "")}${OPS.name.replace(/ /g, "")}`;

      // Check if our map contains data with just created education string
      // Otherwise just return null. There might not be all included values by every OPS created...
      if (!suitabilityMap[education]) {
        return null;
      }

      // Then get correct local string from map by suitability enum value
      let localString = suitabilityMap[education][credit.activity.mandatority];

      const sumOfCredits = getSumOfCredits();

      // If there is sum of credits, return it with local string
      if (sumOfCredits) {
        localString = `${localString}, ${sumOfCredits}`;
      }

      return (
        <div className="label">
          <div className="label__text">{localString} </div>
        </div>
      );
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

            {renderMandatorityDescription()}
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
