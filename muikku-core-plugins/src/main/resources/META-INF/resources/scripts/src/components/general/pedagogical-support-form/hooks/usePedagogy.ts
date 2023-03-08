import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  FormData,
  PedagogyForm,
  SupportActionImplementation,
  Visibility,
} from "~/@types/pedagogy-form";

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
  const [visibility, setVisibility] = React.useState<Visibility[] | undefined>(
    []
  );
  const [formIsApproved, setFormIsApproved] = React.useState(false);
  const [changedFields, setChangedFields] = React.useState<string[]>([]);
  const [extraDetails, setExtraDetails] = React.useState<string>("");

  const componentMounted = React.useRef(true);

  // set loading to true after 5 seconds
  React.useEffect(() => {
    /**
     * loadWorkspaces
     */
    const loadData = async () => {
      setLoading(true);

      try {
        const pedagogyData = (await promisify(
          mApi().pedagogy.form.read(studentId),
          "callback"
        )()) as PedagogyForm;

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
    setFormData({
      ...defaultFormData,
      ...(JSON.parse(data.formData) as FormData),
    });
  };

  /**
   * setUpdatedFormData
   * @param updatedFormData updatedFormData
   */
  const setUpdatedFormData = (updatedFormData: FormData) => {
    // Get old values from data
    const oldDataForm = JSON.parse(data.formData) as FormData;

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
    const somethingHasChanged = !arraysAreSame<SupportActionImplementation>(
      updatedFormData.supportActionsImplemented,
      oldDataForm.supportActionsImplemented
    );

    if (somethingHasChanged) {
      changedValuesComparedToPrevious.push("supportActionsImplemented");
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
   * setExtraDetailsValue
   * @param updatedExtraDetails updatedExtraDetails
   */
  const setExtraDetailsValue = (updatedExtraDetails: string) => {
    setExtraDetails(updatedExtraDetails);
  };

  /**
   * setVisibilityValue
   * @param updatedVisibility updatedVisibility
   */
  const setVisibilityValue = (updatedVisibility: Visibility[]) => {
    setVisibility(updatedVisibility);
  };

  /**
   * setFormApproveValue
   * @param approved approved
   */
  const setFormApproveValue = (approved: boolean) => {
    setFormIsApproved(approved);
  };

  /**
   * activateForm
   */
  const activateForm = async () => {
    setLoading(true);
    try {
      const pedagogyData = (await promisify(
        mApi().pedagogy.form.create(studentId, { formData: "{}" }),
        "callback"
      )()) as PedagogyForm;

      unstable_batchedUpdates(() => {
        setData(pedagogyData);
        setFormData({
          ...defaultFormData,
          ...(JSON.parse(pedagogyData.formData) as FormData),
        });
        setFormIsApproved(pedagogyData.state === "APPROVED");
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
      updateFormData().then(async () => {
        const updatedData = await updateStateToServer("PENDING");

        unstable_batchedUpdates(() => {
          setData(updatedData);
          setFormIsApproved(updatedData.state === "APPROVED");
          setLoading(false);
        });
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
        setFormIsApproved(updatedData.state === "APPROVED");
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
  const updateFormDataToServer = async (fields?: string[], details?: string) =>
    (await promisify(
      mApi().pedagogy.form.formData.update(studentId, {
        formData: JSON.stringify(formData),
        fields: fields || null,
        details: details || null,
      }),
      "callback"
    )()) as PedagogyForm;

  /**
   * updatevisibilityToServer
   */
  const updatevisibilityToServer = async () =>
    (await promisify(
      await mApi().pedagogy.form.visibility.update(studentId, {
        visibility,
      }),
      "callback"
    )()) as PedagogyForm;

  /**
   * updateStateToServer
   * @param state state
   */
  const updateStateToServer = async (state: string) =>
    (await promisify(
      mApi().pedagogy.form.state.update(studentId, {
        state,
      }),
      "callback"
    )()) as PedagogyForm;

  return {
    loading,
    data,
    formData,
    visibility,
    formIsApproved,
    changedFields,
    resetData,
    activateForm,
    sendToStudent,
    approveForm,
    updateFormData,
    updateVisibility,
    setUpdatedFormData,
    setVisibilityValue,
    setFormApproveValue,
    setExtraDetailsValue,
  };
};

const defaultFormData: FormData = {
  supportReasons: [],
  supportActions: [],
  matriculationExaminationSupport: [],
  supportActionsImplemented: [
    {
      creatorName: "",
      action: "remedialInstruction",
      extraInfoDetails: "",
      date: new Date(),
    },
  ],
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
