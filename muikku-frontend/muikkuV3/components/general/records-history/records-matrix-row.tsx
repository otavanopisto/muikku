import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { useRecordsInfoContext } from "./context/records-info-context";
import { getCourseDropdownName } from "~/helper-functions/study-matrix";
import { useWorkspaceAssignmentInfo } from "~/hooks/useWorkspaceAssignmentInfo";
import { suitabilityMapHelper } from "~/@shared/suitability";
import {
  CourseMatrixModule,
  CourseMatrixSubject,
  StudyActivityItem,
} from "~/generated/client";
import AssessmentRequestIndicator from "./assessment-request-indicator";
import AssessmentIndicator from "./assessment-indicator";
import ActivityIndicator from "./activity-indicator";
import WorkspaceAssignmentsAndDiaryDialog from "./dialogs/workspace-assignments-and-diaries";
import Dropdown from "../dropdown";
import { AssessmentInformation } from "./assessment-information";

/**
 * Props for the matrix-based records row.
 * Structure comes from CourseMatrix (subject, course); StudyActivity is mapped onto it.
 */
export interface RecordsMatrixRowProps {
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
export const RecordsMatrixRow: React.FC<RecordsMatrixRowProps> = (props) => {
  const {
    subject,
    course,
    studyActivityItems,
    educationType,
    showCredits = true,
  } = props;

  const { identifier, userEntityId, config, displayNotification } =
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

  const assessmentExist = React.useMemo(
    () =>
      subjectSpecificActivityItem?.state === "GRADED" ||
      subjectSpecificActivityItem?.state === "SUPPLEMENTATIONREQUEST" ||
      subjectSpecificActivityItem?.state === "INTERIM_EVALUATION" ||
      subjectSpecificActivityItem?.state === "INTERIM_EVALUATION_REQUEST" ||
      subjectSpecificActivityItem?.state === "PENDING",
    [subjectSpecificActivityItem]
  );

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

  const headerModifiers = React.useMemo(
    () => (assessmentExist ? ["course"] : ["course", "no-assessment"]),
    [assessmentExist]
  );

  return (
    <ApplicationListItem className="course course--studies" tabIndex={-1}>
      <ApplicationListItemHeader
        modifiers={headerModifiers}
        onClick={assessmentExist ? handleShowEvaluationClick : undefined}
        onKeyDown={assessmentExist ? handleShowEvaluationKeyDown : undefined}
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
        <span
          className={`${hasActivity ? "application-list__header-icon" : "application-list__header-icon application-list__header-icon--inactive"}  icon-books`}
        ></span>
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
          {config.showAssigmentsAndDiaries &&
            hasActivity &&
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
          {hasActivity && (
            <>
              {!isCombinationWorkspace && (
                <AssessmentRequestIndicator
                  studyActivityItem={subjectSpecificActivityItem}
                />
              )}

              <AssessmentIndicator
                studyActivityItem={subjectSpecificActivityItem}
                isCombinationWorkspace={false}
              />

              {!isCombinationWorkspace && (
                <ActivityIndicator
                  studyActivityItem={subjectSpecificActivityItem}
                />
              )}
            </>
          )}
        </div>
      </ApplicationListItemHeader>

      <AnimateHeight height={animateOpen} id={rowId}>
        <AssessmentInformation
          assessment={subjectSpecificActivityItem}
          assignmentInfo={assignmentInfo}
          assignmentInfoLoading={assignmentInfoLoading}
          showAssignmentInfo={true}
        />
      </AnimateHeight>
    </ApplicationListItem>
  );
};

export default RecordsMatrixRow;
