import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { UserType } from "~/reducers/user-index";
import { StateType } from "~/reducers";

export interface LoadUserIndexTriggerType {
  (userId: number, callback?: (user: UserType) => any): AnyActionType;
}

export interface LoadUserIndexBySchoolDataTriggerType {
  (userId: string, callback?: (user: UserType) => any): AnyActionType;
}

export interface LoadLoggedUserTriggerType {
  (callback?: (user: UserType) => any): AnyActionType;
}

export interface LoadUserGroupIndexTriggerType {
  (groupId: number): AnyActionType;
}

export type SET_USER_INDEX = SpecificActionType<
  "SET_USER_INDEX",
  {
    index: number;
    value: UserType;
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
    value: UserType;
  }
>;

const fetchingStateUser: { [index: number]: boolean } = {};
const fetchingStateUserBySchoolData: { [index: string]: boolean } = {};
const loadLoggedUser: LoadLoggedUserTriggerType = function loadLoggedUser(
  callback,
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType,
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
        const user: UserType = <UserType>(
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

const loadUserGroupIndex: LoadUserGroupIndexTriggerType =
  function loadUserGroupIndex(groupId) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType,
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
                "callback",
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
