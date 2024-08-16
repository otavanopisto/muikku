//                         "location",
//                         e.currentTarget.value
//                       )
//                       ensin kyseisen oppilaitoksen kanssa.
//                       Jos haluat suorittaa kokeen muualla, siitä on sovittava
//                       this.onExaminationInformationChange(
//                     "canPublishName",
//                     "location",
//                     "message",
//                     }
//                     </p>
//                     <p>
//                     className="matriculation__input"
//                     e.currentTarget.value
//                     e.currentTarget.value
//                     e.currentTarget.value
//                     label="Muu paikka"
//                     onChange={(e) =>
//                     placeholder="Kirjoita tähän oppilaitoksen nimi"
//                     type="text"
//                     value={location}
//                   )
//                   )
//                   )
//                   />
//                   </div>
//                   <div className="matriculation-container__state-icon icon-notification"></div>
//                   <div className="matriculation-container__state-text">
//                   <TextField
//                   En halua nimeäni julkaistavan valmistujaislistauksissa
//                   Haluan nimeni julkaistavan valmistujalistauksissa
//                   this.onExaminationInformationChange(
//                   this.onExaminationInformationChange(
//                   this.onExaminationInformationChange(
//                 }
//                 }
//                 }
//                 </div>
//                 </div>
//                 </option>
//                 </option>
//                 <div className="matriculation__form-element-container">
//                 <div className="matriculation-container__state state-WARNING">
//                 <option value="">Muu</option>
//                 <option value="false">
//                 <option value="true">
//                 <option>Mikkeli</option>
//                 className="matriculation__input"
//                 className="matriculation__input"
//                 className="matriculation__select"
//                 className="matriculation__select"
//                 className="matriculation__textarea"
//                 label="Lisätietoa ohjaajalle"
//                 label="Nimi"
//                 label="Päivämäärä"
//                 onChange={(e) =>
//                 onChange={(e) =>
//                 onChange={(e) =>
//                 readOnly
//                 readOnly
//                 rows={5}
//                 type="text"
//                 type="text"
//                 value={canPublishName}
//                 value={date}
//                 value={location === "Mikkeli" ? "Mikkeli" : ""}
//                 value={message}
//                 value={name}
//               ) : null}
//               {location === "" ? (
//               />
//               />
//               />
//               </div>
//               </select>
//               </select>
//               <div className="matriculation-container__row">
//               <label className="matriculation__label">Julkaisulupa</label>
//               <label className="matriculation__label">Suorituspaikka</label>
//               <select
//               <select
//               <Textarea
//               <TextField
//               <TextField
//               >
//               >
//             </div>
//             </div>
//             </div>
//             </div>
//             </div>
//             </div>
//             <div className="matriculation__form-element-container">
//             <div className="matriculation__form-element-container">
//             <div className="matriculation__form-element-container">
//             <div className="matriculation__form-element-container">
//             <div className="matriculation__form-element-container">
//             <div>
//             Kokeen suorittaminen
//           ) : null}
//           {location !== "Mikkeli" ? (
//           </div>
//           </div>
//           </div>
//           </div>
//           </legend>
//           <div className="matriculation-container__row">
//           <div className="matriculation-container__row">
//           <div className="matriculation-container__row">
//           <div className="matriculation-container__row">
//           <legend className="matriculation-container__subheader">
//         </fieldset>
//         <fieldset className="matriculation-container__fieldset">
//         <SavingDraftError draftSaveErrorMsg={draftSaveErrorMsg} />
//         <SavingDraftInfo saveState={saveState} />
//       ...examination,
//       [key]: value,
//       </div>
//       <div className="matriculation-container">
//     );
//     };
//     const { examination, draftSaveErrorMsg, saveState } = this.props;
//     const { examination, onChange } = this.props;
//     const { location, message, canPublishName, name, date } = examination;
//     const modifiedExamination: ExaminationInformation = {
//     key: T,
//     onChange(modifiedExamination);
//     return (
//     super(props);
//     value: ExaminationInformation[T]
//    * @param key key of the changed value
//    * @param props props
//    * @param value value
//    * constructor
//    * Handles examination information changes and passes it to parent component
//    * Render method
//    */
//    */
//    */
//   ) => {
//   }
//   }
//   };
//   /**
//   /**
//   /**
//   constructor(props: MatriculationExaminationEnrollmentActProps) {
//   draftSaveErrorMsg?: string;
//   examination: ExaminationInformation;
//   MatriculationExaminationEnrollmentActProps,
//   onChange: (examination: ExaminationInformation) => void;
//   onExaminationInformationChange = <T extends keyof ExaminationInformation>(
//   Record<string, unknown>
//   render() {
//   saveState: SaveState;
//  * MatriculationExaminationEnrollmentAct
//  * MatriculationExaminationEnrollmentActProps
//  */
//  */
// }
// }
// /**
// /**
// > {
// export class MatrMatriculationExaminationEnrollmentAct extends React.Component<
// export default MatrMatriculationExaminationEnrollmentAct;
// import "~/sass/elements/matriculation.scss";
// import { ExaminationInformation, SaveState } from "~/@types/shared";
// import { SavingDraftError } from "./saving-draft-error";
// import { SavingDraftInfo } from "./saving-draft-info";
// import { Textarea } from "./textarea";
// import { TextField } from "./textfield";
// import * as React from "react";
// interface MatriculationExaminationEnrollmentActProps {
