import * as React from "react";
import { useImplementedActions } from "./useImplementedActions";
import { usePedagogyForm } from "./usePedagogyForm";

export type UsePedagogyType = ReturnType<typeof usePedagogy>;

/**
 * usePedagogy. Combined hook for pedagogy form and implemented actions
 * @param studentUserEntityId studentUserEntityId
 * @param isUppersecondary isUppersecondary
 * @param shouldLoadForm whether to attempt loading the form (based on permissions)
 */
export const usePedagogy = (
  studentUserEntityId: number,
  isUppersecondary: boolean,
  shouldLoadForm: boolean = true
) => {
  const [editIsActive, setEditIsActive] = React.useState(false);

  const pedagogyForm = usePedagogyForm(
    studentUserEntityId,
    isUppersecondary,
    shouldLoadForm
  );
  const implementedActions = useImplementedActions(studentUserEntityId);

  // Combined loading state
  const loading = React.useMemo(
    () => pedagogyForm.loading || implementedActions.loading,
    [pedagogyForm.loading, implementedActions.loading]
  );

  /**
   * resetPedagogyData - Unified reset function
   */
  const resetPedagogyData = () => {
    pedagogyForm.resetPedagogyFormData();
    implementedActions.resetImplementedActionsData();
    setEditIsActive(false);
  };

  /**
   * saveAllData - Unified save function that handles both scenarios
   */
  const saveAllData = async () => {
    // Save implemented actions if they have changed
    if (implementedActions.implementedActionsHaveChanged) {
      await implementedActions.saveImplementedActions();
    }

    // Save pedagogy form data if it exists and has changes
    if (
      pedagogyForm.pedagogyFormExists &&
      pedagogyForm.changedFields.length > 0
    ) {
      await pedagogyForm.savePedagogyFormData();
    }

    setEditIsActive(false);
  };

  return {
    // Shared state
    loading,
    editIsActive,
    studentUserEntityId,
    isUppersecondary,
    resetPedagogyData,
    saveAllData,
    setEditIsActive,

    // Implemented support actions related state
    pedagogySupportActions: implementedActions.pedagogySupportActions,
    implemetedSupportActionsFormData:
      implementedActions.implemetedSupportActionsFormData,
    setImplemetedSupportActionsFormData:
      implementedActions.setImplemetedSupportActionsFormData,
    implementedActionsHaveChanged:
      implementedActions.implementedActionsHaveChanged,

    // Pedagogy form related state
    pedagogyFormExists: pedagogyForm.pedagogyFormExists,
    pedagogyForm: pedagogyForm.pedagogyForm,
    pedagogyFormData: pedagogyForm.pedagogyFormData,
    changedFields: pedagogyForm.changedFields,
    activatePedagogyForm: pedagogyForm.activatePedagogyForm,
    setPedagogyFormDataAndUpdateChangedFields:
      pedagogyForm.setPedagogyFormDataAndUpdateChangedFields,
    setPedagogyFormExtraDetails: pedagogyForm.setPedagogyFormExtraDetails,
    togglePublishPedagogyForm: pedagogyForm.togglePublishPedagogyForm,
  };
};
