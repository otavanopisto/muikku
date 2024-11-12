import React from "react";
import { useTranslation } from "react-i18next";
import { ProgressTableProps } from "~/components/general/study-progress2/progress-table";
import { ProgressTableContent } from "~/components/general/study-progress2/progress-table";
import {
  compulsoryOrUpperSecondary,
  getHighestCourseNumber,
} from "~/helper-functions/study-matrix";
import { Table, TableHead, Tr, Th, Td } from "~/components/general/table";

/**
 * HopsPlanningTableProps
 */
interface HopsPlanningTableProps
  extends Omit<
    ProgressTableProps,
    | "renderMandatoryCourseCellContent"
    | "renderOptionalCourseCellContent"
    | "currentMaxCourses"
    | "matrix"
  > {}

/**
 * HopsPlanningTable
 * @param props props
 * @returns JSX.Element
 */
const HopsPlanningTable: React.FC<HopsPlanningTableProps> = (props) => {
  const { t } = useTranslation(["studyMatrix"]);

  const matrix = compulsoryOrUpperSecondary(
    props.studyProgrammeName,
    props.curriculumName
  );

  const currentMaxCourses = getHighestCourseNumber(matrix);

  // Subjects and courses related to skills and arts
  // const renderSkillsAndArtRows = studyProgress.skillsAndArt
  //   ? SKILL_AND_ART_SUBJECTS_CS.map((s) => {
  //       let missingColumsCount = currentMaxCourses;

  //       if (
  //         studyProgress.skillsAndArt[s] &&
  //         studyProgress.skillsAndArt[s].length !== 0
  //       ) {
  //         return (
  //           <Tr key={s} modifiers={["course"]}>
  //             <Td modifiers={["subject"]}>
  //               <div>{studyProgress.skillsAndArt[s][0].subjectName}</div>
  //             </Td>

  //             {studyProgress.skillsAndArt[s].map((c, index) => {
  //               missingColumsCount--;

  //               const listItemModifiers = ["course", "centered", "APPROVAL"];

  //               return (
  //                 <Td key={index} modifiers={listItemModifiers}>
  //                   <Dropdown
  //                     content={
  //                       <div className="hops-container__study-tool-dropdown-container">
  //                         <div className="hops-container__study-tool-dropdow-title">
  //                           {c.courseName}
  //                         </div>
  //                       </div>
  //                     }
  //                   >
  //                     <span
  //                       tabIndex={0}
  //                       className="table__data-content-wrapper table__data-content-wrapper--course"
  //                     >
  //                       {c.courseNumber}
  //                       {!c.transferCreditMandatory ? "*" : null}
  //                     </span>
  //                   </Dropdown>
  //                 </Td>
  //               );
  //             })}

  //             {Array(missingColumsCount)
  //               .fill(1)
  //               .map((c, index) => {
  //                 const modifiers = ["centered", "course"];

  //                 return (
  //                   <Td key={`empty-${index + 1}`} modifiers={modifiers}>
  //                     <div
  //                       className={`table-data-content table-data-content-centered table-data-content--empty`}
  //                     >
  //                       -
  //                     </div>
  //                   </Td>
  //                 );
  //               })}
  //           </Tr>
  //         );
  //       }
  //     }).filter(Boolean)
  //   : undefined;

  // Subjects and courses related to skills and arts
  // const renderOtherLanguageSubjectsRows = studyProgress.otherLanguageSubjects
  //   ? LANGUAGE_SUBJECTS_CS.map((s) => {
  //       let missingColumsCount = currentMaxCourses;

  //       if (
  //         studyProgress.otherLanguageSubjects[s] &&
  //         studyProgress.otherLanguageSubjects[s].length !== 0
  //       ) {
  //         return (
  //           <Tr key={s} modifiers={["course"]}>
  //             <Td modifiers={["subject"]}>
  //               <div>
  //                 {studyProgress.otherLanguageSubjects[s][0].subjectName}
  //               </div>
  //             </Td>

  //             {studyProgress.otherLanguageSubjects[s].map((c, index) => {
  //               missingColumsCount--;

  //               const listItemModifiers = ["course", "centered", "APPROVAL"];

  //               return (
  //                 <Td key={index} modifiers={listItemModifiers}>
  //                   <Dropdown
  //                     content={
  //                       <div className="hops-container__study-tool-dropdown-container">
  //                         <div className="hops-container__study-tool-dropdow-title">
  //                           {c.courseName}
  //                         </div>
  //                       </div>
  //                     }
  //                   >
  //                     <span
  //                       tabIndex={0}
  //                       className="table__data-content-wrapper table__data-content-wrapper--course"
  //                     >
  //                       {c.courseNumber}
  //                       {!c.transferCreditMandatory ? "*" : null}
  //                     </span>
  //                   </Dropdown>
  //                 </Td>
  //               );
  //             })}

  //             {Array(missingColumsCount)
  //               .fill(1)
  //               .map((c, index) => {
  //                 const modifiers = ["centered", "course"];

  //                 return (
  //                   <Td key={`empty-${index + 1}`} modifiers={modifiers}>
  //                     <div
  //                       className={`table-data-content table-data-content-centered table-data-content--empty`}
  //                     >
  //                       -
  //                     </div>
  //                   </Td>
  //                 );
  //               })}
  //           </Tr>
  //         );
  //       }
  //     }).filter(Boolean)
  //   : undefined;

  // Subjects and courses related to skills and arts
  // const renderOtherSubjectsRows = studyProgress.otherSubjects
  //   ? OTHER_SUBJECT_OUTSIDE_HOPS_CS.map((s) => {
  //       if (
  //         studyProgress.otherSubjects[s] &&
  //         studyProgress.otherSubjects[s].length !== 0
  //       ) {
  //         return studyProgress.otherSubjects[s].map((c, index) => {
  //           const listItemModifiers = ["subject"];

  //           return (
  //             <Tr key={index} modifiers={["course"]}>
  //               <Td
  //                 colSpan={currentMaxCourses + 1}
  //                 modifiers={listItemModifiers}
  //               >
  //                 <div>
  //                   {c.courseName}
  //                   {!c.transferCreditMandatory ? "*" : null}
  //                 </div>
  //               </Td>
  //             </Tr>
  //           );
  //         });
  //       }
  //     }).filter(Boolean)
  //   : undefined;

  return (
    <Table modifiers={["course"]}>
      <TableHead modifiers={["course", "sticky"]}>
        <Tr modifiers={["course"]}>
          <Th modifiers={["subject"]}>
            {t("labels.schoolSubject", { ns: "studyMatrix" })}
          </Th>
          <Th colSpan={currentMaxCourses}>
            {t("labels.courses", { ns: "studyMatrix" })}
          </Th>
        </Tr>
      </TableHead>
      <ProgressTableContent
        {...props}
        matrix={matrix}
        currentMaxCourses={currentMaxCourses}
        renderMandatoryCourseCell={({ subject, course, tdModifiers }) => (
          // Your HOPS planning specific mandatory cell rendering
          <Td
            key={`${subject.subjectCode}-${course.courseNumber}`}
            modifiers={tdModifiers}
          >
            <></>
          </Td>
        )}
        renderOptionalCourseCell={({ subject, course, tdModifiers }) => (
          // Your HOPS planning specific optional cell rendering
          <Td
            key={`${subject.subjectCode}-${course.courseNumber}`}
            modifiers={tdModifiers}
          >
            <></>
          </Td>
        )}
      />
      {/* {renderSkillsAndArtRows && renderSkillsAndArtRows.length !== 0 && (
        <ProgressTableBody
          title={t("labels.transferedSkillAndArt", { ns: "studyMatrix" })}
          currentMaxCourses={currentMaxCourses}
        >
          {renderSkillsAndArtRows}
        </ProgressTableBody>
      )} */}

      {/* {renderOtherLanguageSubjectsRows &&
        renderOtherLanguageSubjectsRows.length !== 0 && (
          <ProgressTableBody
            title={t("labels.transferedLanguages", { ns: "studyMatrix" })}
            currentMaxCourses={currentMaxCourses}
          >
            {renderOtherLanguageSubjectsRows}
          </ProgressTableBody>
        )} */}

      {/* {renderOtherSubjectsRows && renderOtherSubjectsRows.length !== 0 && (
        <ProgressTableBody
          title={t("labels.transferedOther", { ns: "studyMatrix" })}
          currentMaxCourses={currentMaxCourses}
        >
          {renderOtherSubjectsRows}
        </ProgressTableBody>
      )} */}
    </Table>
  );
};

export default HopsPlanningTable;
