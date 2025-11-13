import { AnyActionType } from "~/actions";
import {
  AnnouncementsStateType,
  AnnouncementsStatePatch,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import notificationActions from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";
import { GetAnnouncementsRequest } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { Action, Dispatch } from "redux";

const announcerApi = MApi.getAnnouncerApi();

// Constants for pagination
const MAX_LOADED_AT_ONCE = 30;

/**
 * loadAnnouncementsHelper
 * @param location location
 * @param workspaceId workspaceId
 * @param notOverrideCurrent notOverrideCurrent
 * @param force force
 * @param initial initial - whether this is the initial load or loading more
 * @param dispatch dispatch
 * @param getState getState
 */
export async function loadAnnouncementsHelper(
  location: string | null,
  workspaceId: number,
  notOverrideCurrent: boolean,
  force: boolean,
  initial: boolean,
  dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
  getState: () => StateType
) {
  if (!notOverrideCurrent) {
    //Remove the current announcement
    dispatch({
      type: "SET_CURRENT_ANNOUNCEMENT",
      payload: null,
    });
  }

  const state = getState();
  const navigation = state.announcements.navigation;
  const announcements = state.announcements;
  const status = state.status;
  const actualLocation: string = location || announcements.location;

  const isForceDefined = typeof force === "boolean";
  const isForceEnforced = force;

  //Avoid loading announcements if it's the same location and initial load
  if (
    initial &&
    (!isForceDefined || !isForceEnforced) &&
    actualLocation === announcements.location &&
    announcements.state === "READY"
  ) {
    return;
  }

  //If it's for the first time
  if (initial) {
    //We set this state to loading
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"LOADING",
    });
  } else {
    //Otherwise we are loading more
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"LOADING_MORE",
    });
  }

  //We get the navigation location item
  const item: AnnouncerNavigationItemType = navigation.find(
    (item) => item.location === actualLocation
  );
  if (!item) {
    return dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"ERROR",
    });
  }

  // Generate the API query parameters
  const firstResult = initial ? 0 : announcements.announcements.length;
  const concat = !initial;

  const params: GetAnnouncementsRequest = {
    onlyEditable: true,
    hideEnvironmentAnnouncements:
      !status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT,
    firstResult,
    //We load one more to check if they have more
    maxResults: MAX_LOADED_AT_ONCE + 1,
  };

  if (workspaceId) {
    params.workspaceEntityId = workspaceId;
  }

  switch (item.id) {
    case "expired":
      params.timeFrame = "EXPIRED";
      break;
    case "unread":
      params.timeFrame = "ALL";
      params.onlyUnread = true;
      break;
    case "archived":
      params.timeFrame = "ALL";
      params.onlyArchived = true;
      break;
    case "own":
      params.timeFrame = "ALL";
      params.onlyMine = true;
      break;
    default:
      params.timeFrame = "CURRENTANDUPCOMING";
      break;
  }

  try {
    const newAnnouncements = await announcerApi.getAnnouncements(params);
    const categories = await announcerApi.listAnnouncementCategories();
    const hasMore: boolean =
      newAnnouncements.announcements.length === MAX_LOADED_AT_ONCE + 1;

    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    const actualResults = newAnnouncements.announcements.concat([]);
    if (hasMore) {
      //we got to get rid of that extra loaded announcement
      actualResults.pop();
    }

    //Create the payload for updating all the announcer properties
    const properLocation = location || item.location;
    const payload: AnnouncementsStatePatch = {
      state: "READY",
      hasMore,
      location: properLocation,
      workspaceId: workspaceId || null,
    };

    if (concat) {
      // Concatenate with existing announcements
      payload.announcements = announcements.announcements.concat(actualResults);
    } else {
      // Replace announcements for initial load
      payload.announcements = actualResults;
      payload.unreadCount = newAnnouncements.unreadCount;
      payload.selected = [];
      payload.selectedIds = [];
      payload.categories = categories;
    }

    //And there it goes
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
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
          ns: "messaging",
          context: "announcements",
        }),
        "error"
      )
    );
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"ERROR",
    });
  }
}
