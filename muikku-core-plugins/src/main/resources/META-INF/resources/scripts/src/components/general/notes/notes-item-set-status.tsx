import * as React from "react";
import { NoteReceiver, NoteStatusType } from "~/generated/client";
import { useTranslation } from "react-i18next";
import Link from "~/components/general/link";
import Dropdown from "~/components/general/dropdown";
import { IconButton } from "~/components/general/button";

/**
 * DropdownProps
 */
interface DropdownItem {
  id: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: any;
}

/**
 * NoteStatusSettingProps
 */
interface NoteStatusSettingProps {
  children?: React.ReactElement;
  status?: NoteStatusType;
  userId?: number;
  isArchived?: boolean;
  loggedUserIsOwner: boolean;
  loggedUserIsCreator: boolean;
  handleSetNoteStatus: (status: NoteStatusType, userId?: number) => void;
}

/**
 * renderUpdateStatus
 * @param props NoteStatusSettingProps
 */
const NoteStatusSetting = (props: NoteStatusSettingProps) => {
  const {
    status,
    userId,
    loggedUserIsCreator,
    loggedUserIsOwner,
    handleSetNoteStatus,
    children,
  } = props;
  const { t } = useTranslation("tasks");
  let items: DropdownItem[] = [];

  if (loggedUserIsOwner) {
    if (status === "ONGOING") {
      items = [
        {
          id: "task-item-send",
          text: t("actions.send"),
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: () =>
            handleSetNoteStatus("APPROVAL_PENDING", userId && userId),
        },
      ];

      if (loggedUserIsCreator) {
        items = [
          {
            id: "task-item-done",
            text: t("actions.done"),
            // eslint-disable-next-line jsdoc/require-jsdoc
            onClick: () => handleSetNoteStatus("APPROVED", userId && userId),
          },
        ];
      }
    }
    if (status === "APPROVAL_PENDING") {
      items = [
        {
          id: "task-item-cancel",
          text: t("actions.cancel"),
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: () => handleSetNoteStatus("ONGOING", userId && userId),
        },
      ];
    }

    if (status === "APPROVED") {
      items = [
        {
          id: "task-item-incomplete",
          text: t("actions.incomplete"),
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: () => handleSetNoteStatus("ONGOING", userId && userId),
        },
      ];
    }
  } else if (loggedUserIsCreator) {
    if (status === "ONGOING") {
      items = [];
    }
    if (status === "APPROVAL_PENDING") {
      items = [
        {
          id: "task-item-approve",
          text: t("actions.approve"),
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: () => handleSetNoteStatus("APPROVED", userId && userId),
        },
        {
          id: "task-item-incomplete",
          text: t("actions.incomplete"),
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: () => handleSetNoteStatus("ONGOING", userId && userId),
        },
      ];
    }
    if (status === "APPROVED") {
      items = [
        {
          id: "task-item-incomplete",
          text: t("actions.incomplete"),
          // eslint-disable-next-line jsdoc/require-jsdoc
          onClick: () =>
            handleSetNoteStatus("APPROVAL_PENDING", userId && userId),
        },
      ];
    }
  }

  /**
   * Renders item
   * @param item item
   * @param onClose onClose
   */
  const renderItem = (item: DropdownItem, onClose: () => void) => (
    <Link
      key={item.id}
      className={`link link--full link--tasks-dropdown`}
      onClick={() => {
        onClose();
        item.onClick();
      }}
    >
      <span>{item.text}</span>
    </Link>
  );
  return (
    <>
      {items.length > 0 ? (
        <Dropdown
          items={items.map(
            (item) => (closeDropdown: () => void) =>
              renderItem(item, closeDropdown)
          )}
        >
          {children ? (
            <div tabIndex={0}>{children}</div>
          ) : (
            <div tabIndex={0}>
              <IconButton
                icon="more_vert"
                buttonModifiers={["notes-action", "notes-more"]}
              />
            </div>
          )}
        </Dropdown>
      ) : (
        children && children
      )}
    </>
  );
};

export default NoteStatusSetting;
