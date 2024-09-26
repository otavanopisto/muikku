import { Student } from "~/generated/client";
import { ContactRecipientType } from "~/reducers/user-index";
import { getName } from "~/util/modifiers";

/**
 * turnSelectedUsersToContacts
 * @param users array of GuiderStudents
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
