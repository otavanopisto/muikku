import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { Announcement, AnnouncementCategory } from "~/generated/client";

/**
 * AnnouncerNavigationItemType
 */
export interface AnnouncerNavigationItemType {
  location: string;
  id: string | number;
  type: "folder" | "label" | "category";
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
    type: "folder",
    icon: "folder",
    text: "active",
  },
  {
    location: "unread",
    id: "unread",
    type: "folder",
    icon: "folder",
    text: "unread",
  },
  {
    location: "expired",
    id: "expired",
    type: "folder",
    icon: "folder",
    text: "expired",
  },
  {
    location: "own",
    id: "own",
    type: "folder",
    icon: "folder",
    text: "own",
  },
  {
    location: "archived",
    id: "archived",
    type: "folder",
    icon: "trash-alt",
    text: "archived",
  },
];
defaultNavigation;
export type AnnouncementsStateType =
  | "LOADING"
  | "ERROR"
  | "READY"
  | "LOADING_MORE";

/**
 * AnnouncementsState
 */
export interface AnnouncementsState {
  state: AnnouncementsStateType;
  announcements: Announcement[];
  unreadCount: number;
  current: Announcement;
  selected: Announcement[];
  selectedIds: Array<number>;
  categories: AnnouncementCategory[];
  location: string;
  toolbarLock: boolean;
  navigation: AnnouncerNavigationItemListType;
  workspaceId?: number;
  hasMore: boolean;
}

/**
 * AnnouncementsStatePatch
 */
export interface AnnouncementsStatePatch {
  categories?: AnnouncementCategory[];
  state?: AnnouncementsStateType;
  announcements?: Announcement[];
  unreadCount?: number;
  current?: Announcement;
  selected?: Announcement[];
  selectedIds?: Array<number>;
  location?: string;
  toolbarLock?: boolean;
  navigation?: AnnouncerNavigationItemListType;
  workspaceId?: number;
  hasMore?: boolean;
}

/**
 * initialAnnouncementsState
 */
const initialAnnouncementsState: AnnouncementsState = {
  state: "LOADING",
  announcements: [],
  unreadCount: 0,
  current: null,
  selected: [],
  selectedIds: [],
  location: "",
  toolbarLock: false,
  categories: [],
  navigation: defaultNavigation,
  workspaceId: null,
  hasMore: false,
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

    case "UPDATE_ANNOUNCEMENTS_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };

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
    case "ADD_ANNOUNCEMENT_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };

    case "DELETE_ANNOUNCEMENT_CATEGORY": {
      const categories = [...state.categories];
      categories.splice(
        categories.findIndex((category) => category.id === action.payload),
        1
      );
      return {
        ...state,
        categories,
      };
    }

    case "UPDATE_ANNOUNCEMENT_CATEGORY": {
      const categories = [...state.categories];
      const categoryToUpdateIndex = categories.findIndex(
        (category) => category.id === action.payload.id
      );
      if (categoryToUpdateIndex !== -1) {
        categories[categoryToUpdateIndex] = action.payload;
      }
      return {
        ...state,
        categories,
      };
    }

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
