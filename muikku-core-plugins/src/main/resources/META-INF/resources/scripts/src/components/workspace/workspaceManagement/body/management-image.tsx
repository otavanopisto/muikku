import * as React from "react";
import { useTranslation } from "react-i18next";
import UploadImageDialog from "../dialogs/upload-image";
import DeleteImageDialog from "../dialogs/delete-image";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import Button from "~/components/general/button";

/**
 * WorkspaceSignupGroups
 */
interface ManagementImageProps {
  workspaceEntityId?: number;
  workspaceHasCustomImage: boolean;

  onImageStatusChange?: (hasCustomImage: boolean) => void;
}

/**
 * ImageDialogState
 */
interface ManagementImageDialogState {
  newWorkspaceImageSrc?: string;
  newWorkspaceImageFile?: File;
  newWorkspaceImageB64?: string;
  newWorkspaceImageCombo?: {
    file?: File;
    originalB64?: string;
    croppedB64: string;
  };
  isDialogOpen: boolean;
}

/**
 * Workspace Image
 * @param props props
 */
const ManagementImage = (props: ManagementImageProps) => {
  const { workspaceEntityId, workspaceHasCustomImage, onImageStatusChange } =
    props;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [imageDialogState, setImageDialogState] =
    React.useState<ManagementImageDialogState>({
      isDialogOpen: false,
    });

  const { t } = useTranslation(["workspace"]);

  let actualBackgroundSRC = workspaceHasCustomImage
    ? `/rest/workspace/workspaces/${workspaceEntityId}/workspacefile/workspace-frontpage-image-cropped`
    : "/gfx/workspace-default-header.jpg";

  // If new image was uploaded, use that instead
  if (imageDialogState.newWorkspaceImageCombo) {
    actualBackgroundSRC = imageDialogState.newWorkspaceImageCombo.croppedB64;
  }

  /**
   * Handle edit current dialog click
   */
  const handleEditCurrentDialogClick = () => {
    // If new image was uploaded, and editing it
    if (imageDialogState.newWorkspaceImageCombo) {
      setImageDialogState((prevState) => ({
        ...prevState,
        newWorkspaceImageSrc: prevState.newWorkspaceImageCombo.originalB64,
        newWorkspaceImageB64: prevState.newWorkspaceImageCombo.originalB64,
        newWorkspaceImageFile: prevState.newWorkspaceImageCombo.file,
        isImageDialogOpen: true,
      }));
    }
    // If editing existing image
    else if (workspaceHasCustomImage) {
      setImageDialogState((prevState) => ({
        ...prevState,
        newWorkspaceImageSrc: `/rest/workspace/workspaces/${workspaceEntityId}/workspacefile/workspace-frontpage-image-original`,
        isImageDialogOpen: true,
        newWorkspaceImageB64: null,
        newWorkspaceImageFile: null,
      }));
    }
  };

  /**
   * removeCustomImage
   */
  const handleOpenDeleteDialogClick = () => {
    setIsDeleteDialogOpen(true);
  };

  /**
   * acceptNewImage
   * @param croppedB64 croppedB64
   * @param originalB64 originalB64
   * @param file file
   */
  const handleImageChange = (
    croppedB64: string,
    originalB64?: string,
    file?: File
  ) => {
    setImageDialogState((prevState) => ({
      ...prevState,
      newWorkspaceImageCombo: {
        file,
        originalB64,
        croppedB64,
      },
    }));

    if (onImageStatusChange) {
      onImageStatusChange(true);
    }
  };

  /**
   * Handles image delete
   */
  const handleImageDelete = () => {
    unstable_batchedUpdates(() => {
      setImageDialogState((prevState) => ({
        ...prevState,
        newWorkspaceImageSrc: null,
        newWorkspaceImageFile: null,
        newWorkspaceImageB64: null,
        newWorkspaceImageCombo: null,
        isDialogOpen: false,
      }));

      setIsDeleteDialogOpen(false);
    });

    if (onImageStatusChange) {
      onImageStatusChange(false);
    }
  };

  /**
   * Handles image file change
   * @param e e
   */
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    e.target.value = "";

    reader.addEventListener(
      "load",
      () => {
        setImageDialogState((prevState) => ({
          ...prevState,
          newWorkspaceImageB64: String(reader.result),
          newWorkspaceImageFile: file,
          isDialogOpen: true,
          newWorkspaceImageSrc: null,
        }));
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header application-sub-panel__header--workspace-image-settings">
        {t("labels.image", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body application-sub-panel__body--workspace-settings">
        <div className="form__row">
          <div className="change-image">
            <div
              className="change-image__container change-image__container--workspace"
              style={{
                backgroundImage: `url("${actualBackgroundSRC}")`,
                backgroundSize: `cover`,
              }}
            >
              <label className="visually-hidden" htmlFor="workspaceImage">
                {t("wcag.workspaceImage", {
                  ns: "workspace",
                })}
              </label>
              <input
                id="workspaceImage"
                name="file"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />
              {workspaceHasCustomImage ? (
                <div className="change-image__actions">
                  <Button
                    buttonModifiers="change-image-edit button--change-image-workspace"
                    onClick={handleEditCurrentDialogClick}
                  >
                    <span className="icon icon-pencil" />
                    {t("actions.edit", { ns: "common" })}
                  </Button>
                  <Button
                    buttonModifiers="change-image-delete button--change-image-workspace"
                    onClick={handleOpenDeleteDialogClick}
                  >
                    <span className="icon icon-trash" />

                    {t("actions.remove")}
                  </Button>
                </div>
              ) : (
                <div className="change-image__default-content">
                  {t("content.changeImage", { ns: "workspace" })}
                </div>
              )}
            </div>
            <DeleteImageDialog
              isOpen={isDeleteDialogOpen}
              onDelete={handleImageDelete}
              onClose={() => setIsDeleteDialogOpen((prevState) => !prevState)}
            />
            <UploadImageDialog
              isOpen={imageDialogState.isDialogOpen}
              b64={imageDialogState.newWorkspaceImageB64}
              file={imageDialogState.newWorkspaceImageFile}
              onClose={() =>
                setImageDialogState((prevState) => ({
                  ...prevState,
                  isDialogOpen: false,
                }))
              }
              src={imageDialogState.newWorkspaceImageSrc}
              onImageChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementImageMemoized = React.memo(ManagementImage);
