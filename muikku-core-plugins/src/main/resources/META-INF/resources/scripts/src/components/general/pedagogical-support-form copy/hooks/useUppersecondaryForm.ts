import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * useUpperSecondaryForm
 * Hook specifically for upper secondary form data
 */
export const useUpperSecondaryForm = () => {
  const context = usePedagogyContext();

  if (!context.isUpperSecondary) {
    throw new Error(
      "useUpperSecondaryForm can only be used with upper secondary forms"
    );
  }

  const formData = context.getUpperSecondaryData();

  if (!formData) {
    throw new Error("Upper secondary form data is not available");
  }

  return {
    ...context,
    formData,
    setFormData: context.setFormDataAndUpdateChangedFields,
  };
};
