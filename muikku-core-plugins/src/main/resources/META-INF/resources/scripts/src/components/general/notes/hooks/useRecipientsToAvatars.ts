import { NoteReceiver } from "~/generated/client";
import { AvatarProps } from "~/components/general/avatar";
import { useMemo } from "react";
/**
 * trimNoteRecipients reduces the NoteReceiver array to only the unique recipients
 * @param recipients
 */
export const useRecipientsToAvatars = (
  recipients: NoteReceiver[]
): AvatarProps[] => {
  const noteAvatars = useMemo(() => {
    const avatars: AvatarProps[] = [];
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
        avatars.push({
          hasImage: false,
          id: userGroupId,
          groupAvatar: "usergroup",
          firstName: userGroupName,
        });
        return;
      }
      if (workspaceId) {
        workspaceIds.push(workspaceId);
        avatars.push({
          hasImage: false,
          id: userGroupId,
          groupAvatar: "workspace",
          firstName: workspaceName,
        });
        return;
      }
      avatars.push({
        hasImage: hasImage,
        id: recipient,
        firstName: recipientName,
      });
    });
    return avatars;
  }, [recipients]);
  return noteAvatars;
};
