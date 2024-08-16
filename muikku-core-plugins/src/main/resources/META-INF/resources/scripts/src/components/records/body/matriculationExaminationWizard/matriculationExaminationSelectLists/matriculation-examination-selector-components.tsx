// import * as React from "react";
// import "~/sass/elements/matriculation.scss";
// import "~/sass/elements/wcag.scss";
// import Button from "~/components/general/button";
// import { SUBJECT_MAP, EXAMINATION_GRADES_MAP } from "../index";
// import { ExaminationFunding } from "../../../../../@types/shared";
// import {
//   ExaminationEnrolledSubject,
//   ExaminationFinishedSubject,
//   ExaminationPlannedSubject,
// } from "../../../../../@types/shared";

// /**
//  * MatriculationExaminationSubjectInputGroupProps
//  */
// interface MatriculationExaminationEnrolledInputGroupProps {
//   index: number;
//   subject: ExaminationEnrolledSubject;
//   selectedSubjectList: string[];
//   isFailedBefore?: boolean;
//   isSucceedBefore?: boolean;
//   useSubjectSelect?: boolean;
//   useMandatorySelect?: boolean;
//   useRepeatSelect?: boolean;
//   useFundingSelect?: boolean;
//   readOnly?: boolean;
//   isConflictingRepeat?: (attendance: ExaminationEnrolledSubject) => boolean;
//   isConflictingMandatory?: (attendance: ExaminationEnrolledSubject) => boolean;
//   onSubjectGroupChange: <T extends keyof ExaminationEnrolledSubject>(
//     key: T,
//     value: ExaminationEnrolledSubject[T],
//     index: number
//   ) => void;
//   onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
// }

// /**
//  * MatriculationExaminationEnrolledInputGroup
//  * @param props props
//  */
// export const MatriculationExaminationEnrolledInputGroup: React.FC<
//   MatriculationExaminationEnrolledInputGroupProps
// > = (props) => {
//   const {
//     subject,
//     index,
//     onSubjectGroupChange,
//     selectedSubjectList,
//     onClickDeleteRow,
//     isFailedBefore,
//     isSucceedBefore,
//     isConflictingRepeat,
//     isConflictingMandatory,
//     readOnly,
//     ...useSelectProps
//   } = props;

//   return (
//     <>
//       {useSelectProps.useSubjectSelect && (
//         <div
//           style={subject.subject === "" ? { background: "pink" } : {}}
//           className="matriculation__form-element-container matriculation__form-element-container--input"
//         >
//           <SubjectSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.subject}
//             selectedValues={selectedSubjectList}
//             modifier="Enroll"
//             onChange={(e) =>
//               onSubjectGroupChange("subject", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectProps.useMandatorySelect && (
//         <div
//           className={`matriculation__form-element-container matriculation__form-element-container--input${
//             subject.mandatory === "" ||
//             (isConflictingMandatory && isConflictingMandatory(subject))
//               ? " matriculation__form-element-container--mandatory-conflict"
//               : ""
//           } `}
//         >
//           <MandatorySelect
//             i={index}
//             disabled={readOnly}
//             value={subject.mandatory}
//             modifier="Enroll"
//             onChange={(e) =>
//               onSubjectGroupChange("mandatory", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectProps.useRepeatSelect && (
//         <div
//           className={`matriculation__form-element-container matriculation__form-element-container--input${
//             subject.repeat === "" ||
//             (isConflictingRepeat && isConflictingRepeat(subject))
//               ? " matriculation__form-element-container--repeat-conflict"
//               : ""
//           } `}
//         >
//           <RepeatSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.repeat}
//             modifier="Enroll"
//             onChange={(e) =>
//               onSubjectGroupChange("repeat", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectProps.useFundingSelect && (
//         <div
//           className={`matriculation__form-element-container matriculation__form-element-container--input ${
//             isFailedBefore &&
//             subject.funding !==
//               ExaminationFunding.COMPULSORYEDUCATION_FREE_RETRY
//               ? "matriculation__form-element-container--repeatable-info"
//               : ""
//           }`}
//         >
//           <FundingSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.funding}
//             isFailedBefore={isFailedBefore}
//             isSucceedBefore={isSucceedBefore}
//             onChange={(e) =>
//               onSubjectGroupChange("funding", e.target.value, index)
//             }
//             modifier="Enroll"
//           />
//         </div>
//       )}

//       {!readOnly && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--button">
//           {index == 0 ? (
//             <label
//               id="removeMatriculationRowLabelEnrolled"
//               className="visually-hidden"
//             >
//               Poista
//             </label>
//           ) : null}
//           <Button
//             aria-labelledby="removeMatriculationRowLabelEnrolled"
//             icon="trash"
//             buttonModifiers={"remove-matriculation-row"}
//             onClick={onClickDeleteRow(index)}
//           ></Button>
//         </div>
//       )}
//     </>
//   );
// };

// /**
//  * MatriculationExaminationSubjectInputGroupProps
//  */
// interface MatriculationExaminationFinishedInputGroupProps {
//   index: number;
//   enrolledAttendances: ExaminationEnrolledSubject[];
//   subject: ExaminationFinishedSubject;
//   selectedSubjectList: string[];
//   pastTermOptions: JSX.Element[];
//   useTermSelect?: boolean;
//   useSubjectSelect?: boolean;
//   useMandatorySelect?: boolean;
//   useGradeSelect?: boolean;
//   useFundingSelect?: boolean;
//   readOnly?: boolean;
//   onSubjectGroupChange: <T extends keyof ExaminationFinishedSubject>(
//     key: T,
//     value: ExaminationFinishedSubject[T],
//     index: number
//   ) => void;
//   onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
// }

// /**
//  * MatriculationExaminationSubjectInputGroup
//  * @param props props
//  */
// export const MatriculationExaminationFinishedInputGroup: React.FC<
//   MatriculationExaminationFinishedInputGroupProps
// > = (props) => {
//   const {
//     index,
//     subject,
//     selectedSubjectList,
//     enrolledAttendances,
//     pastTermOptions,
//     onSubjectGroupChange,
//     onClickDeleteRow,
//     readOnly,
//     ...useSelectsProps
//   } = props;

//   return (
//     <>
//       {useSelectsProps.useTermSelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <TermSelect
//             i={index}
//             disabled={readOnly}
//             options={pastTermOptions}
//             value={subject.term}
//             modifier="Completed"
//             onChange={(e) =>
//               onSubjectGroupChange("term", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectsProps.useSubjectSelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <SubjectSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.subject}
//             selectedValues={selectedSubjectList}
//             modifier="Completed"
//             onChange={(e) =>
//               onSubjectGroupChange("subject", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectsProps.useMandatorySelect && (
//         <div
//           className={`matriculation__form-element-container matriculation__form-element-container--input${
//             !readOnly &&
//             enrolledAttendances.filter(
//               (era) =>
//                 era.subject === subject.subject &&
//                 era.mandatory != subject.mandatory
//             ).length > 0
//               ? " matriculation__form-element-container--mandatory-conflict"
//               : ""
//           } `}
//         >
//           <MandatorySelect
//             i={index}
//             disabled={readOnly}
//             value={subject.mandatory}
//             modifier="Completed"
//             onChange={(e) =>
//               onSubjectGroupChange("mandatory", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectsProps.useGradeSelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <GradeSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.grade}
//             modifier="Completed"
//             onChange={(e) =>
//               onSubjectGroupChange("grade", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectsProps.useFundingSelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <FundingSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.funding}
//             onChange={(e) =>
//               onSubjectGroupChange("funding", e.target.value, index)
//             }
//             modifier="Enroll"
//           />
//         </div>
//       )}

//       {!readOnly && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--button">
//           {index == 0 ? (
//             <label
//               id="removeMatriculationRowLabelFinished"
//               className="visually-hidden"
//             >
//               Poista
//             </label>
//           ) : null}
//           <Button
//             aria-labelledby="removeMatriculationRowLabelFinished"
//             icon="trash"
//             buttonModifiers={"remove-matriculation-row"}
//             onClick={onClickDeleteRow(index)}
//           ></Button>
//         </div>
//       )}
//     </>
//   );
// };

// /**
//  * MatriculationExaminationFutureSubjectsGroupProps
//  */
// interface MatriculationExaminationPlannedInputGroupProps {
//   index: number;
//   subject: ExaminationPlannedSubject;
//   selectedSubjectList: string[];
//   nextOptions: JSX.Element[];
//   useTermSelect?: boolean;
//   useSubjectSelect?: boolean;
//   useMandatorySelect?: boolean;
//   readOnly?: boolean;
//   onSubjectGroupChange: <T extends keyof ExaminationPlannedSubject>(
//     key: T,
//     value: ExaminationPlannedSubject[T],
//     index: number
//   ) => void;
//   onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
// }

// /**
//  * MatriculationExaminationFutureSubjectsGroup
//  * @param props props
//  */
// export const MatriculationExaminationPlannedInputGroup: React.FC<
//   MatriculationExaminationPlannedInputGroupProps
// > = (props) => {
//   const {
//     index,
//     subject,
//     selectedSubjectList,
//     nextOptions,
//     onSubjectGroupChange,
//     onClickDeleteRow,
//     readOnly,
//     ...useSelectsProps
//   } = props;

//   return (
//     <>
//       {useSelectsProps.useTermSelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <TermSelect
//             i={index}
//             disabled={readOnly}
//             options={nextOptions}
//             value={subject.term}
//             modifier="Future"
//             onChange={(e) =>
//               onSubjectGroupChange("term", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectsProps.useSubjectSelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <SubjectSelect
//             i={index}
//             disabled={readOnly}
//             value={subject.subject}
//             selectedValues={selectedSubjectList}
//             modifier="Future"
//             onChange={(e) =>
//               onSubjectGroupChange("subject", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {useSelectsProps.useMandatorySelect && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--input">
//           <MandatorySelect
//             i={index}
//             disabled={readOnly}
//             value={subject.mandatory}
//             modifier="Future"
//             onChange={(e) =>
//               onSubjectGroupChange("mandatory", e.target.value, index)
//             }
//           />
//         </div>
//       )}

//       {!readOnly && (
//         <div className="matriculation__form-element-container matriculation__form-element-container--button">
//           {index == 0 ? (
//             <label
//               id="removeMatriculationRowLabelPlanned"
//               className="visually-hidden"
//             >
//               Poista
//             </label>
//           ) : null}
//           <Button
//             aria-labelledby="removeMatriculationRowLabelPlanned"
//             icon="trash"
//             buttonModifiers={"remove-matriculation-row"}
//             onClick={onClickDeleteRow(index)}
//           ></Button>
//         </div>
//       )}
//     </>
//   );
// };

// /**
//  * SubjectSelectProps
//  */
// interface SubjectSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   selectedValues: string[];
//   modifier: string;
// }

// /**
//  * SubjectSelect
//  * @param props props
//  * @returns JSX.Element
//  */
// const SubjectSelect: React.FC<SubjectSelectProps> = (props) => {
//   const { i, selectedValues, modifier, ...selectProps } = props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationSubjectSelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Aine
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationSubjectSelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         {Object.keys(SUBJECT_MAP).map((subjectCode, index) => {
//           const subjectName = SUBJECT_MAP[subjectCode];
//           const disabled = selectedValues.indexOf(subjectCode) != -1;

//           return (
//             <option key={index} value={subjectCode} disabled={disabled}>
//               {subjectName}
//             </option>
//           );
//         })}
//       </select>
//     </>
//   );
// };

// /**
//  * TermSelectProps
//  */
// interface TermSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   options: JSX.Element[];
//   modifier: string;
// }

// /**
//  * TermSelect
//  * @param props props
//  * @returns JSX.Element
//  */
// const TermSelect: React.FC<TermSelectProps> = (props) => {
//   const { i, options, modifier, ...selectProps } = props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationTermSelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Ajankohta
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationTermSelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         <option value="">Valitse...</option>
//         <>{options}</>
//       </select>
//     </>
//   );
// };

// /**
//  * MandatorySelectProps
//  */
// interface MandatorySelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   value: string;
//   modifier: string;
// }

// /**
//  * MandatorySelect
//  * @param props props
//  */
// const MandatorySelect: React.FC<MandatorySelectProps> = (props) => {
//   const { i, modifier, ...selectProps } = props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationMandatorySelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Pakollisuus
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationMandatorySelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         <option value="">Valitse...</option>
//         <option value="true">Pakollinen</option>
//         <option value="false">Ylimääräinen</option>
//       </select>
//     </>
//   );
// };

// /**
//  * RepeatSelectProps
//  */
// interface RepeatSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   modifier: string;
// }

// /**
//  * RepeatSelect
//  * @param props props
//  * @returns JSX.Element
//  */
// const RepeatSelect: React.FC<RepeatSelectProps> = (props) => {
//   const { i, modifier, ...selectProps } = props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationRepeatSelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Uusiminen
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationRepeatSelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         <option value="">Valitse...</option>
//         <option value="false">Ensimmäinen suorituskerta</option>
//         <option value="true">Uusinta</option>
//       </select>
//     </>
//   );
// };

// /**
//  * GradeSelectProps
//  */
// interface GradeSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   modifier: string;
// }

// /**
//  * GradeSelect
//  * @param props props
//  * @returns JSX.Element
//  */
// const GradeSelect: React.FC<GradeSelectProps> = (props) => {
//   const { i, modifier, ...selectProps } = props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationGradeSelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Arvosana
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         <option value="">Valitse...</option>
//         {Object.keys(EXAMINATION_GRADES_MAP).map((subjectCode, index) => {
//           const subjectName = EXAMINATION_GRADES_MAP[subjectCode];

//           return (
//             <option key={index} value={subjectCode}>
//               {subjectName}
//             </option>
//           );
//         })}
//       </select>
//     </>
//   );
// };

// /**
//  * FundingSelectProps
//  */
// interface FundingSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   modifier: string;
//   isFailedBefore?: boolean;
//   isSucceedBefore?: boolean;
// }

// /**
//  * FundingSelect
//  * @param props props
//  * @returns JSX.Element
//  */
// const FundingSelect: React.FC<FundingSelectProps> = (props) => {
//   const { i, modifier, isFailedBefore, isSucceedBefore, ...selectProps } =
//     props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationGradeSelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Rahoitus
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         {isSucceedBefore ? (
//           <>
//             <option value="">Valitse...</option>
//             <option value={ExaminationFunding.SELF_FUNDED}>
//               Itserahoitettu
//             </option>
//           </>
//         ) : null}

//         {isFailedBefore ? (
//           <>
//             <option value="">Valitse...</option>
//             <option value={ExaminationFunding.SELF_FUNDED}>
//               Itserahoitettu
//             </option>
//             <option value={ExaminationFunding.COMPULSORYEDUCATION_FREE_RETRY}>
//               Maksuton ylioppilaskoe (uusinta)
//             </option>
//           </>
//         ) : null}

//         {!isFailedBefore && !isSucceedBefore ? (
//           <>
//             <option value="">Valitse...</option>
//             <option value={ExaminationFunding.SELF_FUNDED}>
//               Itserahoitettu
//             </option>
//             <option value={ExaminationFunding.COMPULSORYEDUCATION_FREE}>
//               Maksuton ylioppilaskoe
//             </option>
//             <option value={ExaminationFunding.COMPULSORYEDUCATION_FREE_RETRY}>
//               Maksuton ylioppilaskoe (uusinta)
//             </option>
//           </>
//         ) : null}
//       </select>
//     </>
//   );
// };

// /**
//  * FailedReasonSelectProps
//  */
// interface FailedReasonSelectProps
//   extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   i: number;
//   modifier: string;
// }

// /**
//  * FailedReasonSelect
//  * @param props props
//  * @returns JSX.Element
//  */
// export const FailedReasonSelect: React.FC<FailedReasonSelectProps> = (
//   props
// ) => {
//   const { i, modifier, ...selectProps } = props;

//   return (
//     <>
//       {i == 0 ? (
//         <label
//           id={`matriculationGradeSelectLabel${modifier}`}
//           className="matriculation__label"
//         >
//           Hylkäyksen syy
//         </label>
//       ) : null}
//       <select
//         aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
//         {...selectProps}
//         disabled={selectProps.disabled}
//         className="matriculation__select"
//       >
//         <option>
//           Kokelaan koe on hylätty, koska kokelas on jättänyt saapumatta
//           koetilaisuuteen
//         </option>
//         <option>
//           Kokelaan koe on hylätty, koska kokelas ei ole jättänyt koesuoritusta
//           arvosteltavaksi
//         </option>
//         <option>
//           Kokelaan koe on hylätty vilpin tai koetilaisuuden järjestyksen
//           häiritsemisen vuoksi
//         </option>
//       </select>
//     </>
//   );
// };
