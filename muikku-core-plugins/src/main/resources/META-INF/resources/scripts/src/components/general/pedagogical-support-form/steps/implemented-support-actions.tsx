import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import {
  AddNewActionsBox,
  ImplementedActionsList,
  ImplementedActionsListItem,
} from "../implemented-actions";
import { PedagogyContext } from "..";
import {
  FormData,
  PedagogyForm,
  SupportActionImplementation,
} from "~/@types/pedagogy-form";

/**
 * BasicInformationProps
 */
interface ImplementedSupportActionsProps {
  pedagogyData?: PedagogyForm;
  formData?: FormData;
  onFormDataChange: (updatedFormData: FormData) => void;
}

/**
 * BasicInformation
 * @param props props
 * @returns JSX.Element
 */
const ImplementedSupportActions: React.FC<ImplementedSupportActionsProps> = (
  props
) => {
  const { formData, onFormDataChange } = props;
  const { useCase, editIsActive } = React.useContext(PedagogyContext);
  /**
   * handleAddNewSupportAction
   */
  const handleAddNewSupportAction = () => {
    const updatedFormData: FormData = {
      ...formData,
    };

    updatedFormData.supportActionsImplemented.push({
      creatorName: "",
      action: "remedialInstruction",
      date: new Date(),
    });

    onFormDataChange(updatedFormData);
  };

  /**
   * handleDeleteSupportAction
   * @param index index
   */
  const handleDeleteSupportAction = (index: number) => {
    const updatedFormData: FormData = { ...formData };
    updatedFormData.supportActionsImplemented.splice(index, 1);

    onFormDataChange(updatedFormData);
  };

  /**
   * handleSupportActionChange
   * @param index index
   * @param key key
   * @param value value
   */
  const handleSupportActionChange = <
    T extends keyof SupportActionImplementation
  >(
    index: number,
    key: T,
    value: SupportActionImplementation[T]
  ) => {
    const updatedFormData: FormData = { ...formData };

    updatedFormData.supportActionsImplemented[index] = {
      ...updatedFormData.supportActionsImplemented[index],
      [key]: value,
    };

    onFormDataChange(updatedFormData);
  };

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          TOTEUTETUT TUKITOIMET
        </legend>

        <ImplementedActionsList>
          {formData?.supportActionsImplemented.map((iAction, index) => (
            <ImplementedActionsListItem
              implemenetedSupportAction={iAction}
              key={index}
              index={index}
              onDeleteActionClick={handleDeleteSupportAction}
              onActionChange={handleSupportActionChange}
            />
          ))}
          <AddNewActionsBox
            onClick={handleAddNewSupportAction}
            disabled={useCase === "STUDENT" || !editIsActive}
          />
        </ImplementedActionsList>
      </fieldset>
    </section>
  );
};

export default ImplementedSupportActions;
