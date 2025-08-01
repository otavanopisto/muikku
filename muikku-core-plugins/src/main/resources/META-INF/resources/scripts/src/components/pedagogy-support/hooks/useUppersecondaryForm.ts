import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * useUpperSecondaryForm
 * Hook specifically for upper secondary form data
 */
export const useUpperSecondaryForm = () => {
  const context = usePedagogyContext();

  if (context.contextType !== "upperSecondary") {
    throw new Error(
      "useUpperSecondaryForm can only be used with upper secondary forms"
    );
  }

  const formData = context.getUpperSecondaryData();

  return {
    ...context,
    formData,
    setFormData: context.setPedagogyFormDataAndUpdateChangedFields,
  };
};
