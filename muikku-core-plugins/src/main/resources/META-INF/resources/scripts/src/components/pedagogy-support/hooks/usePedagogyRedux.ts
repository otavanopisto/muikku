import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { displayNotification } from "~/actions/base/notifications";
import {
  PedagogyFormData,
  PedagogySupportActionImplemented,
} from "~/@types/pedagogy-form";
import MApi, { isMApiError } from "~/api/api";
import _ from "lodash";
import {
  initializePedagogyFormData,
  initializeImplemetedSupportActionsFormData,
  getEditedFields,
} from "../helpers";
import {
  initializePedagogySupport,
  startEditingPedagogySupport,
  cancelEditingPedagogySupport,
  resetPedagogySupport,
  savePedagogySupport,
} from "~/actions/main-function/pedagogy-support";
import { StateType } from "~/reducers";

const pedagogyApi = MApi.getPedagogyApi();

export type UsePedagogyReduxType = ReturnType<typeof usePedagogyRedux>;

/**
 * usePedagogyRedux. Combined hook for pedagogy form and implemented actions using Redux
 * @param studentIdentifier studentIdentifier
 * @param isUppersecondary isUppersecondary
 * @param shouldLoadForm whether to attempt loading the form (based on permissions)
 */
export const usePedagogyRedux = (
  studentIdentifier: string,
  isUppersecondary: boolean,
  shouldLoadForm: boolean = true
) => {
  const dispatch = useDispatch();

  // Select state from Redux
  const {
    //initialized,
    //currentStudentIdentifier,
    pedagogyFormStatus,
    pedagogyForm,
    pedagogyFormData,
    //pedagogyFormExtraDetails,
    implementedActionsStatus,
    implementedActions,
    implementedActionsFormData,
    pedagogyMode,
    pedagogyEditing,
  } = useSelector((state: StateType) => state.pedagogySupport);

  // Computed values
  const loading = React.useMemo(
    () =>
      pedagogyFormStatus === "LOADING" ||
      implementedActionsStatus === "LOADING",
    [pedagogyFormStatus, implementedActionsStatus]
  );

  const pedagogyFormExists = React.useMemo(
    () => pedagogyForm?.created !== null || false,
    [pedagogyForm]
  );

  const implementedActionsHaveChanged = React.useMemo(
    () =>
      !_.isEqual(
        initializeImplemetedSupportActionsFormData(
          implementedActions?.formData
        ),
        implementedActionsFormData
      ),
    [implementedActionsFormData, implementedActions]
  );

  const editIsActive = React.useMemo(
    () => pedagogyMode === "EDIT",
    [pedagogyMode]
  );

  // Initialize pedagogy support
  React.useEffect(() => {
    dispatch(
      initializePedagogySupport({
        studentIdentifier,
        shouldLoadForm,
        isUppersecondary,
      })
    );
  }, [dispatch, shouldLoadForm, studentIdentifier, isUppersecondary]);

  /**
   * setEditIsActive
   * Set the edit is active state
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
   * resetPedagogyData
   * Reset the pedagogy data
   */
  const resetPedagogyData = React.useCallback(() => {
    dispatch(resetPedagogySupport());
  }, [dispatch]);

  /**
   * updatePedagogyFormDataAndUpdateChangedFields
   * Set the pedagogy form data and update the changed fields
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
   * updatePedagogyFormExtraDetails
   * Set the pedagogy form extra details
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
   * handleImplemetedSupportActionsFormDataChange
   * Set the implemented support actions form data
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
   * activatePedagogyForm
   * Activate the pedagogy form
   */
  const activatePedagogyForm = React.useCallback(async () => {
    try {
      const pedagogyData = await pedagogyApi.createPedagogyForm({
        studentIdentifier,
        createPedagogyFormRequest: {
          formData: "{}",
        },
      });

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA",
        payload: pedagogyData,
      });

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA",
        payload: initializePedagogyFormData(
          pedagogyData.formData,
          isUppersecondary
        ),
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(displayNotification(err.message, "error"));
    }
  }, [dispatch, studentIdentifier, isUppersecondary]);

  /**
   * togglePublishPedagogyForm
   * Toggle the publish status of the pedagogy form
   */
  const togglePublishPedagogyForm = React.useCallback(async () => {
    try {
      const updatedPedagogyFormData = await pedagogyApi.togglePublished({
        studentIdentifier,
      });

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA",
        payload: updatedPedagogyFormData,
      });

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA",
        payload: initializePedagogyFormData(
          updatedPedagogyFormData.formData,
          isUppersecondary
        ),
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(displayNotification(err.message, "error"));
    }
  }, [dispatch, studentIdentifier, isUppersecondary]);

  /**
   * saveAllData
   */
  const saveAllData = React.useCallback(async () => {
    dispatch(
      savePedagogySupport({
        details: pedagogyEditing.pedagogyFormExtraDetails,
      })
    );
    toggleEditIsActive(false);
  }, [dispatch, pedagogyEditing.pedagogyFormExtraDetails, toggleEditIsActive]);

  return {
    // Shared state
    loading,
    editIsActive,
    studentIdentifier,
    isUppersecondary,
    resetPedagogyData,
    saveAllData,
    toggleEditIsActive,

    // Implemented support actions related state
    pedagogySupportActions: implementedActions,
    implemetedSupportActionsFormData: pedagogyEditing.implementedActions,
    updateImplemetedSupportActionsFormData,
    implementedActionsHaveChanged,

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
