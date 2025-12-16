import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import NotesListItem, { NotesListItemProps } from "../notes-item-list-item";
import GroupAvatarUsers from "~/components/general/avatar/group-avatar/group-avatar-users";
import { useTranslation } from "react-i18next";
import { AvatarGroupUser } from "~/components/general/avatar/group-avatar/group-avatar-user";
import { NoteReceiver } from "~/generated/client";
/**
 * NoteInformationDialogProps
 */
interface NoteInformationDialogProps extends NotesListItemProps {
  recipients?: NoteReceiver[];
  groupMembersAction?: (id: number) => JSX.Element;
  children?: React.ReactElement;
}

/**
 * NoteInformationDialog
 * @param props props
 * @returns JSX.Element
 */
const NoteInformationDialog: React.FC<NoteInformationDialogProps> = (props) => {
  const { children, recipients, groupMembersAction, ...item } = props;
  const { t } = useTranslation("tasks");

  const avatarUsers: AvatarGroupUser[] = [];

  recipients.forEach((recipient) => {
    const user: AvatarGroupUser = {
      hasImage: recipient.hasImage,
      id: recipient.recipientId,
      name: recipient.recipientName,
      modifier: recipient.status.toLowerCase(),
    };
    if (recipient.status === "APPROVAL_PENDING") avatarUsers.unshift(user);
    else avatarUsers.push(user);
  });

  /**
   * content
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const content = (closeDialog: () => never) => (
    <>
      <div className="dialog__note-item">
        <NotesListItem
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(item as any)}
          showRecipients={
            props.specificRecipient || !props.notesItem.multiUserNote
              ? true
              : false
          }
          containerModifier={["dialog-information"]}
          openInformationToDialog={false}
        />
      </div>
      {!props.specificRecipient && props.notesItem.multiUserNote && (
        <div className="dialog__note-recipients">
          <GroupAvatarUsers users={avatarUsers} action={groupMembersAction} />
        </div>
      )}
    </>
  );

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => never) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
      >
        {t("actions.close", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="note-information"
      disableScroll={true}
      title={t("labels.details")}
      content={content}
      footer={footer}
      closeOnOverlayClick={false}
    >
      {children}
    </Dialog>
  );
};

export default NoteInformationDialog;
