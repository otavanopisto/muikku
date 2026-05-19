import React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import {
  OPSCourseCard,
  OPSCourseCardContent,
  OPSCourseCardHeader,
  OPSCourseCardLabel,
} from "~/components/general/OPS-matrix/OPS-course-card";
import {
  OPSCourseTableContent,
  OPSCourseTableProps,
  RenderItemParams,
} from "~/components/general/OPS-matrix/OPS-course-table";
import SuggestionList from "~/components/general/suggestion-list/suggestion-list";
import { Table, TableHead, Td, Th, Tr } from "~/components/general/table";
import { WorkspaceSuggestion } from "~/generated/client";
import {
  getCourseInfo,
  getHighestCourseNumber,
  MANDATORITY_OPTIONAL_VALUES,
  MANDATORITY_MANDATORY_VALUES,
  getCourseStateLabel,
} from "~/helper-functions/study-matrix";
import { localize } from "~/locales/i18n";
import { CurriculumConfig } from "~/util/curriculum-config";

/**
 * Props interface for the ProgressTableStudySummary component.
 * Extends ProgressTableProps but omits specific properties while adding onSignUp functionality.
 */
interface ProgressTableProps
  extends Omit<
    OPSCourseTableProps,
    | "renderMandatoryCourseCellContent"
    | "renderOptionalCourseCellContent"
    | "currentMaxCourses"
  > {
  curriculumConfig: CurriculumConfig;
  /** Callback function to handle student sign-up for a workspace */
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * Component that displays a summary table of a student's study progress.
 * Shows courses, their status, and available workspace suggestions for enrollment.
 *
 * @param props - Component properties
 */
const ProgressTable: React.FC<ProgressTableProps> = (props) => {
  const {
    matrix,
    studentIdentifier,
    studentUserEntityId,
    suggestedNextList,
    transferedList,
    gradedList,
    onGoingList,
    needSupplementationList,
    plannedCourses,
    curriculumConfig,
    onSignUp,
  } = props;

  const { t } = useTranslation(["studyMatrix"]);

  const currentMaxCourses = getHighestCourseNumber(matrix);

  /**
   * renderCourseCell
   * @param params params
   * @returns JSX.Element
   */
  const renderCourseCell = (params: RenderItemParams) => {
    const { subject, course, tdModifiers } = params;

    const {
      modifiers,
      canBeSelected,
      grade,
      needsSupplementation,
      currentActivityItem,
    } = getCourseInfo(
      tdModifiers,
      subject,
      course,
      suggestedNextList,
      transferedList,
      gradedList,
      onGoingList,
      needSupplementationList
    );

    const currentActivityItemLabel = getCourseStateLabel(
      currentActivityItem,
      t
    );

    const suggestionList = (
      <SuggestionList
        studentId={studentIdentifier}
        studentsUserEntityId={studentUserEntityId}
        subjectCode={subject.code}
        course={course}
      >
        {(context) => {
          if (context.suggestionList.length === 0) {
            return (
              <div className="hops-container__study-tool-dropdow-suggestion-subsection">
                <div className="hops-container__study-tool-dropdow-title">
                  {t("content.noSuggestionAvailable", {
                    context: "staff",
                    ns: "studyMatrix",
                  })}
                </div>
              </div>
            );
          }

          return context.suggestionList.map((suggestion) => (
            <SuggestionListContent
              key={suggestion.id}
              suggestion={suggestion}
              onSignUp={onSignUp}
            />
          ));
        }}
      </SuggestionList>
    );

    const isMandatory = MANDATORITY_MANDATORY_VALUES.includes(
      course.mandatority
    );

    // By default content is mandatory or option shorthand
    let courseTdContent = isMandatory
      ? t("labels.mandatoryShorthand", { ns: "studyMatrix" })
      : t("labels.optionalShorthand", { ns: "studyMatrix" });

    // If needs supplementation, then replace default with supplementation request shorthand
    if (needsSupplementation) {
      courseTdContent = t("labels.supplementationRequestShorthand", {
        ns: "studyMatrix",
      });
    }

    // If grade is available, then replace content with that
    if (grade) {
      courseTdContent = grade;
    }

    const plannedCourseInfo = plannedCourses?.find(
      (plannedCourse) =>
        plannedCourse.subjectCode === subject.code &&
        plannedCourse.courseNumber === course.courseNumber
    );

    // Calculates the end date of the planned course
    const calculatedEndDate = plannedCourseInfo?.duration
      ? new Date(
          plannedCourseInfo.startDate.getTime() + plannedCourseInfo.duration
        )
      : null;

    return (
      <Td key={`${subject.code}-${course.courseNumber}`} modifiers={modifiers}>
        <Dropdown
          content={
            <div className="hops-container__study-tool-dropdown-container">
              <OPSCourseCard
                innerContainerModifiers={
                  isMandatory ? ["mandatory"] : ["optional"]
                }
              >
                <OPSCourseCardHeader>
                  <span className="ops-course__card-title">
                    <b>{`${subject.code}${course.courseNumber}`}</b>{" "}
                    {curriculumConfig
                      ? `${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course.length)}`
                      : `${course.name}`}
                  </span>
                </OPSCourseCardHeader>
                <OPSCourseCardContent>
                  <div className="ops-course__card-labels">
                    <OPSCourseCardLabel
                      modifiers={[isMandatory ? "mandatory" : "optional"]}
                    >
                      {isMandatory
                        ? t("labels.mandatory", {
                            ns: "common",
                          })
                        : t("labels.optional", {
                            ns: "common",
                          })}
                    </OPSCourseCardLabel>

                    {currentActivityItemLabel && (
                      <OPSCourseCardLabel
                        modifiers={[currentActivityItemLabel.state]}
                      >
                        {currentActivityItemLabel.label}
                      </OPSCourseCardLabel>
                    )}

                    {plannedCourseInfo && (
                      <OPSCourseCardLabel modifiers={["planned"]}>
                        {t("labels.planned", {
                          ns: "common",
                        })}
                      </OPSCourseCardLabel>
                    )}
                  </div>

                  {plannedCourseInfo && (
                    <div className="ops-course__card-dates">
                      <div className="ops-course__card-dates-item">
                        {calculatedEndDate ? (
                          <>
                            {`${localize.date(new Date(plannedCourseInfo.startDate))} - ${localize.date(new Date(calculatedEndDate))} (suunniteltu)`}
                          </>
                        ) : (
                          <>
                            {`${localize.date(new Date(plannedCourseInfo.startDate))} (suunniteltu)`}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {canBeSelected && suggestionList}
                </OPSCourseCardContent>
              </OPSCourseCard>
            </div>
          }
        >
          <span
            tabIndex={0}
            className="table__data-content-wrapper table__data-content-wrapper--course"
          >
            {courseTdContent}
            {MANDATORITY_OPTIONAL_VALUES.includes(course.mandatority) ? (
              <sup>*</sup>
            ) : null}
          </span>
        </Dropdown>
      </Td>
    );
  };

  return (
    <Table modifiers={["course"]}>
      {currentMaxCourses && (
        <TableHead modifiers={["course", "sticky"]}>
          <Tr modifiers={["course"]}>
            <Th modifiers={["subject"]}>
              {t("labels.schoolSubject", { ns: "studyMatrix" })}
            </Th>
            {Array.from({ length: currentMaxCourses }).map((_, index) => (
              <Th key={index} modifiers={["course"]}>
                {index + 1}
              </Th>
            ))}
          </Tr>
        </TableHead>
      )}
      <OPSCourseTableContent
        {...props}
        matrix={matrix}
        currentMaxCourses={currentMaxCourses}
        renderCourseCell={renderCourseCell}
      />
    </Table>
  );
};

/**
 * Props interface for the SuggestionListContent component
 * @interface SuggestionListContentProps
 */
interface SuggestionListContentProps {
  /** Workspace suggestion data */
  suggestion: WorkspaceSuggestion;
  /** Callback function when user signs up for a workspace */
  onSignUp: (workspaceToSignUp: WorkspaceSuggestion) => void;
}

/**
 * Component that renders the content of a workspace suggestion including name and action buttons.
 *
 * @param props - Component properties
 */
const SuggestionListContent = (props: SuggestionListContentProps) => {
  const { suggestion, onSignUp } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles sign up click
   * @param e e
   */
  const handleSignUpClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    onSignUp(suggestion);
  };

  let name = suggestion.name;
  if (suggestion.nameExtension) {
    name += ` (${suggestion.nameExtension})`;
  }

  return (
    <div
      key={suggestion.id}
      className="hops-container__study-tool-dropdow-suggestion-subsection"
    >
      <div className="hops-container__study-tool-dropdow-title">{name}</div>
      {suggestion.canSignup && (
        <>
          <Button
            buttonModifiers={[
              "guider-hops-studytool",
              "guider-hops-studytool-next",
            ]}
            href={`/workspace/${suggestion.urlName}`}
            openInNewTab="_blank"
          >
            {t("actions.checkOut", { ns: "workspace" })}
          </Button>
          <Button
            buttonModifiers={[
              "guider-hops-studytool",
              "guider-hops-studytool-next",
            ]}
            onClick={handleSignUpClick}
          >
            {t("actions.signUp", { ns: "workspace" })}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProgressTable;
