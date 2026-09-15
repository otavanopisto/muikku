import * as React from "react";
import { useTranslation } from "react-i18next";
import { AnnotationOrphanReason } from "~/util/html";

/**
 * NotebookItemOrphanBadgeProps
 */
interface NotebookItemOrphanBadgeProps {
  reason: AnnotationOrphanReason | null;
}

/**
 * NotebookItemOrphanBadge
 * @param props props
 * @returns React.ReactNode
 */
const NotebookItemOrphanBadge = (props: NotebookItemOrphanBadgeProps) => {
  const { t } = useTranslation(["notebook"]);

  const label = t("labels.orphanedNote", { defaultValue: "Vanhentunut" });

  return (
    <span
      className="notebook__item-orphan-badge"
      title={label}
      aria-label={label}
    >
      {label}
    </span>
  );
};

export default NotebookItemOrphanBadge;
