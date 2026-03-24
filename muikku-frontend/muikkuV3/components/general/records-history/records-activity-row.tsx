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
import { getMandatorityLabel } from "~/@shared/suitability";
import { StudyActivityItem } from "~/generated/client";
import AssessmentRequestIndicator from "./assessment-request-indicator";
import AssessmentIndicator from "./assessment-indicator";
import ActivityIndicator from "./activity-indicator";
import WorkspaceAssignmentsAndDiaryDialog from "./dialogs/workspace-assignments-and-diaries";
import { AssessmentInformation } from "./assessment-information";
import Link from "~/components/general/link";

/**
 * RecordsActivityRowProps
 */
interface RecordsActivityRowProps {
  /**
   * If credit contains more than one item, then it is combination workspace
   */
  studyActivityItems: StudyActivityItem[];
  isCombinationWorkspace: boolean;
  educationType: string;
}

/**
 * RecordsGroupItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsActivityRow: React.FC<RecordsActivityRowProps> = (
  props
) => {
  const { studyActivityItems, isCombinationWorkspace, educationType } = props;

  const { identifier, userEntityId, config, displayNotification } =
    useRecordsInfoContext();

  const { t, i18n } = useTranslation([
    "studies",
    "evaluation",
    "materials",
    "workspace",
    "common",
  ]);

  const [showEvaluation, setShowEvaluation] = React.useState(false);

  const { assignmentInfo, assignmentInfoLoading } = useWorkspaceAssignmentInfo({
    workspaceId: studyActivityItems[0].courseId,
    userEntityId,
    enabled: showEvaluation, // Only load data when expanded
    displayNotification,
  });

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
   * handleShowEvaluationClick
   */
  const handleShowEvaluationClick = () => {
    setShowEvaluation((showEvaluation) => !showEvaluation);
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
      setShowEvaluation((showEvaluation) => !showEvaluation);
    }
  };

  /**
   * Calculate sum of credits. If sum is 0, return null.
   * @returns string
   */
  const getSumOfCredits = () => {
    const sumOfCredits = studyActivityItems.reduce(
      (acc: number, curr) =>
        acc + ((curr?.length && curr.lengthSymbol && curr.length) ?? 0),
      0
    );

    if (sumOfCredits === 0) {
      return null;
    }

    return `${sumOfCredits} ${studyActivityItems[0]?.lengthSymbol}`;
  };

  /**
   * Depending what mandatority value is, returns description
   *
   * @returns mandatority description
   */
  const renderMandatorityDescription = () => {
    if (!studyActivityItems[0].mandatority) return null;

    let localString = getMandatorityLabel({
      t,
      exists: i18n.exists,
      mandatority: studyActivityItems[0].mandatority,
      educationType,
      curriculums: studyActivityItems[0].curriculums,
    });

    const sumOfCredits = getSumOfCredits();

    if (sumOfCredits) {
      localString = `${localString}, ${sumOfCredits}`;
    }

    return (
      <div className="label">
        <div className="label__text">{localString}</div>
      </div>
    );
  };

  /**
   * Render workspace link if workspace studyActivityItems exists
   * @returns workspace link
   */
  const renderWorkspaceLink = () => {
    if (!studyActivityItems[0]?.url) return null;
    return (
      <div className="application-list__header-primary-meta">
        <Link
          href={studyActivityItems[0].url}
          openInNewTab="_blank"
          className="link"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {t("labels.goto", { ns: "workspace" })}
        </Link>
      </div>
    );
  };

  const animateOpen = showEvaluation ? "auto" : 0;

  const headerModifiers = React.useMemo(() => {
    const modifiers = ["course"];
    if (isCombinationWorkspace) {
      modifiers.push("combination-course");
    }
    if (!assessmentExist) {
      modifiers.push("no-assessment");
    }
    return modifiers;
  }, [assessmentExist, isCombinationWorkspace]);

  return (
    <ApplicationListItem className="course course--studies" tabIndex={-1}>
      <ApplicationListItemHeader
        modifiers={headerModifiers}
        onClick={assessmentExist ? handleShowEvaluationClick : undefined}
        onKeyDown={assessmentExist ? handleShowEvaluationKeyDown : undefined}
        role="button"
        aria-label={
          showEvaluation
            ? t("wcag.collapseRecordInfo", {
                ns: "studies",
              })
            : t("wcag.expandRecordInfo", {
                ns: "studies",
              })
        }
        aria-expanded={showEvaluation}
        aria-controls={"record" + studyActivityItems[0].courseId}
        tabIndex={0}
      >
        <span className="application-list__header-icon icon-books"></span>
        <div className="application-list__header-primary">
          <div className="application-list__header-primary-title">
            {studyActivityItems[0].courseName}
          </div>

          <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
            {studyActivityItems[0].studyProgramme && (
              <div className="label">
                <div className="label__text">
                  {studyActivityItems[0].studyProgramme}
                </div>
              </div>
            )}

            {studyActivityItems[0].curriculums &&
              studyActivityItems[0].curriculums.map((curriculum) => (
                <div key={curriculum} className="label">
                  <div className="label__text">{curriculum} </div>
                </div>
              ))}

            {renderMandatorityDescription()}
          </div>
          {renderWorkspaceLink()}
        </div>
        <div className="application-list__header-secondary">
          {config.showAssigmentsAndDiaries && (
            <span>
              <WorkspaceAssignmentsAndDiaryDialog
                credit={studyActivityItems[0]}
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
          )}

          {!isCombinationWorkspace ? (
            // So "legasy" case where there is only one module, render indicator etc next to workspace name
            <>
              <AssessmentRequestIndicator
                studyActivityItem={studyActivityItems[0]}
              />
              <AssessmentIndicator
                studyActivityItem={studyActivityItems[0]}
                isCombinationWorkspace={isCombinationWorkspace}
              />
            </>
          ) : null}
          <ActivityIndicator studyActivityItem={studyActivityItems[0]} />
        </div>
      </ApplicationListItemHeader>

      {isCombinationWorkspace ? (
        // If combinatin workspace render module assessments below workspace name
        <ApplicationListItemContentContainer modifiers="combination-course">
          {studyActivityItems.map((aItem) => {
            const subjectCode = aItem.subject;
            const subjectName = aItem.subjectName;
            const courseNumber = aItem.courseNumber;
            const courseLength = aItem.length;
            const courseLengthSymbol = aItem.lengthSymbol;

            let codeSubjectString = `${subjectCode}`;

            if (courseNumber) {
              codeSubjectString += `${courseNumber}`;
            }

            if (subjectName) {
              codeSubjectString += ` - ${subjectName}`;
            }

            if (courseLength && courseLengthSymbol) {
              codeSubjectString += ` (${courseLength} ${courseLengthSymbol})`;
            }

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
                  isCombinationWorkspace={isCombinationWorkspace}
                />
              </div>
            );
          })}
        </ApplicationListItemContentContainer>
      ) : null}
      <AnimateHeight
        height={animateOpen}
        id={"record" + studyActivityItems[0].courseId}
      >
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

export default RecordsActivityRow;
