import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import {
  ApplicationListItem,
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
import Dropdown from "../dropdown";

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

  const subjectSpecificActivityItem = studyActivityItems.find(
    (a) => a.subject === subject.code && a.courseNumber === course.courseNumber
  );

  const hasActivity = studyActivityItems.length > 0;
  const isCombinationWorkspace = studyActivityItems.length > 1;

  const { assignmentInfo, assignmentInfoLoading } = useWorkspaceAssignmentInfo({
    workspaceId: subjectSpecificActivityItem?.courseId,
    userEntityId,
    enabled: showE && !!subjectSpecificActivityItem?.courseId,
    displayNotification,
  });

  const rowId = `record-matrix-${subject.code}-${course.courseNumber}`;

  /**
   * getSumOfCredits
   * @returns sum of credits
   */
  const getCreditsString = (): string | null => {
    if (!subjectSpecificActivityItem) return null;

    if (subjectSpecificActivityItem.length === 0) return null;
    return `${subjectSpecificActivityItem.length} ${subjectSpecificActivityItem.lengthSymbol}`;
  };

  /**
   * renderMandatorityDescription
   * @returns mandatority description
   */
  const renderMandatorityDescription = () => {
    if (
      !hasActivity ||
      !subjectSpecificActivityItem?.curriculums?.[0] ||
      !subjectSpecificActivityItem.mandatority
    ) {
      return null;
    }
    const OPS = subjectSpecificActivityItem.curriculums[0];
    const suitabilityMap = suitabilityMapHelper(t);
    const education = `${educationType
      .toLowerCase()
      .replace(/ /g, "")}${OPS.replace(/ /g, "")}`;
    if (!suitabilityMap[education]) return null;
    let localString =
      suitabilityMap[education][subjectSpecificActivityItem.mandatority];
    const creditsString = getCreditsString();
    if (creditsString) localString = `${localString}, ${creditsString}`;
    return (
      <div className="label">
        <div className="label__text">{localString} </div>
      </div>
    );
  };

  /**
   * renderAssessmentInformation
   * @returns assessments informations
   */
  const renderAssessmentInformation = () => {
    if (!subjectSpecificActivityItem) return null;

    const {
      evalStateClassName,
      evalStateIcon,
      assessmentIsPending,
      assessmentIsIncomplete,
      assessmentIsUnassessed,
      literalAssessment,
      assessmentIsInterim,
    } = getAssessmentData(subjectSpecificActivityItem);

    const subjectCode = subjectSpecificActivityItem.subject;
    const courseNumber = subjectSpecificActivityItem.courseNumber;
    const subjectName = subjectSpecificActivityItem.subjectName;
    const subjectCodeString = `(${subjectName}, ${subjectCode}${courseNumber})`;

    if (assessmentIsInterim) {
      return (
        <div
          key={`${subjectCode}-${courseNumber}`}
          className={`workspace-assessment workspace-assessment--studies-details ${evalStateClassName}`}
        >
          <div className={`workspace-assessment__icon ${evalStateIcon}`}></div>
          <div className="workspace-assessment__date">
            <span className="workspace-assessment__date-label">
              {t("labels.date")}:
            </span>
            <span className="workspace-assessment__date-data">
              {localize.date(subjectSpecificActivityItem.date)}
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
          {assignmentInfoLoading && <div className="loader-empty" />}
          {assignmentInfo.length > 0 && (
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
                {localize.date(subjectSpecificActivityItem.date)}
              </span>
            </div>
            {subjectSpecificActivityItem.evaluatorName && (
              <div className="workspace-assessment__evaluator">
                <span className="workspace-assessment__evaluator-label">
                  {t("labels.assessor", { ns: "evaluation" })}:
                </span>
                <span className="workspace-assessment__evaluator-data">
                  {subjectSpecificActivityItem.evaluatorName}
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
                  : subjectSpecificActivityItem.grade}
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
        <div className={`workspace-assessment__icon ${evalStateIcon}`}></div>
        <div className="workspace-assessment__date">
          <span className="workspace-assessment__date-label">
            {t("labels.date")}:
          </span>
          <span className="workspace-assessment__date-data">
            {localize.date(subjectSpecificActivityItem.date)}
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
  };

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

  const title = getCourseDropdownName(subject, course, showCredits);

  const animateOpen = showE ? "auto" : 0;

  return (
    <ApplicationListItem className="course course--studies" tabIndex={-1}>
      <ApplicationListItemHeader
        modifiers={["course"]}
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
                  <div className="label__text">
                    {subjectSpecificActivityItem.studyProgramme}
                  </div>
                </div>
                {subjectSpecificActivityItem.curriculums?.map((curriculum) => (
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

            {isCombinationWorkspace && (
              <Dropdown
                openByHover
                content={<span>{subjectSpecificActivityItem.courseName}</span>}
              >
                <div className="label">
                  <div className="label__text">YHD</div>
                </div>
              </Dropdown>
            )}
          </div>
        </div>
        <div className="application-list__header-secondary">
          {hasActivity &&
            subjectSpecificActivityItem.courseId &&
            !isCombinationWorkspace && (
              <span>
                <WorkspaceAssignmentsAndDiaryDialog
                  credit={subjectSpecificActivityItem}
                  userIdentifier={identifier}
                  userEntityId={userEntityId}
                >
                  <Button
                    buttonModifiers={["info", "assignments-and-exercises"]}
                  >
                    {t("actions.assignments", { ns: "studies" })}
                  </Button>
                </WorkspaceAssignmentsAndDiaryDialog>
              </span>
            )}
          {hasActivity && !isCombinationWorkspace && (
            <>
              <AssessmentRequestIndicator
                studyActivityItem={subjectSpecificActivityItem}
              />
              <RecordsAssessmentIndicator
                studyActivityItem={subjectSpecificActivityItem}
                isCombinationWorkspace={false}
              />
              <ActivityIndicator
                studyActivityItem={subjectSpecificActivityItem}
              />
            </>
          )}
        </div>
      </ApplicationListItemHeader>

      <AnimateHeight height={animateOpen} id={rowId}>
        {renderAssessmentInformation()}
      </AnimateHeight>
    </ApplicationListItem>
  );
};

export default RecordsMatrixGroupItem;
