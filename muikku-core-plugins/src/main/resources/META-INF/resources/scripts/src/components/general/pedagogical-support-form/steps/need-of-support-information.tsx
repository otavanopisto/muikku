import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { Textarea } from "../../hops-compulsory-education-wizard/text-area";
import Select, { ActionMeta } from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import AnimateHeight from "react-animate-height";
import { PedagogyContext } from "..";
import {
  FormData,
  PedagogyForm,
  SupportAction,
  SupportActionMatriculationExamination,
  SupportReason,
} from "~/@types/pedagogy-form";
import {
  matriculationSupportActionsOptions,
  supportActionsOptions,
  supportReasonsOptions,
} from "../helpers";

/**
 * NeedOfSupportInformationProps
 */
interface NeedOfSupportInformationProps {
  pedagogyData?: PedagogyForm;
  formData?: FormData;
  onFormDataChange: (updatedFormData: FormData) => void;
}

/**
 * NeedOfSupportInformation
 *
 * @param props props
 * @returns JSX.Element
 */
const NeedOfSupportInformation: React.FC<NeedOfSupportInformationProps> = (
  props
) => {
  const { formData, onFormDataChange } = props;
  const { useCase, editIsActive } = React.useContext(PedagogyContext);

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

    onFormDataChange(updatedFormData);
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

    onFormDataChange(updatedFormData);
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

    onFormDataChange(updatedFormData);
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

    onFormDataChange(updatedFormData);
  };

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          PERUSTEET JA OPISKELIJAN VAHVUUDET
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="studentStrengths"
              label="Opiskelijan vahvuudet"
              className="hops__input"
              onChange={(e) =>
                handleTextAreaChange("studentStrengths", e.target.value)
              }
              value={formData?.studentStrengths || ""}
              disabled={useCase === "STUDENT" || !editIsActive}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="graduationGoalMonth" className="hops__label">
              Pedagogisen tuen perusteet
            </label>
            <Select
              className="react-select-override"
              classNamePrefix="react-select-override"
              isMulti
              value={
                (formData &&
                  supportReasonsOptions.filter((option) =>
                    formData?.supportReasons.includes(option.value)
                  )) ||
                undefined
              }
              options={supportReasonsOptions}
              onChange={handleSupportReasonChange}
              isSearchable={false}
              isDisabled={useCase === "STUDENT" || !editIsActive}
            />
          </div>
        </div>

        <AnimateHeight
          height={formData?.supportReasons.includes("other") ? "auto" : 0}
        >
          <div
            className="hops-container__row"
            style={{ margin: "0", padding: "10px 0" }}
          >
            <div className="hops__form-element-container">
              <Textarea
                id="reasonOther"
                label="Muu?"
                className="hops__input"
                onChange={(e) =>
                  handleTextAreaChange("supportReasonOther", e.target.value)
                }
                value={formData?.supportReasonOther || ""}
                disabled={useCase === "STUDENT" || !editIsActive}
              />
            </div>
          </div>
        </AnimateHeight>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Suunnitelma</legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="graduationGoalMonth" className="hops__label">
              Suunniteltut tukitoimet
            </label>
            <Select
              className="react-select-override"
              classNamePrefix="react-select-override"
              isMulti
              value={
                (formData &&
                  supportActionsOptions.filter((option) =>
                    formData?.supportActions.includes(option.value)
                  )) ||
                undefined
              }
              options={supportActionsOptions}
              onChange={handleSupportActionChange}
              isSearchable={false}
              isDisabled={useCase === "STUDENT" || !editIsActive}
            />
          </div>
        </div>
        <AnimateHeight
          height={formData?.supportActions.includes("other") ? "auto" : 0}
        >
          <div
            className="hops-container__row"
            style={{ margin: "0", padding: "10px 0" }}
          >
            <div className="hops__form-element-container">
              <Textarea
                id="otherSupportMeasures"
                label="Muu?"
                placeholder="Yhteistyötahot"
                className="hops__input"
                onChange={(e) =>
                  handleTextAreaChange("supportActionOther", e.target.value)
                }
                value={formData?.supportActionOther || ""}
                disabled={useCase === "STUDENT" || !editIsActive}
              />
            </div>
          </div>
        </AnimateHeight>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="graduationGoalMonth" className="hops__label">
              Ennakko suunnitelma ylioppilaskirjoituksiin:
            </label>
            <Select
              className="react-select-override"
              classNamePrefix="react-select-override"
              isMulti
              value={
                (formData &&
                  matriculationSupportActionsOptions.filter((option) =>
                    formData?.matriculationExaminationSupport.includes(
                      option.value
                    )
                  )) ||
                undefined
              }
              options={matriculationSupportActionsOptions}
              onChange={handleMatriculationSupportActionChange}
              isSearchable={false}
              isDisabled={useCase === "STUDENT" || !editIsActive}
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
          <div
            className="hops-container__row"
            style={{ margin: "0", padding: "10px 0" }}
          >
            <div className="hops__form-element-container">
              <Textarea
                id="matriculationSupportOther"
                label="Muu?"
                className="hops__input"
                onChange={(e) =>
                  handleTextAreaChange(
                    "matriculationExaminationSupportOther",
                    e.target.value
                  )
                }
                value={formData?.matriculationExaminationSupportOther || ""}
                disabled={useCase === "STUDENT" || !editIsActive}
              />
            </div>
          </div>
        </AnimateHeight>
      </fieldset>
    </section>
  );
};

export default NeedOfSupportInformation;
