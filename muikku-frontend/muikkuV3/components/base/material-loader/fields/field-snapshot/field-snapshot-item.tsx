import * as React from "react";
import { useState } from "react";
import { IconButton } from "~/components/general/button";
import { FieldSnapshotAccordion } from "./field-snapshot-accordion";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";
import { DeleteSnapshotDialog } from "./delete-snapshot-dialog";

/**
 * Field snapshot item props
 */
export interface FieldSnapshotItemProps {
  snapshotId: number;
  label: React.ReactNode;
  onDelete?: () => void;
  children: React.ReactNode;
  className?: string;
  rowClassName?: string;
  accordionClassName?: string;
  accordionContentClassName?: string;
  deleteDisabled?: boolean;
  /** Optional: start expanded */
  defaultOpen?: boolean;
}

/**
 * Field snapshot item
 * @param props - Field snapshot item props
 * @returns Field snapshot item
 */
export const FieldSnapshotItem = (props: FieldSnapshotItemProps) => {
  const {
    label,
    onDelete,
    children,
    className = "field-snapshot",
    rowClassName = "field-snapshot__row",
    accordionClassName = "field-snapshot__accordion",
    accordionContentClassName = "field-snapshot__accordion-content",
    deleteDisabled = false,
    defaultOpen = false,
  } = props;

  const { t } = useTranslation("materials");

  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={className}>
      <div className={rowClassName}>
        <button
          type="button"
          className="field-snapshot__toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
        >
          <span
            className={`field-snapshot__toggle-icon icon-arrow-right ${
              isOpen ? "is-open" : ""
            }`}
          />
          <span className="field-snapshot__label">{label}</span>
        </button>

        {onDelete && (
          <DeleteSnapshotDialog onDelete={onDelete}>
            <Dropdown
              alignSelfVertically="top"
              content={
                <p>
                  {t("labels.remove", {
                    context: "snapshot",
                    ns: "materials",
                  })}
                </p>
              }
              openByHover
            >
              <IconButton
                buttonModifiers="snapshot-delete"
                icon="trash"
                disabled={deleteDisabled}
              />
            </Dropdown>
          </DeleteSnapshotDialog>
        )}
      </div>

      <FieldSnapshotAccordion
        isOpen={isOpen}
        className={accordionClassName}
        contentClassName={accordionContentClassName}
      >
        {children}
      </FieldSnapshotAccordion>
    </div>
  );
};
