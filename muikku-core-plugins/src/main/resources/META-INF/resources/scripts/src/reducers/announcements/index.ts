import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { Announcement } from "~/generated/client";

/**
 * AnnouncerNavigationItemType
 */
export interface AnnouncerNavigationItemType {
  location: string;
  id: string | number;
  icon: string;
  color?: string;
  text: string;
}

export type AnnouncerNavigationItemListType =
  Array<AnnouncerNavigationItemType>;

const defaultNavigation: AnnouncerNavigationItemListType = [
  {
    location: "active",
    id: "active",
    icon: "folder",
    text: "active",
  },
  {
    location: "expired",
    id: "expired",
    icon: "folder",
    text: "expired",
  },
  {
    location: "own",
    id: "own",
    icon: "folder",
    text: "own",
  },
  {
    location: "archived",
    id: "archived",
    icon: "trash-alt",
    text: "archived",
  },
];

export type AnnouncementsStateType = "LOADING" | "ERROR" | "READY";

/**
 * AnnouncementsState
 */
export interface AnnouncementsState {
  state: AnnouncementsStateType;
  announcements: Announcement[];
  current: Announcement;
  selected: Announcement[];
  selectedIds: Array<number>;
  location: string;
  toolbarLock: boolean;
  navigation: AnnouncerNavigationItemListType;
  workspaceId?: number;
}

/**
 * AnnouncementsStatePatch
 */
export interface AnnouncementsStatePatch {
  state?: AnnouncementsStateType;
  announcements?: Announcement[];
  current?: Announcement;
  selected?: Announcement[];
  selectedIds?: Array<number>;
  location?: string;
  toolbarLock?: boolean;
  navigation?: AnnouncerNavigationItemListType;
  workspaceId?: number;
}

/**
 * initialAnnouncementsState
 */
const initialAnnouncementsState: AnnouncementsState = {
  state: "LOADING",
  announcements: [],
  current: null,
  selected: [],
  selectedIds: [],
  location: "",
  toolbarLock: false,
  navigation: defaultNavigation,
  workspaceId: null,
};

/**
 * Reducer function for announcements
 *
 * @param state state
 * @param action action
 * @returns State of announcements
 */
export const announcements: Reducer<AnnouncementsState> = (
  state = initialAnnouncementsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_ANNOUNCEMENTS":
      return { ...state, announcements: action.payload };

    case "UPDATE_ANNOUNCEMENTS_STATE":
      return { ...state, state: action.payload };

    case "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES": {
      const newAllProperties: AnnouncementsStatePatch = action.payload;
      return Object.assign({}, state, newAllProperties);
    }

    case "UPDATE_SELECTED_ANNOUNCEMENTS":
      return {
        ...state,
        selected: action.payload,
        selectedIds: action.payload.map((s: Announcement) => s.id),
      };

    case "ADD_TO_ANNOUNCEMENTS_SELECTED":
      return {
        ...state,
        selected: state.selected.concat([action.payload]),
        selectedIds: state.selectedIds.concat([action.payload.id]),
      };

    case "REMOVE_FROM_ANNOUNCEMENTS_SELECTED":
      return {
        ...state,
        selected: state.selected.filter(
          (selected: Announcement) => selected.id !== action.payload.id
        ),
        selectedIds: state.selectedIds.filter(
          (id: number) => id !== action.payload.id
        ),
      };

    case "UPDATE_ONE_ANNOUNCEMENT": {
      const update = action.payload.update;
      const oldAnnouncement = action.payload.announcement;
      const newAnnouncement = Object.assign(
        {},
        oldAnnouncement,
        update
      ) as Announcement;

      let newCurrent = state.current;
      if (newCurrent && newCurrent.id === newAnnouncement.id) {
        newCurrent = newAnnouncement;
      }

      return {
        ...state,
        selected: state.selected.map((selected: Announcement) => {
          if (selected.id === oldAnnouncement.id) {
            return newAnnouncement;
          }
          return selected;
        }),
        announcements: state.announcements.map((announcement: Announcement) => {
          if (announcement.id === oldAnnouncement.id) {
            return newAnnouncement;
          }
          return announcement;
        }),
        current: newCurrent,
      };
    }
    case "LOCK_TOOLBAR":
      return { ...state, toolbarLock: true };

    case "UNLOCK_TOOLBAR":
      return { ...state, toolbarLock: false };

    case "DELETE_ANNOUNCEMENT":
      return {
        ...state,
        selected: state.selected.filter(
          (selected: Announcement) => selected.id !== action.payload.id
        ),
        announcements: state.announcements.filter(
          (announcement: Announcement) => announcement.id !== action.payload.id
        ),
        selectedIds: state.selectedIds.filter(
          (id: number) => id !== action.payload.id
        ),
      };

    case "SET_CURRENT_ANNOUNCEMENT":
      return { ...state, current: action.payload };

    default:
      return state;
  }
};
