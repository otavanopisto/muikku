import { AnyActionType } from "~/actions";
import {
  AnnouncementsType,
  AnnouncementsStateType,
  AnnouncementListType,
  AnnouncementsPatchType,
  AnnouncerNavigationItemListType,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import { StatusType } from "~/reducers/base/status";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import notificationActions from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import { loadUserGroupIndex } from "~/actions/user-index";

export async function loadAnnouncementsHelper(
  location: string | null,
  workspaceId: number,
  notOverrideCurrent: boolean,
  force: boolean,
  dispatch: (arg: AnyActionType) => any,
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
  const navigation: AnnouncerNavigationItemListType =
    state.announcements.navigation;
  const announcements: AnnouncementsType = state.announcements;
  const status: StatusType = state.status;
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

  const params: any = {
    onlyEditable: true,
    hideEnvironmentAnnouncements:
      !status.permissions.ANNOUNCER_CAN_PUBLISH_ENVIRONMENT,
  };
  if (workspaceId) {
    params.workspaceEntityId = workspaceId;
  }
  switch (item.id) {
    case "past":
      params.timeFrame = "EXPIRED";
      break;
    case "archived":
      params.timeFrame = "ALL";
      params.onlyArchived = true;
      break;
    case "mine":
      params.timeFrame = "ALL";
      params.onlyMine = true;
      break;
    default:
      params.timeFrame = "CURRENTANDUPCOMING";
      break;
  }

  try {
    const announcements: AnnouncementListType = <AnnouncementListType>(
      await promisify(mApi().announcer.announcements.read(params), "callback")()
    );
    announcements.forEach((a) =>
      a.userGroupEntityIds.forEach((id) => dispatch(loadUserGroupIndex(id)))
    );

    //Create the payload for updating all the announcer properties
    const properLocation = location || item.location;
    const payload: AnnouncementsPatchType = {
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
    if (!(err instanceof MApiError)) {
      throw err;
    }
    //Error :(
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get(
          "plugin.announcer.errormessage.loadAnnouncements"
        ),
        "error"
      )
    );
    dispatch({
      type: "UPDATE_ANNOUNCEMENTS_STATE",
      payload: <AnnouncementsStateType>"ERROR",
    });
  }
}
