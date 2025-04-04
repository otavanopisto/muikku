import { NoteReceiver } from "~/generated/client";
import { AvatarEntity } from "~/components/general/avatar";
import { useMemo } from "react";
/**
 * useRecipientsToAvatars turns note recipients into avatars
 * @param recipients recipients
 * @param showGroupMembers showGroupMembers
 */
export const useRecipientsToAvatars = (
  recipients: NoteReceiver[],
  showGroupMembers?: boolean
): AvatarEntity[] => {
  const noteAvatars = useMemo(() => {
    const avatars: AvatarEntity[] = [];
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
              modifier: status.toLowerCase(),
            };

            // Put the ones with "APPROVAL_PENDING" status at the top
            switch (status) {
              case "APPROVAL_PENDING":
                existingGroupAvatar.groupMembers.unshift(newMember);
                break;
              case "APPROVED": {
                // Find the last group member with "APPROVAL_PENDING" status
                const lastPendingIndex = existingGroupAvatar.groupMembers
                  .map((member, index) => ({ member, index }))
                  .reverse()
                  .findIndex((item) => item.member.modifier === "ongoing");

                // Find out the index to insert the new member
                const insertIndex =
                  lastPendingIndex === -1 ? 0 : lastPendingIndex + 1;

                // Insert the approved member accordingly
                existingGroupAvatar.groupMembers.splice(
                  insertIndex,
                  0,
                  newMember
                );
                break;
              }

              default:
                existingGroupAvatar.groupMembers.push(newMember);
            }
          }
          return;
        }
      }
      // Not in the list, add it
      if (userGroupId) {
        const groupMember = {
          id: recipientId,
          hasImage: hasImage,
          showTooltip: true,
          name: recipientName,
          modifier: status.toLowerCase(),
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
          modifier: status.toLowerCase(),
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
