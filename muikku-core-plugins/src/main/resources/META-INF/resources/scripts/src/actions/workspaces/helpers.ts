import notificationActions from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  WorkspacesActiveFiltersType,
  WorkspacesState,
  WorkspacesStateType,
  WorkspacesStatePatch,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { ReducerStateType } from "~/reducers/workspaces/journals";
import i18n from "~/locales/i18n";
import { loadWorkspaceJournalFeedback } from "./journals";
import MApi, { isMApiError } from "~/api/api";
import { Action, Dispatch } from "redux";

//HELPERS
const MAX_LOADED_AT_ONCE = 26;
const MAX_JOURNAL_LOADED_AT_ONCE = 10;

/**
 * loadWorkspacesHelper
 * @param filters filters
 * @param initial initial
 * @param refresh refresh
 * @param loadOrganizationWorkspaces loadOrganizationWorkspaces
 * @param dispatch dispatch
 * @param getState getState
 */
export async function loadWorkspacesHelper(
  filters: WorkspacesActiveFiltersType | null,
  initial: boolean,
  refresh: boolean,
  loadOrganizationWorkspaces: boolean,
  dispatch,
  getState
) {
  const state: StateType = getState();

  // This "WorkspacesState" annoys me. It's used in the organization workspaces,
  // which have type "OrganizationWorkspacesType",
  // which at this point is not conflicting, but the "OrganizationWorkspacesType" is different - less attributes.
  // I cannot find any bugs or disadvantages in my testing.

  let workspaces: WorkspacesState = state.workspaces;

  if (loadOrganizationWorkspaces === true) {
    workspaces = state.organizationWorkspaces;
  }

  // Avoid loading courses again for the first time if it's the same location

  if (
    initial &&
    filters === workspaces.activeFilters &&
    workspaces.state === "READY" &&
    !refresh
  ) {
    return;
  }

  const actualFilters = filters || workspaces.activeFilters;

  let workspacesNextstate: WorkspacesStateType;

  //If it's for the first time

  if (initial) {
    //We set this state to loading
    workspacesNextstate = "LOADING";
  } else {
    //Otherwise we are loading more
    workspacesNextstate = "LOADING_MORE";
  }

  const newWorkspacesPropsWhileLoading: WorkspacesStatePatch = {
    state: workspacesNextstate,
    activeFilters: actualFilters,
  };

  if (!loadOrganizationWorkspaces === true) {
    dispatch({
      type: "UPDATE_WORKSPACES_ALL_PROPS",
      payload: newWorkspacesPropsWhileLoading,
    });
  } else {
    dispatch({
      type: "UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS",
      payload: newWorkspacesPropsWhileLoading,
    });
  }

  //Generate the api query, our first result in the messages that we have loaded
  const firstResult = initial ? 0 : workspaces.availableWorkspaces.length;
  //We only concat if it is not the initial, that means adding to the next messages
  const concat = !initial;
  const maxResults = MAX_LOADED_AT_ONCE + 1;
  let myWorkspaces = false;
  let publicity = "ONLY_PUBLISHED";

  // When base filter is 'My courses'
  if (actualFilters.baseFilter === "MY_COURSES") {
    myWorkspaces = true;
    // When base filter is 'Unpublished'
  } else if (actualFilters.baseFilter === "UNPUBLISHED") {
    publicity = "ONLY_UNPUBLISHED";
    // When state filter has unpublished and published selected (this is possible in organization management)
  } else if (
    loadOrganizationWorkspaces &&
    actualFilters.stateFilters &&
    actualFilters.stateFilters.includes("PUBLISHED") &&
    actualFilters.stateFilters.includes("UNPUBLISHED")
  ) {
    publicity = "LIST_ALL";
    // When state filter has only unpublished selected (this is possible in organization management)
  } else if (
    loadOrganizationWorkspaces &&
    actualFilters.stateFilters &&
    actualFilters.stateFilters.includes("UNPUBLISHED")
  ) {
    publicity = "ONLY_UNPUBLISHED";
    // When state filter has only published selected (this is possible in organization management)
  } else if (
    loadOrganizationWorkspaces &&
    actualFilters.stateFilters &&
    actualFilters.stateFilters.includes("PUBLISHED")
  ) {
    publicity = "ONLY_PUBLISHED";
  } else if (loadOrganizationWorkspaces) {
    publicity = "LIST_ALL";
  }

  let params = {};

  // If we are loading workspaces within organization management
  // then we use different set of params so front-end follows back-end's specs

  // NOTE: empty arrays as parameters are not supported by the backend, so we need to
  // send undefined instead of empty array. Empty array is resolved as ERROR by the backend.
  if (loadOrganizationWorkspaces) {
    params = {
      firstResult,
      maxResults,
      orderBy: "alphabet",
      templates: actualFilters.templates || undefined,
      educationTypes: actualFilters.educationFilters.length
        ? actualFilters.educationFilters
        : undefined,
      curriculums: actualFilters.curriculumFilters.length
        ? actualFilters.curriculumFilters
        : undefined,
      organizations: actualFilters.organizationFilters.length
        ? actualFilters.organizationFilters
        : undefined,
      publicity,
    };
  } else {
    params = {
      firstResult,
      maxResults,
      orderBy: "alphabet",
      myWorkspaces,
      educationTypes: actualFilters.educationFilters.length
        ? actualFilters.educationFilters
        : undefined,
      curriculums: actualFilters.curriculumFilters.length
        ? actualFilters.curriculumFilters
        : undefined,
      organizations: actualFilters.organizationFilters.length
        ? actualFilters.organizationFilters
        : undefined,
      publicity,
    };
  }

  if (actualFilters.query) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params as any).q = actualFilters.query;
  }

  const coursepickerApi = MApi.getCoursepickerApi();
  const organizationApi = MApi.getOrganizationApi();

  try {
    // NOTE: Still using old WorkspaceType for now, because frontend is not ready for the path
    // specific types yet. This will be changed in the future.
    let nWorkspaces: WorkspaceDataType[] = loadOrganizationWorkspaces
      ? await organizationApi.getOrganizationWorkspaces(params)
      : await coursepickerApi.getCoursepickerWorkspaces({
          ...params,
        });

    //TODO why in the world does the server return nothing rather than an empty array?
    //remove this hack fix the server side
    nWorkspaces = nWorkspaces || [];
    const hasMore: boolean = nWorkspaces.length === MAX_LOADED_AT_ONCE + 1;

    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    const actualWorkspaces = nWorkspaces.concat([]);
    if (hasMore) {
      //we got to get rid of that extra loaded message
      actualWorkspaces.pop();
    }

    const payload: WorkspacesStatePatch = {
      state: "READY",
      availableWorkspaces: concat
        ? workspaces.availableWorkspaces.concat(actualWorkspaces)
        : actualWorkspaces,
      hasMore,
    };

    //And there it goes

    if (loadOrganizationWorkspaces === true) {
      dispatch({
        type: "UPDATE_ORGANIZATION_WORKSPACES_ALL_PROPS",
        payload,
      });
    } else {
      dispatch({
        type: "UPDATE_WORKSPACES_ALL_PROPS",
        payload,
      });
    }
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }

    //Error :(
    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.loadError", {
          ns: "workspace",
          context: "workspaces",
        }),
        "error"
      )
    );
    dispatch({
      type: "UPDATE_WORKSPACES_STATE",
      payload: <WorkspacesStateType>"ERROR",
    });
  }
}

/**
 * loadCurrentWorkspaceJournalsHelper
 * @param userEntityId userEntityId
 * @param initial initial
 * @param dispatch dispatch
 * @param getState getState
 */
export async function loadCurrentWorkspaceJournalsHelper(
  userEntityId: number | null,
  initial: boolean,
  dispatch,
  getState
) {
  const workspaceApi = MApi.getWorkspaceApi();

  const state = getState();
  const currentWorkspace = state.workspaces.currentWorkspace;

  let currentJournalState = state.journals;
  let journalNextstate: ReducerStateType;
  //If it's for the first time
  if (initial) {
    //We set this state to loading
    journalNextstate = "LOADING";
  } else {
    //Otherwise we are loading more
    journalNextstate = "LOADING_MORE";
  }

  const currentJournalsList = currentJournalState.journals
    ? currentJournalState.journals
    : [];

  dispatch({
    type: "JOURNALS_LOAD",
    payload: {
      original: currentJournalState,
      updated: {
        journals: currentJournalsList,
        hasMore: (currentJournalState && currentJournalState.hasMore) || false,
        userEntityId,
        // If user changes, we need to reset the commentsLoaded
        // because the commentsLoaded holds user based data which is not relevant anymore
        commentsLoaded:
          userEntityId === currentJournalState.userEntityId
            ? currentJournalState.commentsLoaded
            : [],
        // Same as above, but for currentJournal
        currentJournal:
          userEntityId === currentJournalState.userEntityId
            ? currentJournalState.currentJournal
            : null,
        state: journalNextstate,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    firstResult: initial
      ? 0
      : (currentJournalState && currentJournalState.journals.length) || 0,
    maxResults: MAX_JOURNAL_LOADED_AT_ONCE + 1,
  };

  if (userEntityId) {
    params.userEntityId = userEntityId;
  }

  try {
    const journals = await workspaceApi.getWorkspaceJournals({
      workspaceId: currentWorkspace.id,
      firstResult: params.firstResult,
      maxResults: params.maxResults,
      userEntityId: params.userEntityId,
    });

    //update current workspace again in case
    currentJournalState = getState().journals;

    const concat = !initial;
    const hasMore: boolean = journals.length === MAX_JOURNAL_LOADED_AT_ONCE + 1;

    const actualJournals = journals.concat([]);
    if (hasMore) {
      //we got to get rid of that extra loaded message
      actualJournals.pop();
    }

    dispatch({
      type: "JOURNALS_LOAD",
      payload: {
        original: currentJournalState,
        updated: {
          journals: concat
            ? currentJournalState.journals.concat(actualJournals)
            : actualJournals,
          hasMore,
          userEntityId,
          state: "READY",
        },
      },
    });

    // when loading journals for the first time is done, we also want to load user's
    // journal feedback if that exists
    initial &&
      dispatch(
        loadWorkspaceJournalFeedback({
          userEntityId: state.status.userId,
          workspaceEntityId: currentWorkspace.id,
        })
      );
  } catch (err) {
    if (!isMApiError(err)) {
      throw err;
    }
    //update current workspace again in case
    currentJournalState = getState().journals;

    //Error :(
    dispatch(
      notificationActions.displayNotification(
        i18n.t("notifications.loadError", {
          ns: "journal",
          context: "entries",
        }),
        "error"
      )
    );
    dispatch({
      type: "JOURNALS_LOAD",
      payload: {
        original: currentJournalState,
        updated: {
          journals: currentJournalState.journals
            ? currentJournalState.journals
            : [],
          hasMore:
            (currentJournalState && currentJournalState.hasMore) || false,
          userEntityId,
          state: "ERROR",
        },
      },
    });
  }
}

/**
 * reuseExistantValue
 * @param conditional conditional
 * @param existantValue existantValue
 * @param otherwise otherwise
 */
export function reuseExistantValue(
  conditional: boolean,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  existantValue: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherwise: () => any
) {
  if (!conditional) {
    return null;
  }
  if (existantValue) {
    return existantValue;
  }

  return otherwise();
}
