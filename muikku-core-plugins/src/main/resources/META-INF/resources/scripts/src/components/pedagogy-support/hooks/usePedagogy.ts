import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { displayNotification } from "~/actions/base/notifications";
import {
  CompulsoryFormData,
  FormData,
  isCompulsoryForm,
  isUpperSecondaryForm,
  PedagogyFormData,
  PedagogySupportActionImplemented,
  UpperSecondaryFormData,
} from "~/@types/pedagogy-form";
import {
  PedagogyForm,
  PedagogyFormImplementedActions,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import _ from "lodash";
import {
  initializePedagogyFormData,
  initializeImplemetedSupportActionsFormData,
} from "../helpers";
import { useDispatch } from "react-redux";

export type UsePedagogyType = ReturnType<typeof usePedagogy>;

const pedagogyApi = MApi.getPedagogyApi();

/**
 * usePedagogy
 * @param studentUserEntityId studentUserEntityId
 * @param isUppersecondary isUppersecondary
 */
export const usePedagogy = (
  studentUserEntityId: number,
  isUppersecondary: boolean
) => {
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

  // Pedagogy form related state
  const [pedagogyForm, setPedagogyForm] = React.useState<
    PedagogyForm | undefined
  >(undefined);
  const [pedagogyFormData, setPedagogyFormData] = React.useState<
    PedagogyFormData | undefined
  >(undefined);
  const [changedFields, setChangedFields] = React.useState<string[]>([]);
  const [pedagogyFormExtraDetails, setPedagogyFormExtraDetails] =
    React.useState<string>("");
  const [editIsActive, setEditIsActive] = React.useState(false);

  const componentMounted = React.useRef(true);

  // Check if the form exists
  const pedagogyFormExists = React.useMemo(
    () => pedagogyForm?.created !== null || false,
    [pedagogyForm]
  );

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
      const pedagogyFormImplementedActions =
        await pedagogyApi.getPedagogyFormImplementedActions({
          userEntityId: studentUserEntityId,
        });

      if (componentMounted.current) {
        setPedagogySupportActions(pedagogyFormImplementedActions);
        setImplemetedSupportActionsFormData(
          initializeImplemetedSupportActionsFormData(
            pedagogyFormImplementedActions.formData
          )
        );
      }
    };

    /**
     * loadPedagogyFormData
     */
    const loadPedagogyFormData = async () => {
      setLoading(true);

      try {
        const pedagogyData = await pedagogyApi.getPedagogyForm({
          userEntityId: studentUserEntityId,
        });

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setPedagogyForm({
              ...pedagogyData,
            });

            setPedagogyFormData(
              initializePedagogyFormData(
                pedagogyData.formData,
                isUppersecondary
              )
            );
            setLoading(false);
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          setLoading(false);
          dispatch(displayNotification(err.message, "error"));
        }
      }
    };

    loadPedagogyFormData();
    loadPedagogyFormImplementedActions();
  }, [dispatch, isUppersecondary, studentUserEntityId]);

  /**
   * resetPedagogyData
   */
  const resetPedagogyData = () => {
    unstable_batchedUpdates(() => {
      setEditIsActive(false);

      // If the form exists, reset the form data
      if (pedagogyFormExists) {
        setChangedFields([]);
        setPedagogyFormData(
          initializePedagogyFormData(pedagogyForm.formData, isUppersecondary)
        );
      }

      // Implemented support actions are present by default always so we reset them
      setImplemetedSupportActionsFormData(
        initializeImplemetedSupportActionsFormData(
          pedagogySupportActions.formData
        )
      );
    });
  };

  /**
   * setUpdatedFormData
   * @param updatedFormData updatedFormData
   */
  const setPedagogyFormDataAndUpdateChangedFields = (
    updatedFormData: PedagogyFormData
  ) => {
    const changedValuesComparedToPrevious = getEditedFields(
      pedagogyFormData,
      updatedFormData
    );

    unstable_batchedUpdates(() => {
      setChangedFields(changedValuesComparedToPrevious);
      setPedagogyFormData((previousData) => ({
        ...previousData,
        ...updatedFormData,
      }));
    });
  };

  /**
   * activatePedagogyForm
   */
  const activatePedagogyForm = async () => {
    setLoading(true);
    try {
      const pedagogyData = await pedagogyApi.createPedagogyForm({
        userEntityId: studentUserEntityId,
        createPedagogyFormRequest: {
          formData: "{}",
        },
      });

      unstable_batchedUpdates(() => {
        setPedagogyForm(pedagogyData);
        setPedagogyFormData(
          initializePedagogyFormData(pedagogyData.formData, isUppersecondary)
        );
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      dispatch(displayNotification(err.message, "error"));
    }
  };

  /**
   * updateFormDataToServer
   * @param fields fields
   * @param details details
   */
  const updatePedagogyFormDataToServer = async (
    fields?: string[],
    details?: string
  ) => {
    let dataToUpdate = {
      ...pedagogyFormData,
    };

    const oldData = {
      ...JSON.parse(pedagogyForm.formData),
    } as FormData;

    // If there is no oldData to compare to,
    // there is no need to check if something has changed
    if (Object.keys(oldData).length > 0) {
      dataToUpdate = {
        ...dataToUpdate,
        studentOpinionOfSupport: dataToUpdate.studentOpinionOfSupport.map(
          (opinion, index) => {
            const oldOpinion = oldData.studentOpinionOfSupport[index];

            if (oldOpinion) {
              const opinionHasChanged = !_.isEqual(opinion, oldOpinion);

              if (opinionHasChanged) {
                return {
                  ...opinion,
                  updatedDate: new Date(),
                };
              }
            }

            return opinion;
          }
        ),
        schoolOpinionOfSupport: dataToUpdate.schoolOpinionOfSupport.map(
          (opinion, index) => {
            const oldOpinion = oldData.schoolOpinionOfSupport[index];

            if (oldOpinion) {
              const opinionHasChanged = !_.isEqual(opinion, oldOpinion);

              if (opinionHasChanged) {
                return {
                  ...opinion,
                  updatedDate: new Date(),
                };
              }
            }

            return opinion;
          }
        ),
      };
    }

    return await pedagogyApi.updatePedagogyFormData({
      userEntityId: studentUserEntityId,
      updatePedagogyFormDataRequest: {
        formData: JSON.stringify(dataToUpdate),
        fields: fields || null,
        details: details || null,
      },
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
   * saveAllData - Unified save function that handles both scenarios
   */
  const saveAllData = async () => {
    setLoading(true);
    try {
      // Always save implemented actions if they have changed
      if (implementedActionsHaveChanged) {
        const updatedImplementedActions =
          await updateImplementedActionsToServer();

        unstable_batchedUpdates(() => {
          setPedagogySupportActions(updatedImplementedActions);
          setImplemetedSupportActionsFormData(
            initializeImplemetedSupportActionsFormData(
              updatedImplementedActions.formData
            )
          );
        });
      }

      // Save pedagogy form data if it exists and has changes
      if (pedagogyFormExists && changedFields.length > 0) {
        const updatedPedagogyFormData = await updatePedagogyFormDataToServer(
          changedFields,
          pedagogyFormExtraDetails
        );

        unstable_batchedUpdates(() => {
          setPedagogyForm(updatedPedagogyFormData);
          setPedagogyFormData(
            initializePedagogyFormData(
              updatedPedagogyFormData.formData,
              isUppersecondary
            )
          );
        });
      }

      // Update local state
      unstable_batchedUpdates(() => {
        setEditIsActive(false);
        setChangedFields([]);
        setPedagogyFormExtraDetails("");
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      dispatch(displayNotification(err.message, "error"));
    }
  };

  /**
   * togglePublishPedagogyForm
   */
  const togglePublishPedagogyForm = async () => {
    try {
      const updatedPedagogyFormData = await pedagogyApi.togglePublished({
        userEntityId: studentUserEntityId,
      });

      unstable_batchedUpdates(() => {
        setPedagogyForm(updatedPedagogyFormData);
        setPedagogyFormData(
          initializePedagogyFormData(
            updatedPedagogyFormData.formData,
            isUppersecondary
          )
        );
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      dispatch(displayNotification(err.message, "error"));
    }
  };

  return {
    // Shared state
    loading,
    editIsActive,
    studentUserEntityId,
    isUppersecondary,
    resetPedagogyData,
    saveAllData,

    // Implemented support actions related state
    pedagogySupportActions,
    implemetedSupportActionsFormData,
    setImplemetedSupportActionsFormData,
    implementedActionsHaveChanged,

    // Pedagogy form related state
    pedagogyFormExists,
    pedagogyForm,
    pedagogyFormData,
    changedFields,
    activatePedagogyForm,
    setPedagogyFormDataAndUpdateChangedFields,
    setPedagogyFormExtraDetails,
    setEditIsActive,
    togglePublishPedagogyForm,
  };
};

/**
 * Get the edited fields
 * @param oldData old pedagogyForm
 * @param newData new pedagogyForm
 * @returns string[]
 */
const getEditedFields = (
  oldData: PedagogyFormData,
  newData: PedagogyFormData
) => {
  let changedValuesComparedToPrevious: string[] = [];

  // Check if the form type has changed
  if (isCompulsoryForm(oldData) && isCompulsoryForm(newData)) {
    changedValuesComparedToPrevious = Object.keys(newData).filter(
      (key: keyof CompulsoryFormData) => {
        if (typeof oldData[key] !== "object") {
          return oldData[key] !== newData[key];
        }
      }
    );

    const hasStudentOpinionChanged = !_.isEqual(
      newData.studentOpinionOfSupport,
      oldData.studentOpinionOfSupport
    );

    if (hasStudentOpinionChanged) {
      changedValuesComparedToPrevious.push("studentOpinionOfSupport");
    }

    const hasSchoolOpinionChanged = !_.isEqual(
      newData.schoolOpinionOfSupport,
      oldData.schoolOpinionOfSupport
    );

    if (hasSchoolOpinionChanged) {
      changedValuesComparedToPrevious.push("schoolOpinionOfSupport");
    }
  } else if (isUpperSecondaryForm(oldData) && isUpperSecondaryForm(newData)) {
    changedValuesComparedToPrevious = Object.keys(newData).filter(
      (key: keyof UpperSecondaryFormData) => {
        if (typeof oldData[key] !== "object") {
          return oldData[key] !== newData[key];
        }
      }
    );

    const hasStudentOpinionChanged = !_.isEqual(
      newData.studentOpinionOfSupport,
      oldData.studentOpinionOfSupport
    );

    if (hasStudentOpinionChanged) {
      changedValuesComparedToPrevious.push("studentOpinionOfSupport");
    }

    const hasSchoolOpinionChanged = !_.isEqual(
      newData.schoolOpinionOfSupport,
      oldData.schoolOpinionOfSupport
    );

    if (hasSchoolOpinionChanged) {
      changedValuesComparedToPrevious.push("schoolOpinionOfSupport");
    }
  }

  return changedValuesComparedToPrevious;
};
