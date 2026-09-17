import Dialog from "~/components/general/dialog";
import React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";

/**
 * Props for the orphaned study planner items dialog
 */
interface OrphanedStudyPlannerItemsDialogProps {
  isOpen: boolean;
  courseCount: number;
  noteCount: number;
  onRemove: () => void;
  onKeep: () => void;
  children?: React.ReactElement;
}

/**
 * Dialog shown when shrinking graduation goal hides planned courses or notes
 * @param props props
 */
const OrphanedStudyPlannerItemsDialog: React.FC<
  OrphanedStudyPlannerItemsDialogProps
> = (props) => {
  const { isOpen, courseCount, noteCount, onRemove, onKeep, children } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Handles remove click
   * @param closePortal closePortal
   */
  const handleRemoveClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onRemove();
    };

  /**
   * Handles keep click
   * @param closePortal closePortal
   */
  const handleKeepClick =
    (closePortal: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      onKeep();
    };

  /**
   * Renders dialog content
   */
  const dialogContent = () => (
    <div className="hops-container__row">
      <div className="hops__form-element-container">
        <p>
          {t("content.studyPlannerOrphanedItemsDescription", {
            ns: "hops_new",
            courseCount,
            noteCount,
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
        onClick={handleRemoveClick(closePortal)}
      >
        {t("actions.removeFromPlan", { ns: "hops_new" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={handleKeepClick(closePortal)}
      >
        {t("actions.keepInPlan", { ns: "hops_new" })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="orphaned-studyplanner-items-dialog"
      disableScroll={true}
      title={t("labels.studyPlannerOrphanedItemsTitle", { ns: "hops_new" })}
      onClose={onKeep}
      content={dialogContent}
      footer={footer}
      closeOnOverlayClick={false}
      isOpen={isOpen}
    >
      {children}
    </Dialog>
  );
};

export default OrphanedStudyPlannerItemsDialog;
