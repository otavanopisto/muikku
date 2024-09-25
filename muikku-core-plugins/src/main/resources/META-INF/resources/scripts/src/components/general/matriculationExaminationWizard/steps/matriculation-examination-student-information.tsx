import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationInformation } from "~/@types/shared";
import { Textarea } from "../textarea";
import { TextField } from "../textfield";
import { useMatriculationContext } from "../context/matriculation-context";
import { SavingDraftError } from "../saving-draft-error";
import { SavingDraftInfo } from "../saving-draft-info";
import { useTranslation } from "react-i18next";

/**
 * MatriculationExaminationEnrollmentInformation
 */
export const MatriculationExaminationStudentInformation = () => {
  const { matriculation, onExaminationInformationChange } =
    useMatriculationContext();
  const { examinationInformation, studentInformation, draftState, errorMsg } =
    matriculation;

  const { t } = useTranslation(["common", "hops_new", "users"]);

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
    const modifiedExamination: ExaminationInformation = {
      ...examinationInformation,
      [key]: value,
    };

    onExaminationInformationChange(modifiedExamination);
  };

  return (
    <div className="matriculation-container">
      <SavingDraftError draftSaveErrorMsg={errorMsg} />
      <SavingDraftInfo draftState={draftState} />
      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormStudentInfoSubTitle1", {
            ns: "hops_new",
          })}
        </legend>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.name")}
              readOnly
              type="text"
              defaultValue={studentInformation.name}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.email")}
              readOnly
              type="text"
              defaultValue={studentInformation.email}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.phone")}
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
              label={t("labels.address")}
              readOnly
              type="text"
              defaultValue={studentInformation.address}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.postalCode")}
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
              label={t("labels.postOffice")}
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
              label={t("labels.groupAdvisor_one", { ns: "users" })}
              readOnly
              defaultValue={studentInformation.guidanceCounselor}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <Textarea
              label={t("content.matriculationFormChangedInformation", {
                ns: "hops_new",
              })}
              onChange={(e) =>
                handleExaminationInformationChange(
                  "changedContactInfo",
                  e.target.value
                )
              }
              rows={5}
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
