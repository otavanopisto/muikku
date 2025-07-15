import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * useCompulsoryForm
 * Hook specifically for compulsory pedagogical support form data
 */
export const useCompulsoryForm = () => {
  const context = usePedagogyContext();

  if (!context.isCompulsory) {
    throw new Error("useCompulsoryForm can only be used with compulsory forms");
  }

  const formData = context.getCompulsoryStudiesData();

  if (!formData) {
    throw new Error(
      "Compulsory pedagogical support form data is not available"
    );
  }

  return {
    ...context,
    formData,
    setFormData: context.setFormDataAndUpdateChangedFields,
  };
};
