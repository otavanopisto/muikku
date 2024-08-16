// import * as React from "react";
// import { ExaminationEnrolledSubject } from "../../../../../@types/shared";
// import "~/sass/elements/matriculation.scss";
// import { MatriculationExaminationEnrolledInputGroup } from "./matriculation-examination-selector-components";

// /**
//  * MatriculationExaminationSubjectSelectsListProps
//  */
// interface MatriculationExaminationEnrolledAttendesListProps {
//   onChange?: (
//     modifiedExaminationAttendedSubjectList: ExaminationEnrolledSubject[]
//   ) => void;
//   readOnly?: boolean;
//   useSubjectSelect?: boolean;
//   useMandatorySelect?: boolean;
//   useRepeatSelect?: boolean;
//   useFundingSelect?: boolean;
//   failedFinishedList?: string[];
//   succesFinishedList?: string[];
//   examinationEnrolledList: ExaminationEnrolledSubject[];
//   isConflictingMandatory?: (attendance: ExaminationEnrolledSubject) => boolean;
//   conflictingAttendancesGroup?: string[][];
//   isConflictingRepeat?: (attendance: ExaminationEnrolledSubject) => boolean;
//   onDeleteRow?: (index: number) => (e: React.MouseEvent) => void;
// }

// const defaultUseSelectsProps = {
//   useSubjectSelect: true,
//   useMandatorySelect: true,
//   useRepeatSelect: true,
//   useFundingSelect: false,
// };

// /**
//  * MatriculationExaminationSubjectSelectsList
//  * @param props props
//  * @returns JSX.Element
//  */
// export const MatriculationExaminationEnrolledAttendesList: React.FC<
//   MatriculationExaminationEnrolledAttendesListProps
// > = (props) => {
//   props = { ...defaultUseSelectsProps, ...props };

//   const {
//     onChange,
//     examinationEnrolledList,
//     failedFinishedList,
//     succesFinishedList,
//     conflictingAttendancesGroup,
//     onDeleteRow,
//     readOnly,
//     ...rest
//   } = props;

//   /**
//    * Handles matriculation examation enrolled subject group change
//    * @param key key
//    * @param value value
//    * @param index index
//    */
//   const handleMatriculationExaminationSubjectGroupChange = <
//     T extends keyof ExaminationEnrolledSubject
//   >(
//     key: T,
//     value: ExaminationEnrolledSubject[T],
//     index: number
//   ) => {
//     const modifiedExaminationEnrolledList = examinationEnrolledList;

//     modifiedExaminationEnrolledList[index][key] = value;

//     onChange(modifiedExaminationEnrolledList);
//   };

//   /**
//    * List of selected subject string keys
//    */
//   const selectedSubjects = examinationEnrolledList.map(
//     (sSubject) => sSubject.subject
//   );

//   return (
//     <>
//       {examinationEnrolledList.map((subject, index) => {
//         /**
//          * Checks if course conflicts
//          */
//         const conflictedCourse =
//           conflictingAttendancesGroup &&
//           conflictingAttendancesGroup.some(
//             (r) => r.indexOf(subject.subject) >= 0
//           );

//         const failedBefore =
//           failedFinishedList && failedFinishedList.includes(subject.subject);

//         const succeedBefore =
//           succesFinishedList && succesFinishedList.includes(subject.subject);

//         return (
//           <div
//             key={index}
//             className={`matriculation-container__row matriculation-container__row--input-groups ${
//               conflictedCourse
//                 ? "matriculation-container__row--input-groups--conflicted"
//                 : ""
//             }`}
//           >
//             <MatriculationExaminationEnrolledInputGroup
//               index={index}
//               readOnly={readOnly}
//               subject={subject}
//               isFailedBefore={failedBefore}
//               isSucceedBefore={succeedBefore}
//               selectedSubjectList={selectedSubjects}
//               onSubjectGroupChange={
//                 handleMatriculationExaminationSubjectGroupChange
//               }
//               onClickDeleteRow={onDeleteRow}
//               {...rest}
//             />
//           </div>
//         );
//       })}
//     </>
//   );
// };
