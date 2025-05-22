import { AnyActionType } from "~/actions";
import {
  AnnouncementsStateType,
  AnnouncementsStatePatch,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import notificationActions from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import { loadUserGroupIndex } from "~/actions/user-index";
import i18n from "~/locales/i18n";
import { GetAnnouncementsRequest } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { Action, Dispatch } from "redux";

/**
 * loadAnnouncementsHelper
 * @param location location
 * @param workspaceId workspaceId
 * @param notOverrideCurrent notOverrideCurrent
 * @param force force
 * @param dispatch dispatch
 * @param getState getState
 */
export async function loadAnnouncementsHelper(
  location: string | null,
  workspaceId: number,
  notOverrideCurrent: boolean,
  force: boolean,
  dispatch,
  getState
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

  //Avoid loading announcements if it's the same location
  if (
    (!isForceDefined || !isForceEnforced) &&
    actualLocation === announcements.location &&
    announcements.state === "READY"
  ) {
    return;
  }

  //We set this state to loading
  dispatch({
    type: "UPDATE_ANNOUNCEMENTS_STATE",
    payload: <AnnouncementsStateType>"LOADING",
  });

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

  const params: GetAnnouncementsRequest = {
    onlyEditable: true,
    hideEnvironmentAnnouncements:
      !status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT,
  };
  if (workspaceId) {
    params.workspaceEntityId = workspaceId;
  }
  switch (item.id) {
    case "expired":
      params.timeFrame = "EXPIRED";
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

  const announcerApi = MApi.getAnnouncerApi();

  try {
    const announcements = await announcerApi.getAnnouncements(params);

    announcements.forEach((a) =>
      a.userGroupEntityIds.forEach((id) => dispatch(loadUserGroupIndex(id)))
    );

    //Create the payload for updating all the announcer properties
    const properLocation = location || item.location;
    const payload: AnnouncementsStatePatch = {
      state: "READY",
      announcements,
      location: properLocation,
      selected: [],
      selectedIds: [],
      workspaceId: workspaceId || null,
    };

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
