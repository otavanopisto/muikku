import notificationActions from "~/actions/base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  AnnouncementsStateType,
  AnnouncementsStatePatch,
  AnnouncementsState,
} from "~/reducers/announcements";
import { loadAnnouncementsHelper } from "./helpers";
import moment from "~/lib/moment";
import { StateType } from "~/reducers";
import { loadUserGroupIndex } from "~/actions/user-index";
import { Announcement, UpdateAnnouncementRequest } from "~/generated/client";

export type UPDATE_ANNOUNCEMENTS_STATE = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS_STATE",
  AnnouncementsStateType
>;
export type UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
  AnnouncementsStatePatch
>;
export type UPDATE_SELECTED_ANNOUNCEMENTS = SpecificActionType<
  "UPDATE_SELECTED_ANNOUNCEMENTS",
  Announcement[]
>;
export type ADD_TO_ANNOUNCEMENTS_SELECTED = SpecificActionType<
  "ADD_TO_ANNOUNCEMENTS_SELECTED",
  Announcement
>;
export type REMOVE_FROM_ANNOUNCEMENTS_SELECTED = SpecificActionType<
  "REMOVE_FROM_ANNOUNCEMENTS_SELECTED",
  Announcement
>;
export type SET_CURRENT_ANNOUNCEMENT = SpecificActionType<
  "SET_CURRENT_ANNOUNCEMENT",
  Announcement
>;
export type UPDATE_ONE_ANNOUNCEMENT = SpecificActionType<
  "UPDATE_ONE_ANNOUNCEMENT",
  {
    update: UpdateAnnouncementRequest;
    announcement: Announcement;
  }
>;
export type DELETE_ANNOUNCEMENT = SpecificActionType<
  "DELETE_ANNOUNCEMENT",
  Announcement
>;
export type UPDATE_ANNOUNCEMENTS = SpecificActionType<
  "UPDATE_ANNOUNCEMENTS",
  Announcement[]
>;

/**
 * LoadAnnouncementsAsAClientTriggerType
 */
export interface LoadAnnouncementsAsAClientTriggerType {
  (
    options?: any,
    callback?: (announcements: Announcement[]) => any
  ): AnyActionType;
}

//TODO notOverrideCurrent should go once the missing data in the current announcement is fixed
/**
 * LoadAnnouncementsTriggerType
 */
export interface LoadAnnouncementsTriggerType {
  (
    location: string,
    workspaceId?: number,
    notOverrideCurrent?: boolean,
    force?: boolean
  ): AnyActionType;
}

/**
 * LoadAnnouncementTriggerType
 */
export interface LoadAnnouncementTriggerType {
  (
    location: string,
    announcementId: number,
    workspaceId?: number
  ): AnyActionType;
}

/**
 * AddToAnnouncementsSelectedTriggerType
 */
export interface AddToAnnouncementsSelectedTriggerType {
  (announcement: Announcement): AnyActionType;
}

/**
 * RemoveFromAnnouncementsSelectedTriggerType
 */
export interface RemoveFromAnnouncementsSelectedTriggerType {
  (announcement: Announcement): AnyActionType;
}

/**
 * UpdateAnnouncementTriggerType
 */
export interface UpdateAnnouncementTriggerType {
  (data: {
    announcement: Announcement;
    update: UpdateAnnouncementRequest;
    success?: () => any;
    fail?: () => any;
    cancelRedirect?: boolean;
  }): AnyActionType;
}

/**
 * DeleteAnnouncementTriggerType
 */
export interface DeleteAnnouncementTriggerType {
  (data: {
    announcement: Announcement;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * DeleteSelectedAnnouncementsTriggerType
 */
export interface DeleteSelectedAnnouncementsTriggerType {
  (): AnyActionType;
}

/**
 * AnnouncementGeneratorType
 */
interface AnnouncementGeneratorType {
  caption: string;
  content: string;
  endDate: string;
  publiclyVisible: boolean;
  startDate: string;
  userGroupEntityIds: Array<number>;
  workspaceEntityIds: Array<number>;
}

/**
 * CreateAnnouncementTriggerType
 */
export interface CreateAnnouncementTriggerType {
  (data: {
    announcement: AnnouncementGeneratorType;
    success: () => any;
    fail: () => any;
  }): AnyActionType;
}

/**
 * validateAnnouncement
 * @param dispatch dispatch
 * @param getState getState
 * @param announcement announcement
 */
function validateAnnouncement(
  dispatch: (arg: AnyActionType) => any,
  getState: () => StateType,
  announcement: AnnouncementGeneratorType
) {
  if (!announcement.caption) {
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get(
          "plugin.announcer.errormessage.createAnnouncement.missing.caption"
        ),
        "error"
      )
    );
    return false;
  } else if (!announcement.content) {
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get(
          "plugin.announcer.errormessage.createAnnouncement.missing.content"
        ),
        "error"
      )
    );
    return false;
  } else if (!announcement.endDate) {
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get(
          "plugin.announcer.errormessage.createAnnouncement.missing.endDate"
        ),
        "error"
      )
    );
    return false;
  } else if (!announcement.startDate) {
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get(
          "plugin.announcer.errormessage.createAnnouncement.missing.startDate"
        ),
        "error"
      )
    );
    return false;
  }

  return true;
}

/**
 * loadAnnouncements
 * @param location location
 * @param workspaceId workspaceId
 * @param notOverrideCurrent notOverrideCurrent
 * @param force force
 */
const loadAnnouncements: LoadAnnouncementsTriggerType =
  function loadAnnouncements(location, workspaceId, notOverrideCurrent, force) {
    return loadAnnouncementsHelper.bind(
      this,
      location,
      workspaceId,
      notOverrideCurrent,
      force
    );
  };

/**
 * loadAnnouncement
 * @param location location
 * @param announcementId announcementId
 * @param workspaceId workspaceId
 */
const loadAnnouncement: LoadAnnouncementTriggerType = function loadAnnouncement(
  location,
  announcementId,
  workspaceId
) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    const state = getState();

    let announcement: Announcement = state.announcements.announcements.find(
      (a: Announcement) => a.id === announcementId
    );
    try {
      if (!announcement) {
        /**
         * There is chance that user will try url with id that is not (anymore) available, then this try catch will take
         * care of it if that happens
         */
        try {
          announcement = <Announcement>(
            await promisify(
              mApi().announcer.announcements.read(announcementId),
              "callback"
            )()
          );
          announcement.userGroupEntityIds.forEach((id) =>
            dispatch(loadUserGroupIndex(id))
          );
          //TODO we should be able to get the information of wheter there is an announcement later or not, trace all this
          //and remove the unnecessary code

          //this is where notOverrideCurrent plays a role when loading all the other announcements after itself
          dispatch(loadAnnouncements(location, workspaceId, true, false));
        } catch (err) {
          dispatch(
            notificationActions.displayNotification(
              getState().i18n.text.get(
                "plugin.announcer.errormessage.announcementNotAvailable"
              ),
              "error"
            )
          );
        }
      } else {
        // load the user group entities if not loaded for that announcement
        // this doe not reload if it's found
        announcement.userGroupEntityIds.forEach((id) =>
          dispatch(loadUserGroupIndex(id))
        );
      }

      dispatch({
        type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
        payload: {
          location,
          current: announcement,
        },
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        notificationActions.displayNotification(
          getState().i18n.text.get(
            "plugin.announcer.errormessage.loadAnnouncement"
          ),
          "error"
        )
      );
    }
  };
};

/**
 * addToAnnouncementsSelected
 * @param announcement announcement
 */
const addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType =
  function addToAnnouncementsSelected(announcement) {
    return {
      type: "ADD_TO_ANNOUNCEMENTS_SELECTED",
      payload: announcement,
    };
  };

/**
 * removeFromAnnouncementsSelected
 * @param announcement announcement
 */
const removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType =
  function removeFromAnnouncementsSelected(announcement) {
    return {
      type: "REMOVE_FROM_ANNOUNCEMENTS_SELECTED",
      payload: announcement,
    };
  };

/**
 * updateAnnouncement
 * @param data data
 */
const updateAnnouncement: UpdateAnnouncementTriggerType =
  function updateAnnouncement(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      if (!validateAnnouncement(dispatch, getState, data.announcement)) {
        return data.fail && data.fail();
      }

      try {
        const nAnnouncement: Announcement = Object.assign(
          {},
          data.announcement,
          data.update
        );
        await promisify(
          mApi().announcer.announcements.update(
            data.announcement.id,
            nAnnouncement
          ),
          "callback"
        )();

        const diff = moment(nAnnouncement.endDate).diff(moment(), "days");
        if (announcements.location !== "active" && diff >= 0) {
          if (data.cancelRedirect) {
            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              payload: data.announcement,
            });
            return;
          }
          location.hash = "#active";
        } else if (announcements.location !== "past" && diff < 0) {
          if (data.cancelRedirect) {
            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              payload: data.announcement,
            });
            return;
          }
          location.hash = "#past";
        } else {
          dispatch({
            type: "UPDATE_ONE_ANNOUNCEMENT",
            payload: {
              update: <Announcement>(
                await promisify(
                  mApi().announcer.announcements.read(data.announcement.id),
                  "callback"
                )()
              ),
              announcement: data.announcement,
            },
          });
        }
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.announcer.errormessage.updateAnnouncement"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * deleteAnnouncement
 * @param data data
 */
const deleteAnnouncement: DeleteAnnouncementTriggerType =
  function deleteAnnouncement(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        await promisify(
          mApi().announcer.announcements.del(data.announcement.id),
          "callback"
        )();
        dispatch({
          type: "DELETE_ANNOUNCEMENT",
          payload: data.announcement,
        });
        data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        data.fail();
      }
    };
  };

/**
 * deleteSelectedAnnouncements
 */
const deleteSelectedAnnouncements: DeleteSelectedAnnouncementsTriggerType =
  function deleteSelectedAnnouncements() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      await Promise.all(
        announcements.selected.map(async (announcement) => {
          try {
            await promisify(
              mApi().announcer.announcements.del(announcement.id),
              "callback"
            )();
            dispatch({
              type: "DELETE_ANNOUNCEMENT",
              payload: announcement,
            });
          } catch (err) {
            if (!(err instanceof MApiError)) {
              throw err;
            }
            dispatch(
              notificationActions.displayNotification(
                getState().i18n.text.get(
                  "plugin.announcer.errormessage.deleteAnnouncement"
                ),
                "error"
              )
            );
          }
        })
      );
    };
  };

/**
 * createAnnouncement
 * @param data data
 */
const createAnnouncement: CreateAnnouncementTriggerType =
  function createAnnouncement(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();
      const announcements: AnnouncementsState = state.announcements;

      if (!validateAnnouncement(dispatch, getState, data.announcement)) {
        return data.fail && data.fail();
      }

      try {
        await promisify(
          mApi().announcer.announcements.create(data.announcement),
          "callback"
        )();

        const diff = moment(data.announcement.endDate).diff(moment(), "days");
        if (announcements.location !== "active" && diff >= 0) {
          location.hash = "#active";
        } else if (announcements.location !== "past" && diff < 0) {
          location.hash = "#past";
        } else {
          //TODO why in the world the request to create the announcement does not return the created object?
          //I am forced to reload all the announcements due to being unable to know what was created
          dispatch(
            loadAnnouncements(
              announcements.location,
              announcements.workspaceId,
              true,
              true
            )
          );
        }
        data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.announcer.errormessage.createAnnouncement"
            ),
            "error"
          )
        );
        data.fail();
      }
    };
  };

/**
 * loadAnnouncementsAsAClient
 * @param options options
 * @param callback callback
 */
const loadAnnouncementsAsAClient: LoadAnnouncementsAsAClientTriggerType =
  function loadAnnouncementsFromServer(
    options = { hideWorkspaceAnnouncements: "false", loadUserGroups: true },
    callback
  ) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_STATE",
          payload: <AnnouncementsStateType>"LOADING",
        });

        const loadUserGroups = options.loadUserGroups;
        delete options.loadUserGroups;

        const announcements: Announcement[] = <Announcement[]>(
          await promisify(
            mApi().announcer.announcements.read(options),
            "callback"
          )()
        );
        if (loadUserGroups) {
          announcements.forEach((a) =>
            a.userGroupEntityIds.forEach((id) =>
              dispatch(loadUserGroupIndex(id))
            )
          );
        }

        const payload: AnnouncementsStatePatch = {
          state: "READY",
          announcements,
          location: null,
          selected: [],
          selectedIds: [],
        };

        //And there it goes
        dispatch({
          type: "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES",
          payload,
        });

        callback && callback(announcements);
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.announcer.errormessage.loadAnnouncements"
            ),
            "error"
          )
        );
      }
    };
  };

export {
  loadAnnouncements,
  addToAnnouncementsSelected,
  removeFromAnnouncementsSelected,
  updateAnnouncement,
  loadAnnouncement,
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  loadAnnouncementsAsAClient,
};
export default {
  loadAnnouncements,
  addToAnnouncementsSelected,
  removeFromAnnouncementsSelected,
  updateAnnouncement,
  loadAnnouncement,
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
  loadAnnouncementsAsAClient,
};
