import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { localize } from "~/locales/i18n";
import { useRecordsInfoContext } from "./context/records-info-context";
import { getAssessmentData } from "~/helper-functions/shared";
import { useWorkspaceAssignmentInfo } from "~/hooks/useWorkspaceAssignmentInfo";
import AssignmentDetails from "~/components/general/evaluation-assessment-details/assigments-details";
import { suitabilityMapHelper } from "~/@shared/suitability";
import { StudyActivityItem } from "~/generated/client";
import AssessmentRequestIndicator from "./assessment-request-indicator";
import RecordsAssessmentIndicator from "./records-assessment-indicator";
import ActivityIndicator from "./activity-indicator";
import WorkspaceAssignmentsAndDiaryDialog from "./dialogs/workspace-assignments-and-diaries";

/**
 * Props for the combination-workspace (Yhdistelmäopintojaksot) list item.
 * Expects two or more StudyActivityItems that share the same courseId.
 */
export interface RecordsMatrixCombinationItemProps {
  studyActivityItems: StudyActivityItem[];
  educationType: string;
}

/**
 * Renders a single combination workspace in the "Yhdistelmäopintojaksot" section.
 * Shows workspace title, programme/curriculum labels, list of modules, and expandable assessments.
 * @param props props
 */
export const RecordsMatrixCombinationItem: React.FC<
  RecordsMatrixCombinationItemProps
> = (props) => {
  const { studyActivityItems, educationType } = props;

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

  const firstItem = studyActivityItems[0];

  const { assignmentInfo, assignmentInfoLoading } = useWorkspaceAssignmentInfo({
    workspaceId: firstItem?.courseId,
    userEntityId,
    enabled: showE && !!firstItem?.courseId,
    displayNotification,
  });

  const rowId = `record-matrix-combo-${firstItem?.courseId}`;

  /**
   * getSumOfCredits
   * @returns sum of credits
   */
  const getSumOfCredits = (): string | null => {
    const sumOfCredits = studyActivityItems.reduce(
      (acc: number, curr) =>
        acc + ((curr?.length && curr.lengthSymbol && curr.length) ?? 0),
      0
    );
    if (sumOfCredits === 0) return null;
    return `${sumOfCredits} ${studyActivityItems[0]?.lengthSymbol}`;
  };

  /**
   * renderMandatorityDescription
   * @returns mandatority description
   */
  const renderMandatorityDescription = () => {
    if (!firstItem.curriculums?.[0] || !firstItem.mandatority) return null;
    const OPS = firstItem.curriculums[0];
    const suitabilityMap = suitabilityMapHelper(t);
    const education = `${educationType
      .toLowerCase()
      .replace(/ /g, "")}${OPS.replace(/ /g, "")}`;
    if (!suitabilityMap[education]) return null;
    let localString = suitabilityMap[education][firstItem.mandatority];
    const sumOfCredits = getSumOfCredits();
    if (sumOfCredits) localString = `${localString}, ${sumOfCredits}`;
    return (
      <div className="label">
        <div className="label__text">{localString} </div>
      </div>
    );
  };

  /**
   * renderAssessmentsInformations
   */
  const renderAssessmentsInformations = () => (
    <>
      {studyActivityItems.map((a, i) => {
        const {
          evalStateClassName,
          evalStateIcon,
          assessmentIsPending,
          assessmentIsIncomplete,
          assessmentIsUnassessed,
          literalAssessment,
          assessmentIsInterim,
        } = getAssessmentData(a);
        const subjectCode = a.subject;
        const courseNumber = a.courseNumber;
        const subjectName = a.subjectName;
        const subjectCodeString = `(${subjectName}, ${subjectCode}${courseNumber})`;

        if (assessmentIsInterim) {
          return (
            <div
              key={`${subjectCode}-${courseNumber}`}
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
                    : t("labels.interimEvaluation", { ns: "materials" })}
                  :
                </div>
                <div
                  className="workspace-assessment__literal-data rich-text"
                  dangerouslySetInnerHTML={{ __html: literalAssessment }}
                />
              </div>
            </div>
          );
        }

        if (
          !assessmentIsUnassessed &&
          !assessmentIsPending &&
          !assessmentIsInterim
        ) {
          return (
            <div key={`${subjectCode}-${courseNumber}`}>
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
                      {t("labels.assessor", { ns: "evaluation" })}:
                    </span>
                    <span className="workspace-assessment__evaluator-data">
                      {a.evaluatorName}
                    </span>
                  </div>
                )}
                <div className="workspace-assessment__grade">
                  <span className="workspace-assessment__grade-label">
                    {t("labels.grade", { ns: "workspace" })}:
                  </span>
                  <span className="workspace-assessment__grade-data">
                    {assessmentIsIncomplete
                      ? t("labels.incomplete", { ns: "workspace" })
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
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div
            key={`${subjectCode}-${courseNumber}`}
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
                {t("labels.evaluationRequest", { ns: "evaluation" })}:
              </div>
              <div
                className="workspace-assessment__literal-data rich-text"
                dangerouslySetInnerHTML={{ __html: literalAssessment }}
              />
            </div>
          </div>
        );
      })}
    </>
  );

  /**
   * handleShowEvaluationClick
   */
  const handleShowEvaluationClick = () => {
    setShowE((prev) => !prev);
  };

  /**
   * handleShowEvaluationKeyDown
   * @param e e
   */
  const handleShowEvaluationKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowE((prev) => !prev);
    }
  };

  const animateOpen = showE ? "auto" : 0;

  return (
    <ApplicationListItem className="course course--studies" tabIndex={-1}>
      <ApplicationListItemHeader
        modifiers={["course", "combination-course"]}
        onClick={handleShowEvaluationClick}
        onKeyDown={handleShowEvaluationKeyDown}
        role="button"
        aria-label={
          showE
            ? t("wcag.collapseRecordInfo", { ns: "studies" })
            : t("wcag.expandRecordInfo", { ns: "studies" })
        }
        aria-expanded={showE}
        aria-controls={rowId}
        tabIndex={0}
      >
        <span className="application-list__header-icon icon-books"></span>
        <div className="application-list__header-primary">
          <div className="application-list__header-primary-title">
            {firstItem.courseName}
          </div>
          <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
            <div className="label">
              <div className="label__text">{firstItem.studyProgramme}</div>
            </div>
            {firstItem.curriculums?.map((curriculum) => (
              <div key={curriculum} className="label">
                <div className="label__text">{curriculum} </div>
              </div>
            ))}
            {renderMandatorityDescription()}
          </div>
        </div>
        <div className="application-list__header-secondary">
          {firstItem.courseId && (
            <span>
              <WorkspaceAssignmentsAndDiaryDialog
                credit={firstItem}
                userIdentifier={identifier}
                userEntityId={userEntityId}
              >
                <Button buttonModifiers={["info", "assignments-and-exercises"]}>
                  {t("actions.assignments", { ns: "studies" })}
                </Button>
              </WorkspaceAssignmentsAndDiaryDialog>
            </span>
          )}
          <ActivityIndicator studyActivityItem={firstItem} />
        </div>
      </ApplicationListItemHeader>

      <ApplicationListItemContentContainer modifiers="combination-course">
        {studyActivityItems.map((aItem) => {
          const subjectCode = aItem.subject;
          const subjectName = aItem.subjectName;
          const courseNumber = aItem.courseNumber;
          const courseLength = aItem.length;
          const courseLengthSymbol = aItem.lengthSymbol;
          let codeSubjectString = `${subjectCode}`;
          if (courseNumber) codeSubjectString += `${courseNumber}`;
          if (courseLength && courseLengthSymbol)
            codeSubjectString += ` (${courseLength} ${courseLengthSymbol})`;
          if (subjectName) codeSubjectString += ` - ${subjectName}`;
          return (
            <div
              key={`${subjectCode}-${courseNumber}`}
              className="application-list__item-content-single-item"
            >
              <span className="application-list__item-content-single-item-primary">
                {codeSubjectString}
              </span>
              <AssessmentRequestIndicator studyActivityItem={aItem} />
              <RecordsAssessmentIndicator
                studyActivityItem={aItem}
                isCombinationWorkspace={true}
              />
            </div>
          );
        })}
      </ApplicationListItemContentContainer>

      <AnimateHeight height={animateOpen} id={rowId}>
        {renderAssessmentsInformations()}
      </AnimateHeight>
    </ApplicationListItem>
  );
};

export default RecordsMatrixCombinationItem;
