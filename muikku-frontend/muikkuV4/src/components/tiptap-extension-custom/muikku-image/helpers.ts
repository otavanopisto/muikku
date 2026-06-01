export const OPEN_IMAGE_PROPERTIES_MODAL_EVENT =
  "muikku:open-image-properties-modal" as const;
export type OpenImageModalDetail = {
  mode?: "create" | "edit";
};

/**
 * Opens the image properties modal.
 * @param detail - The detail to open the modal with.
 */
export function openImagePropertiesModal(detail?: OpenImageModalDetail) {
  window.dispatchEvent(
    new CustomEvent<OpenImageModalDetail>(OPEN_IMAGE_PROPERTIES_MODAL_EVENT, {
      detail,
    })
  );
}
