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
  const [data, setData] = React.useState<PedagogyForm | undefined>(undefined);
  const [formData, setFormData] = React.useState<PedagogyFormData | undefined>(
    undefined
  );
  const [changedFields, setChangedFields] = React.useState<string[]>([]);
  const [extraDetails, setExtraDetails] = React.useState<string>("");
  const [editIsActive, setEditIsActive] = React.useState(false);

  const componentMounted = React.useRef(true);

  // set loading to true after 5 seconds
  React.useEffect(() => {
    /**
     * loadWorkspaces
     */
    const loadData = async () => {
      setLoading(true);

      try {
        const pedagogyData = await pedagogyApi.getPedagogyForm({
          userEntityId: studentUserEntityId,
        });

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setData({
              ...pedagogyData,
            });

            setFormData(
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

    loadData();
  }, [dispatch, isUppersecondary, studentUserEntityId]);

  /**
   * resetData
   */
  const resetData = () => {
    unstable_batchedUpdates(() => {
      setEditIsActive(false);
      setChangedFields([]);
      setFormData(initializePedagogyFormData(data.formData, isUppersecondary));
    });
  };

  /**
   * setUpdatedFormData
   * @param updatedFormData updatedFormData
   */
  const setFormDataAndUpdateChangedFields = (
    updatedFormData: PedagogyFormData
  ) => {
    const changedValuesComparedToPrevious = getEditedFields(
      formData,
      updatedFormData
    );

    unstable_batchedUpdates(() => {
      setChangedFields(changedValuesComparedToPrevious);
      setFormData((previousData) => ({
        ...previousData,
        ...updatedFormData,
      }));
    });
  };

  /**
   * activateForm
   */
  const activateForm = async () => {
    setLoading(true);
    try {
      const pedagogyData = await pedagogyApi.createPedagogyForm({
        userEntityId: studentUserEntityId,
        createPedagogyFormRequest: {
          formData: "{}",
        },
      });

      unstable_batchedUpdates(() => {
        setData(pedagogyData);
        setFormData(
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
   * sendToStudent
   */
  /* const sendToStudent = async () => {
    setLoading(true);
    try {
      const updatedData = await updateStateToServer("PENDING");

      unstable_batchedUpdates(() => {
        setData(updatedData);
        setLoading(false);
        setEditIsActive(false);
      });
    } catch (err) {
      setLoading(false);
      dispatch(displayNotification(err.message, "error"));
    }
  }; */

  /**
   * approveForm
   */
  /* const approveForm = async () => {
    setLoading(true);
    try {
      let updatedData = {
        ...data,
      };

      updatedData = await updateStateToServer("APPROVED");

      unstable_batchedUpdates(() => {
        setData(updatedData);
        setFormData((previousData) => ({
          ...previousData,
          ...JSON.parse(updatedData.formData),
        }));
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      dispatch(displayNotification(err.message, "error"));
    }
  }; */

  /**
   * updateFormData
   */
  const updateFormData = async () => {
    setLoading(true);
    try {
      const updatedData = await updateFormDataToServer(
        changedFields.length > 0 ? changedFields : null,
        extraDetails !== "" ? extraDetails : null
      );

      unstable_batchedUpdates(() => {
        setEditIsActive(false);
        setData(updatedData);
        setFormData((previousData) => ({
          ...previousData,
          ...JSON.parse(updatedData.formData),
        }));
        setChangedFields([]);
        setExtraDetails("");
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
  const updateFormDataToServer = async (
    fields?: string[],
    details?: string
  ) => {
    let dataToUpdate = {
      ...formData,
    };

    const oldData = {
      ...JSON.parse(data.formData),
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
   * updateStateToServer
   * @param state state
   */
  /* const updateStateToServer = async (state: PedagogyFormState) =>
    await pedagogyApi.updatePedagogyFormState({
      userEntityId: studentUserEntityId,
      updatePedagogyFormStateRequest: {
        state,
      },
    }); */

  return {
    loading,
    data,
    formData,
    changedFields,
    editIsActive,
    resetData,
    activateForm,
    // sendToStudent,
    // approveForm,
    updateFormData,
    studentUserEntityId,
    setFormDataAndUpdateChangedFields,
    setExtraDetails,
    setEditIsActive,
  };
};

/**
 * Get the edited fields
 * @param oldData old data
 * @param newData new data
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
