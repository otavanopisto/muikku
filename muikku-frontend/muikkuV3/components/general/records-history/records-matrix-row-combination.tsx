import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useTranslation } from "react-i18next";
import {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { useRecordsInfoContext } from "./context/records-info-context";
import { useWorkspaceAssignmentInfo } from "~/hooks/useWorkspaceAssignmentInfo";
import { suitabilityMapHelper } from "~/@shared/suitability";
import { StudyActivityItem } from "~/generated/client";
import AssessmentRequestIndicator from "./assessment-request-indicator";
import AssessmentIndicator from "./assessment-indicator";
import ActivityIndicator from "./activity-indicator";
import WorkspaceAssignmentsAndDiaryDialog from "./dialogs/workspace-assignments-and-diaries";
import { AssessmentInformation } from "./assessment-information";

/**
 * Props for the combination-workspace (Yhdistelmäopintojaksot) row.
 * Expects two or more StudyActivityItems that share the same courseId.
 */
interface RecordsMatrixRowCombinationProps {
  studyActivityItems: StudyActivityItem[];
  educationType: string;
}

/**
 * Renders a single combination workspace in the "Yhdistelmäopintojaksot" section.
 * Shows workspace title, programme/curriculum labels, list of modules, and expandable assessments.
 * @param props props
 */
const RecordsMatrixRowCombination: React.FC<
  RecordsMatrixRowCombinationProps
> = (props) => {
  const { studyActivityItems, educationType } = props;

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

  const firstItem = studyActivityItems[0];

  const { assignmentInfo, assignmentInfoLoading } = useWorkspaceAssignmentInfo({
    workspaceId: firstItem?.courseId,
    userEntityId,
    enabled: showE && !!firstItem?.courseId,
    displayNotification,
  });

  const rowId = `record-matrix-combo-${firstItem?.courseId}`;

  const assessmentExist = React.useMemo(
    () =>
      studyActivityItems.some(
        (a) =>
          a.state === "GRADED" ||
          a.state === "SUPPLEMENTATIONREQUEST" ||
          a.state === "INTERIM_EVALUATION" ||
          a.state === "INTERIM_EVALUATION_REQUEST" ||
          a.state === "PENDING"
      ),
    [studyActivityItems]
  );

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

  const headerModifiers = React.useMemo(
    () =>
      assessmentExist
        ? ["course", "combination-course"]
        : ["course", "combination-course", "no-assessment"],
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
          {config.showAssigmentsAndDiaries && firstItem.courseId && (
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
              <AssessmentIndicator
                studyActivityItem={aItem}
                isCombinationWorkspace={true}
              />
            </div>
          );
        })}
      </ApplicationListItemContentContainer>

      <AnimateHeight height={animateOpen} id={rowId}>
        {studyActivityItems.map((a, i) => (
          <AssessmentInformation
            key={`${a.subject}-${a.courseNumber}`}
            assessment={a}
            assignmentInfo={assignmentInfo}
            assignmentInfoLoading={assignmentInfoLoading}
            showAssignmentInfo={i === 0}
          />
        ))}
      </AnimateHeight>
    </ApplicationListItem>
  );
};

export default RecordsMatrixRowCombination;
