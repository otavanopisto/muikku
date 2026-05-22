import * as React from "react";
import { useMemo } from "react";
import { MaterialAnswerSnapshot } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { FieldSnapshotItem } from "./field-snapshot-item";
import "~/sass/elements/field-snapshot.scss";
import { useTranslation } from "react-i18next";

/**
 * Field snapshot list props
 */
export interface FieldSnapshotListProps {
  snapshots?: MaterialAnswerSnapshot[];
  fieldName: string;
  onDeleteFieldSnapshot?: (fieldName: string, snapshotId: number) => void;
  renderSnapshot: (snapshot: MaterialAnswerSnapshot) => React.ReactNode;
  formatLabel?: (snapshot: MaterialAnswerSnapshot) => React.ReactNode;
  className?: string;
}

/**
 * Field snapshot list
 * @param props - Field snapshot list props
 * @returns Field snapshot list
 */
export const FieldSnapshotList = (props: FieldSnapshotListProps) => {
  const {
    snapshots = [],
    fieldName,
    onDeleteFieldSnapshot,
    renderSnapshot,
    formatLabel,
    className = "field-snapshot-list",
  } = props;

  const { t } = useTranslation("materials");

  const sortedSnapshots = useMemo(
    () => [...snapshots].sort((a, b) => b.date.getTime() - a.date.getTime()),
    [snapshots]
  );

  if (!sortedSnapshots.length) {
    return null;
  }

  return (
    <div className={className}>
      {sortedSnapshots.map((snapshot) => (
        <FieldSnapshotItem
          key={snapshot.id}
          snapshotId={snapshot.id}
          label={
            formatLabel
              ? formatLabel(snapshot)
              : `${t("labels.snapshot", {
                  ns: "materials",
                })} ${localize.date(snapshot.date, "l LT")}`
          }
          onDelete={
            onDeleteFieldSnapshot
              ? () => onDeleteFieldSnapshot(fieldName, snapshot.id)
              : undefined
          }
        >
          {renderSnapshot(snapshot)}
        </FieldSnapshotItem>
      ))}
    </div>
  );
};
