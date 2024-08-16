// import * as React from "react";
// import Button from "~/components/general/button";
// import "~/sass/elements/matriculation.scss";
// import { SaveState } from "../../../../@types/shared";

// /**
//  * MatriculationExaminationEnrollmentCompletedProps
//  */
// interface MatriculationExaminationEnrollmentCompletedProps {
//   saveState: SaveState;
//   examId: number;
//   onDone: () => void;
//   updateEnrollemnts: (examId: number) => void;
// }

// /**
//  * MatriculationExaminationEnrollmentCompleted
//  */
// export class MatriculationExaminationEnrollmentCompleted extends React.Component<
//   MatriculationExaminationEnrollmentCompletedProps,
//   Record<string, unknown>
// > {
//   /**
//    * constructor
//    * @param props props
//    */
//   constructor(props: MatriculationExaminationEnrollmentCompletedProps) {
//     super(props);
//   }

//   /**
//    * handleClickClose
//    */
//   handleClickClose = () => {
//     if (this.props.saveState === "SUCCESS") {
//       this.props.updateEnrollemnts(this.props.examId);
//     }

//     this.props.onDone();
//   };

//   /**
//    * renderStateMessage
//    * @param saveState saveState
//    * @returns render save state message
//    */
//   renderStateMessage = (saveState: SaveState) =>
//     ({
//       PENDING: (
//         <div className="matriculation-container">
//           <h3 className="matriculation-container__header">Odottaa!</h3>
//           <div className="loader-empty" />
//         </div>
//       ),
//       IN_PROGRESS: (
//         <div className="matriculation-container">
//           <h3 className="matriculation-container__header">
//             Lomaketta tallennetaan
//           </h3>
//           <div className="matriculation-container__state state-LOADER">
//             <div className="matriculation-container__state-icon icon-notification"></div>
//             <div className="matriculation-container__state-text">
//               <p>Lomakkeen tietoja tallennetaan, odota hetki</p>
//             </div>
//           </div>
//           <div className="loader-empty" />
//         </div>
//       ),
//       SUCCESS: (
//         <div className="matriculation-container">
//           <h3 className="matriculation-container__header">
//             Ilmoittautuminen ylioppilaskirjoituksiin lähetetty
//           </h3>
//           <div className="matriculation-container__state state-SUCCESS">
//             <div className="matriculation-container__state-icon icon-notification"></div>
//             <div className="matriculation-container__state-text">
//               <p>
//                 Ilmoittautumisesi ylioppilaskirjoituksiin on lähetetty
//                 onnistuneesti. Saat lomakkeesta kopion sähköpostiisi.
//               </p>
//               <p>
//                 Tulosta lomake, allekirjoita ja päivää se ja lähetä skannattuna
//                 tai kuvana yo-ilmoittautumiset@otavia.fi tai kirjeitse
//                 Otavia/Nettilukio, Otavantie 2B, 50670 Otava.
//               </p>
//               <p>Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteyttä.</p>
//             </div>
//           </div>
//         </div>
//       ),
//       FAILED: (
//         <div className="matriculation-container">
//           <h3 className="matriculation-container__header">
//             Lomakkeen tallennus epäonnistui
//           </h3>
//           <div className="matriculation-container__state state-FAILED">
//             <div className="matriculation-container__state-icon icon-notification"></div>
//             <div className="matriculation-container__state-text">
//               <p>
//                 Lomakkeen tietojen tallennus epäonnistui. Varmista, että olet
//                 kirjautunut sisään palaamalla lomakkeelle uudelleen Muikun
//                 kautta.
//               </p>
//             </div>
//           </div>
//         </div>
//       ),
//       SAVING_DRAFT: null,
//       DRAFT_SAVED: null,
//       undefined: null,
//     }[saveState]);

//   /**
//    * render
//    */
//   render() {
//     return (
//       <div>
//         {this.renderStateMessage(this.props.saveState)}
//         {this.props.saveState === "SUCCESS" ||
//         this.props.saveState === "FAILED" ? (
//           <Button
//             onClick={this.handleClickClose}
//             className={`${
//               this.props.saveState === "SUCCESS"
//                 ? "button--success"
//                 : "button--error"
//             }`}
//           >
//             Sulje
//           </Button>
//         ) : null}
//       </div>
//     );
//   }
// }

// export default MatriculationExaminationEnrollmentCompleted;
