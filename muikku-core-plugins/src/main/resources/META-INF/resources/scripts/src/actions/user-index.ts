import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import { User } from "~/generated/client";

/**
 * LoadUserIndexTriggerType
 */
export interface LoadUserIndexTriggerType {
  (userId: number, callback?: (user: User) => any): AnyActionType;
}

/**
 * LoadUserIndexBySchoolDataTriggerType
 */
export interface LoadUserIndexBySchoolDataTriggerType {
  (userId: string, callback?: (user: User) => any): AnyActionType;
}

/**
 * LoadLoggedUserTriggerType
 */
export interface LoadLoggedUserTriggerType {
  (callback?: (user: User) => any): AnyActionType;
}

/**
 * LoadUserGroupIndexTriggerType
 */
export interface LoadUserGroupIndexTriggerType {
  (groupId: number): AnyActionType;
}

export type SET_USER_INDEX = SpecificActionType<
  "SET_USER_INDEX",
  {
    index: number;
    value: User;
  }
>;

export type SET_USER_GROUP_INDEX = SpecificActionType<
  "SET_USER_GROUP_INDEX",
  {
    index: number;
    value: any; //TODO fix these user groups
  }
>;

export type SET_USER_BY_SCHOOL_DATA_INDEX = SpecificActionType<
  "SET_USER_BY_SCHOOL_DATA_INDEX",
  {
    index: string;
    value: User;
  }
>;

const fetchingStateUser: { [index: number]: boolean } = {};
const fetchingStateUserBySchoolData: { [index: string]: boolean } = {};
/**
 * loadLoggedUser
 * @param callback callback
 */
const loadLoggedUser: LoadLoggedUserTriggerType = function loadLoggedUser(
  callback
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    const state = getState();

    if (state.status.loggedIn) {
      const userId = state.status.userSchoolDataIdentifier;
      const currentUserInfo = state.userIndex.usersBySchoolData[userId];
      if (currentUserInfo || fetchingStateUserBySchoolData[userId]) {
        return;
      }

      fetchingStateUserBySchoolData[userId] = true;

      try {
        const user: User = <User>(
          ((await promisify(mApi().user.whoami.read(), "callback")()) || 0)
        );
        dispatch({
          type: "SET_USER_BY_SCHOOL_DATA_INDEX",
          payload: {
            index: userId,
            value: user,
          },
        });
        callback(user);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
      }
    } else {
      // TODO: if the user is not logged in, what to do?
      callback(null);
    }
  };
};

/**
 * loadUserGroupIndex
 * @param groupId groupId
 */
const loadUserGroupIndex: LoadUserGroupIndexTriggerType =
  function loadUserGroupIndex(groupId) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();
      const currentGroupInfo = state.userIndex.groups[groupId];
      if (currentGroupInfo || fetchingStateUser[groupId]) {
        return;
      }

      fetchingStateUser[groupId] = true;

      try {
        dispatch({
          type: "SET_USER_GROUP_INDEX",
          payload: {
            index: groupId,
            value:
              (await promisify(
                mApi().usergroup.groups.read(groupId),
                "callback"
              )()) || 0,
          },
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
      }
    };
  };

export default { loadUserGroupIndex, loadLoggedUser };
export { loadUserGroupIndex, loadLoggedUser };
