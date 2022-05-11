import { ActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import { Reducer } from "redux";

/**
 * AnnouncerNavigationItemType
 */
export interface AnnouncerNavigationItemType {
  location: string;
  id: string | number;
  icon: string;
  color?: string;
  /**
   * text
   */
  text(i18n: i18nType): string;
}

export type AnnouncerNavigationItemListType =
  Array<AnnouncerNavigationItemType>;

const defaultNavigation: AnnouncerNavigationItemListType = [
  {
    location: "active",
    id: "active",
    icon: "folder",
    /**
     * text
     * @param i18n i18n
     */
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.announcer.cat.active");
    },
  },
  {
    location: "past",
    id: "past",
    icon: "folder",
    /**
     * text
     * @param i18n i18n
     */
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.announcer.cat.past");
    },
  },
  {
    location: "mine",
    id: "mine",
    icon: "folder",
    /**
     * text
     * @param i18n i18n
     */
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.announcer.cat.mine");
    },
  },
  {
    location: "archived",
    id: "archived",
    icon: "trash-alt",
    /**
     * text
     * @param i18n i18n
     */
    text(i18n: i18nType): string {
      return i18n.text.get("plugin.announcer.cat.archived");
    },
  },
];

/**
 * AnnouncementType
 */
export interface AnnouncementType {
  archived: boolean;
  caption: string;
  content: string;
  created: string;
  endDate: string;
  id: number;
  publiclyVisible: boolean;
  publisherUserEntityId: number;
  startDate: string;
  temporalStatus: string;
  userGroupEntityIds: Array<number>;
  workspaceEntityIds: Array<number>;
  workspaces: Array<{
    id: number;
    urlName: string;
    name: string;
    nameExtension: string;
  }>;
}

/**
 * AnnouncementUpdateType
 */
export interface AnnouncementUpdateType {
  archived?: boolean;
  caption?: string;
  content?: string;
  created?: string;
  endDate?: string;
  publiclyVisible?: boolean;
  publisherUserEntityId?: number;
  startDate?: string;
  temporalStatus?: string;
  userGroupEntityIds?: Array<number>;
  workspaceEntityIds?: Array<number>;
  workspaces?: Array<{
    id: number;
    urlName: string;
    name: string;
    nameExtension: string;
  }>;
}

export type AnnouncementListType = Array<AnnouncementType>;

export type AnnouncementsStateType = "LOADING" | "ERROR" | "READY";

/**
 * AnnouncementsType
 */
export interface AnnouncementsType {
  state: AnnouncementsStateType;
  announcements: AnnouncementListType;
  current: AnnouncementType;
  selected: AnnouncementListType;
  selectedIds: Array<number>;
  location: string;
  toolbarLock: boolean;
  navigation: AnnouncerNavigationItemListType;
  workspaceId?: number;
}

/**
 * AnnouncementsPatchType
 */
export interface AnnouncementsPatchType {
  state?: AnnouncementsStateType;
  announcements?: AnnouncementListType;
  current?: AnnouncementType;
  selected?: AnnouncementListType;
  selectedIds?: Array<number>;
  location?: string;
  toolbarLock?: boolean;
  navigation?: AnnouncerNavigationItemListType;
  workspaceId?: number;
}

/**
 * initialAnnouncementsState
 */
const initialAnnouncementsState: AnnouncementsType = {
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
export const announcements: Reducer<AnnouncementsType> = (
  state = initialAnnouncementsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_ANNOUNCEMENTS":
      return { ...state, announcements: action.payload };

    case "UPDATE_ANNOUNCEMENTS_STATE":
      return { ...state, state: action.payload };

    case "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES": {
      const newAllProperties: AnnouncementsPatchType = action.payload;
      return Object.assign({}, state, newAllProperties);
    }

    case "UPDATE_SELECTED_ANNOUNCEMENTS":
      return {
        ...state,
        selected: action.payload,
        selectedIds: action.payload.map((s: AnnouncementType) => s.id),
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
          (selected: AnnouncementType) => selected.id !== action.payload.id
        ),
        selectedIds: state.selectedIds.filter(
          (id: number) => id !== action.payload.id
        ),
      };

    case "UPDATE_ONE_ANNOUNCEMENT": {
      const update: AnnouncementUpdateType = action.payload.update;
      const oldAnnouncement: AnnouncementType = action.payload.announcement;
      const newAnnouncement: AnnouncementType = Object.assign(
        {},
        oldAnnouncement,
        update
      );
      let newCurrent = state.current;
      if (newCurrent && newCurrent.id === newAnnouncement.id) {
        newCurrent = newAnnouncement;
      }

      return {
        ...state,
        selected: state.selected.map((selected: AnnouncementType) => {
          if (selected.id === oldAnnouncement.id) {
            return newAnnouncement;
          }
          return selected;
        }),
        announcements: state.announcements.map(
          (announcement: AnnouncementType) => {
            if (announcement.id === oldAnnouncement.id) {
              return newAnnouncement;
            }
            return announcement;
          }
        ),
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
          (selected: AnnouncementType) => selected.id !== action.payload.id
        ),
        announcements: state.announcements.filter(
          (announcement: AnnouncementType) =>
            announcement.id !== action.payload.id
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

/**
 * announcements
 * @param state state
 * @param action action
 */
/* export default function announcements(
  state: AnnouncementsType = {
    state: "LOADING",
    announcements: [],
    current: null,
    selected: [],
    selectedIds: [],
    location: "",
    toolbarLock: false,
    navigation: defaultNavigation,
    workspaceId: null,
  },
  action: ActionType
): AnnouncementsType {
  if (action.type === "UPDATE_ANNOUNCEMENTS") {
    return Object.assign({}, state, { announcements: action.payload });
  } else if (action.type === "UPDATE_ANNOUNCEMENTS_STATE") {
    const newState: AnnouncementsStateType = action.payload;
    return Object.assign({}, state, { state: newState });
  } else if (action.type === "UPDATE_ANNOUNCEMENTS_ALL_PROPERTIES") {
    const newAllProperties: AnnouncementsPatchType = action.payload;
    return Object.assign({}, state, newAllProperties);
  } else if (action.type === "UPDATE_SELECTED_ANNOUNCEMENTS") {
    const newAnnouncements: AnnouncementListType = action.payload;
    return Object.assign({}, state, {
      selected: newAnnouncements,
      selectedIds: newAnnouncements.map((s: AnnouncementType) => s.id),
    });
  } else if (action.type === "ADD_TO_ANNOUNCEMENTS_SELECTED") {
    const newAnnouncement: AnnouncementType = action.payload;
    return Object.assign({}, state, {
      selected: state.selected.concat([newAnnouncement]),
      selectedIds: state.selectedIds.concat([newAnnouncement.id]),
    });
  } else if (action.type === "REMOVE_FROM_ANNOUNCEMENTS_SELECTED") {
    return Object.assign({}, state, {
      selected: state.selected.filter(
        (selected: AnnouncementType) => selected.id !== action.payload.id
      ),
      selectedIds: state.selectedIds.filter(
        (id: number) => id !== action.payload.id
      ),
    });
  } else if (action.type === "UPDATE_ONE_ANNOUNCEMENT") {
    const update: AnnouncementUpdateType = action.payload.update;
    const oldAnnouncement: AnnouncementType = action.payload.announcement;
    const newAnnouncement: AnnouncementType = Object.assign(
      {},
      oldAnnouncement,
      update
    );
    let newCurrent = state.current;
    if (newCurrent && newCurrent.id === newAnnouncement.id) {
      newCurrent = newAnnouncement;
    }
    return Object.assign({}, state, {
      selected: state.selected.map((selected: AnnouncementType) => {
        if (selected.id === oldAnnouncement.id) {
          return newAnnouncement;
        }
        return selected;
      }),
      announcements: state.announcements.map(
        (announcement: AnnouncementType) => {
          if (announcement.id === oldAnnouncement.id) {
            return newAnnouncement;
          }
          return announcement;
        }
      ),
      current: newCurrent,
    });
  } else if (action.type === "LOCK_TOOLBAR") {
    return Object.assign({}, state, { toolbarLock: true });
  } else if (action.type === "UNLOCK_TOOLBAR") {
    return Object.assign({}, state, { toolbarLock: false });
  } else if (action.type === "DELETE_ANNOUNCEMENT") {
    return Object.assign({}, state, {
      selected: state.selected.filter(
        (selected: AnnouncementType) => selected.id !== action.payload.id
      ),
      announcements: state.announcements.filter(
        (announcement: AnnouncementType) =>
          announcement.id !== action.payload.id
      ),
      selectedIds: state.selectedIds.filter(
        (id: number) => id !== action.payload.id
      ),
    });
  } else if (action.type === "SET_CURRENT_ANNOUNCEMENT") {
    return Object.assign({}, state, { current: action.payload });
  }
  return state;
} */
