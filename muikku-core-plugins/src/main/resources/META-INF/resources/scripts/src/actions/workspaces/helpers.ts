import notificationActions from "~/actions/base/notifications";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  WorkspacesActiveFiltersType,
  WorkspacesType,
  WorkspacesStateType,
  WorkspacesPatchType,
  WorkspaceListType,
} from "~/reducers/workspaces";
import {
  ReducerStateType,
  WorkspaceJournalType,
} from "~/reducers/workspaces/journals";
import { Dispatch } from "react";

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
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  const state: StateType = getState();

  // This "WorkspacesType" annoys me. It's used in the organization workspaces,
  // which have type "OrganizationWorkspacesType",
  // which at this point is not conflicting, but the "OrganizationWorkspacesType" is different - less attributes.
  // I cannot find any bugs or disadvantages in my testing.

  let workspaces: WorkspacesType = state.workspaces;

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

  const newWorkspacesPropsWhileLoading: WorkspacesPatchType = {
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
  if (loadOrganizationWorkspaces) {
    params = {
      firstResult,
      maxResults,
      orderBy: "alphabet",
      templates: actualFilters.templates,
      educationTypes: actualFilters.educationFilters,
      curriculums: actualFilters.curriculumFilters,
      organizations: actualFilters.organizationFilters,
      publicity,
    };
  } else {
    params = {
      firstResult,
      maxResults,
      orderBy: "alphabet",
      myWorkspaces,
      educationTypes: actualFilters.educationFilters,
      curriculums: actualFilters.curriculumFilters,
      organizations: actualFilters.organizationFilters,
      publicity,
    };
  }

  if (actualFilters.query) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (params as any).q = actualFilters.query;
  }

  try {
    let nWorkspaces: WorkspaceListType = loadOrganizationWorkspaces
      ? <WorkspaceListType>(
          await promisify(
            mApi()
              .organizationWorkspaceManagement.workspaces.cacheClear()
              .read(params),
            "callback"
          )()
        )
      : <WorkspaceListType>(
          await promisify(
            mApi().coursepicker.workspaces.cacheClear().read(params),
            "callback"
          )()
        );

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

    const payload: WorkspacesPatchType = {
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
    if (!(err instanceof MApiError)) {
      throw err;
    }
    //Error :(
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get("plugin.coursepicker.errormessage.courseLoad"),
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
  dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
  getState: () => StateType
) {
  const state: StateType = getState();
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
    const journals = (await promisify(
      mApi().workspace.workspaces.journal.read(currentWorkspace.id, params),
      "callback"
    )()) as WorkspaceJournalType[];

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
  } catch (err) {
    if (!(err instanceof MApiError)) {
      throw err;
    }
    //update current workspace again in case
    currentJournalState = getState().journals;

    //Error :(
    dispatch(
      notificationActions.displayNotification(
        getState().i18n.text.get(
          "plugin.workspace.journal.notification.viewLoadError"
        ),
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
  existantValue: any,
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
