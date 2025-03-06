import { NoteReceiver } from "~/generated/client";
import { AvatarProps } from "~/components/general/avatar/index";
import { useMemo } from "react";
/**
 * useRecipientsToAvatars turns note recipients into avatars
 * @param recipients recipients
 * @param showGroupMembers showGroupMembers
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
        status,
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
          // If the userGroup or workspace is already in the list,
          // add the user to the groupMembers under it
          const existingGroupAvatar = avatars.find(
            (avatar) =>
              (avatar.groupAvatar === "usergroup" &&
                avatar.id === userGroupId) ||
              (avatar.groupAvatar === "workspace" && avatar.id === workspaceId)
          );
          if (existingGroupAvatar) {
            const newMember = {
              id: recipientId,
              hasImage: hasImage,
              name: recipientName,
            };
            // Put the ones with "APPROVAL_PENDING" status at the top
            if (status === "APPROVAL_PENDING") {
              existingGroupAvatar.groupMembers.unshift(newMember);
            } else {
              existingGroupAvatar.groupMembers.push(newMember);
            }
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
