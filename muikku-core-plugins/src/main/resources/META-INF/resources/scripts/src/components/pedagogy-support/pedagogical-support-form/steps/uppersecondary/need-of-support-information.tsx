import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { Textarea } from "~/components/pedagogy-support/components/textarea";
import Select, { ActionMeta } from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import AnimateHeight from "react-animate-height";
import {
  SupportAction,
  SupportActionMatriculationExamination,
  UpperSecondaryFormData,
} from "~/@types/pedagogy-form";
import {
  matriculationSupportActionsOptions,
  supportActionsOptionsUppersecondary,
} from "~/components/pedagogy-support/helpers";
import { useTranslation } from "react-i18next";
import { useUpperSecondaryForm } from "~/components/pedagogy-support/hooks/useUppersecondaryForm";
import DatePicker from "react-datepicker";
import { TextField } from "~/components/pedagogy-support/components/textfield";

/**
 * NeedOfSupportInformationProps
 */
interface NeedOfSupportInformationProps {}

/**
 * NeedOfSupportInformation
 *
 * @param props props
 * @returns JSX.Element
 */
const NeedOfSupportInformation: React.FC<NeedOfSupportInformationProps> = (
  props
) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const {
    userRole,
    editIsActive,
    formData,
    updatePedagogyFormDataAndUpdateChangedFields,
  } = useUpperSecondaryForm();

  /**
   * Handles different field changes based on key
   *
   * @param key key
   * @param value value
   */
  const handleFieldChange = <T extends keyof UpperSecondaryFormData>(
    key: T,
    value: UpperSecondaryFormData[T]
  ) => {
    const updatedFormData = { ...formData };

    updatedFormData[key] = value;

    updatePedagogyFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles support action select change
   *
   * @param options options
   * @param actionMeta actionMeta
   */
  const handleSupportActionChange = (
    options: readonly OptionDefault<SupportAction>[],
    actionMeta: ActionMeta<OptionDefault<SupportAction>>
  ) => {
    const updatedFormData = { ...formData };

    updatedFormData.supportActions = options.map((option) => option.value);

    if (!updatedFormData.supportActions.includes("other")) {
      updatedFormData.supportActionOther = undefined;
    }

    updatePedagogyFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles matriculation support action select change
   *
   * @param options options
   * @param actionMeta actionMeta
   */
  const handleMatriculationSupportActionChange = (
    options: readonly OptionDefault<SupportActionMatriculationExamination>[],
    actionMeta: ActionMeta<OptionDefault<SupportActionMatriculationExamination>>
  ) => {
    const updatedFormData = { ...formData };

    updatedFormData.matriculationExaminationSupport = options.map(
      (option) => option.value
    );

    if (!updatedFormData.matriculationExaminationSupport.includes("other")) {
      updatedFormData.matriculationExaminationSupportOther = undefined;
    }

    updatePedagogyFormDataAndUpdateChangedFields(updatedFormData);
  };

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.decisionToSpecialEducation", {
            ns: "pedagogySupportPlan",
          })}
        </legend>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="decisionToSpecialEducation" className="hops__label">
              {t("labels.decisionToSpecialEducationLaw", {
                ns: "pedagogySupportPlan",
              })}
            </label>
            <input
              type="checkbox"
              id="decisionToSpecialEducation"
              className="hops__input"
              checked={formData?.decisionToSpecialEducation || false}
              onChange={(e) =>
                handleFieldChange(
                  "decisionToSpecialEducation",
                  e.target.checked
                )
              }
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="decisionToSpecialEducationMaker"
              label={t("labels.decisionToSpecialEducationMaker", {
                ns: "pedagogySupportPlan",
              })}
              value={formData?.decisionToSpecialEducationMaker || ""}
              onChange={(e) =>
                handleFieldChange(
                  "decisionToSpecialEducationMaker",
                  e.target.value
                )
              }
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="decisionToSpecialEducation" className="hops__label">
              {t("labels.date", {
                ns: "common",
              })}
            </label>
            <DatePicker
              id="decisionToSpecialEducationDate"
              className="hops__input"
              dateFormat="dd.MM.yyyy"
              selected={formData?.decisionToSpecialEducationDate}
              onChange={(date) =>
                handleFieldChange("decisionToSpecialEducationDate", date)
              }
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.studentStrengths", {
            ns: "pedagogySupportPlan",
            context: "basisForSupport",
          })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="studentStrengths"
              label="Opiskelijan vahvuudet"
              className="hops__textarea"
              onChange={(e) =>
                handleFieldChange("studentStrengths", e.target.value)
              }
              value={formData?.studentStrengths || ""}
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="needOfSupport"
              label={t("labels.needForSupport", { ns: "pedagogySupportPlan" })}
              className="hops__textarea"
              onChange={(e) =>
                handleFieldChange("needOfSupport", e.target.value)
              }
              value={formData?.needOfSupport || ""}
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.plan", {
            ns: "pedagogySupportPlan",
          })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="suggestedSupportActions" className="hops__label">
              {t("labels.plannedActions", {
                ns: "pedagogySupportPlan",
              })}
            </label>
            <Select
              id="suggestedSupportActions"
              className="react-select-override react-select-override--pedagogy-form"
              classNamePrefix="react-select-override"
              closeMenuOnSelect={false}
              isMulti
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              // eslint-disable-next-line jsdoc/require-jsdoc
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              value={
                (formData &&
                  supportActionsOptionsUppersecondary.filter((option) =>
                    formData?.supportActions.includes(option.value)
                  )) ||
                undefined
              }
              placeholder={t("labels.select", {
                ns: "common",
              })}
              noOptionsMessage={() =>
                t("content.empty", {
                  ns: "pedagogySupportPlan",
                  context: "options",
                })
              }
              options={supportActionsOptionsUppersecondary}
              onChange={handleSupportActionChange}
              isSearchable={false}
              isDisabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>
        <AnimateHeight
          height={formData?.supportActions.includes("other") ? "auto" : 0}
        >
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                id="otherSupportMeasures"
                label={t("labels.other", {
                  ns: "pedagogySupportPlan",
                  context: "action",
                })}
                className="hops__textarea"
                onChange={(e) =>
                  handleFieldChange("supportActionOther", e.target.value)
                }
                value={formData?.supportActionOther || ""}
                disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
              />
            </div>
          </div>
        </AnimateHeight>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label
              htmlFor="prePlansForMatriculationExam"
              className="hops__label"
            >
              {t("labels.matriculationPrePlan", {
                ns: "pedagogySupportPlan",
              })}
            </label>
            <Select
              id="prePlansForMatriculationExam"
              className="react-select-override react-select-override--pedagogy-form"
              classNamePrefix="react-select-override"
              closeMenuOnSelect={false}
              isMulti
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              // eslint-disable-next-line jsdoc/require-jsdoc
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              value={
                (formData &&
                  matriculationSupportActionsOptions.filter((option) =>
                    formData?.matriculationExaminationSupport.includes(
                      option.value
                    )
                  )) ||
                undefined
              }
              placeholder={t("labels.select", {
                ns: "common",
              })}
              noOptionsMessage={() =>
                t("content.empty", {
                  ns: "pedagogySupportPlan",
                  context: "options",
                })
              }
              options={matriculationSupportActionsOptions}
              onChange={handleMatriculationSupportActionChange}
              isSearchable={false}
              isDisabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>
        <AnimateHeight
          height={
            formData?.matriculationExaminationSupport.includes("other")
              ? "auto"
              : 0
          }
        >
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                id="matriculationSupportOther"
                label={t("labels.other", {
                  ns: "pedagogySupportPlan",
                  context: "action",
                })}
                className="hops__textarea"
                onChange={(e) =>
                  handleFieldChange(
                    "matriculationExaminationSupportOther",
                    e.target.value
                  )
                }
                value={formData?.matriculationExaminationSupportOther || ""}
                disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
              />
            </div>
          </div>
        </AnimateHeight>
      </fieldset>
    </section>
  );
};

export default NeedOfSupportInformation;
