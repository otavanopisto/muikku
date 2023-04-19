import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { FormData, Opinion, OpinionType } from "~/@types/pedagogy-form";
import { AddNewOpinionBox, OpinionItem, OpinionList } from "../opinions-list";
import { StatusType } from "~/reducers/base/status";
import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * MonitoringAndEvaluationProps
 */
interface MonitoringAndEvaluationProps {
  status: StatusType;
}

/**
 * MonitoringAndEvaluation
 * @param props props
 * @returns JSX.Element
 */
const MonitoringAndEvaluation: React.FC<MonitoringAndEvaluationProps> = (
  props
) => {
  const { status } = props;
  const { formData, setFormDataAndUpdateChangedFields } = usePedagogyContext();
  const { userRole, editIsActive } = usePedagogyContext();

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

    setFormDataAndUpdateChangedFields(updatedFormData);
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

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles support reason select change
   * @param index index
   * @param type type
   */
  const handleDeleteOpinion = (index: number, type: OpinionType) => {
    const updatedFormData: FormData = { ...formData };
    updatedFormData[type].splice(index, 1);

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  const studentOpinionEntries = (formData?.studentOpinionOfSupport &&
    formData?.studentOpinionOfSupport.length > 0 &&
    formData?.studentOpinionOfSupport.map((iOpinion, index) => (
      <OpinionItem
        key={index}
        index={index}
        type="studentOpinionOfSupport"
        opinion={iOpinion}
        disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
        onOpinionChange={handleOpinionChange}
        onDeleteEntryClick={handleDeleteOpinion}
      />
    ))) || (
    <div className="empty">
      <span>Ei opiskelijan arvioita</span>
    </div>
  );

  const schoolOpinionEntries = (formData?.schoolOpinionOfSupport &&
    formData?.schoolOpinionOfSupport.length > 0 &&
    formData?.schoolOpinionOfSupport.map((iOpinion, index) => {
      const ownerOfEntry =
        status.userSchoolDataIdentifier === iOpinion.creatorIdentifier;

      return (
        <OpinionItem
          key={index}
          index={index}
          type="schoolOpinionOfSupport"
          opinion={iOpinion}
          disabled={
            userRole === "STUDENT" ||
            !editIsActive ||
            !ownerOfEntry ||
            !editIsActive
          }
          onOpinionChange={handleOpinionChange}
          onDeleteEntryClick={handleDeleteOpinion}
        />
      );
    })) || (
    <div className="empty">
      <span>Ei koulun arvioita</span>
    </div>
  );

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          OPISKELIJAN NÄKEMYS TUEN VAIKUTTAVUUDESTA
        </legend>
        <OpinionList>
          {studentOpinionEntries}
          {userRole === "SPECIAL_ED_TEACHER" && (
            <AddNewOpinionBox
              onClick={handleAddNewOpinion("studentOpinionOfSupport")}
              disabled={!editIsActive}
            />
          )}
        </OpinionList>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          OPPILAITOKSEN NÄKEMYS TUEN VAIKUTTAVUUDESTA
        </legend>
        <OpinionList>
          {schoolOpinionEntries}
          {userRole !== "STUDENT" && (
            <AddNewOpinionBox
              onClick={handleAddNewOpinion("schoolOpinionOfSupport")}
              disabled={!editIsActive}
            />
          )}
        </OpinionList>
      </fieldset>
    </section>
  );
};

export default MonitoringAndEvaluation;
