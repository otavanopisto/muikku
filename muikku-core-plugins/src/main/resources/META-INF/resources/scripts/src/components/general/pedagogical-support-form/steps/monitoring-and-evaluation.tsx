import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { FormData, PedagogyForm } from "../types";
import CKEditor from "../../ckeditor";

/**
 * BasicInformationProps
 */
interface MonitoringAndEvaluationProps {
  loading: boolean;
  pedagogyData?: PedagogyForm;
  formData?: FormData;
  onFormDataChange: (updatedFormData: FormData) => void;
}

/**
 * BasicInformation
 * @param props props
 * @returns JSX.Element
 */
const MonitoringAndEvaluation: React.FC<MonitoringAndEvaluationProps> = (
  props
) => {
  const { formData, onFormDataChange } = props;

  /**
   * handleStudentOpinionChange
   * @param value value
   */
  const handleStudentOpinionChange = (value: string) => {
    onFormDataChange({
      ...formData,
      studentOpinionOfSupport: value,
    });
  };

  /**
   * handleSchoolOpinionChange
   * @param value value
   */
  const handleSchoolOpinionChange = (value: string) => {
    onFormDataChange({
      ...formData,
      schoolOpinionOfSupport: value,
    });
  };

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          TUEN SEURANTA JA ARVIOINTI
        </legend>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label className="env-dialog__label">Opiskelijan näkemys</label>
            <CKEditor onChange={handleStudentOpinionChange}>
              {formData?.studentOpinionOfSupport || ""}
            </CKEditor>
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label className="env-dialog__label">
              Lukion näkemys tuen vaikuttavuudesta
            </label>

            <CKEditor onChange={handleSchoolOpinionChange}>
              {formData?.schoolOpinionOfSupport || ""}
            </CKEditor>
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default MonitoringAndEvaluation;
