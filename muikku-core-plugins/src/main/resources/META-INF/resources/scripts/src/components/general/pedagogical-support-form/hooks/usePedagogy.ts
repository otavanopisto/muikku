import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  FormData,
  Opinion,
  SupportActionImplementation,
} from "~/@types/pedagogy-form";
import {
  PedagogyForm,
  PedagogyFormState,
  PedagogyFormVisibility,
} from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

export type UsePedagogyType = ReturnType<typeof usePedagogy>;

const pedagogyApi = MApi.getPedagogyApi();

/**
 * usePedagogy
 * @param studentId studentId
 * @param displayNotification displayNotification
 */
export const usePedagogy = (
  studentId: string,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<PedagogyForm | undefined>(undefined);
  const [formData, setFormData] = React.useState<FormData | undefined>(
    undefined
  );
  const [visibility, setVisibility] = React.useState<
    PedagogyFormVisibility[] | undefined
  >([]);
  const [formIsApproved, setFormIsApproved] = React.useState(false);
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
        /* const pedagogyData = (await promisify(
          mApi().pedagogy.form.read(studentId),
          "callback"
        )()) as PedagogyForm; */

        const pedagogyData = await pedagogyApi.getPedagogyForm({
          studentIdentifier: studentId,
        });

        if (componentMounted.current) {
          unstable_batchedUpdates(() => {
            setData({
              ...pedagogyData,
            });

            setFormData({
              ...defaultFormData,
              ...(JSON.parse(pedagogyData.formData) as FormData),
            });
            setFormIsApproved(pedagogyData.state === "APPROVED");
            setVisibility(pedagogyData.visibility);
            setLoading(false);
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          if (!isMApiError(err)) {
            throw err;
          }

          setLoading(false);
          displayNotification(err.message, "error");
        }
      }
    };

    loadData();
  }, [displayNotification, studentId]);

  /**
   * resetData
   */
  const resetData = () => {
    unstable_batchedUpdates(() => {
      setEditIsActive(false);
      setChangedFields([]);
      setFormData({
        ...defaultFormData,
        ...(JSON.parse(data.formData) as FormData),
      });
    });
  };

  /**
   * setUpdatedFormData
   * @param updatedFormData updatedFormData
   */
  const setFormDataAndUpdateChangedFields = (updatedFormData: FormData) => {
    // Get old values from data
    const oldDataForm = {
      ...defaultFormData,
      ...(JSON.parse(data.formData) as FormData),
    };

    // Compare to old values and if value is different or is previosly undefined,
    // add it to changedValuesComparedToPrevious
    const changedValuesComparedToPrevious = Object.keys(updatedFormData).filter(
      (key: keyof FormData) => {
        if (typeof updatedFormData[key] !== "object") {
          return updatedFormData[key] !== oldDataForm[key];
        }
      }
    );

    // Check if supportActionsImplemented has changed
    // by length or in the object values
    const somethingHasChangedInAction =
      !arraysAreSame<SupportActionImplementation>(
        updatedFormData.supportActionsImplemented,
        oldDataForm.supportActionsImplemented
      );

    const studentOpinionHasChanged = !arraysAreSame<Opinion>(
      updatedFormData.studentOpinionOfSupport,
      oldDataForm.studentOpinionOfSupport
    );

    const schoolOpinionHasChanged = !arraysAreSame<Opinion>(
      updatedFormData.schoolOpinionOfSupport,
      oldDataForm.schoolOpinionOfSupport
    );

    if (somethingHasChangedInAction) {
      changedValuesComparedToPrevious.push("supportActionsImplemented");
    }

    if (studentOpinionHasChanged) {
      changedValuesComparedToPrevious.push("studentOpinionOfSupport");
    }

    if (schoolOpinionHasChanged) {
      changedValuesComparedToPrevious.push("schoolOpinionOfSupport");
    }

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
      /*  const pedagogyData = (await promisify(
        mApi().pedagogy.form.create(studentId, { formData: "{}" }),
        "callback"
      )()) as PedagogyForm; */

      const pedagogyData = await pedagogyApi.createPedagogyForm({
        studentIdentifier: studentId,
        createPedagogyFormRequest: {
          formData: "{}",
        },
      });

      unstable_batchedUpdates(() => {
        setData(pedagogyData);
        setFormData({
          ...defaultFormData,
          ...(JSON.parse(pedagogyData.formData) as FormData),
        });
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      displayNotification(err.message, "error");
    }
  };

  /**
   * sendToStudent
   */
  const sendToStudent = async () => {
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
      displayNotification(err.message, "error");
    }
  };

  /**
   * approveForm
   */
  const approveForm = async () => {
    setLoading(true);
    try {
      // Check if visibility has changed
      const visibilityHasChanged = visibility.some(
        (v) => !data.visibility.includes(v)
      );

      let updatedData = {
        ...data,
      };

      if (visibilityHasChanged) {
        await updatevisibilityToServer();
      }

      updatedData = await updateStateToServer("APPROVED");

      unstable_batchedUpdates(() => {
        setData(updatedData);
        setFormData({
          ...defaultFormData,
          ...(JSON.parse(updatedData.formData) as FormData),
        });
        setFormIsApproved(true);
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      displayNotification(err.message, "error");
    }
  };

  /**
   * updateVisibility
   */
  const updateVisibility = async () => {
    setLoading(true);
    try {
      const updatedData = await updatevisibilityToServer();

      unstable_batchedUpdates(() => {
        setData(updatedData);
        setFormData({
          ...defaultFormData,
          ...(JSON.parse(updatedData.formData) as FormData),
        });
        setVisibility(updatedData.visibility);
        setFormIsApproved(updatedData.state === "APPROVED");
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      displayNotification(err.message, "error");
    }
  };

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
        setFormData({
          ...defaultFormData,
          ...(JSON.parse(updatedData.formData) as FormData),
        });
        setChangedFields([]);
        setExtraDetails("");
        setFormIsApproved(updatedData.state === "APPROVED");
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
      displayNotification(err.message, "error");
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
              const opinionHasChanged = !objectsAreSame<Opinion>(
                opinion,
                oldOpinion
              );

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
              const opinionHasChanged = !objectsAreSame<Opinion>(
                opinion,
                oldOpinion
              );

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

    /* return (await promisify(
      mApi().pedagogy.form.formData.update(studentId, {
        formData: JSON.stringify(dataToUpdate),
        fields: fields || null,
        details: details || null,
      }),
      "callback"
    )()) as PedagogyForm; */

    return await pedagogyApi.updatePedagogyFormData({
      studentIdentifier: studentId,
      updatePedagogyFormDataRequest: {
        formData: JSON.stringify(dataToUpdate),
        fields: fields || null,
        details: details || null,
      },
    });
  };

  /**
   * updatevisibilityToServer
   */
  /* const updatevisibilityToServer = async () =>
    (await promisify(
      await mApi().pedagogy.form.visibility.update(studentId, {
        visibility,
      }),
      "callback"
    )()) as PedagogyForm; */

  /**
   * updatevisibilityToServer
   */
  const updatevisibilityToServer = async () =>
    await pedagogyApi.updatePedagogyFormVisibility({
      studentIdentifier: studentId,
      updatePedagogyFormVisibilityRequest: {
        visibility,
      },
    });

  /**
   * updateStateToServer
   * @param state state
   */
  /* const updateStateToServer = async (state: string) =>
    (await promisify(
      mApi().pedagogy.form.state.update(studentId, {
        state,
      }),
      "callback"
    )()) as PedagogyForm; */

  /**
   * updateStateToServer
   * @param state state
   */
  const updateStateToServer = async (state: PedagogyFormState) =>
    await pedagogyApi.updatePedagogyFormState({
      studentIdentifier: studentId,
      updatePedagogyFormStateRequest: {
        state,
      },
    });

  return {
    loading,
    data,
    formData,
    visibility,
    formIsApproved,
    changedFields,
    editIsActive,
    resetData,
    activateForm,
    sendToStudent,
    approveForm,
    updateFormData,
    updateVisibility,
    setFormDataAndUpdateChangedFields,
    setVisibility,
    setFormIsApproved,
    setExtraDetails,
    setEditIsActive,
  };
};

const defaultFormData: FormData = {
  supportReasons: [],
  supportActions: [],
  matriculationExaminationSupport: [],
  supportActionsImplemented: [],
  studentOpinionOfSupport: [],
  schoolOpinionOfSupport: [],
};

/**
 * arraysAreSame
 * @param x x
 * @param y y
 * @returns boolean if arrays are same
 */
function arraysAreSame<T>(x: T[], y: T[]) {
  if (x.length !== y.length) {
    return false;
  }

  if (x.some((o, i) => !objectsAreSame<T>(o, y[i]))) {
    return false;
  }

  return true;
}

/**
 * objectsAreSame
 * @param x x
 * @param y y
 * @returns boolean if objects are same
 */
function objectsAreSame<O>(x: O, y: O) {
  for (const propertyName in x) {
    if (x[propertyName] !== y[propertyName]) {
      return false;
    }
  }

  return true;
}
