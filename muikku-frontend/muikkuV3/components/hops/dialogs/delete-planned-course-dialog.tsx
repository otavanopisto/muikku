import Dialog from "~/components/general/dialog";
import React from "react";
import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * Props for the delete planned course dialog
 */
interface DeletePlannedCourseDialogProps {
  onDelete: () => void;
  children?: React.ReactElement;
}

/**
 * Dialog shown when deleting a planned course
 * @param props props
 */
const DeletePlannedCourseDialog: React.FC<DeletePlannedCourseDialogProps> = (
  props
) => {
  const { onDelete, children } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Handles delete click
   * @param closePortal closePortal
   */
  const handleDeleteClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      onDelete();
      closePortal();
    };

  /**
   * Handles keep click
   * @param closePortal closePortal
   */
  const handleCancelClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      closePortal();
    };

  /**
   * Renders dialog content
   */
  const dialogContent = () => (
    <div>
      <div className="form-element dialog__content-row">
        <p>
          {t("labels.studyPlannerRemoveCourseFromPlanDescription", {
            ns: "hops_new",
          })}
        </p>
      </div>
    </div>
  );

  /**
   * Renders dialog footer
   * @param closePortal closePortal
   */
  const footer = (closePortal: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleDeleteClick(closePortal)}
      >
        {t("actions.remove", {
          ns: "common",
        })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleCancelClick(closePortal)}
      >
        {t("actions.cancel", {
          ns: "common",
        })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="delete-planned-course-dialog"
      disableScroll={true}
      title={t("labels.studyPlannerRemoveFromPlanTitle", {
        ns: "hops_new",
      })}
      content={dialogContent}
      footer={footer}
      closeOnOverlayClick={false}
    >
      {children}
    </Dialog>
  );
};

export default DeletePlannedCourseDialog;
