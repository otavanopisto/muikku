import { NoteReceiver } from "~/generated/client";
import { AvatarProps } from "~/components/general/avatar/index";
import { useMemo } from "react";
/**
 * useRecipientsToAvatars turns note recipients into avatars
 * @param recipients recipients
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
        recipientId,
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
          name: userGroupName,
        });
        return;
      }
      if (workspaceId) {
        workspaceIds.push(workspaceId);
        avatars.push({
          hasImage: false,
          id: workspaceId,
          groupAvatar: "workspace",
          name: workspaceName,
        });
        return;
      }
      avatars.push({
        hasImage: hasImage,
        id: recipientId,
        name: recipientName,
      });
    });
    return avatars;
  }, [recipients]);
  return noteAvatars;
};
