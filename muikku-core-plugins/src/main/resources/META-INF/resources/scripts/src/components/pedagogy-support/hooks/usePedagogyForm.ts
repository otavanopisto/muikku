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
  UpperSecondaryFormData,
} from "~/@types/pedagogy-form";
import { PedagogyForm } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import _ from "lodash";
import { initializePedagogyFormData } from "../helpers";
import { useDispatch } from "react-redux";

export type UsePedagogyFormType = ReturnType<typeof usePedagogyForm>;

const pedagogyApi = MApi.getPedagogyApi();

/**
 * usePedagogyForm
 * @param studentUserEntityId studentUserEntityId
 * @param isUppersecondary isUppersecondary
 * @param shouldLoadForm whether to attempt loading the form (based on permissions)
 */
export const usePedagogyForm = (
  studentUserEntityId: number,
  isUppersecondary: boolean,
  shouldLoadForm: boolean = false
) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(false);

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

  const componentMounted = React.useRef(true);

  // Check if the form exists
  const pedagogyFormExists = React.useMemo(
    () => pedagogyForm?.created !== null || false,
    [pedagogyForm]
  );

  React.useEffect(() => {
    // User has no permission to load the form or the form is already loading
    if (!shouldLoadForm) {
      return;
    }

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
          // Only show notification if it's not a permission error
          dispatch(displayNotification(err.message, "error"));
        }
      }
    };

    loadPedagogyFormData();
  }, [dispatch, isUppersecondary, studentUserEntityId, shouldLoadForm]);

  /**
   * resetPedagogyFormData
   */
  const resetPedagogyFormData = () => {
    unstable_batchedUpdates(() => {
      // If the form exists, reset the form data
      if (pedagogyFormExists) {
        setChangedFields([]);
        setPedagogyFormData(
          initializePedagogyFormData(pedagogyForm.formData, isUppersecondary)
        );
      }
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
      if (!isMApiError(err)) {
        throw err;
      }
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
   * savePedagogyFormData
   */
  const savePedagogyFormData = async () => {
    if (!pedagogyFormExists || changedFields.length === 0) {
      return;
    }

    setLoading(true);

    try {
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
        setChangedFields([]);
        setPedagogyFormExtraDetails("");
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
    // State
    loading,
    pedagogyFormExists,
    pedagogyForm,
    pedagogyFormData,
    changedFields,
    pedagogyFormExtraDetails,

    // Actions
    resetPedagogyFormData,
    setPedagogyFormDataAndUpdateChangedFields,
    setPedagogyFormExtraDetails,
    activatePedagogyForm,
    savePedagogyFormData,
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
