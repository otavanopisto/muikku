import {
  PedagogyFormData,
  PedagogySupportActionImplemented,
} from "~/@types/pedagogy-form";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  PedagogyForm,
  PedagogyFormImplementedActions,
  PedagogyFormLocked,
} from "~/generated/client";
import {
  PedagogyEditingState,
  PedagogyMode,
  ReducerInitializeStatusType,
  ReducerStateType,
} from "~/reducers/pedagogy-support";
import { Dispatch, Action } from "redux";
import { StateType } from "~/reducers";
import { isMApiError } from "~/api/api";
import MApi from "~/api/api";
import {
  displayNotification,
  hideNotification,
} from "~/actions/base/notifications";
import _ from "lodash";
import {
  getEditedFields,
  initializePedagogyFormData,
} from "~/components/pedagogy-support/helpers";

const pedagogyApi = MApi.getPedagogyApi();

// PEDAGOGY SUPPORT INITIALIZATION AND GENERAL RELATED ACTIONS
export type PEDAGOGY_SUPPORT_UPDATE_INITIALIZE_STATUS = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_INITIALIZE_STATUS",
  ReducerInitializeStatusType
>;

export type PEDAGOGY_SUPPORT_UPDATE_STUDENT_TYPE = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_STUDENT_TYPE",
  "COMPULSORY" | "UPPERSECONDARY"
>;

export type PEDAGOGY_SUPPORT_CHANGE_MODE = SpecificActionType<
  "PEDAGOGY_SUPPORT_CHANGE_MODE",
  PedagogyMode
>;

export type PEDAGOGY_SUPPORT_CANCEL_EDITING = SpecificActionType<
  "PEDAGOGY_SUPPORT_CANCEL_EDITING",
  undefined
>;

export type PEDAGOGY_SUPPORT_RESET_DATA = SpecificActionType<
  "PEDAGOGY_SUPPORT_RESET_DATA",
  undefined
>;

// PEDAGOGY SUPPORT LOCKED RELATED ACTIONS
export type PEDAGOGY_SUPPORT_UPDATE_LOCKED_STATUS = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_LOCKED_STATUS",
  ReducerStateType
>;

export type PEDAGOGY_SUPPORT_UPDATE_LOCKED = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_LOCKED",
  PedagogyFormLocked
>;

// PEDAGOGY SUPPORT CURRENT STUDENT RELATED ACTIONS
export type PEDAGOGY_SUPPORT_UPDATE_CURRENTSTUDENTIDENTIFIER =
  SpecificActionType<
    "PEDAGOGY_SUPPORT_UPDATE_CURRENTSTUDENTIDENTIFIER",
    string
  >;

// PEDAGOGY SUPPORT FORM RELATED ACTIONS
export type PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS = SpecificActionType<
  "PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS",
  ReducerStateType
>;

export type PEDAGOGY_SUPPORT_FORM_UPDATE_DATA = SpecificActionType<
  "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA",
  PedagogyForm
>;

export type PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA = SpecificActionType<
  "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA",
  PedagogyFormData | null
>;

export type PEDAGOGY_SUPPORT_FORM_RESET_DATA = SpecificActionType<
  "PEDAGOGY_SUPPORT_FORM_RESET_DATA",
  null
>;

// IMPLEMENTED ACTIONS RELATED ACTIONS
export type PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS =
  SpecificActionType<
    "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS",
    ReducerStateType
  >;

export type PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_DATA =
  SpecificActionType<
    "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_DATA",
    PedagogyFormImplementedActions
  >;

export type PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_FORM_DATA =
  SpecificActionType<
    "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_FORM_DATA",
    PedagogySupportActionImplemented[]
  >;

export type PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_RESET_DATA =
  SpecificActionType<"PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_RESET_DATA", null>;

// EDITING RELATED ACTIONS
export type PEDAGOGY_SUPPORT_UPDATE_EDITING = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_EDITING",
  Partial<PedagogyEditingState>
>;

export type PEDAGOGY_SUPPORT_UPDATE_EDITING_FORM_DATA = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_EDITING_FORM_DATA",
  PedagogyFormData | null
>;

export type PEDAGOGY_SUPPORT_UPDATE_EDITING_CHANGED_FIELDS = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_EDITING_CHANGED_FIELDS",
  string[]
>;

export type PEDAGOGY_SUPPORT_UPDATE_EDITING_FORM_EXTRA_DETAILS =
  SpecificActionType<
    "PEDAGOGY_SUPPORT_UPDATE_EDITING_FORM_EXTRA_DETAILS",
    string
  >;

export type PEDAGOGY_SUPPORT_UPDATE_EDITING_IMPL_ACTIONS = SpecificActionType<
  "PEDAGOGY_SUPPORT_UPDATE_EDITING_IMPL_ACTIONS",
  PedagogySupportActionImplemented[]
>;

/**
 * InitializePedagogySupportTriggerType
 */
export interface InitializePedagogySupportTriggerType {
  (data: {
    studentIdentifier: string;
    shouldLoadForm: boolean;
    isUppersecondary: boolean;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * ResetPedagogySupportTriggerType
 */
export interface ResetPedagogySupportTriggerType {
  (): AnyActionType;
}

/**
 * ActivatePedagogySupportTriggerType
 */
export interface ActivatePedagogySupportTriggerType {
  (data: {
    isUppersecondary: boolean;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * TogglePublishPedagogySupportTriggerType
 */
export interface TogglePublishPedagogySupportFormTriggerType {
  (data: {
    isUppersecondary: boolean;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadPedagogySupportFormTriggerType
 */
export interface LoadPedagogySupportFormTriggerType {
  (data: {
    studentIdentifier: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadPedagogySupportImplActionsTriggerType
 */
export interface LoadPedagogySupportImplActionsTriggerType {
  (data: {
    studentIdentifier: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SavePedagogySupportTriggerType
 */
export interface SavePedagogySupportTriggerType {
  (data: {
    details?: string;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SavePedagogySupportFormTriggerType
 */
export interface SavePedagogySupportFormTriggerType {
  (data: {
    details?: string;
    fields?: string[];
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * SavePedagogySupportImplActionsTriggerType
 */
export interface SavePedagogySupportImplementedActionsTriggerType {
  (): AnyActionType;
}

/**
 * StartEditingPedagogySupportTriggerType
 */
export interface StartEditingPedagogySupportTriggerType {
  (): AnyActionType;
}

/**
 * CancelEditingPedagogySupportTriggerType
 */
export interface CancelEditingPedagogySupportTriggerType {
  (): AnyActionType;
}

/**
 * Initializing pedagogy support thunk. Combines loading implemented actions and
 * pedagogy form and initializes pedagogy locked status.
 *
 * @param data data
 * @returns AnyActionType
 */
const initializePedagogySupport: InitializePedagogySupportTriggerType =
  function initializePedagogySupport(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Get student identifier
      const studentIdentifier =
        data.studentIdentifier ||
        state.pedagogySupport.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Just throw error if trying to initialize HOPS with invalid student identifier
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      // If not IDLE we know that it is already initialized, or being initialized
      // Just call onSuccess and end method.
      if (state.pedagogySupport.initialized !== "IDLE") {
        data.onSuccess && data.onSuccess();

        return;
      }

      // Update initialize status
      dispatch({
        type: "PEDAGOGY_SUPPORT_UPDATE_INITIALIZE_STATUS",
        payload: "INITIALIZING",
      });

      // Update student type based on passed parameter
      dispatch({
        type: "PEDAGOGY_SUPPORT_UPDATE_STUDENT_TYPE",
        payload: data.isUppersecondary ? "UPPERSECONDARY" : "COMPULSORY",
      });

      // Update identifier if changed
      if (
        state.pedagogySupport.currentStudentIdentifier !== studentIdentifier
      ) {
        dispatch({
          type: "PEDAGOGY_SUPPORT_UPDATE_CURRENTSTUDENTIDENTIFIER",
          payload: studentIdentifier,
        });
      }

      // Set mode to READ by default
      dispatch({
        type: "PEDAGOGY_SUPPORT_CHANGE_MODE",
        payload: "READ",
      });

      try {
        // Lets make list of all promises that we need to resolve
        const promises = [
          dispatch(
            loadPedagogySupportImplActions({
              studentIdentifier: studentIdentifier,
            })
          ),
        ];

        if (data.shouldLoadForm) {
          promises.push(
            dispatch(
              loadPedagogySupportForm({
                studentIdentifier: studentIdentifier,
              })
            )
          );
        }

        // Resolve all promises
        await Promise.all(promises);

        // Initialize pedagogy locked status
        const pedagogyLocked = await initializePedagogyLocked(
          studentIdentifier,
          dispatch,
          getState
        );

        // Check if current user is editing
        const currentUserIsEditing =
          pedagogyLocked && state.status.userId === pedagogyLocked.userEntityId;

        // Change mode to EDIT if current user is editing
        if (currentUserIsEditing) {
          dispatch({
            type: "PEDAGOGY_SUPPORT_CHANGE_MODE",
            payload: "EDIT",
          });
        }

        dispatch({
          type: "PEDAGOGY_SUPPORT_UPDATE_INITIALIZE_STATUS",
          payload: "INITIALIZED",
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!isMApiError(err)) throw err;

        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Load pedagogy form thunk. Loads pedagogy form and initializes pedagogy form
 * data.
 *
 * @param data data
 * @returns AnyActionType
 */
const loadPedagogySupportForm: LoadPedagogySupportFormTriggerType =
  function loadPedagogySupportForm(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // If already ready, just cancel by returning
      if (state.pedagogySupport.pedagogyFormStatus === "READY") {
        return;
      }

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS",
        payload: "LOADING",
      });

      try {
        const pedagogyForm = await pedagogyApi.getPedagogyForm({
          studentIdentifier: data.studentIdentifier,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA",
          payload: pedagogyForm,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA",
          payload: initializePedagogyFormData(
            pedagogyForm.formData,
            state.pedagogySupport.pedagogyStudentType === "UPPERSECONDARY"
          ),
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS",
          payload: "READY",
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!isMApiError(err)) throw err;

        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Load pedagogy implemented actions thunk. Loads pedagogy implemented actions
 * and initializes pedagogy implemented actions data.
 *
 * @param data data
 * @returns AnyActionType
 */
const loadPedagogySupportImplActions: LoadPedagogySupportImplActionsTriggerType =
  function loadPedagogySupportImplActions(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // If already ready, just cancel by returning
      if (state.pedagogySupport.implementedActionsStatus === "READY") {
        return;
      }

      dispatch({
        type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS",
        payload: "LOADING",
      });

      try {
        const implementedActions =
          await pedagogyApi.getPedagogyFormImplementedActions({
            studentIdentifier: data.studentIdentifier,
          });

        dispatch({
          type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_DATA",
          payload: implementedActions,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_FORM_DATA",
          payload: JSON.parse(
            implementedActions.formData
          ) as PedagogySupportActionImplemented[],
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS",
          payload: "READY",
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!isMApiError(err)) throw err;
        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Handles starting editing pedagogy support. Loads pedagogy form and
 * implemented actions if needed and locks pedagogy form.
 *
 * @returns AnyActionType
 */
const startEditingPedagogySupport: StartEditingPedagogySupportTriggerType =
  function startEditingPedagogySupport() {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const promises = [];

      // Check if any needed data is not ready or loading, if not load it
      if (state.pedagogySupport.pedagogyFormStatus === "IDLE") {
        promises.push(
          dispatch(
            loadPedagogySupportForm({
              studentIdentifier: state.pedagogySupport.currentStudentIdentifier,
            })
          )
        );
      }

      if (state.pedagogySupport.implementedActionsStatus === "IDLE") {
        promises.push(
          dispatch(
            loadPedagogySupportImplActions({
              studentIdentifier: state.pedagogySupport.currentStudentIdentifier,
            })
          )
        );
      }

      try {
        await Promise.all(promises);

        const pedagogyLocked = await pedagogyApi.updateStudentPedagogyFormLock({
          studentIdentifier: state.pedagogySupport.currentStudentIdentifier,
          updateStudentPedagogyFormLockRequest: {
            locked: true,
          },
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED",
          payload: pedagogyLocked,
        });

        // Change mode after ensuring data is at least loading and hops is locked
        dispatch({
          type: "PEDAGOGY_SUPPORT_CHANGE_MODE",
          payload: "EDIT",
        });

        dispatch(
          displayNotification(
            "Editing mode enabled",
            "persistent-info",
            undefined,
            "pedagogy-editing-mode-notification"
          )
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Handles canceling editing pedagogy support by resetting the pedagogy form
 * and implemented actions to previous state. Unlocks pedagogy form.
 *
 * @returns AnyActionType
 */
const cancelEditingPedagogySupport: CancelEditingPedagogySupportTriggerType =
  function cancelEditingPedagogySupport() {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        const pedagogyLocked = await pedagogyApi.updateStudentPedagogyFormLock({
          studentIdentifier: state.pedagogySupport.currentStudentIdentifier,
          updateStudentPedagogyFormLockRequest: {
            locked: false,
          },
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED",
          payload: pedagogyLocked,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_CANCEL_EDITING",
          payload: undefined,
        });

        const pedagogyNotification =
          getState().notifications.notifications.find(
            (notification) =>
              notification.id === "pedagogy-editing-mode-notification"
          );

        if (pedagogyNotification) {
          dispatch(hideNotification(pedagogyNotification));
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Handles saving pedagogy support by saving the pedagogy form and implemented
 * actions. Unlocks pedagogy form. Invidual saves are done if needed.
 *
 * @param data data
 */
const savePedagogySupport: SavePedagogySupportTriggerType =
  function savePedagogySupport(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const pedagogyFormHasChanges = !_.isEqual(
        state.pedagogySupport.pedagogyFormData,
        state.pedagogySupport.pedagogyEditing.pedagogyFormData
      );

      const implementedActionsHaveChanges = !_.isEqual(
        state.pedagogySupport.implementedActionsFormData,
        state.pedagogySupport.pedagogyEditing.implementedActions
      );

      const allPromises = [];

      if (pedagogyFormHasChanges) {
        const editedFields = getEditedFields(
          state.pedagogySupport.pedagogyFormData,
          state.pedagogySupport.pedagogyEditing.pedagogyFormData
        );

        allPromises.push(
          dispatch(
            savePedagogySupportForm({
              details: data.details,
              fields: editedFields,
            })
          )
        );
      }

      if (implementedActionsHaveChanges) {
        allPromises.push(dispatch(savePedagogySupportImplementedActions()));
      }

      try {
        await Promise.all(allPromises);

        const pedagogyLocked = await pedagogyApi.updateStudentPedagogyFormLock({
          studentIdentifier: state.pedagogySupport.currentStudentIdentifier,
          updateStudentPedagogyFormLockRequest: {
            locked: false,
          },
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED",
          payload: pedagogyLocked,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_CHANGE_MODE",
          payload: "READ",
        });

        // Find and hide the editing mode notification if it exists
        const pedagogyNotification =
          getState().notifications.notifications.find(
            (notification) =>
              notification.id === "pedagogy-editing-mode-notification"
          );

        if (pedagogyNotification) {
          dispatch(hideNotification(pedagogyNotification));
        }
      } catch (err) {
        if (!isMApiError(err)) throw err;

        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Save pedagogy form thunk
 *
 * @param data data
 */
const savePedagogySupportForm: SavePedagogySupportFormTriggerType =
  function savePedagogySupportForm(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier or user school data identifier from current user
      const studentIdentifier =
        state.pedagogySupport.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS",
        payload: "LOADING",
      });

      try {
        const savedFormData = await pedagogyApi.updatePedagogyFormData({
          studentIdentifier,
          updatePedagogyFormDataRequest: {
            fields: data.fields,
            details: data.details,
            formData: JSON.stringify(
              state.pedagogySupport.pedagogyEditing.pedagogyFormData
            ),
          },
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_FORM_UPDATE_DATA",
          payload: savedFormData,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_FORM_UPDATE_FORM_DATA",
          payload: JSON.parse(savedFormData.formData) as PedagogyFormData,
        });

        data.onSuccess && data.onSuccess();
      } catch (err) {
        if (!isMApiError(err)) throw err;

        dispatch(displayNotification(err.message, "error"));
      }

      dispatch({
        type: "PEDAGOGY_SUPPORT_FORM_UPDATE_STATUS",
        payload: "READY",
      });
    };
  };

/**
 * Save pedagogy implemented actions thunk
 */
const savePedagogySupportImplementedActions: SavePedagogySupportImplementedActionsTriggerType =
  function savePedagogySupportImplementedActions() {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier or user school data identifier from current user
      const studentIdentifier =
        state.pedagogySupport.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

      dispatch({
        type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS",
        payload: "LOADING",
      });

      try {
        const savedFormData =
          await pedagogyApi.updatePedagogyFormDataImplementedActions({
            studentIdentifier,
            updatePedagogyFormDataImplementedActionsRequest: {
              formData: JSON.stringify(
                state.pedagogySupport.pedagogyEditing.implementedActions
              ),
            },
          });

        dispatch({
          type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_DATA",
          payload: savedFormData,
        });

        dispatch({
          type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_FORM_DATA",
          payload: JSON.parse(
            savedFormData.formData
          ) as PedagogySupportActionImplemented[],
        });
      } catch (err) {
        if (!isMApiError(err)) throw err;

        dispatch(displayNotification(err.message, "error"));
      }

      dispatch({
        type: "PEDAGOGY_SUPPORT_IMPLEMENTED_ACTIONS_UPDATE_STATUS",
        payload: "READY",
      });
    };
  };

/**
 * Reset pedagogy support thunk. Resets the pedagogy form and implemented actions
 * to initial state.
 *
 * @returns AnyActionType
 */
const resetPedagogySupport: ResetPedagogySupportTriggerType =
  function resetPedagogySupport() {
    return async (
      dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>
    ) => {
      dispatch({
        type: "PEDAGOGY_SUPPORT_RESET_DATA",
        payload: undefined,
      });
    };
  };

/**
 * Activate pedagogy support thunk. Creates a new pedagogy form for the student
 * that previously did not have one.
 *
 * @param data data
 */
const activatePedagogySupport: ActivatePedagogySupportTriggerType =
  function activatePedagogySupport(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const studentIdentifier =
        state.pedagogySupport.currentStudentIdentifier ||
        state.status.userSchoolDataIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

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
            data.isUppersecondary
          ),
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

/**
 * Toggle publish pedagogy support form thunk. Toggles the publish status of the
 * pedagogy form. Only SPECIAL_TEACHERS can toggle the publish status.
 *
 * @param data data
 */
const togglePublishPedagogySupportForm: TogglePublishPedagogySupportFormTriggerType =
  function togglePublishPedagogySupportForm(data) {
    return async (
      dispatch: (
        arg: AnyActionType
      ) => Promise<Dispatch<Action<AnyActionType>>>,
      getState: () => StateType
    ) => {
      const state = getState();

      // Student identifier is either current student identifier
      const studentIdentifier = state.pedagogySupport.currentStudentIdentifier;

      // Only PYRAMUS students are supported
      if (!studentIdentifier.startsWith("PYRAMUS-STUDENT-")) {
        throw new Error("Invalid student identifier");
      }

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
            data.isUppersecondary
          ),
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch(displayNotification(err.message, "error"));
      }
    };
  };

// HELPER FUNCTIONS

/**
 * Initialize Pedagogy locked status
 * @param studentIdentifier student identifier
 * @param dispatch dispatch
 * @param getState getState
 * @returns hops locked
 */
const initializePedagogyLocked = async (
  studentIdentifier: string,
  dispatch: (arg: AnyActionType) => Promise<Dispatch<Action<AnyActionType>>>,
  getState: () => StateType
) => {
  const state = getState();

  if (state.pedagogySupport.pedagogyLockedStatus !== "IDLE") {
    return;
  }

  dispatch({
    type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED_STATUS",
    payload: "LOADING",
  });

  const pedagogyLocked = await pedagogyApi.getStudentPedagogyFormLock({
    studentIdentifier,
  });

  dispatch({
    type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED_STATUS",
    payload: "READY",
  });

  dispatch({
    type: "PEDAGOGY_SUPPORT_UPDATE_LOCKED",
    payload: pedagogyLocked,
  });

  return pedagogyLocked;
};

export {
  initializePedagogySupport,
  startEditingPedagogySupport,
  cancelEditingPedagogySupport,
  loadPedagogySupportForm,
  loadPedagogySupportImplActions,
  resetPedagogySupport,
  savePedagogySupport,
  activatePedagogySupport,
  togglePublishPedagogySupportForm,
};
