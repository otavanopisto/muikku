import { NoteReceiver } from "~/generated/client";
import { AvatarProps } from "~/components/general/avatar/index";
import { useMemo } from "react";
/**
 * useRecipientsToAvatars turns note recipients into avatars
 * @param recipients recipients
 * @param showGroupMembers showGroupMembers
 * @param groupMembersActions groupMembersActions
 */
export const useRecipientsToAvatars = (
  recipients: NoteReceiver[],
  showGroupMembers?: boolean
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
        if (showGroupMembers) {
          const existingAvatar = avatars.find(
            (avatar) =>
              (avatar.groupAvatar === "usergroup" &&
                avatar.id === userGroupId) ||
              (avatar.groupAvatar === "workspace" && avatar.id === workspaceId)
          );

          if (existingAvatar) {
            existingAvatar.groupMembers.push({
              id: recipientId,
              hasImage: hasImage,
              name: recipientName,
            });
          }
        }
        return;
      }
      // Not in the list, add it
      if (userGroupId) {
        const groupMember = {
          id: recipientId,
          hasImage: hasImage,
          showTooltip: true,
          name: recipientName,
        };
        userGroupIds.push(userGroupId);
        avatars.push({
          hasImage: false,
          id: userGroupId,
          groupAvatar: "usergroup",
          showTooltip: true,
          groupMembers: showGroupMembers && [groupMember],
          name: userGroupName,
        });
        return;
      }
      if (workspaceId) {
        const workspaceMember = {
          id: recipientId,
          hasImage: hasImage,
          name: recipientName,
        };
        workspaceIds.push(workspaceId);
        avatars.push({
          hasImage: false,
          id: workspaceId,
          groupAvatar: "workspace",
          groupMembers: showGroupMembers && [workspaceMember],
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
  }, [recipients, showGroupMembers]);
  return noteAvatars;
};
