import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { ListItem } from "~/components/general/list";
import { ListItemIndicator } from "~/components/general/list";
import ProgressList, {
  ProgressListProps,
  RenderItemParams,
} from "~/components/general/study-progress2/progress-list";
import { compulsoryOrUpperSecondary } from "~/helper-functions/study-matrix";
//import SuggestionList from "../../suggestion-list";

/**
 * HopsPlanningListProps
 */
interface HopsPlanningListProps
  extends Omit<
    ProgressListProps,
    | "renderMandatoryCourseItemContent"
    | "renderOptionalCourseItemContent"
    | "matrix"
  > {}

/**
 * HopsPlanningList
 * @param props props
 * @returns JSX.Element
 */
const HopsPlanningList: React.FC<HopsPlanningListProps> = (props) => {
  const { t } = useTranslation(["studyMatrix"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  /**
   * Render mandatory course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderMandatoryCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const suggestionList = 0;
    const showSuggestionList = false;

    /* const suggestionList = (
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
    ); */

    return (
      <ListItem
        key={`${subject.subjectCode}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={listItemModifiers}>
          <Dropdown
            content={
              <div className="hops-container__study-tool-dropdown-container">
                <div className="hops-container__study-tool-dropdow-title">
                  {course.mandatory ? course.name : `${course.name}*`}
                </div>
                <>{showSuggestionList && suggestionList}</>
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
  };

  /**
   * Render optional course item content
   * @param params params
   * @returns JSX.Element
   */
  const renderOptionalCourseItem = (params: RenderItemParams) => {
    const { subject, course, listItemModifiers } = params;

    const showSuggestOptional = false;
    const showToggleChoice = false;

    const suggestedBySupervisor = false;
    const selectedByStudent = false;

    const suggestionList = 0;
    const showSuggestionList = false;

    return (
      <ListItem
        key={`${subject.subjectCode}-${course.courseNumber}`}
        modifiers={["course"]}
      >
        <ListItemIndicator modifiers={listItemModifiers}></ListItemIndicator>
        <Dropdown
          content={
            <>
              <div className="hops-container__study-tool-button-container">
                {showSuggestOptional && (
                  <Button
                    buttonModifiers={[
                      "guider-hops-studytool",
                      "guider-hops-studytool-suggested",
                    ]}
                    /* onClick={handleToggleSuggestOptional({
                    courseNumber: course.courseNumber,
                    subject: sSubject.subjectCode,
                    studentId: studyProgressStatic.studentId,
                  })} */
                  >
                    {suggestedBySupervisor
                      ? t("actions.suggested", { ns: "studyMatrix" })
                      : t("actions.suggestOptional", { ns: "studyMatrix" })}
                  </Button>
                )}

                {showToggleChoice && (
                  <Button
                    /* onClick={handleToggleChoiceClick({
                    studentId: studyProgressStatic.studentId,
                    courseNumber: course.courseNumber,
                    subject: sSubject.subjectCode,
                  })} */
                    buttonModifiers={["guider-hops-studytool"]}
                  >
                    {selectedByStudent
                      ? t("actions.cancelSelection", { ns: "studyMatrix" })
                      : t("actions.selectOptionalToHops", {
                          ns: "studyMatrix",
                        })}
                  </Button>
                )}
              </div>

              {showSuggestionList && suggestionList}
            </>
          }
        >
          <span tabIndex={0} className="list__indicator-data-wapper">
            {`${course.courseNumber}*`}
          </span>
        </Dropdown>
      </ListItem>
    );
  };

  // Subjects and courses related to skills and arts
  // const renderSkillsAndArtRows = studyProgress.skillsAndArt
  //   ? SKILL_AND_ART_SUBJECTS.map((s) => {
  //       if (
  //         studyProgress.skillsAndArt[s] &&
  //         studyProgress.skillsAndArt[s].length !== 0
  //       ) {
  //         return (
  //           <ListContainer key={s} modifiers={["subject"]}>
  //             <ListContainer modifiers={["row"]}>
  //               <ListHeader modifiers={["subject-name"]}>
  //                 {studyProgress.skillsAndArt[s][0].subjectName}
  //               </ListHeader>
  //             </ListContainer>
  //             <ListContainer modifiers={["row"]}>
  //               {studyProgress.skillsAndArt[s].map((c, index) => {
  //                 const listItemIndicatormodifiers = ["course", "APPROVAL"];
  //                 const listItemModifiers = ["course", "APPROVAL"];

  //                 return (
  //                   <ListItem key={index} modifiers={listItemModifiers}>
  //                     <ListItemIndicator modifiers={listItemIndicatormodifiers}>
  //                       <Dropdown
  //                         content={
  //                           <div className="hops-container__study-tool-dropdown-container">
  //                             <div className="hops-container__study-tool-dropdow-title">
  //                               {c.courseName}
  //                             </div>
  //                           </div>
  //                         }
  //                       >
  //                         <span
  //                           tabIndex={0}
  //                           className="list__indicator-data-wapper"
  //                         >
  //                           {c.courseNumber}
  //                           {!c.transferCreditMandatory ? "*" : null}
  //                         </span>
  //                       </Dropdown>
  //                     </ListItemIndicator>
  //                   </ListItem>
  //                 );
  //               })}
  //             </ListContainer>
  //           </ListContainer>
  //         );
  //       }
  //     }).filter(Boolean)
  //   : undefined;

  // Subjects and courses related to skills and arts
  // const renderOtherLanguageSubjectsRows = studyProgress.otherLanguageSubjects
  //   ? LANGUAGE_SUBJECTS.map((s) => {
  //       if (
  //         studyProgress.otherLanguageSubjects[s] &&
  //         studyProgress.otherLanguageSubjects[s].length !== 0
  //       ) {
  //         return (
  //           <ListContainer key={s} modifiers={["subject"]}>
  //             <ListContainer modifiers={["row"]}>
  //               <ListHeader modifiers={["subject-name"]}>
  //                 {studyProgress.otherLanguageSubjects[s][0].subjectName}
  //               </ListHeader>
  //             </ListContainer>
  //             <ListContainer modifiers={["row"]}>
  //               {studyProgress.otherLanguageSubjects[s].map((c, index) => {
  //                 const listItemIndicatormodifiers = ["course", "APPROVAL"];
  //                 const listItemModifiers = ["course", "APPROVAL"];

  //                 return (
  //                   <ListItem key={index} modifiers={listItemModifiers}>
  //                     <ListItemIndicator modifiers={listItemIndicatormodifiers}>
  //                       <Dropdown
  //                         content={
  //                           <div className="hops-container__study-tool-dropdown-container">
  //                             <div className="hops-container__study-tool-dropdow-title">
  //                               {c.courseName}
  //                             </div>
  //                           </div>
  //                         }
  //                       >
  //                         <span tabIndex={0} className="list__item-data-wapper">
  //                           {c.courseNumber}
  //                           {!c.transferCreditMandatory ? "*" : null}
  //                         </span>
  //                       </Dropdown>
  //                     </ListItemIndicator>
  //                   </ListItem>
  //                 );
  //               })}
  //             </ListContainer>
  //           </ListContainer>
  //         );
  //       }
  //     }).filter(Boolean)
  //   : undefined;

  // Subjects and courses related to skills and arts
  // const renderOtherSubjectsRows = studyProgress.otherSubjects
  //   ? OTHER_SUBJECT_OUTSIDE_HOPS.map((s) => {
  //       if (
  //         studyProgress.otherSubjects[s] &&
  //         studyProgress.otherSubjects[s].length !== 0
  //       ) {
  //         return studyProgress.otherSubjects[s].map((c) => (
  //           <ListContainer key={c.courseName} modifiers={["row"]}>
  //             <ListHeader modifiers={["subject-name"]}>
  //               {c.courseName}
  //               {!c.transferCreditMandatory ? "*" : null}
  //             </ListHeader>
  //           </ListContainer>
  //         ));
  //       }
  //     }).filter(Boolean)
  //   : undefined;

  return (
    <ProgressList
      {...props}
      matrix={matrix}
      renderMandatoryCourseItem={renderMandatoryCourseItem}
      renderOptionalCourseItem={renderOptionalCourseItem}
    >
      {/* {renderSkillsAndArtRows && renderSkillsAndArtRows.length !== 0 && (
        <ListContainer modifiers={["section"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subtitle"]}>
              {t("labels.transferedSkillAndArt", { ns: "studyMatrix" })}
            </ListHeader>
          </ListContainer>
          {renderSkillsAndArtRows}
        </ListContainer>
      )} */}

      {/* {renderOtherLanguageSubjectsRows &&
        renderOtherLanguageSubjectsRows.length !== 0 && (
          <ListContainer modifiers={["section"]}>
            <ListContainer modifiers={["row"]}>
              <ListHeader modifiers={["subtitle"]}>
                {t("labels.transferedLanguages", { ns: "studyMatrix" })}
              </ListHeader>
            </ListContainer>
            {renderOtherLanguageSubjectsRows}
          </ListContainer>
        )} */}

      {/* {renderOtherSubjectsRows && renderOtherSubjectsRows.length !== 0 && (
        <ListContainer modifiers={["section"]}>
          <ListContainer modifiers={["row"]}>
            <ListHeader modifiers={["subtitle"]}>
              {t("labels.transferedOther", { ns: "studyMatrix" })}
            </ListHeader>
          </ListContainer>
          {renderOtherSubjectsRows}
        </ListContainer>
      )} */}
    </ProgressList>
  );
};

export default HopsPlanningList;
