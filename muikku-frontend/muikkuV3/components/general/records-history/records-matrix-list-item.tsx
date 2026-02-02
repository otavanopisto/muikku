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
import { getCourseDropdownName } from "~/helper-functions/study-matrix";
import { useWorkspaceAssignmentInfo } from "~/hooks/useWorkspaceAssignmentInfo";
import AssignmentDetails from "~/components/general/evaluation-assessment-details/assigments-details";
import { suitabilityMapHelper } from "~/@shared/suitability";
import {
  CourseMatrixModule,
  CourseMatrixSubject,
  StudyActivityItem,
} from "~/generated/client";
import AssessmentRequestIndicator from "./assessment-request-indicator";
import RecordsAssessmentIndicator from "./records-assessment-indicator";
import ActivityIndicator from "./activity-indicator";
import WorkspaceAssignmentsAndDiaryDialog from "./dialogs/workspace-assignments-and-diaries";

/**
 * Props for the matrix-based records list item.
 * Structure comes from CourseMatrix (subject, course); StudyActivity is mapped onto it.
 */
export interface RecordsMatrixGroupItemProps {
  subject: CourseMatrixSubject;
  course: CourseMatrixModule;
  studyActivityItems: StudyActivityItem[];
  educationType: string;
  /** Show credits in the course title (e.g. "2 op"). Default true for upper secondary. */
  showCredits?: boolean;
}

/**
 * Single expandable row in the matrix-based records list.
 * Displays one (subject, course) from CourseMatrix with optional StudyActivity data.
 * @param props props
 */
export const RecordsMatrixGroupItem: React.FC<RecordsMatrixGroupItemProps> = (
  props
) => {
  const {
    subject,
    course,
    studyActivityItems,
    educationType,
    showCredits = true,
  } = props;

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
  const hasActivity = studyActivityItems.length > 0;
  const isCombinationWorkspace = studyActivityItems.length > 1;

  const { assignmentInfo, assignmentInfoLoading } = useWorkspaceAssignmentInfo({
    workspaceId: firstItem?.courseId,
    userEntityId,
    enabled: showE && !!firstItem?.courseId,
    displayNotification,
  });

  const rowId = `record-matrix-${subject.code}-${course.courseNumber}`;

  const getSumOfCredits = (): string | null => {
    if (!hasActivity) return null;
    const sumOfCredits = studyActivityItems.reduce(
      (acc: number, curr) =>
        acc + ((curr?.length && curr.lengthSymbol && curr.length) ?? 0),
      0
    );
    if (sumOfCredits === 0) return null;
    return `${sumOfCredits} ${studyActivityItems[0]?.lengthSymbol}`;
  };

  const renderMandatorityDescription = () => {
    if (!hasActivity || !firstItem.curriculums?.[0] || !firstItem.mandatority) {
      return null;
    }
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

  const renderAssessmentsInformations = () => {
    if (!hasActivity) return null;
    return (
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
  };

  const handleShowEvaluationClick = () => {
    setShowE((prev) => !prev);
  };

  const handleShowEvaluationKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowE((prev) => !prev);
    }
  };

  const title = hasActivity
    ? firstItem.courseName
    : getCourseDropdownName(subject, course, showCredits);

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
            ? t("wcag.collapseRecordInfo", { ns: "studies" })
            : t("wcag.expandRecordInfo", { ns: "studies" })
        }
        aria-expanded={showE}
        aria-controls={rowId}
        tabIndex={0}
      >
        <span className="application-list__header-icon icon-books"></span>
        <div className="application-list__header-primary">
          <div className="application-list__header-primary-title">{title}</div>
          <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
            {hasActivity && (
              <>
                <div className="label">
                  <div className="label__text">{firstItem.studyProgramme}</div>
                </div>
                {firstItem.curriculums?.map((curriculum) => (
                  <div key={curriculum} className="label">
                    <div className="label__text">{curriculum} </div>
                  </div>
                ))}
              </>
            )}
            {hasActivity && renderMandatorityDescription()}
            {!hasActivity && showCredits && course.length != null && (
              <div className="label">
                <div className="label__text">{course.length} op</div>
              </div>
            )}
          </div>
        </div>
        <div className="application-list__header-secondary">
          {hasActivity && firstItem.courseId && (
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
          {hasActivity && (
            <>
              {!isCombinationWorkspace && (
                <>
                  <AssessmentRequestIndicator studyActivityItem={firstItem} />
                  <RecordsAssessmentIndicator
                    studyActivityItem={firstItem}
                    isCombinationWorkspace={false}
                  />
                </>
              )}
              <ActivityIndicator studyActivityItem={firstItem} />
            </>
          )}
        </div>
      </ApplicationListItemHeader>

      {hasActivity && isCombinationWorkspace && (
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
      )}
      <AnimateHeight height={animateOpen} id={rowId}>
        {renderAssessmentsInformations()}
      </AnimateHeight>
    </ApplicationListItem>
  );
};

export default RecordsMatrixGroupItem;
