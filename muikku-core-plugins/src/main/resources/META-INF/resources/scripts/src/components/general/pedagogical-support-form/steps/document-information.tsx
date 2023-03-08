import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { TextField } from "../../hops-compulsory-education-wizard/text-field";
import { Textarea } from "../../hops-compulsory-education-wizard/text-area";
import DatePicker from "react-datepicker";
import { PedagogyContext } from "..";
import { FormData, PedagogyForm } from "~/@types/pedagogy-form";
/**
 * BasicInformationProps
 */
interface DocumentInformationProps {
  formData?: FormData;
  pedagogyData?: PedagogyForm;
  onFormDataChange: (updatedFormData: FormData) => void;
}

/**
 * BasicInformation
 * @param props props
 * @returns JSX.Element
 */
const DocumentInformation: React.FC<DocumentInformationProps> = (props) => {
  const { pedagogyData, formData } = props;
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

    props.onFormDataChange(updatedFormData);
  };

  const ownerNameWithPhone = pedagogyData
    ? `${pedagogyData?.ownerInfo.firstName} ${pedagogyData?.ownerInfo.lastName}` +
      (pedagogyData?.ownerInfo.phoneNumber
        ? ` (${pedagogyData?.ownerInfo.phoneNumber})`
        : "")
    : "-";

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Asiakirja</legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="graduationGoalMonth" className="hops__label">
              Asiakirjan laatimispäivä
            </label>
            <DatePicker
              id="graduationGoalMonth"
              dateFormat="MM/yyyy"
              // eslint-disable-next-line no-console
              onChange={() => console.log("changed")}
              selected={
                (pedagogyData?.created && new Date(pedagogyData?.created)) ||
                new Date()
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
              label="Asiakirjan laatija:"
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
              label="Asiakirjan laatimiseen osallistuneet"
              placeholder="Asiakirjan laatimiseen osallistuneet"
              className="hops__input"
              onChange={(e) =>
                handleTextAreaChange("documentParticipants", e.target.value)
              }
              value={formData?.documentParticipants || ""}
              disabled={useCase === "STUDENT" || !editIsActive}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="cooperativePartners"
              label="Yhteistyötahot"
              className="hops__input"
              onChange={(e) =>
                handleTextAreaChange("cooperativePartners", e.target.value)
              }
              value={formData?.cooperativePartners || ""}
              disabled={useCase === "STUDENT" || !editIsActive}
            />
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default DocumentInformation;
