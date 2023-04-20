import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import {
  AddNewActionsBox,
  ImplementedActionsList,
  ImplementedActionsListItem,
} from "../implemented-actions";
import { FormData, SupportActionImplementation } from "~/@types/pedagogy-form";
import { StatusType } from "~/reducers/base/status";
import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * ImplementedSupportActionsProps
 */
interface ImplementedSupportActionsProps {
  status: StatusType;
}

/**
 * ImplementedSupportActions
 *
 * @param props props
 * @returns JSX.Element
 */
const ImplementedSupportActions: React.FC<ImplementedSupportActionsProps> = (
  props
) => {
  const { status } = props;
  const { formData, setFormDataAndUpdateChangedFields } = usePedagogyContext();
  const { userRole, editIsActive } = usePedagogyContext();

  /**
   * Handles support reason select change
   */
  const handleAddNewSupportAction = () => {
    const updatedFormData: FormData = {
      ...formData,
    };

    updatedFormData.supportActionsImplemented.push({
      creatorIdentifier: status.userSchoolDataIdentifier,
      creatorName: status.profile.displayName,
      action: "remedialInstruction",
      date: new Date(),
    });

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles support reason select change
   *
   * @param index index
   */
  const handleDeleteSupportAction = (index: number) => {
    const updatedFormData: FormData = { ...formData };
    updatedFormData.supportActionsImplemented.splice(index, 1);

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  /**
   * Handles support reason select change
   *
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

    setFormDataAndUpdateChangedFields(updatedFormData);
  };

  const implementedActions = (formData?.supportActionsImplemented &&
    formData?.supportActionsImplemented.length > 0 &&
    formData?.supportActionsImplemented.map((iAction, index) => (
      <ImplementedActionsListItem
        implemenetedSupportAction={iAction}
        key={index}
        index={index}
        ownerOfEntry={
          status.userSchoolDataIdentifier === iAction.creatorIdentifier
        }
        onDeleteActionClick={handleDeleteSupportAction}
        onActionChange={handleSupportActionChange}
      />
    ))) || (
    <div className="empty">
      <span>Ei toteutettuja tukitoimia</span>
    </div>
  );

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          TOTEUTETUT TUKITOIMET
        </legend>

        <ImplementedActionsList>
          {implementedActions}
          {userRole !== "STUDENT" && (
            <AddNewActionsBox
              onClick={handleAddNewSupportAction}
              disabled={!editIsActive}
            />
          )}
        </ImplementedActionsList>
      </fieldset>
    </section>
  );
};

export default ImplementedSupportActions;
