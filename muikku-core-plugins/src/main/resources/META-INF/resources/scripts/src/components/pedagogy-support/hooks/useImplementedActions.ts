import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { displayNotification } from "~/actions/base/notifications";
import { PedagogySupportActionImplemented } from "~/@types/pedagogy-form";
import { PedagogyFormImplementedActions } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import _ from "lodash";
import { initializeImplemetedSupportActionsFormData } from "../helpers";
import { useDispatch } from "react-redux";

export type UseImplementedActionsType = ReturnType<
  typeof useImplementedActions
>;

const pedagogyApi = MApi.getPedagogyApi();

/**
 * useImplementedActions
 * @param studentUserEntityId studentUserEntityId
 */
export const useImplementedActions = (studentUserEntityId: number) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);

  // Implemented support actions related state
  const [pedagogySupportActions, setPedagogySupportActions] = React.useState<
    PedagogyFormImplementedActions | undefined
  >(undefined);
  const [
    implemetedSupportActionsFormData,
    setImplemetedSupportActionsFormData,
  ] = React.useState<PedagogySupportActionImplemented[]>([]);

  const componentMounted = React.useRef(true);

  // Check if the implemented support actions form data exists
  const implementedSupportActionsFormDataExists = React.useMemo(
    () =>
      (pedagogySupportActions?.formData !== null &&
        pedagogySupportActions?.formData !== undefined &&
        pedagogySupportActions?.formData !== "") ||
      false,
    [pedagogySupportActions]
  );

  // Check if the implemented support actions have changed
  const implementedActionsHaveChanged = React.useMemo(
    () =>
      !_.isEqual(
        initializeImplemetedSupportActionsFormData(
          pedagogySupportActions?.formData
        ),
        implemetedSupportActionsFormData
      ),
    [implemetedSupportActionsFormData, pedagogySupportActions]
  );

  React.useEffect(() => {
    /**
     * loadPedagogyFormImplementedActions
     */
    const loadPedagogyFormImplementedActions = async () => {
      setLoading(true);

      try {
        const pedagogyFormImplementedActions =
          await pedagogyApi.getPedagogyFormImplementedActions({
            userEntityId: studentUserEntityId,
          });

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setPedagogySupportActions(pedagogyFormImplementedActions);
            setImplemetedSupportActionsFormData(
              initializeImplemetedSupportActionsFormData(
                pedagogyFormImplementedActions.formData
              )
            );
            setLoading(false);
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          setLoading(false);

          if (!isMApiError(err)) {
            throw err;
          }

          dispatch(displayNotification(err.message, "error"));
        }
      }
    };

    loadPedagogyFormImplementedActions();
  }, [dispatch, studentUserEntityId]);

  /**
   * resetImplementedActionsData
   */
  const resetImplementedActionsData = () => {
    unstable_batchedUpdates(() => {
      // Implemented support actions are present by default always so we reset them
      setImplemetedSupportActionsFormData(
        initializeImplemetedSupportActionsFormData(
          pedagogySupportActions.formData
        )
      );
    });
  };

  /**
   * updateImplementedActionsToServer
   */
  const updateImplementedActionsToServer = async () => {
    // If the implemented support actions form data does not exist initially, create it
    if (!implementedSupportActionsFormDataExists) {
      return await pedagogyApi.createPedagogyFormImplementedActions({
        userEntityId: studentUserEntityId,
        createPedagogyFormImplementedActionsRequest: {
          formData: JSON.stringify(implemetedSupportActionsFormData),
        },
      });
    }

    // If the implemented support actions form data exists, update it
    return await pedagogyApi.updatePedagogyFormDataImplementedActions({
      userEntityId: studentUserEntityId,
      updatePedagogyFormDataImplementedActionsRequest: {
        formData: JSON.stringify(implemetedSupportActionsFormData),
      },
    });
  };

  /**
   * saveImplementedActions
   */
  const saveImplementedActions = async () => {
    if (!implementedActionsHaveChanged) {
      return;
    }

    setLoading(true);

    try {
      const updatedImplementedActions =
        await updateImplementedActionsToServer();

      unstable_batchedUpdates(() => {
        setPedagogySupportActions(updatedImplementedActions);
        setImplemetedSupportActionsFormData(
          initializeImplemetedSupportActionsFormData(
            updatedImplementedActions.formData
          )
        );
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(displayNotification(err.message, "error"));
    }
  };

  return {
    // State
    loading,
    pedagogySupportActions,
    implemetedSupportActionsFormData,
    implementedSupportActionsFormDataExists,
    implementedActionsHaveChanged,

    // Actions
    setImplemetedSupportActionsFormData,
    resetImplementedActionsData,
    saveImplementedActions,
  };
};
