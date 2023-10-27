import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../../hops-compulsory-education-wizard/text-field";
import { Textarea } from "../../hops-compulsory-education-wizard/text-area";
import DatePicker from "react-datepicker";
import { FormData } from "~/@types/pedagogy-form";
import { usePedagogyContext } from "../context/pedagogy-context";
import { useTranslation } from "react-i18next";

/**
 * DocumentInformationProps
 */
interface DocumentInformationProps {}

/**
 * DocumentInformation
 *
 * @param props props
 * @returns JSX.Element
 */
const DocumentInformation: React.FC<DocumentInformationProps> = (props) => {
  const { t } = useTranslation("pedagogySupportPlan");
  const {
    userRole,
    editIsActive,
    formData,
    data,
    setFormDataAndUpdateChangedFields,
  } = usePedagogyContext();

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

  const ownerNameWithPhone = data
    ? `${data?.ownerInfo.firstName} ${data?.ownerInfo.lastName}` +
      (data?.ownerInfo.phoneNumber ? ` (${data?.ownerInfo.phoneNumber})` : "")
    : "-";

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.document", { ns: "pedagogySupportPlan" })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="documentCreationDate" className="hops__label">
              {t("labels.documentCreatedDate", { ns: "pedagogySupportPlan" })}
            </label>
            <DatePicker
              id="documentCreationDate"
              dateFormat="dd.MM.yyyy"
              onChange={undefined}
              selected={
                (data?.created && new Date(data?.created)) || new Date()
              }
              className="hops__input"
              disabled
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="authorOfDocument"
              label={t("labels.authorOfDocument", {
                ns: "pedagogySupportPlan",
              })}
              type="text"
              className="hops__input"
              value={ownerNameWithPhone || "-"}
              disabled
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="documentParticipants"
              label={t("labels.documentParticipants", {
                ns: "pedagogySupportPlan",
              })}
              className="hops__textarea"
              onChange={(e) =>
                handleTextAreaChange("documentParticipants", e.target.value)
              }
              value={formData?.documentParticipants || ""}
              required
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="cooperativePartners"
              label={t("labels.cooperativePartners", {
                ns: "pedagogySupportPlan",
              })}
              className="hops__textarea"
              onChange={(e) =>
                handleTextAreaChange("cooperativePartners", e.target.value)
              }
              value={formData?.cooperativePartners || ""}
              disabled={userRole !== "SPECIAL_ED_TEACHER" || !editIsActive}
            />
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default DocumentInformation;
