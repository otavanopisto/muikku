import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import {
  CompulsoryFormData,
  Opinion,
  OpinionType,
} from "~/@types/pedagogy-form";
import {
  AddNewOpinionBox,
  OpinionItem,
  OpinionList,
} from "~/components/pedagogy-support/components/opinions-list";
import { StatusType } from "~/reducers/base/status";
import { useTranslation } from "react-i18next";
import { useCompulsoryForm } from "~/components/pedagogy-support/hooks/useCompulsoryForm";

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
  const { t } = useTranslation("pedagogySupportPlan");
  const { status } = props;
  const {
    userRole,
    editIsActive,
    formData,
    updatePedagogyFormDataAndUpdateChangedFields,
  } = useCompulsoryForm();

  /**
   * Handles support reason select change
   * @param type type
   */
  const handleAddNewOpinion = (type: OpinionType) => () => {
    const updatedFormData: CompulsoryFormData = {
      ...formData,
    };

    // Clone the array to avoid mutating the original
    updatedFormData[type] = [...updatedFormData[type]];
    updatedFormData[type].push({
      creatorIdentifier: status.userSchoolDataIdentifier,
      creatorName: status.profile.displayName,
      creationDate: new Date(),
    });

    updatePedagogyFormDataAndUpdateChangedFields(updatedFormData);
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
    const updatedFormData: CompulsoryFormData = { ...formData };

    // Clone the array to avoid mutating the original
    updatedFormData[type] = [...updatedFormData[type]];
    updatedFormData[type][index] = {
      ...updatedFormData[type][index],
      [key]: value,
    };

    updatePedagogyFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles support reason select change
   * @param index index
   * @param type type
   */
  const handleDeleteOpinion = (index: number, type: OpinionType) => {
    const updatedFormData: CompulsoryFormData = { ...formData };

    // Clone the array to avoid mutating the original
    updatedFormData[type] = [...updatedFormData[type]];
    updatedFormData[type].splice(index, 1);

    updatePedagogyFormDataAndUpdateChangedFields(updatedFormData);
  };

  const studentOpinionEntries = (formData?.studentOpinionOfSupport &&
    formData?.studentOpinionOfSupport.length > 0 &&
    formData?.studentOpinionOfSupport.map((iOpinion, index) => {
      const isOwnerOfEntry =
        iOpinion.creatorIdentifier === status.userSchoolDataIdentifier;

      return (
        <OpinionItem
          key={index}
          index={index}
          type="studentOpinionOfSupport"
          opinion={iOpinion}
          disabled={
            userRole !== "SPECIAL_ED_TEACHER" ||
            !editIsActive ||
            !isOwnerOfEntry
          }
          onOpinionChange={handleOpinionChange}
          onDeleteEntryClick={handleDeleteOpinion}
        />
      );
    })) || (
    <div className="empty">
      <span>
        {t("content.empty", {
          ns: "pedagogySupportPlan",
          context: "studentAssessment",
        })}
      </span>
    </div>
  );

  const schoolOpinionEntries = (formData?.schoolOpinionOfSupport &&
    formData?.schoolOpinionOfSupport.length > 0 &&
    formData?.schoolOpinionOfSupport.map((iOpinion, index) => {
      const isOwnerOfEntry =
        iOpinion.creatorIdentifier === status.userSchoolDataIdentifier;

      return (
        <OpinionItem
          key={index}
          index={index}
          type="schoolOpinionOfSupport"
          opinion={iOpinion}
          disabled={
            userRole !== "SPECIAL_ED_TEACHER" ||
            !editIsActive ||
            !isOwnerOfEntry
          }
          onOpinionChange={handleOpinionChange}
          onDeleteEntryClick={handleDeleteOpinion}
        />
      );
    })) || (
    <div className="empty">
      <span>
        {t("content.empty", {
          ns: "pedagogySupportPlan",
          context: "schoolAssessment",
        })}
      </span>
    </div>
  );

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.opinionOfSupport", {
            ns: "pedagogySupportPlan",
            context: "student",
          })}
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
          {t("labels.opinionOfSupport", {
            ns: "pedagogySupportPlan",
            context: "school",
          })}
        </legend>
        <OpinionList>
          {schoolOpinionEntries}
          {userRole === "SPECIAL_ED_TEACHER" && (
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
