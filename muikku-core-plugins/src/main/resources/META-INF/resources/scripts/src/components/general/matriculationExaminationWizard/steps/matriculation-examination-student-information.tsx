import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationInformation } from "~/@types/shared";
import { Textarea } from "../textarea";
import { TextField } from "../textfield";
import { useMatriculationContext } from "../context/matriculation-context";
import { SavingDraftError } from "../saving-draft-error";
import { SavingDraftInfo } from "../saving-draft-info";
import { MatriculationExamFundingType } from "~/generated/client";

/**
 * Required amount attendances for valid Examination (vähintään 5 suoritusta)
 */
export const REQUIRED_AMOUNT_OF_ATTENDACNES = 5;

/**
 * MatriculationExaminationEnrollmentInformation
 */
export const MatriculationExaminationStudentInformation = () => {
  const { matriculation, onExaminationInformationChange } =
    useMatriculationContext();
  const { examinationInformation, studentInformation, saveState, errorMsg } =
    matriculation;

  /**
   * handles examination information changes and passes it to parent component
   * @param key key
   * @param value value
   */
  const handleExaminationInformationChange = <
    T extends keyof ExaminationInformation
  >(
    key: T,
    value: ExaminationInformation[T]
  ) => {
    const { degreeType } = examinationInformation;

    let modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      [key]: value,
    };

    /**
     * If user restarts Matriculation examination finishedAttendance should be empty list
     */
    if (modifiedExamination.restartExam) {
      modifiedExamination.finishedAttendances = [];
    }

    if (
      modifiedExamination.degreeType !== degreeType &&
      modifiedExamination.degreeType === "MATRICULATIONEXAMINATIONSUPPLEMENT"
    ) {
      modifiedExamination = {
        ...modifiedExamination,
        finishedAttendances: modifiedExamination.finishedAttendances.map(
          (fSubject) => ({
            ...fSubject,
            funding: MatriculationExamFundingType.SelfFunded,
          })
        ),
        enrolledAttendances: modifiedExamination.enrolledAttendances.map(
          (eSubject) => ({
            ...eSubject,
            funding: MatriculationExamFundingType.SelfFunded,
          })
        ),
      };
    }
    if (
      modifiedExamination.degreeType !== degreeType &&
      modifiedExamination.degreeType === "MATRICULATIONEXAMINATION"
    ) {
      modifiedExamination = {
        ...modifiedExamination,
        finishedAttendances: modifiedExamination.finishedAttendances.map(
          (fSubject) => ({
            ...fSubject,
            funding: undefined,
          })
        ),
        enrolledAttendances: modifiedExamination.enrolledAttendances.map(
          (eSubject) => ({
            ...eSubject,
            funding: undefined,
          })
        ),
      };
    }

    onExaminationInformationChange(modifiedExamination);
  };

  return (
    <div className="matriculation-container">
      <SavingDraftError draftSaveErrorMsg={errorMsg} />
      <SavingDraftInfo saveState={saveState} />
      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          Perustiedot
        </legend>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label="Nimi"
              readOnly
              type="text"
              defaultValue={studentInformation.name}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label="Henkilötunnus"
              readOnly
              type="text"
              defaultValue={studentInformation.ssn}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label="Sähköpostiosoite"
              readOnly
              type="text"
              defaultValue={studentInformation.email}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label="Puhelinnumero"
              readOnly
              type="text"
              defaultValue={studentInformation.phone}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label="Osoite"
              readOnly
              type="text"
              defaultValue={studentInformation.address}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label="Postinumero"
              readOnly
              type="text"
              defaultValue={studentInformation.postalCode}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label="Postitoimipaikka"
              readOnly
              type="text"
              defaultValue={studentInformation.locality}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              onChange={(e) =>
                handleExaminationInformationChange("guider", e.target.value)
              }
              label="Ohjaaja"
              readOnly
              defaultValue={studentInformation.guidanceCounselor}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <Textarea
              onChange={(e) =>
                handleExaminationInformationChange(
                  "changedContactInfo",
                  e.target.value
                )
              }
              rows={5}
              label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
              value={examinationInformation.changedContactInfo}
              className="matriculation__textarea"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default MatriculationExaminationStudentInformation;
