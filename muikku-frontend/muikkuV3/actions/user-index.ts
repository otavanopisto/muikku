import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { UserGroup, UserWhoAmI } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch, Action } from "redux";

/**
 * LoadLoggedUserTriggerType
 */
interface LoadLoggedUserTriggerType {
  (callback?: (user: UserWhoAmI) => void): AnyActionType;
}

/**
 * LoadUserGroupIndexTriggerType
 */
interface LoadUserGroupIndexTriggerType {
  (groupId: number): AnyActionType;
}

export type SET_USER_GROUP_INDEX = SpecificActionType<
  "SET_USER_GROUP_INDEX",
  {
    index: number;
    value: UserGroup; //TODO fix these user groups
  }
>;

export type SET_USER_BY_SCHOOL_DATA_INDEX = SpecificActionType<
  "SET_USER_BY_SCHOOL_DATA_INDEX",
  {
    index: string;
    value: UserWhoAmI;
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
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
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

      const userApi = MApi.getUserApi();

      try {
        const whoAmIUser = await userApi.getWhoAmI();

        dispatch({
          type: "SET_USER_BY_SCHOOL_DATA_INDEX",
          payload: {
            index: userId,
            value: whoAmIUser,
          },
        });
        callback(whoAmIUser);
      } catch (err) {
        if (!isMApiError(err)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const usergroupApi = MApi.getUsergroupApi();

      const state = getState();
      const currentGroupInfo = state.userIndex.groups[groupId];
      if (currentGroupInfo || fetchingStateUser[groupId]) {
        return;
      }

      fetchingStateUser[groupId] = true;

      try {
        const userGroup = await usergroupApi.getUserGroup({
          groupId: groupId,
        });

        dispatch({
          type: "SET_USER_GROUP_INDEX",
          payload: {
            index: groupId,
            value: userGroup,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };
  };

export default { loadUserGroupIndex, loadLoggedUser };
export { loadUserGroupIndex, loadLoggedUser };
