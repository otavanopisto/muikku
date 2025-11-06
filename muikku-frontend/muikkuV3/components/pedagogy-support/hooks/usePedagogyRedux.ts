import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PedagogyFormData,
  PedagogySupportActionImplemented,
} from "~/@types/pedagogy-form";
import _ from "lodash";
import { getEditedFields, PedagogySupportPermissions } from "../helpers";
import {
  initializePedagogySupport,
  startEditingPedagogySupport,
  cancelEditingPedagogySupport,
  resetPedagogySupport,
  savePedagogySupport,
  activatePedagogySupport,
  togglePublishPedagogySupportForm,
} from "~/actions/main-function/pedagogy-support";
import { StateType } from "~/reducers";
import {
  PedagogyForm,
  PedagogyFormAccess,
  PedagogyFormImplementedActions,
  PedagogyFormLocked,
} from "~/generated/client";

export type UsePedagogyReduxType = ReturnType<typeof usePedagogyRedux>;

/**
 * usePedagogyRedux. Combined hook for pedagogy form and implemented actions using Redux
 * @param studentIdentifier studentIdentifier
 * @param pedagogyFormAccess pedagogyFormAccess
 * @param pedagogySupportStudentPermissions pedagogySupportStudentPermissions
 */
export const usePedagogyRedux = (
  studentIdentifier: string,
  pedagogyFormAccess: Partial<PedagogyFormAccess>,
  pedagogySupportStudentPermissions: PedagogySupportPermissions
) => {
  const dispatch = useDispatch();

  const websocket = useSelector(
    (state: StateType) => state.websocket.websocket
  );

  // Select state from Redux
  const {
    // General state
    pedagogyLocked,

    // Pedagogy form state
    pedagogyFormStatus,
    pedagogyForm,
    pedagogyFormData,

    // Implemented actions state
    implementedActionsStatus,
    implementedActions,
    implementedActionsFormData,

    // Editing state
    pedagogyMode,
    pedagogyEditing,
  } = useSelector((state: StateType) => state.pedagogySupport);

  const { userId } = useSelector((state: StateType) => state.status);

  // Computed values
  const loading = React.useMemo(
    () =>
      pedagogyFormStatus === "LOADING" ||
      implementedActionsStatus === "LOADING",
    [pedagogyFormStatus, implementedActionsStatus]
  );

  // Check if pedagogy form exists
  const pedagogyFormExists = React.useMemo(
    () => pedagogyForm?.created !== null || false,
    [pedagogyForm]
  );

  // Check if pedagogy form has changes
  const pedagogyFormHasChanges = React.useMemo(
    () => !_.isEqual(pedagogyFormData, pedagogyEditing.pedagogyFormData),
    [pedagogyFormData, pedagogyEditing.pedagogyFormData]
  );

  // Check if implemented actions have changed
  const implementedActionsHaveChanged = React.useMemo(
    () =>
      !_.isEqual(
        implementedActionsFormData,
        pedagogyEditing.implementedActions
      ),
    [implementedActionsFormData, pedagogyEditing.implementedActions]
  );

  // Check if edit is active
  const editIsActive = React.useMemo(
    () => pedagogyMode === "EDIT",
    [pedagogyMode]
  );

  // Check if editing is disabled
  const editingDisabled = React.useMemo(() => {
    if (pedagogyLocked?.userEntityId !== userId && pedagogyLocked?.locked) {
      return true;
    }
    return false;
  }, [pedagogyLocked, userId]);

  // Initialize pedagogy support
  React.useEffect(() => {
    dispatch(
      initializePedagogySupport({
        studentIdentifier,
        pedagogyFormAccess,
        pedagogySupportStudentPermissions,
      })
    );
  }, [
    dispatch,
    pedagogyFormAccess,
    studentIdentifier,
    pedagogySupportStudentPermissions,
  ]);

  // Add useEffect to handle beforeunload event
  React.useEffect(() => {
    /**
     * Handles the beforeunload event to prevent the user from leaving the page
     * with unsaved changes.
     *
     * @param e - The beforeunload event
     * @returns - Returns an empty string to allow the user to leave the page
     */
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        implementedActionsHaveChanged ||
        pedagogyFormHasChanges ||
        editIsActive
      ) {
        e.preventDefault();
        e.returnValue = ""; // For Chrome
        return ""; // For other browsers
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editIsActive, implementedActionsHaveChanged, pedagogyFormHasChanges]);

  // Websocket event handling
  React.useEffect(() => {
    /**
     * Handle pedagogy support form updated
     * @param data data
     */
    const handlePedagogySupportFormUpdated = (data: unknown) => {
      const pedagogyData = data as PedagogyForm;

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA",
        payload: pedagogyData,
      });

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA",
        payload: JSON.parse(pedagogyData.formData) as PedagogyFormData,
      });
    };

    /**
     * Handle pedagogy support implemented actions updated
     * @param data data
     */
    const handlePedagogytImplementedActionsUpdated = (data: unknown) => {
      const implementedActionsData = data as PedagogyFormImplementedActions;

      dispatch({
        type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_DATA",
        payload: implementedActionsData,
      });

      dispatch({
        type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_FORM_DATA",
        payload: JSON.parse(
          implementedActionsData.formData
        ) as PedagogySupportActionImplemented[],
      });
    };

    /**
     * Handle pedagogy locked updated
     * @param data data
     */
    const handlePedagogyLockedUpdated = (data: unknown) => {
      const pedagogyLockedData = data as PedagogyFormLocked;

      dispatch({
        type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED",
        payload: pedagogyLockedData,
      });
    };

    // Add event callbacks
    websocket.addEventCallback(
      "pedagogy:pedagogy-form-updated",
      handlePedagogySupportFormUpdated
    );
    websocket.addEventCallback(
      "pedagogy:implemented-support-actions-updated",
      handlePedagogytImplementedActionsUpdated
    );
    websocket.addEventCallback(
      "pedagogy:lock-updated",
      handlePedagogyLockedUpdated
    );

    // Clean up event callbacks
    return () => {
      websocket.removeEventCallback(
        "pedagogy:pedagogy-form-updated",
        handlePedagogySupportFormUpdated
      );
      websocket.removeEventCallback(
        "pedagogy:implemented-support-actions-updated",
        handlePedagogytImplementedActionsUpdated
      );
      websocket.removeEventCallback(
        "pedagogy:lock-updated",
        handlePedagogyLockedUpdated
      );
    };
  }, [dispatch, websocket]);

  /**
   * Toggle edit is active
   * @param isActive isActive
   */
  const toggleEditIsActive = React.useCallback(
    (isActive: boolean) => {
      if (isActive) {
        dispatch(startEditingPedagogySupport());
      } else {
        dispatch(cancelEditingPedagogySupport());
      }
    },
    [dispatch]
  );

  /**
   * Reset the pedagogy data
   */
  const resetPedagogyData = React.useCallback(() => {
    dispatch(resetPedagogySupport());
  }, [dispatch]);

  /**
   * Update the pedagogy form data and update the changed fields
   */
  const updatePedagogyFormDataAndUpdateChangedFields = React.useCallback(
    (updatedFormData: PedagogyFormData) => {
      const changedValuesComparedToPrevious = getEditedFields(
        pedagogyFormData,
        updatedFormData
      );

      // Update editing state
      dispatch({
        type: "PEDAGOGY_SUPPORT_UPDATE_EDITING",
        payload: {
          pedagogyFormData: updatedFormData,
          changedFields: changedValuesComparedToPrevious,
        },
      });
    },
    [dispatch, pedagogyFormData]
  );

  /**
   * Update the pedagogy form extra details
   */
  const updatePedagogyFormExtraDetails = React.useCallback(
    (details: string) => {
      dispatch({
        type: "PEDAGOGY_SUPPORT_UPDATE_EDITING",
        payload: {
          pedagogyFormExtraDetails: details,
        },
      });
    },
    [dispatch]
  );

  /**
   * Update the implemented support actions form data
   */
  const updateImplemetedSupportActionsFormData = React.useCallback(
    (formData: PedagogySupportActionImplemented[]) => {
      dispatch({
        type: "PEDAGOGY_SUPPORT_UPDATE_EDITING",
        payload: {
          implementedActions: formData,
        },
      });
    },
    [dispatch]
  );

  /**
   * Activate the pedagogy form
   */
  const activatePedagogyForm = React.useCallback(async () => {
    dispatch(activatePedagogySupport({}));
  }, [dispatch]);

  /**
   * Toggle the publish status of the pedagogy form
   */
  const togglePublishPedagogyForm = React.useCallback(async () => {
    dispatch(togglePublishPedagogySupportForm({}));
  }, [dispatch]);

  /**
   * Save all data
   */
  const saveAllData = React.useCallback(async () => {
    dispatch(
      savePedagogySupport({
        details: pedagogyEditing.pedagogyFormExtraDetails,
      })
    );
  }, [dispatch, pedagogyEditing.pedagogyFormExtraDetails]);

  return {
    // Shared state
    loading,
    editIsActive,
    studentIdentifier,
    editingDisabled,
    pedagogySupportStudentPermissions,
    resetPedagogyData,
    saveAllData,
    toggleEditIsActive,

    // Implemented support actions related state
    pedagogySupportActions: implementedActions,
    implemetedSupportActionsFormData: pedagogyEditing.implementedActions,
    implementedActionsHaveChanged,
    updateImplemetedSupportActionsFormData,

    // Pedagogy form related state
    pedagogyFormExists,
    pedagogyForm,
    pedagogyFormData: pedagogyEditing.pedagogyFormData || pedagogyFormData,
    changedFields: pedagogyEditing.changedFields,
    activatePedagogyForm,
    updatePedagogyFormDataAndUpdateChangedFields,
    updatePedagogyFormExtraDetails,
    togglePublishPedagogyForm,
  };
};
