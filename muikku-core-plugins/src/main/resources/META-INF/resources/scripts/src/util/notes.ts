import { NoteReceiver } from "~/generated/client";
import { AvatarProps } from "~/components/general/avatar";

/**
 * trimNoteRecipients reduces the NoteReceiver array to only the unique recipients
 * @param recipients
 */
export const trimNoteRecipientsToAvatars = (
  recipients: NoteReceiver[]
): AvatarProps[] => {
  const noteAvatars: AvatarProps[] = [];
  const userGroupIds: number[] = [];
  const workspaceIds: number[] = [];

  recipients.forEach((noteRecipient) => {
    const {
      userGroupId,
      workspaceId,
      recipient,
      hasImage,
      recipientName,
      userGroupName,
      workspaceName,
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
      noteAvatars.push({
        hasImage: false,
        id: userGroupId,
        firstName: userGroupName,
      });
      return;
    }
    if (workspaceId) {
      workspaceIds.push(workspaceId);
      noteAvatars.push({
        hasImage: false,
        id: userGroupId,
        firstName: workspaceName,
      });
      return;
    }
    noteAvatars.push({
      hasImage: hasImage,
      id: recipient,
      firstName: recipientName,
    });
  });

  return noteAvatars;
};
