import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { PedagogyContext } from "..";
import {
  FormData,
  Opinion,
  OpinionType,
  PedagogyForm,
} from "~/@types/pedagogy-form";
import { AddNewOpinionBox, OpinionItem, OpinionList } from "../opinions-list";
import { StatusType } from "~/reducers/base/status";

/**
 * MonitoringAndEvaluationProps
 */
interface MonitoringAndEvaluationProps {
  pedagogyData?: PedagogyForm;
  formData?: FormData;
  status: StatusType;
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
  const { useCase, editIsActive } = React.useContext(PedagogyContext);
  const { formData, onFormDataChange, status } = props;

  /**
   * Handles support reason select change
   * @param type type
   */
  const handleAddNewOpinion = (type: OpinionType) => () => {
    const updatedFormData: FormData = {
      ...formData,
    };

    updatedFormData[type].push({
      creatorIdentifier: status.userSchoolDataIdentifier,
      creatorName: status.profile.displayName,
      creationDate: new Date(),
    });

    onFormDataChange(updatedFormData);
  };

  /**
   * Handles support reason select change
   *
   * @param index index
   * @param key key
   * @param value value
   * @param type type
   */
  const handleOpinionChange = <T extends keyof Opinion>(
    index: number,
    key: T,
    value: Opinion[T],
    type: OpinionType
  ) => {
    const updatedFormData: FormData = { ...formData };

    updatedFormData[type][index] = {
      ...updatedFormData[type][index],
      [key]: value,
    };

    onFormDataChange(updatedFormData);
  };

  /**
   * Handles support reason select change
   * @param index index
   * @param type type
   */
  const handleDeleteOpinion = (index: number, type: OpinionType) => {
    const updatedFormData: FormData = { ...formData };
    updatedFormData[type].splice(index, 1);

    onFormDataChange(updatedFormData);
  };

  const studentOpinionEntries =
    (formData?.studentOpinionOfSupport &&
      formData?.studentOpinionOfSupport.length > 0 &&
      formData?.studentOpinionOfSupport.map((iOpinion, index) => (
        <OpinionItem
          key={index}
          index={index}
          type="studentOpinionOfSupport"
          opinion={iOpinion}
          ownerOfEntry={
            status.userSchoolDataIdentifier === iOpinion.creatorIdentifier
          }
          onOpinionChange={handleOpinionChange}
          onDeleteEntryClick={handleDeleteOpinion}
        />
      ))) ||
    "Ei opiskelijan arvioita";

  const schoolOpinionEntries =
    (formData?.schoolOpinionOfSupport &&
      formData?.schoolOpinionOfSupport.length > 0 &&
      formData?.schoolOpinionOfSupport.map((iOpinion, index) => (
        <OpinionItem
          key={index}
          index={index}
          type="schoolOpinionOfSupport"
          opinion={iOpinion}
          ownerOfEntry={
            status.userSchoolDataIdentifier === iOpinion.creatorIdentifier
          }
          onOpinionChange={handleOpinionChange}
          onDeleteEntryClick={handleDeleteOpinion}
        />
      ))) ||
    "Ei koulun arvioita";

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          TUEN SEURANTA JA ARVIOINTI (opiskelijan näkökulma)
        </legend>
        <OpinionList>
          {studentOpinionEntries}
          {editIsActive && (
            <AddNewOpinionBox
              onClick={handleAddNewOpinion("studentOpinionOfSupport")}
              disabled={useCase === "STUDENT" || !editIsActive}
            />
          )}
        </OpinionList>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          TUEN SEURANTA JA ARVIOINTI (Lukion näkökulma)
        </legend>
        <OpinionList>
          {schoolOpinionEntries}
          {editIsActive && (
            <AddNewOpinionBox
              onClick={handleAddNewOpinion("schoolOpinionOfSupport")}
              disabled={useCase === "STUDENT" || !editIsActive}
            />
          )}
        </OpinionList>
      </fieldset>
    </section>
  );
};

export default MonitoringAndEvaluation;
