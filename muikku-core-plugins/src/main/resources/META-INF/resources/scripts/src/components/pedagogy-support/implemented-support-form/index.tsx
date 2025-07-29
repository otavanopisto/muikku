import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import {
  AddNewActionsBox,
  ImplementedActionsList,
  ImplementedActionsListItem,
} from "../components/implemented-actions";
import { usePedagogyContext } from "../context/pedagogy-context";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { PedagogySupportActionImplemented } from "~/@types/pedagogy-form";

/**
 * ImplementedSupportActionsProps
 */
interface ImplementedSupportActionsProps {}

/**
 * ImplementedSupportActions
 *
 * @param props props
 * @returns JSX.Element
 */
const ImplementedSupportActions: React.FC<ImplementedSupportActionsProps> = (
  props
) => {
  const { t } = useTranslation("pedagogySupportPlan");
  const status = useSelector((state: StateType) => state.status);
  const {
    implemetedSupportActionsFormData,
    setImplemetedSupportActionsFormData,
    editIsActive,
  } = usePedagogyContext();

  /**
   * Handles adding new support action
   */
  const handleAddNewSupportAction = () => {
    setImplemetedSupportActionsFormData((prev) => [
      ...prev,
      {
        creatorIdentifier: status.userSchoolDataIdentifier,
        creatorName: status.profile.displayName,
        action: "remedialInstruction",
        date: new Date(),
      },
    ]);
  };

  /**
   * Handles removing a support action
   * @param index index of the action to remove
   */
  const handleRemoveSupportAction = (index: number) => {
    setImplemetedSupportActionsFormData((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /**
   * Handles changing a support action
   * @param index index of the action to change
   * @param key key of the action to change
   * @param value value of the action to change
   */
  const handleSupportActionChange = <
    T extends keyof PedagogySupportActionImplemented,
  >(
    index: number,
    key: T,
    value: PedagogySupportActionImplemented[T]
  ) => {
    setImplemetedSupportActionsFormData((prev) =>
      prev.map((a, i) => (i === index ? { ...a, [key]: value } : a))
    );
  };

  // Implemented actions content
  const implementedActionsContent = (implemetedSupportActionsFormData &&
    implemetedSupportActionsFormData.length > 0 &&
    implemetedSupportActionsFormData.map((iAction, index) => (
      <ImplementedActionsListItem
        implemenetedSupportAction={iAction}
        key={index}
        index={index}
        ownerOfEntry={
          iAction.creatorIdentifier === status.userSchoolDataIdentifier
        }
        onDeleteActionClick={handleRemoveSupportAction}
        onActionChange={handleSupportActionChange}
      />
    ))) || (
    <div className="empty">
      <span>
        {t("content.empty", { ns: "pedagogySupportPlan", context: "actions" })}
      </span>
    </div>
  );

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.implementedActions", { ns: "pedagogySupportPlan" })}
        </legend>

        <ImplementedActionsList>
          {implementedActionsContent}
          {editIsActive && (
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
