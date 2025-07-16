import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { Textarea } from "~/components/pedagogy-support/components/textarea";
import Select, { ActionMeta } from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import AnimateHeight from "react-animate-height";
import { CompulsoryFormData, SupportAction } from "~/@types/pedagogy-form";
import { supportActionsOptions } from "~/components/pedagogy-support/helpers";
import { useTranslation } from "react-i18next";
import { useCompulsoryForm } from "~/components/pedagogy-support/hooks/useCompulsoryForm";

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
    setFormDataAndUpdateChangedFields,
  } = useCompulsoryForm();

  /**
   * Handles different text area changes based on key
   *
   * @param key key
   * @param value value
   */
  const handleTextAreaChange = <T extends keyof CompulsoryFormData>(
    key: T,
    value: CompulsoryFormData[T]
  ) => {
    const updatedFormData = { ...formData };

    updatedFormData[key] = value;

    setFormDataAndUpdateChangedFields(updatedFormData);
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

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  return (
    <section className="hops-container">
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
                handleTextAreaChange("studentStrengths", e.target.value)
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
                handleTextAreaChange("needOfSupport", e.target.value)
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
                  supportActionsOptions.filter((option) =>
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
              options={supportActionsOptions}
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
                  handleTextAreaChange("supportActionOther", e.target.value)
                }
                value={formData?.supportActionOther || ""}
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
