import { instanceOfUser, User, Student } from "~/generated/client";

/**
 * isUser
 * @param item item
 */
export const isUser = (item: Student | User): item is User =>
  instanceOfUser(item);
