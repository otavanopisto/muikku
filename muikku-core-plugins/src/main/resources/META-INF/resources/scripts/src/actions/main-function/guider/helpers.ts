import notificationActions from "~/actions/base/notifications";
import equals = require("deep-equal");
import { AnyActionType } from "~/actions";
import {
  GuiderState,
  GuiderActiveFiltersType,
  GuiderStudentsStateType,
  GuiderStatePatch,
} from "~/reducers/main-function/guider";
import { StateType } from "~/reducers";
import MApi, { isMApiError } from "~/api/api";
import { Dispatch, Action } from "redux";
import i18n from "~/locales/i18n";

//HELPERS
const MAX_LOADED_AT_ONCE = 25;

/**
 * loadStudentsHelper
 * @param filters filters
 * @param initial initial
 * @param dispatch dispatch
 * @param getState getState
 */
export async function loadStudentsHelper(
  filters: GuiderActiveFiltersType | null,
  initial: boolean,
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
  getState: () => StateType
) {
  dispatch({
    type: "SET_CURRENT_GUIDER_STUDENT",
    payload: null,
  });

  const guiderApi = MApi.getGuiderApi();
  const state = getState();
  const guider: GuiderState = state.guider;
  const flagOwnerIdentifier: string = state.status.userSchoolDataIdentifier;

  //Avoid loading courses again for the first time if it's the same location
  if (
    initial &&
    equals(filters, guider.activeFilters) &&
    guider.studentsState === "READY"
  ) {
    return;
  }

  const actualFilters = filters || guider.activeFilters;

  let guiderStudentsNextState: GuiderStudentsStateType;
  //If it's for the first time
  if (initial) {
    //We set this state to loading
    guiderStudentsNextState = "LOADING";
  } else {
    //Otherwise we are loading more
    guiderStudentsNextState = "LOADING_MORE";
  }

  dispatch({
    type: "UPDATE_GUIDER_ALL_PROPS",
    payload: {
      studentsState: guiderStudentsNextState,
      activeFilters: actualFilters,
    },
  });

  //Generate the api query, our first result in the messages that we have loaded
  const firstResult = initial ? 0 : guider.students.length;
  //We only concat if it is not the initial, that means adding to the next messages
  const concat = !initial;
  const maxResults = MAX_LOADED_AT_ONCE + 1;

  const params = {
    firstResult,
    maxResults,
    flags: actualFilters.labelFilters,
    workspaceIds: actualFilters.workspaceFilters,
    userGroupIds: actualFilters.userGroupFilters,
    flagOwnerIdentifier,
  };

  if (actualFilters.query) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params as any).q = actualFilters.query;
  }

  try {
    let students = await guiderApi.getGuiderStudents({
      firstResult,
      maxResults,
      flags: actualFilters.labelFilters.length
        ? actualFilters.labelFilters
        : undefined,
      workspaceIds: actualFilters.workspaceFilters.length
        ? actualFilters.workspaceFilters
        : undefined,
      userGroupIds: actualFilters.userGroupFilters.length
        ? actualFilters.userGroupFilters
        : undefined,
      flagOwnerIdentifier,
      q: actualFilters.query,
    });

    //TODO why in the world does the server return nothing rather than an empty array?
    //remove this hack fix the server side
    students = students || [];
    const hasMore: boolean = students.length === MAX_LOADED_AT_ONCE + 1;

    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    const actualStudents = students.concat([]);
    if (hasMore) {
      //we got to get rid of that extra loaded message
      actualStudents.pop();
    }

    //Create the payload for updating all the communicator properties
    const payload: GuiderStatePatch = {
      studentsState: "READY",
      students: concat
        ? guider.students.concat(actualStudents)
        : actualStudents,
      hasMore,
    };

    //And there it goes
    dispatch({
      type: "UPDATE_GUIDER_ALL_PROPS",
      payload,
    });
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }
    //Error :(
    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.loadError", {
          ns: "users",
          context: "students",
        }),
        "error"
      )
    );
    dispatch({
      type: "UPDATE_GUIDER_STATE",
      payload: <GuiderStudentsStateType>"ERROR",
    });
  }
}
