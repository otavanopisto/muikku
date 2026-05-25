import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";

/**
 * Delete snapshot dialog props
 */
interface DeleteSnapshotDialogProps {
  onDelete: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * Delete snapshot dialog
 * @param props Delete snapshot dialog props
 */
export const DeleteSnapshotDialog = (props: DeleteSnapshotDialogProps) => {
  const { t } = useTranslation("evaluation");

  /**
   * Handle delete
   * @param closeDialog closeDialog
   */
  const handleDelete = (closeDialog: () => void) => () => {
    props.onDelete();
    closeDialog();
  };

  /**
   * Content
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const content = (closeDialog: () => void) => (
    <div>
      <p>
        {t("content.removing", {
          context: "snapshot",
          ns: "materials",
        })}
      </p>
    </div>
  );

  /**
   * Footer
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleDelete(closeDialog)}
      >
        {t("actions.remove", { context: "snapshot" })}
      </Button>

      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="delete-snapshot"
      title={t("labels.deleteSnapshot", {
        defaultValue: "Delete snapshot",
        ns: "materials",
      })}
      content={content}
      footer={footer}
    >
      {props.children}
    </Dialog>
  );
};
