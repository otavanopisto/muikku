import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import CKEditor from "../../ckeditor";
import { PedagogyContext } from "..";
import CkeditorLoaderContent from "../../../base/ckeditor-loader/content";
import { FormData, PedagogyForm } from "~/@types/pedagogy-form";

/**
 * MonitoringAndEvaluationProps
 */
interface MonitoringAndEvaluationProps {
  pedagogyData?: PedagogyForm;
  formData?: FormData;
  onFormDataChange: (updatedFormData: FormData) => void;
}

/**
 * MonitoringAndEvaluation
 * @param props props
 * @returns JSX.Element
 */
const MonitoringAndEvaluation: React.FC<MonitoringAndEvaluationProps> = (
  props
) => {
  const { formData, onFormDataChange } = props;
  const { editIsActive } = React.useContext(PedagogyContext);

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

  const studentOpinion = formData?.studentOpinionOfSupport || "";
  const schoolOpinion = formData?.schoolOpinionOfSupport || "";

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          TUEN SEURANTA JA ARVIOINTI
        </legend>
        <div className="hops-container__row">
          {editIsActive ? (
            <div className="hops__form-element-container">
              <label className="hops__label">Opiskelijan näkemys</label>
              <CKEditor onChange={handleStudentOpinionChange}>
                {studentOpinion}
              </CKEditor>
            </div>
          ) : (
            <div className="hops__form-element-container">
              <label className="hops__label">Opiskelijan näkemys</label>
              {studentOpinion === "" ? (
                <p>Opiskelijan näkemystä ei ole vielä asetettu</p>
              ) : (
                <CkeditorLoaderContent html={studentOpinion} />
              )}
            </div>
          )}
        </div>
        <div className="hops-container__row">
          {editIsActive ? (
            <div className="hops__form-element-container">
              <label className="hops__label">
                Lukion näkemys tuen vaikuttavuudesta
              </label>
              <CKEditor onChange={handleSchoolOpinionChange}>
                {schoolOpinion}
              </CKEditor>
            </div>
          ) : (
            <div className="hops__form-element-container">
              <label className="hops__label">
                Lukion näkemys tuen vaikuttavuudesta
              </label>
              {schoolOpinion === "" ? (
                <p>Lukion näkemystä ei ole vielä asetettu</p>
              ) : (
                <CkeditorLoaderContent html={schoolOpinion} />
              )}
            </div>
          )}
        </div>
      </fieldset>
    </section>
  );
};

export default MonitoringAndEvaluation;
