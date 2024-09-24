import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationInformation, stringToBoolean } from "~/@types/shared";
import { useMatriculationContext } from "../context/matriculation-context";
import { SavingDraftError } from "../saving-draft-error";
import { SavingDraftInfo } from "../saving-draft-info";
import { Textarea } from "../textarea";
import { TextField } from "../textfield";
import { useTranslation } from "react-i18next";

/**
 * MatriculationExaminationEnrollmentAct
 */
const MatrMatriculationExaminationEnrollmentAct = () => {
  const { matriculation, onExaminationInformationChange } =
    useMatriculationContext();
  const { examinationInformation, studentInformation, draftState, errorMsg } =
    matriculation;

  const { t } = useTranslation(["common"]);

  /**
   * Handles examination information changes and passes it to parent component
   * @param key key of the changed value
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
          {t("labels.matriculationFormActSubTitle1", {
            ns: "hops_new",
          })}
        </legend>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <label className="matriculation__label">
              {t("labels.matriculationFormFieldPlace", {
                ns: "hops_new",
              })}
            </label>
            <select
              onChange={(e) =>
                handleExaminationInformationChange(
                  "location",
                  e.currentTarget.value
                )
              }
              value={
                examinationInformation.location === "Mikkeli" ? "Mikkeli" : ""
              }
              className="matriculation__select"
            >
              <option>Mikkeli</option>
              <option value="">
                {t("labels.other", {
                  ns: "hops_new",
                })}
              </option>
            </select>
          </div>
        </div>

        {examinationInformation.location !== "Mikkeli" ? (
          <div>
            <div className="matriculation-container__row">
              <div className="matriculation__form-element-container">
                <TextField
                  label={t("labels.otherPlace", {
                    ns: "hops_new",
                  })}
                  value={examinationInformation.location}
                  type="text"
                  placeholder="Kirjoita tähän oppilaitoksen nimi"
                  className="matriculation__input"
                  onChange={(e) =>
                    handleExaminationInformationChange(
                      "location",
                      e.currentTarget.value
                    )
                  }
                />
              </div>
            </div>

            {examinationInformation.location === "" ? (
              <div className="matriculation-container__state state-WARNING">
                <div className="matriculation-container__state-icon icon-notification"></div>
                <div className="matriculation-container__state-text">
                  <p>
                    {t("content.matriculationFormEmptyPlace", {
                      ns: "hops_new",
                    })}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <Textarea
              label={t("labels.matriculationFormFieldInfoForCouncelor", {
                ns: "hops_new",
              })}
              rows={5}
              onChange={(e) =>
                handleExaminationInformationChange(
                  "message",
                  e.currentTarget.value
                )
              }
              value={examinationInformation.message}
              className="matriculation__textarea"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <label className="matriculation__label">
              {t("labels.matriculationFormFieldPublishName", {
                ns: "hops_new",
              })}
            </label>
            <select
              onChange={(e) =>
                handleExaminationInformationChange(
                  "canPublishName",
                  stringToBoolean(e.currentTarget.value)
                )
              }
              value={examinationInformation.canPublishName.toString()}
              className="matriculation__select"
            >
              <option value="true">
                {t("content.matriculationFormPublishNameOptionYes", {
                  ns: "hops_new",
                })}
              </option>
              <option value="false">
                {t("content.matriculationFormPublishNameOptionNo", {
                  ns: "hops_new",
                })}
              </option>
            </select>
          </div>
        </div>

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.name")}
              value={studentInformation.name}
              type="text"
              readOnly
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.date")}
              value={`${examinationInformation.enrollmentDate.getDate()}.${
                examinationInformation.enrollmentDate.getMonth() + 1
              }.${examinationInformation.enrollmentDate.getFullYear()}`}
              type="text"
              readOnly
              className="matriculation__input"
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default MatrMatriculationExaminationEnrollmentAct;
