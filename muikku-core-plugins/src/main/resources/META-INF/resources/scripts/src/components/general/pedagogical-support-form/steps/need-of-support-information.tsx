import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { Textarea } from "../../hops-compulsory-education-wizard/text-area";
import Select, { ActionMeta } from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import AnimateHeight from "react-animate-height";
import {
  FormData,
  SupportAction,
  SupportActionMatriculationExamination,
  SupportReason,
} from "~/@types/pedagogy-form";
import {
  matriculationSupportActionsOptions,
  supportActionsOptions,
  supportReasonsOptions,
} from "../helpers";
import { usePedagogyContext } from "../context/pedagogy-context";

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
  const { formData, setFormDataAndUpdateChangedFields } = usePedagogyContext();
  const { userRole, editIsActive } = usePedagogyContext();

  /**
   * Handles different text area changes based on key
   *
   * @param key key
   * @param value value
   */
  const handleTextAreaChange = <T extends keyof FormData>(
    key: T,
    value: FormData[T]
  ) => {
    const updatedFormData: FormData = { ...formData };

    updatedFormData[key] = value;

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles support reason select change
   *
   * @param options options
   * @param actionMeta actionMeta
   */
  const handleSupportReasonChange = (
    options: readonly OptionDefault<SupportReason>[],
    actionMeta: ActionMeta<OptionDefault<SupportReason>>
  ) => {
    const updatedFormData: FormData = {
      ...formData,
    };

    updatedFormData.supportReasons = options.map((option) => option.value);

    if (!updatedFormData.supportReasons.includes("other")) {
      updatedFormData.supportReasonOther = undefined;
    }

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
    const updatedFormData: FormData = {
      ...formData,
    };

    updatedFormData.supportActions = options.map((option) => option.value);

    if (!updatedFormData.supportActions.includes("other")) {
      updatedFormData.supportActionOther = undefined;
    }

    setFormDataAndUpdateChangedFields(updatedFormData);
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
    const updatedFormData: FormData = {
      ...formData,
    };

    updatedFormData.matriculationExaminationSupport = options.map(
      (option) => option.value
    );

    if (!updatedFormData.matriculationExaminationSupport.includes("other")) {
      updatedFormData.matriculationExaminationSupportOther = undefined;
    }

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Opiskelijan vahvuudet ja tuen perusteet
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
            <label htmlFor="needOfPedagogySupport" className="hops__label">
              Pedagogisen tuen perusteet
            </label>
            <Select
              id="needOfPedagogySupport"
              className="react-select-override react-select-override--hops"
              classNamePrefix="react-select-override"
              isMulti
              menuPortalTarget={document.body}
              menuPosition={"fixed"}
              // eslint-disable-next-line jsdoc/require-jsdoc
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              value={
                (formData &&
                  supportReasonsOptions.filter((option) =>
                    formData?.supportReasons.includes(option.value)
                  )) ||
                undefined
              }
              placeholder="Valitse..."
              noOptionsMessage={() => "Ei enempää vaihtoehtoja"}
              options={supportReasonsOptions}
              onChange={handleSupportReasonChange}
              isSearchable={false}
              isDisabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>

        <AnimateHeight
          height={formData?.supportReasons.includes("other") ? "auto" : 0}
        >
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                id="reasonOther"
                label="Muu peruste"
                className="hops__textarea"
                onChange={(e) =>
                  handleTextAreaChange("supportReasonOther", e.target.value)
                }
                value={formData?.supportReasonOther || ""}
                disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
              />
            </div>
          </div>
        </AnimateHeight>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Suunnitelma</legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="suggestedSupportActions" className="hops__label">
              Suunnitellut tukitoimet
            </label>
            <Select
              id="suggestedSupportActions"
              className="react-select-override react-select-override--hops"
              classNamePrefix="react-select-override"
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
              placeholder="Valitse..."
              noOptionsMessage={() => "Ei enempää vaihtoehtoja"}
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
                label="Muu toimenpide"
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

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label
              htmlFor="prePlansForMatriculationExam"
              className="hops__label"
            >
              Ennakkosuunnitelma ylioppilaskirjoituksiin
            </label>
            <Select
              id="prePlansForMatriculationExam"
              className="react-select-override react-select-override--hops"
              classNamePrefix="react-select-override"
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
              placeholder="Valitse..."
              noOptionsMessage={() => "Ei enempää vaihtoehtoja"}
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
                label="Muu toimenpide"
                className="hops__textarea"
                onChange={(e) =>
                  handleTextAreaChange(
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
