import * as React from "react";
import {
  ListContainer,
  ListHeader,
  ListItem,
  ListItemIndicator,
} from "~/components/general/list";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
} from "../../../hooks/useStudentActivity";
import { UpdateStudentChoicesParams } from "~/hooks/useStudentChoices";
import Dropdown from "~/components/general/dropdown";
import Button from "~/components/general/button";
import { UpdateSupervisorOptionalSuggestionParams } from "~/hooks/useSupervisorOptionalSuggestion";
import {
  useStudyProgressContextState,
  useStudyProgressContextUpdater,
  useStudyProgressStaticDataContext,
} from "./context";
import SuggestionList from "./suggestion-list";
import { StudentStudyActivity } from "~/generated/client";
import {
  compulsoryOrUpperSecondary,
  filterMatrix,
  showSubject,
} from "~/helper-functions/study-matrix";
import { useTranslation } from "react-i18next";

/**
 * CourseListProps
 */
interface HopsCourseListProps {
  curriculumName: string;
  studyProgrammeName: string;
  editMode: boolean;
}

/**
 * CourseTable. Renders a table of courses
 *
 * @param props props
 * @returns JSX.Element
 */
const ProgressList: React.FC<HopsCourseListProps> = (props) => {
  const { editMode, studyProgrammeName, curriculumName } = props;

  const { t } = useTranslation("studyMatrix");

  const studyProgress = useStudyProgressContextState();
  const studyProgressStatic = useStudyProgressStaticDataContext();
  const studyProgressUpdater = useStudyProgressContextUpdater();

  /**
   * handleToggleChoiceClick
   *
   * @param choiceParams choiceParams
   */
  const handleToggleChoiceClick =
    (choiceParams: UpdateStudentChoicesParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      studyProgressUpdater.updateStudentChoice(choiceParams);
    };

  /**
   * handleToggleSuggestOptionalNext
   * @param params params
   */
  const handleToggleSuggestOptional =
    (params: UpdateSupervisorOptionalSuggestionParams) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      studyProgressUpdater.updateSupervisorOptionalSuggestion(params);
    };

  const matrix = compulsoryOrUpperSecondary(studyProgrammeName, curriculumName);

  // If study programme name doesn't have a matrix, return empty matrix indicator
  if (matrix === null) {
    return (
      <div className="empty">
        <span>{t("content.noSubjectTable")}</span>
      </div>
    );
  }

  const filteredMatrix = filterMatrix(
    studyProgrammeName,
    matrix,
    studyProgress.options
  );

  /**
   * renderRows
   */
  const renderRows = filteredMatrix.map((sSubject, i) => {
    let showSubjectRow = showSubject(props.studyProgrammeName, sSubject);

    /**
     * Renders courses
     */
    const courses = sSubject.availableCourses.map((course) => {
      //Default modifiers
      const listItemIndicatormodifiers = ["course"];
      const listItemModifiers = ["course"];

      if (course.mandatory) {
        listItemIndicatormodifiers.push("MANDATORY");
      } else {
        listItemIndicatormodifiers.push("OPTIONAL");
      }

      // List item options with default values
      let canBeSelected = true;
      let courseSuggestions: StudentStudyActivity[] = [];

      let selectedByStudent = false;
      let suggestedBySupervisor = false;

      /**
       * If any of these list are given, check whether course id is in
       * and push another modifier
       */

      if (
        studyProgress.studentChoices.find(
          (sCourse) =>
            sCourse.subject === sSubject.subjectCode &&
            sCourse.courseNumber === course.courseNumber
        )
      ) {
        selectedByStudent = true;
        listItemIndicatormodifiers.push("OPTIONAL-SELECTED");
      }
      if (
        studyProgress.supervisorOptionalSuggestions.find(
          (sOCourse) =>
            sOCourse.subject === sSubject.subjectCode &&
            sOCourse.courseNumber === course.courseNumber
        )
      ) {
        suggestedBySupervisor = true;
        listItemIndicatormodifiers.push("SUGGESTED");
      }

      /**
       * Only one of these can happen
       */
      if (
        studyProgress.suggestedNextList.find(
          (sCourse) =>
            sCourse.subject === sSubject.subjectCode &&
            sCourse.courseNumber === course.courseNumber
        )
      ) {
        const suggestedCourseDataNext = studyProgress.suggestedNextList.filter(
          (sCourse) => sCourse.subject === sSubject.subjectCode
        );

        courseSuggestions = courseSuggestions.concat(suggestedCourseDataNext);

        listItemIndicatormodifiers.push("NEXT");
      } else if (
        studyProgress.transferedList.find(
          (tCourse) =>
            tCourse.subject === sSubject.subjectCode &&
            tCourse.courseNumber === course.courseNumber
        )
      ) {
        showSubjectRow = true;
        canBeSelected = false;
        listItemIndicatormodifiers.push("APPROVAL");
      } else if (
        studyProgress.gradedList.find(
          (gCourse) =>
            gCourse.subject === sSubject.subjectCode &&
            gCourse.courseNumber === course.courseNumber
        )
      ) {
        canBeSelected = false;
        listItemIndicatormodifiers.push("COMPLETED");
      } else if (
        studyProgress.onGoingList.find(
          (oCourse) =>
            oCourse.subject === sSubject.subjectCode &&
            oCourse.courseNumber === course.courseNumber
        )
      ) {
        canBeSelected = false;
        listItemIndicatormodifiers.push("INPROGRESS");
      }

      const suggestionList = (
        <SuggestionList
          user={studyProgressStatic.user}
          studentId={studyProgressStatic.studentId}
          studentsUserEntityId={studyProgressStatic.studentUserEntityId}
          suggestedActivityCourses={courseSuggestions}
          subjectCode={sSubject.subjectCode}
          course={course}
          updateSuggestionNext={studyProgressUpdater.updateSuggestionForNext}
          openSignUpDialog={studyProgressUpdater.openSignUpDialog}
          onCloseSignUpBehalfDialog={
            studyProgressUpdater.closeSignUpBehalfDialog
          }
        />
      );

      switch (studyProgressStatic.useCase) {
        case "hops-planning": {
          const showSuggestionList =
            editMode &&
            canBeSelected &&
            studyProgressStatic.user === "supervisor";

          // Button visibility conditions
          const showSuggestOptional =
            editMode && studyProgressStatic.user === "supervisor";
          const showToggleChoice = editMode;

          return (
            <ListItem
              key={`${sSubject.subjectCode}-${course.courseNumber}`}
              modifiers={listItemModifiers}
            >
              <ListItemIndicator modifiers={listItemIndicatormodifiers}>
                <Dropdown
                  content={
                    <div className="hops-container__study-tool-dropdown-container">
                      <div className="hops-container__study-tool-dropdow-title">
                        {course.mandatory ? course.name : `${course.name}*`}
                      </div>
                      {course.mandatory ? (
                        <>{showSuggestionList && suggestionList}</>
                      ) : (
                        <>
                          <div className="hops-container__study-tool-button-container">
                            {showSuggestOptional && (
                              <Button
                                buttonModifiers={[
                                  "guider-hops-studytool",
                                  "guider-hops-studytool-suggested",
                                ]}
                                onClick={handleToggleSuggestOptional({
                                  courseNumber: course.courseNumber,
                                  subject: sSubject.subjectCode,
                                  studentId: studyProgressStatic.studentId,
                                })}
                              >
                                {suggestedBySupervisor
                                  ? t("actions.suggested")
                                  : t("actions.suggestOptional")}
                              </Button>
                            )}

                            {showToggleChoice && (
                              <Button
                                onClick={handleToggleChoiceClick({
                                  studentId: studyProgressStatic.studentId,
                                  courseNumber: course.courseNumber,
                                  subject: sSubject.subjectCode,
                                })}
                                buttonModifiers={["guider-hops-studytool"]}
                              >
                                {selectedByStudent
                                  ? t("actions.cancelSelection")
                                  : t("actions.selectOptionalToHops")}
                              </Button>
                            )}
                          </div>

                          {showSuggestionList && suggestionList}
                        </>
                      )}
                    </div>
                  }
                >
                  <span tabIndex={0} className="list__indicator-data-wapper">
                    {course.mandatory
                      ? course.courseNumber
                      : `${course.courseNumber}*`}
                  </span>
                </Dropdown>
              </ListItemIndicator>
            </ListItem>
          );
        }

        case "state-of-studies": {
          const showSuggestionList = canBeSelected;

          return (
            <ListItem
              key={`${sSubject.subjectCode}-${course.courseNumber}`}
              modifiers={listItemModifiers}
            >
              <ListItemIndicator modifiers={listItemIndicatormodifiers}>
                <Dropdown
                  content={
                    <div className="hops-container__study-tool-dropdown-container">
                      <div className="hops-container__study-tool-dropdow-title">
                        {course.mandatory ? course.name : `${course.name}*`}
                      </div>
                      {showSuggestionList && suggestionList}
                    </div>
                  }
                >
                  <span tabIndex={0} className="list__indicator-data-wapper">
                    {course.mandatory
                      ? course.courseNumber
                      : `${course.courseNumber}*`}
                  </span>
                </Dropdown>
              </ListItemIndicator>
            </ListItem>
          );
        }

        default:
          return null;
      }
    });

    return (
      showSubjectRow && (
        <ListContainer key={sSubject.name} modifiers={["subject"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader
              modifiers={["subject-name"]}
            >{`${sSubject.name} (${sSubject.subjectCode})`}</ListHeader>
          </ListContainer>
          <ListContainer modifiers={["row"]}>{courses}</ListContainer>
        </ListContainer>
      )
    );
  });

  /**
   * Subjects and courses related to skills and arts
   */
  const renderSkillsAndArtRows = studyProgress.skillsAndArt
    ? SKILL_AND_ART_SUBJECTS.map((s) => {
        if (
          studyProgress.skillsAndArt[s] &&
          studyProgress.skillsAndArt[s].length !== 0
        ) {
          return (
            <ListContainer key={s} modifiers={["subject"]}>
              <ListContainer modifiers={["row"]}>
                <ListHeader modifiers={["subject-name"]}>
                  {studyProgress.skillsAndArt[s][0].subjectName}
                </ListHeader>
              </ListContainer>
              <ListContainer modifiers={["row"]}>
                {studyProgress.skillsAndArt[s].map((c, index) => {
                  const listItemIndicatormodifiers = ["course", "APPROVAL"];
                  const listItemModifiers = ["course", "APPROVAL"];

                  return (
                    <ListItem key={index} modifiers={listItemModifiers}>
                      <ListItemIndicator modifiers={listItemIndicatormodifiers}>
                        <Dropdown
                          openByHover={
                            studyProgressStatic.user !== "supervisor"
                          }
                          content={
                            <div className="hops-container__study-tool-dropdown-container">
                              <div className="hops-container__study-tool-dropdow-title">
                                {c.courseName}
                              </div>
                            </div>
                          }
                        >
                          <span
                            tabIndex={0}
                            className="list__indicator-data-wapper"
                          >
                            {c.courseNumber}
                            {!c.transferCreditMandatory ? "*" : null}
                          </span>
                        </Dropdown>
                      </ListItemIndicator>
                    </ListItem>
                  );
                })}
              </ListContainer>
            </ListContainer>
          );
        }
      }).filter(Boolean)
    : undefined;

  /**
   * Subjects and courses related to skills and arts
   */
  const renderOtherLanguageSubjectsRows = studyProgress.otherLanguageSubjects
    ? LANGUAGE_SUBJECTS.map((s) => {
        if (
          studyProgress.otherLanguageSubjects[s] &&
          studyProgress.otherLanguageSubjects[s].length !== 0
        ) {
          return (
            <ListContainer key={s} modifiers={["subject"]}>
              <ListContainer modifiers={["row"]}>
                <ListHeader modifiers={["subject-name"]}>
                  {studyProgress.otherLanguageSubjects[s][0].subjectName}
                </ListHeader>
              </ListContainer>
              <ListContainer modifiers={["row"]}>
                {studyProgress.otherLanguageSubjects[s].map((c, index) => {
                  const listItemIndicatormodifiers = ["course", "APPROVAL"];
                  const listItemModifiers = ["course", "APPROVAL"];

                  return (
                    <ListItem key={index} modifiers={listItemModifiers}>
                      <ListItemIndicator modifiers={listItemIndicatormodifiers}>
                        <Dropdown
                          openByHover={
                            studyProgressStatic.user !== "supervisor"
                          }
                          content={
                            <div className="hops-container__study-tool-dropdown-container">
                              <div className="hops-container__study-tool-dropdow-title">
                                {c.courseName}
                              </div>
                            </div>
                          }
                        >
                          <span tabIndex={0} className="list__item-data-wapper">
                            {c.courseNumber}
                            {!c.transferCreditMandatory ? "*" : null}
                          </span>
                        </Dropdown>
                      </ListItemIndicator>
                    </ListItem>
                  );
                })}
              </ListContainer>
            </ListContainer>
          );
        }
      }).filter(Boolean)
    : undefined;

  /**
   * Subjects and courses related to skills and arts
   */
  const renderOtherSubjectsRows = studyProgress.otherSubjects
    ? OTHER_SUBJECT_OUTSIDE_HOPS.map((s) => {
        if (
          studyProgress.otherSubjects[s] &&
          studyProgress.otherSubjects[s].length !== 0
        ) {
          return studyProgress.otherSubjects[s].map((c) => (
            <ListContainer key={c.courseName} modifiers={["row"]}>
              <ListHeader modifiers={["subject-name"]}>
                {c.courseName}
                {!c.transferCreditMandatory ? "*" : null}
              </ListHeader>
            </ListContainer>
          ));
        }
      }).filter(Boolean)
    : undefined;

  return (
    <div className="list">
      <ListContainer modifiers={["section"]}>{renderRows}</ListContainer>

      {renderSkillsAndArtRows && renderSkillsAndArtRows.length !== 0 && (
        <ListContainer modifiers={["section"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subtitle"]}>
              {t("labels.transferedSkillAndArt")}
            </ListHeader>
          </ListContainer>
          {renderSkillsAndArtRows}
        </ListContainer>
      )}

      {renderOtherLanguageSubjectsRows &&
        renderOtherLanguageSubjectsRows.length !== 0 && (
          <ListContainer modifiers={["section"]}>
            <ListContainer modifiers={["row"]}>
              <ListHeader modifiers={["subtitle"]}>
                {t("labels.transferedLanguages")}
              </ListHeader>
            </ListContainer>
            {renderOtherLanguageSubjectsRows}
          </ListContainer>
        )}

      {renderOtherSubjectsRows && renderOtherSubjectsRows.length !== 0 && (
        <ListContainer modifiers={["section"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subtitle"]}>
              {t("labels.transferedOther")}
            </ListHeader>
          </ListContainer>
          {renderOtherSubjectsRows}
        </ListContainer>
      )}
    </div>
  );
};

export default ProgressList;
