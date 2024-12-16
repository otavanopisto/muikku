import { Student, NoteReceiver } from "~/generated/client";
import { ContactRecipientType } from "~/reducers/user-index";
import { getName } from "~/util/modifiers";

/**
 * turnSelectedUsersToContacts
 * @param users array of GuiderStudents
 * @param hasFullNamePermission boolean
 * @returns {Array} an Array of ContactRecipientType
 */
export const turnSelectedUsersToContacts = (
  users: Student[],
  hasFullNamePermission: boolean
): ContactRecipientType[] => {
  const contacts: ContactRecipientType[] = [];
  users.map((user) => {
    contacts.push({
      type: "user",
      value: {
        id: user.userEntityId,
        name: getName(user, hasFullNamePermission),
        identifier: user.id,
        email: user.email,
      },
    });
  });
  return contacts;
};

/**
 * turnNoteRecipientsToContacts
 * @param recipients
 * @returns
 */
export const turnNoteRecipientsToContacts = (
  recipients: NoteReceiver[]
): ContactRecipientType[] => {
  const contacts: ContactRecipientType[] = [];

  const userGroupIds: number[] = [];
  const workspaceIds: number[] = [];

  recipients.map((noteRecipient) => {
    const {
      userGroupId,
      workspaceId,
      userGroupName,
      workspaceName,
      recipientName,
      recipient,
    } = noteRecipient;

    // If the userGroup or workspace is already in the list, skip it
    if (
      (userGroupId && userGroupIds.includes(userGroupId)) ||
      (workspaceId && workspaceIds.includes(workspaceId))
    ) {
      return;
    }
    // Not in the list, add it
    if (userGroupId) {
      userGroupIds.push(userGroupId);
    }
    if (workspaceId) {
      workspaceIds.push(workspaceId);
    }

    const type = workspaceId ? "workspace" : userGroupId ? "usergroup" : "user";
    const id = workspaceId || userGroupId || recipient;
    const name = workspaceName || userGroupName || recipientName;

    contacts.push({
      type,
      value: {
        id,
        name,
      },
    });
  });
  return contacts;
};
