// import * as React from "react";
// import "~/sass/elements/matriculation.scss";
// import { MatriculationExaminationEnrolledAttendesList } from "./matriculationExaminationSelectLists/matriculation-examination-enrolled-attendes-list";
// import { MatriculationExaminationFinishedAttendesList } from "./matriculationExaminationSelectLists/matriculation-examination-finished-attendes-list";
// import { MatriculationExaminationPlannedAttendesList } from "./matriculationExaminationSelectLists/matriculation-examination-planned-attendes-list";
// import { Textarea } from "./textarea";
// import { TextField } from "./textfield";
// import Button from "~/components/general/button";
// import { SavingDraftError } from "./saving-draft-error";
// import { SavingDraftInfo } from "./saving-draft-info";
// import { ExamEnrollmentDegreeStructure } from "../../../../@types/shared";
// import {
//   getDefaultNextTerm,
//   getDefaultPastTerm,
// } from "../../../../helper-functions/matriculation-functions";
// import {
//   SUBJECT_MAP,
//   FINNISH_SUBJECTS,
//   ACADEMIC_SUBJECTS,
//   ADVANCED_SUBJECTS,
// } from "./index";

// import {
//   SaveState,
//   ExaminationInformation,
//   ExaminationEnrolledSubject,
//   ExaminationFinishedSubject,
//   ExaminationPlannedSubject,
// } from "../../../../@types/shared";

// import {
//   resolveCurrentTerm,
//   getNextTermOptions,
//   getPastTermOptions,
// } from "../../../../helper-functions/matriculation-functions";

// /**
//  * Specific rules for old form
//  */
// const REQUIRED_FINNISH_ATTENDANCES = 1;
// const REQUIRED_MANDATORY_ATTENDANCES = 4;
// const REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN = 2;
// const REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN = 0;
// const REQUIRED_NUM_OF_COURSES = 20;

// /**
//  * MatriculationExaminationEnrollmentInformationProps
//  */
// interface MatriculationExaminationEnrollmentInformationProps {
//   examination: ExaminationInformation;
//   saveState?: SaveState;
//   draftSaveErrorMsg?: string;
//   onChange: (examination: ExaminationInformation) => void;
// }

// type MatriculationExaminationEnrollmentInformationState =
//   ExaminationInformation;

// /**
//  * MatriculationExaminationEnrollmentInformation
//  */
// export class MatriculationExaminationEnrollmentInformation extends React.Component<
//   MatriculationExaminationEnrollmentInformationProps,
//   MatriculationExaminationEnrollmentInformationState
// > {
//   /**
//    * constructor
//    * @param props props
//    */
//   constructor(props: MatriculationExaminationEnrollmentInformationProps) {
//     super(props);

//     this.state = {
//       name: "",
//       email: "",
//       phone: "",
//       address: "",
//       postalCode: "",
//       locality: "",
//       changedContactInfo: "",
//       guider: "",
//       enrollAs: "UPPERSECONDARY",
//       degreeType: "MATRICULATIONEXAMINATION",
//       numMandatoryCourses: "",
//       restartExam: false,
//       location: "Mikkeli",
//       message: "",
//       studentIdentifier: "",
//       initialized: false,
//       enrolledAttendances: [],
//       plannedAttendances: [],
//       finishedAttendances: [],
//       canPublishName: "true",
//       enrollmentSent: false,
//       guidanceCounselor: "",
//       ssn: null,
//       date: "",
//       degreeStructure: ExamEnrollmentDegreeStructure.PRE2022,
//     };

//     this.isValidated = this.isValidated.bind(this);
//   }

//   /**
//    * Set props to state
//    */
//   componentDidMount = () => {
//     this.setState(this.props.examination);
//   };

//   /**
//    * Updates props to state
//    * @param prevProps prevProps
//    */
//   componentDidUpdate = (
//     prevProps: MatriculationExaminationEnrollmentInformationProps
//   ) => {
//     if (this.props !== prevProps) {
//       this.setState(this.props.examination);
//     }
//   };

//   /**
//    * This is for StepZilla way to validated "step"
//    * that locks users way to get further in form
//    * before all data is given and valitated
//    * @returns boolean
//    */
//   isValidated = () => !this.isInvalid();

//   /**
//    * Returns next non selected subject from subjects list
//    *
//    * @param selectedSubjects list of selected subjects
//    * @returns next non selected subject from subjects list
//    */
//   getDefaultSubject = (selectedSubjects: string[]) => {
//     const subjects = Object.keys(SUBJECT_MAP);

//     for (let i = 0; i < subjects.length; i++) {
//       if (selectedSubjects.indexOf(subjects[i]) === -1) {
//         return subjects[i];
//       }
//     }

//     return null;
//   };

//   /**
//    * Returns list of enrolled subjects from enrolled attendances lists
//    *
//    * @returns list of enrolled subjects from enrolled attendances lists
//    */
//   getEnrolledSubjects = () =>
//     this.state.enrolledAttendances.map((attendance) => attendance.subject);

//   /**
//    * Returns list of planned subjects from planned attendances lists
//    *
//    * @returns list of planned subjects from planned attendances lists
//    */
//   getPlannedSubjects = () =>
//     this.state.plannedAttendances.map((attendance) => attendance.subject);

//   /**
//    * Returns list of finished subjects from finished attendances lists
//    *
//    * @returns list of finished subjects from finished attendances lists
//    */
//   getFinishedSubjects = () =>
//     this.state.finishedAttendances.map((attendance) => attendance.subject);

//   /**
//    * Returns an array of attendances which includes enrolledAttendances, plannedAttendances
//    * and such finishedAttendances that have subjects not yet included from the previous
//    * two lists.
//    *
//    * I.e. the array is missing the duplicates (repeated exams) which come from finished list.
//    */
//   getNonDuplicateAttendances() {
//     const attendances = [].concat(
//       this.state.enrolledAttendances,
//       this.state.plannedAttendances
//     );
//     const attendedSubjects = attendances.map(
//       (attendance) => attendance.subject
//     );

//     this.state.finishedAttendances.forEach((finishedAttendance) => {
//       if (attendedSubjects.indexOf(finishedAttendance.subject) === -1) {
//         attendances.push(finishedAttendance);
//       }
//     });

//     return attendances;
//   }

//   /**
//    * Returns count of attendances in finnish courses.
//    *
//    * Attendances with grade IMPROBATUR are ignored while counting attendances
//    *
//    * @returns count of attendances in finnish courses
//    */
//   getAmountOfFinnishAttendances() {
//     return this.getNonDuplicateAttendances().filter(
//       (attendance) => FINNISH_SUBJECTS.indexOf(attendance.subject) !== -1
//     ).length;
//   }

//   /**
//    * Returns count of attendances in mandatory courses
//    *
//    * Attendances with grade IMPROBATUR are ignored while counting attendances
//    *
//    * @returns count of attendances in mandatory courses
//    */
//   getAmountOfMandatoryAttendances() {
//     return this.getNonDuplicateAttendances().filter(
//       (attendance) => attendance.mandatory === "true"
//     ).length;
//   }

//   /**
//    * Returns count of attendances in academic subjects
//    *
//    * Attendances with grade IMPROBATUR are ignored while counting attendances
//    *
//    * @returns count of attendances in academic subjects
//    */
//   getAmountOfAcademicSubjectAttendances() {
//     return this.getNonDuplicateAttendances().filter(
//       (attendance) =>
//         attendance.mandatory === "true" &&
//         ACADEMIC_SUBJECTS.indexOf(attendance.subject) !== -1
//     ).length;
//   }

//   /**
//    * Returns whether user has valid amount of attendances in mandatory advanced subjects
//    *
//    * Attendances with grade IMPROBATUR are ignored while counting attendances
//    *
//    * @returns whether user has valid amount of attendances in mandatory advanced subjects
//    */
//   getAmountOfMandatoryAdvancedSubjectAttendances() {
//     return this.getNonDuplicateAttendances().filter(
//       (attendance) =>
//         attendance.mandatory === "true" &&
//         ADVANCED_SUBJECTS.indexOf(attendance.subject) !== -1
//     ).length;
//   }

//   /**
//    * Returns whether attendance details are valid
//    *
//    * @returns whether attendance details are valid
//    */
//   isValidAttendances = () =>
//     this.getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES &&
//     this.getAmountOfMandatoryAttendances() == REQUIRED_MANDATORY_ATTENDANCES &&
//     this.getAmountOfAcademicSubjectAttendances() <
//       REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN &&
//     this.getAmountOfMandatoryAdvancedSubjectAttendances() >
//       REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN;

//   /**
//    * isConflictingAttendances
//    * @returns list of subject groups where subject conflicted together
//    */
//   isConflictingAttendances = (): string[][] => {
//     // Can't enroll to two subjects that are in the same group
//     const conflictingGroups = [
//       ["AI", "S2"],
//       ["UE", "ET", "YO", "KE", "GE", "TT"],
//       ["RUA", "RUB"],
//       ["PS", "FI", "HI", "FY", "BI"],
//       ["MAA", "MAB"],
//     ];

//     const subjectCodes: string[] = [];

//     /**
//      * Creates array of string from attendance subject codes
//      */
//     for (const attendance of this.state.enrolledAttendances) {
//       subjectCodes.push(attendance.subject);
//     }

//     let conflictedGroups = [];

//     /**
//      * Creates list of conflicted group by subject that conflicts together
//      * This will create duplicated of same items to array that are removed later
//      */
//     for (const group of conflictingGroups) {
//       for (const subject1 of subjectCodes) {
//         for (const subject2 of subjectCodes) {
//           if (
//             subject1 !== subject2 &&
//             group.includes(subject1) &&
//             group.includes(subject2)
//           ) {
//             conflictedGroups.push(group);
//           }
//         }
//       }
//     }

//     const tmp: string[] = [];

//     /**
//      * Remove dublicated conflicted groups
//      */
//     conflictedGroups = conflictedGroups.filter((v) => {
//       if (tmp.indexOf(v.toString()) < 0) {
//         tmp.push(v.toString());
//         return v;
//       }
//     });

//     const conflictSubjectGroups: string[][] = [];

//     /**
//      * Returns list of subject that conflict together by conflictgroup
//      */
//     for (const cGroup of conflictedGroups) {
//       const array: string[] = [];

//       for (const subject of subjectCodes) {
//         if (cGroup.includes(subject)) {
//           array.push(subject);
//         }
//       }
//       conflictSubjectGroups.push(array);
//     }

//     return conflictSubjectGroups;
//   };

//   /**
//    * Checks if any attendes has empty values
//    * @returns boolean
//    */
//   isIncompleteAttendances = (): boolean => {
//     for (const attendance of this.state.enrolledAttendances) {
//       if (
//         attendance.subject === "" ||
//         attendance.mandatory === "" ||
//         attendance.repeat === ""
//       ) {
//         return true;
//       }
//     }
//     for (const attendance of this.state.finishedAttendances) {
//       if (
//         attendance.term === "" ||
//         attendance.subject === "" ||
//         attendance.mandatory === "" ||
//         attendance.grade === ""
//       ) {
//         return true;
//       }
//     }
//     for (const attendance of this.state.plannedAttendances) {
//       if (
//         attendance.term === "" ||
//         attendance.subject === "" ||
//         attendance.mandatory === ""
//       ) {
//         return true;
//       }
//     }
//   };

//   /**
//    * Returns true if enrolled attendance is not a repeat but there is a
//    * previous exam with the same subject.
//    * @param attendance attendance
//    */
//   isConflictingRepeat = (attendance: ExaminationEnrolledSubject) => {
//     if (attendance.repeat === "false") {
//       return this.getFinishedSubjects().indexOf(attendance.subject) != -1;
//     } else {
//       return false;
//     }
//   };

//   /**
//    * Returns true if there are any conflicting repeats; see isConflictingRepeat.
//    */
//   hasConflictingRepeats = () => {
//     const finishedSubjects = this.getFinishedSubjects();

//     return (
//       this.state.enrolledAttendances.filter(
//         (attendance) =>
//           attendance.repeat === "false" &&
//           finishedSubjects.indexOf(attendance.subject) != -1
//       ).length > 0
//     );
//   };

//   /**
//    * Returns true if there is a finished attendance with the same subject but different mandatory.
//    * @param attendance attendance
//    */
//   isConflictingMandatory = (attendance: ExaminationEnrolledSubject) =>
//     this.state.finishedAttendances.filter(
//       (fin) =>
//         fin.subject === attendance.subject &&
//         fin.mandatory != attendance.mandatory
//     ).length > 0;

//   /**
//    * Returns true if there are any conflicting mandatories; see isConflictingMandatory.
//    */
//   hasMandatoryConflicts = () => {
//     const attendances = [].concat(
//       this.state.enrolledAttendances,
//       this.state.plannedAttendances
//     );
//     return (
//       attendances.filter(
//         (attendance) =>
//           this.state.finishedAttendances.filter(
//             (fin) =>
//               fin.subject === attendance.subject &&
//               fin.mandatory != attendance.mandatory
//           ).length > 0
//       ).length > 0
//     );
//   };

//   /**
//    * Checks if form has any conflicted courses selected
//    * @returns boolean
//    */
//   isInvalid() {
//     return (
//       this.isConflictingAttendances().length > 0 ||
//       this.hasConflictingRepeats() ||
//       this.hasMandatoryConflicts() ||
//       this.isIncompleteAttendances() ||
//       !this.isValidAttendances()
//     );
//   }

//   /**
//    * handles examination information changes and passes it to parent component
//    * @param key key of changed value
//    * @param value value
//    */
//   handleExaminationInformationChange = <T extends keyof ExaminationInformation>(
//     key: T,
//     value: ExaminationInformation[T]
//   ) => {
//     const { examination, onChange } = this.props;

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       [key]: value,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles adding new enrolled attendes to list and passed modfied examination information to parent
//    */
//   handleNewEnrolledAttendanceClick = () => {
//     const { examination, onChange } = this.props;

//     const enrolledAttendances = this.state.enrolledAttendances;

//     enrolledAttendances.push({
//       subject: this.getDefaultSubject(this.getEnrolledSubjects()),
//       mandatory: "true",
//       repeat: "false",
//       status: "ENROLLED",
//     });

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       enrolledAttendances,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles adding new finished attendes to list and passed modfied examination information to parent
//    */
//   handleNewFinishedAttendanceClick = () => {
//     const { examination, onChange } = this.props;

//     const finishedAttendances = this.state.finishedAttendances;

//     finishedAttendances.push({
//       term: getDefaultPastTerm().value,
//       subject: this.getDefaultSubject(this.getFinishedSubjects()),
//       mandatory: "false",
//       grade: "UNKNOWN",
//       status: "FINISHED",
//     });

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       finishedAttendances,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles adding new planned attendes to list and passed modfied examination information to parent
//    */
//   handleNewPlannedAttendanceClick = () => {
//     const { examination, onChange } = this.props;

//     const plannedAttendances = this.state.plannedAttendances;

//     plannedAttendances.push({
//       term: getDefaultNextTerm().value,
//       subject: this.getDefaultSubject(this.getPlannedSubjects()),
//       mandatory: "true",
//       status: "PLANNED",
//     });

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       plannedAttendances,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles delete enrolled attendance and passes modified examination information to parent
//    * @param i index of row which will be deleted
//    */
//   handleDeleteEnrolledAttendanceRow = (i: number) => () => {
//     const { examination, onChange } = this.props;

//     const enrolledAttendances = this.state.enrolledAttendances;

//     enrolledAttendances.splice(i, 1);

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       enrolledAttendances,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles delete finished attendance and passes modified examination information to parent
//    * @param i index of row which will be deleted
//    */
//   handleDeleteFinishedAttendanceRow = (i: number) => () => {
//     const { examination, onChange } = this.props;

//     const finishedAttendances = this.state.finishedAttendances;

//     finishedAttendances.splice(i, 1);

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       finishedAttendances,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles delete planned attendance and passes modified examination information to parent
//    * @param i index of row which will be deleted
//    */
//   handleDeletePlannedAttendanceRow = (i: number) => () => {
//     const { examination, onChange } = this.props;

//     const plannedAttendances = this.state.plannedAttendances;
//     plannedAttendances.splice(i, 1);

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       plannedAttendances,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handle enrolled attendes list change and passes it to parent component
//    * @param examinationSubjectList examinationSubjectList
//    */
//   handleExaminationEnrolledAttendSubjectListChange = (
//     examinationSubjectList: ExaminationEnrolledSubject[]
//   ) => {
//     const { examination, onChange } = this.props;

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       enrolledAttendances: examinationSubjectList,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles finished attendes list change and passes it to parent component
//    * @param examinationSubjectList examinationSubjectList
//    */
//   handleExaminationFinishedSubjectListChange = (
//     examinationSubjectList: ExaminationFinishedSubject[]
//   ) => {
//     const { examination, onChange } = this.props;

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       finishedAttendances: examinationSubjectList,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * handles planned attendes list change
//    * @param examinationSubjectList examinationSubjectList
//    */
//   handleExaminationPlannedSubjectListChange = (
//     examinationSubjectList: ExaminationPlannedSubject[]
//   ) => {
//     const { examination, onChange } = this.props;

//     const modifiedExamination: ExaminationInformation = {
//       ...examination,
//       plannedAttendances: examinationSubjectList,
//     };

//     onChange(modifiedExamination);
//   };

//   /**
//    * Render method
//    */
//   render() {
//     const { saveState, draftSaveErrorMsg } = this.props;

//     const {
//       name,
//       email,
//       phone,
//       address,
//       postalCode,
//       locality,
//       ssn,
//       restartExam,
//       enrollAs,
//       degreeType,
//       changedContactInfo,
//       guider,
//       numMandatoryCourses,
//       enrolledAttendances,
//       plannedAttendances,
//       finishedAttendances,
//     } = this.state;

//     return (
//       <div className="matriculation-container">
//         <SavingDraftError draftSaveErrorMsg={draftSaveErrorMsg} />
//         <SavingDraftInfo saveState={saveState} />
//         <fieldset className="matriculation-container__fieldset">
//           <legend className="matriculation-container__subheader">
//             Perustiedot
//           </legend>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Nimi"
//                 readOnly
//                 type="text"
//                 defaultValue={name}
//                 className="matriculation__input"
//               />
//             </div>
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Henkilötunnus"
//                 readOnly
//                 type="text"
//                 defaultValue={ssn}
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Sähköpostiosoite"
//                 readOnly
//                 type="text"
//                 defaultValue={email}
//                 className="matriculation__input"
//               />
//             </div>
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Puhelinnumero"
//                 readOnly
//                 type="text"
//                 defaultValue={phone}
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Osoite"
//                 readOnly
//                 type="text"
//                 defaultValue={address}
//                 className="matriculation__input"
//               />
//             </div>
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Postinumero"
//                 readOnly
//                 type="text"
//                 defaultValue={postalCode}
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <TextField
//                 label="Postitoimipaikka"
//                 readOnly
//                 type="text"
//                 defaultValue={locality}
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <Textarea
//                 onChange={(e) =>
//                   this.handleExaminationInformationChange(
//                     "changedContactInfo",
//                     e.target.value
//                   )
//                 }
//                 rows={5}
//                 label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
//                 value={changedContactInfo}
//                 className="matriculation__textarea"
//               />
//             </div>
//           </div>
//         </fieldset>
//         <fieldset className="matriculation-container__fieldset">
//           <legend className="matriculation-container__subheader">
//             Opiskelijatiedot
//           </legend>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <TextField
//                 onChange={(e) =>
//                   this.handleExaminationInformationChange(
//                     "guider",
//                     e.target.value
//                   )
//                 }
//                 label="Ohjaaja"
//                 defaultValue={guider}
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <label className="matriculation__label">Ilmoittautuminen</label>
//               <select
//                 onChange={(e) =>
//                   this.handleExaminationInformationChange(
//                     "enrollAs",
//                     e.currentTarget.value
//                   )
//                 }
//                 value={enrollAs}
//                 className="matriculation__select"
//               >
//                 <option value="UPPERSECONDARY">Lukion opiskelijana</option>
//                 <option value="VOCATIONAL">
//                   Ammatillisten opintojen perusteella
//                 </option>
//                 <option value="UNKNOWN">Muu tausta</option>
//               </select>
//             </div>
//             <div className="matriculation__form-element-container">
//               <TextField
//                 type="number"
//                 onChange={(e) =>
//                   this.handleExaminationInformationChange(
//                     "numMandatoryCourses",
//                     e.target.value
//                   )
//                 }
//                 label="Pakollisia kursseja suoritettuna"
//                 value={numMandatoryCourses}
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container">
//               <label className="matriculation__label">Tutkintotyyppi</label>
//               <select
//                 onChange={(e) =>
//                   this.handleExaminationInformationChange(
//                     "degreeType",
//                     e.currentTarget.value
//                   )
//                 }
//                 value={degreeType}
//                 className="matriculation__select"
//               >
//                 <option value="MATRICULATIONEXAMINATION">Yo-tutkinto</option>
//                 <option value="MATRICULATIONEXAMINATIONSUPPLEMENT">
//                   Tutkinnon korottaja tai täydentäjä
//                 </option>
//                 <option value="SEPARATEEXAM">
//                   Erillinen koe (ilman yo-tutkintoa)
//                 </option>
//               </select>
//             </div>
//           </div>

//           {enrollAs === "UPPERSECONDARY" && numMandatoryCourses === "" ? (
//             <div className="matriculation-container__state state-WARNING">
//               <div className="matriculation-container__state-icon icon-notification"></div>
//               <div className="matriculation-container__state-text">
//                 <p>
//                   Ole hyvä ja täytä suoritettujen pakollisten kurssien
//                   lukumäärä.
//                 </p>
//               </div>
//             </div>
//           ) : null}

//           {enrollAs === "UPPERSECONDARY" &&
//           numMandatoryCourses !== "" &&
//           parseInt(numMandatoryCourses) < REQUIRED_NUM_OF_COURSES ? (
//             <div className="matriculation-container__state state-WARNING">
//               <div className="matriculation-container__state-icon icon-notification"></div>
//               <div className="matriculation-container__state-text">
//                 <p>
//                   Sinulla ei ole tarpeeksi pakollisia kursseja suoritettuna.
//                   Tarkistamme ilmoittautumisesi ja otamme sinuun yhteyttä.
//                 </p>
//               </div>
//             </div>
//           ) : null}

//           <div className="matriculation-container__row">
//             <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
//               <label className="matriculation__label">
//                 Aloitan tutkinnon suorittamisen uudelleen
//               </label>
//               <input
//                 onChange={(e) =>
//                   this.handleExaminationInformationChange(
//                     "restartExam",
//                     e.target.checked
//                   )
//                 }
//                 checked={Boolean(restartExam)}
//                 type="checkbox"
//                 className="matriculation__input"
//               />
//             </div>
//           </div>
//         </fieldset>

//         <fieldset className="matriculation-container__fieldset">
//           <legend className="matriculation-container__subheader">
//             Olen jo suorittanut seuraavat ylioppilaskokeet
//           </legend>
//           <MatriculationExaminationFinishedAttendesList
//             enrolledAttendances={enrolledAttendances}
//             examinationFinishedList={finishedAttendances}
//             pastOptions={getPastTermOptions()}
//             onChange={this.handleExaminationFinishedSubjectListChange}
//             onDeleteRow={this.handleDeleteFinishedAttendanceRow}
//           />
//           <div className="matriculation-container__row">
//             <Button
//               buttonModifiers={"add-matriculation-row"}
//               onClick={this.handleNewFinishedAttendanceClick}
//               icon="plus"
//             >
//               Lisää uusi rivi
//             </Button>
//           </div>
//         </fieldset>

//         <fieldset className="matriculation-container__fieldset">
//           <legend className="matriculation-container__subheader">
//             {`Ilmoittaudun suorittamaan kokeen seuraavissa aineissa `}
//             <b>
//               {resolveCurrentTerm() ? resolveCurrentTerm().adessive : "Virhe"}
//             </b>
//           </legend>
//           <MatriculationExaminationEnrolledAttendesList
//             isConflictingMandatory={this.isConflictingMandatory}
//             isConflictingRepeat={this.isConflictingRepeat}
//             conflictingAttendancesGroup={this.isConflictingAttendances()}
//             examinationEnrolledList={enrolledAttendances}
//             onChange={this.handleExaminationEnrolledAttendSubjectListChange}
//             onDeleteRow={this.handleDeleteEnrolledAttendanceRow}
//           />
//           <div className="matriculation-container__row">
//             <Button
//               buttonModifiers={"add-matriculation-row"}
//               onClick={this.handleNewEnrolledAttendanceClick}
//               icon="plus"
//             >
//               Lisää uusi rivi
//             </Button>
//           </div>

//           {this.isConflictingAttendances().length > 0 ? (
//             <div className="matriculation-container__state state-WARNING">
//               <div className="matriculation-container__state-icon icon-notification"></div>
//               <div className="matriculation-container__state-text">
//                 <p>
//                   Olet ilmoittautumassa kokeisiin, joita ei voi valita
//                   samanaikaisesti. Kysy tarvittaessa lisää ohjaajalta.
//                 </p>
//                 <p>
//                   <b>Aineet:</b>
//                 </p>
//                 {this.isConflictingAttendances().map((cGroup, index) => (
//                   <div key={index}>
//                     <ul>
//                       {cGroup.map((cSubject, index) => (
//                         <li key={index}> {SUBJECT_MAP[cSubject]} </li>
//                       ))}
//                     </ul>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//         </fieldset>

//         <fieldset className="matriculation-container__fieldset">
//           <legend className="matriculation-container__subheader">
//             Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa
//           </legend>
//           <MatriculationExaminationPlannedAttendesList
//             examinationPlannedList={plannedAttendances}
//             nextOptions={getNextTermOptions()}
//             onChange={this.handleExaminationPlannedSubjectListChange}
//             onDeleteRow={this.handleDeletePlannedAttendanceRow}
//           />
//           <div className="matriculation-container__row">
//             <Button
//               buttonModifiers={"add-matriculation-row"}
//               onClick={this.handleNewPlannedAttendanceClick}
//               icon="plus"
//             >
//               Lisää uusi rivi
//             </Button>
//           </div>

//           {this.isIncompleteAttendances() ? (
//             <div className="matriculation-container__state state-WARNING">
//               <div className="matriculation-container__state-icon icon-notification"></div>
//               <div className="matriculation-container__state-text">
//                 <p>Ole hyvä ja täytä kaikki rivit</p>
//               </div>
//             </div>
//           ) : null}
//         </fieldset>

//         <div className="matriculation-container__indicator-examples">
//           {this.hasMandatoryConflicts() ? (
//             <div className="matriculation-container__mandatory-conflicts">
//               <div className="matriculation-container__mandatory-conflicts-indicator"></div>
//               <p>
//                 Ainetta uusittaessa pakollisuustiedon on oltava sama kuin
//                 aiemmalla suorituskerralla
//               </p>
//             </div>
//           ) : null}

//           {this.hasConflictingRepeats() ? (
//             <div className="matriculation-container__repeat-conflicts">
//               <div className="matriculation-container__repeat-conflicts-indicator"></div>
//               <p>
//                 Aine on merkittävä uusittavaksi, kun siitä on aiempi
//                 suorituskerta
//               </p>
//             </div>
//           ) : null}
//         </div>

//         {this.getAmountOfFinnishAttendances() == REQUIRED_FINNISH_ATTENDANCES &&
//         this.getAmountOfMandatoryAttendances() ==
//           REQUIRED_MANDATORY_ATTENDANCES &&
//         this.getAmountOfAcademicSubjectAttendances() <
//           REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN &&
//         this.getAmountOfMandatoryAdvancedSubjectAttendances() >
//           REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN ? null : (
//           <div className="matriculation-container__state state-INFO">
//             <div className="matriculation-container__state-icon icon-notification"></div>
//             <div className="matriculation-container__state-text">
//               <p>Ylioppilastutkintoon tulee sisältyä</p>
//               <ul>
//                 <li>
//                   äidinkieli / suomi toisena kielenä
//                   {this.getAmountOfFinnishAttendances() ==
//                   REQUIRED_FINNISH_ATTENDANCES
//                     ? ""
//                     : " (ei valittuna)"}
//                 </li>
//                 <li>
//                   neljä pakollista koetta
//                   {this.getAmountOfMandatoryAttendances() ==
//                   REQUIRED_MANDATORY_ATTENDANCES
//                     ? ""
//                     : ` (valittuna ${this.getAmountOfMandatoryAttendances()})`}
//                 </li>
//                 <li>
//                   vähintään yksi A-tason koe
//                   {this.getAmountOfMandatoryAdvancedSubjectAttendances() > 0
//                     ? ""
//                     : ` (valittuna ${this.getAmountOfMandatoryAdvancedSubjectAttendances()})`}
//                 </li>
//                 <li>
//                   vain yksi pakollinen reaaliaine, jos kirjoitat yhden tai
//                   useamman reaaliaineen.
//                   {this.getAmountOfAcademicSubjectAttendances() < 2
//                     ? ""
//                     : ` (valittuna ${this.getAmountOfAcademicSubjectAttendances()})`}
//                 </li>
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default MatriculationExaminationEnrollmentInformation;
