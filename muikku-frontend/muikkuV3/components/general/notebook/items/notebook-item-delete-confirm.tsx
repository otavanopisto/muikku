import * as React from "react";
import AnimateHeight from "react-animate-height";
import Button from "../../button";
import { useTranslation } from "react-i18next";

/**
 * NotebookItemDeleteConfirmProps
 */
interface NotebookItemDeleteConfirmProps {
  active: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * NotebookItemDeleteConfirm
 * @param props props
 * @returns React.ReactNode
 */
const NotebookItemDeleteConfirm = (props: NotebookItemDeleteConfirmProps) => {
  const { active, onConfirm, onCancel } = props;
  const { t } = useTranslation("notebook");

  return (
    <AnimateHeight
      height={active ? "auto" : 0}
      contentClassName="notebook__item-delete-container"
    >
      <div className="notebook__item-delete">
        <div className="notebook__item-description">{t("content.remove")}</div>
        <div className="notebook__item-buttonset">
          <Button buttonModifiers={["fatal"]} onClick={onConfirm}>
            {t("actions.remove", { ns: "common" })}
          </Button>
          <Button buttonModifiers={["cancel"]} onClick={onCancel}>
            {t("actions.cancel", { ns: "common" })}
          </Button>
        </div>
      </div>
    </AnimateHeight>
  );
};

export default NotebookItemDeleteConfirm;
