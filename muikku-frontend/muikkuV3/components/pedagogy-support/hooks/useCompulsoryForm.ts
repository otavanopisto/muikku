import { usePedagogyContext } from "../context/pedagogy-context";

/**
 * useCompulsoryForm
 * Hook specifically for compulsory pedagogical support form data
 */
export const useCompulsoryForm = () => {
  const context = usePedagogyContext();

  if (context.contextType !== "compulsory") {
    throw new Error("useCompulsoryForm can only be used with compulsory forms");
  }

  const formData = context.getCompulsoryStudiesData();

  return {
    ...context,
    formData,
    setFormData: context.updatePedagogyFormDataAndUpdateChangedFields,
  };
};
