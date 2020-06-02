import notificationActions from '~/actions/base/notifications';

import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';

import {AnyActionType} from '~/actions';
import { StateType } from '~/reducers';
import { WorkspacesActiveFiltersType, WorkspacesType, WorkspacesStateType, WorkspacesPatchType, WorkspaceType, WorkspaceListType, WorkspaceJournalListType } from '~/reducers/workspaces';

//HELPERS
const MAX_LOADED_AT_ONCE = 26;
const MAX_JOURNAL_LOADED_AT_ONCE = 10;

export async function loadWorkspacesHelper(filters:WorkspacesActiveFiltersType | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  let state: StateType = getState();
  let workspaces:WorkspacesType = state.workspaces;
  let hasEvaluationFees:boolean = state.userIndex &&
    state.userIndex.usersBySchoolData[state.status.userSchoolDataIdentifier] &&
    state.userIndex.usersBySchoolData[state.status.userSchoolDataIdentifier].hasEvaluationFees

  //Avoid loading courses again for the first time if it's the same location
  if (initial && filters === workspaces.activeFilters && workspaces.state === "READY"){
    return;
  }

  let actualFilters = filters || workspaces.activeFilters;

  let workspacesNextstate:WorkspacesStateType;
  //If it's for the first time
  if (initial){
    //We set this state to loading
    workspacesNextstate = "LOADING";
  } else {
    //Otherwise we are loading more
    workspacesNextstate = "LOADING_MORE";
  }

  let newWorkspacesPropsWhileLoading:WorkspacesPatchType = {
    state: workspacesNextstate,
    activeFilters: actualFilters
  }

  dispatch({
    type: "UPDATE_WORKSPACES_ALL_PROPS",
    payload: newWorkspacesPropsWhileLoading
  });

  //Generate the api query, our first result in the messages that we have loaded
  let firstResult = initial ? 0 : workspaces.availableWorkspaces.length + 1;
  //We only concat if it is not the initial, that means adding to the next messages
  let concat = !initial;
  let maxResults = MAX_LOADED_AT_ONCE + 1;
  let search = actualFilters.query;

  let myWorkspaces = false;
  let includeUnpublished = false;

  if (actualFilters.baseFilter === "MY_COURSES"){
    myWorkspaces = true;
  } else if (actualFilters.baseFilter === "AS_TEACHER"){
    myWorkspaces = true;
    includeUnpublished = true;
  }

  let params = {
    firstResult,
    maxResults,
    orderBy: "alphabet",
    myWorkspaces,
    educationTypes: actualFilters.educationFilters,
    curriculums: actualFilters.curriculumFilters,
    organizations: actualFilters.organizationFilters,
    includeUnpublished
  }

  if (actualFilters.query){
    (params as any).q = actualFilters.query;
  }

  try {
    let nWorkspaces:WorkspaceListType = <WorkspaceListType>await promisify(mApi().coursepicker.workspaces.cacheClear().read(params), 'callback')();

    //TODO why in the world does the server return nothing rather than an empty array?
    //remove this hack fix the server side
    nWorkspaces = nWorkspaces || [];
    let hasMore:boolean = nWorkspaces.length === MAX_LOADED_AT_ONCE + 1;

    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualWorkspaces = nWorkspaces.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualWorkspaces.pop();
    }

    //Create the payload for updating all the coursepicker properties
    if (hasEvaluationFees){
      actualWorkspaces = await Promise.all(actualWorkspaces.map(async (workspace)=>{
        return Object.assign(workspace, {
          feeInfo: await promisify(mApi().workspace.workspaces.feeInfo.read(workspace.id), 'callback')()
        });
      }));
    }

    let payload:WorkspacesPatchType = {
      state: "READY",
      availableWorkspaces: (concat ? workspaces.availableWorkspaces.concat(actualWorkspaces) : actualWorkspaces),
      hasMore
    }

    //And there it goes
    dispatch({
      type: "UPDATE_WORKSPACES_ALL_PROPS",
      payload
    });
  } catch (err){
    if (!(err instanceof MApiError)){
      throw err;
    }
    //Error :(
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.courseLoad"), 'error'));
    dispatch({
      type: "UPDATE_WORKSPACES_STATE",
      payload: <WorkspacesStateType>"ERROR"
    });
  }
}

export async function loadCurrentWorkspaceJournalsHelper(userEntityId:number | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  let state: StateType = getState();
  let currentWorkspace = state.workspaces.currentWorkspace;

  //Avoid loading again for the first time
  //THIS DOES NOT WORK AND IT PREVENTS THE SELECTION OF SINGLE STUDENT'S JOURNAL
  //if (initial && userEntityId === userEntityId && currentWorkspace.journals && currentWorkspace.journals.state === "READY"){
  //  return;
  //}

  let actualUserEntityId = userEntityId || currentWorkspace.journals && currentWorkspace.journals.userEntityId || null;

  let journalNextstate:WorkspacesStateType;
  //If it's for the first time
  if (initial){
    //We set this state to loading
    journalNextstate = "LOADING";
  } else {
    //Otherwise we are loading more
    journalNextstate = "LOADING_MORE";
  }

  dispatch({
    type: "UPDATE_WORKSPACE",
    payload: {
      original: currentWorkspace,
      update: {
        journals: {
          journals: currentWorkspace.journals ? currentWorkspace.journals.journals : [],
          hasMore: (currentWorkspace.journals && currentWorkspace.journals.hasMore) || false,
          userEntityId,
          state: journalNextstate
        }
      }
    }
  });

  let workspaceId = currentWorkspace.id;

  let params:any = {
    firstResult: initial ? 0 : (currentWorkspace.journals && currentWorkspace.journals.journals.length || 0),
    maxResults: MAX_JOURNAL_LOADED_AT_ONCE + 1
  }

  if (userEntityId){
    params.userEntityId = userEntityId;
  }

  try {
    let journals:WorkspaceJournalListType =
      <WorkspaceJournalListType>await promisify(mApi().workspace.workspaces.journal.read(workspaceId, params), 'callback')();

    //update current workspace again in case
    currentWorkspace = getState().workspaces.currentWorkspace;

    let hasMore:boolean = journals.length === MAX_LOADED_AT_ONCE + 1;

    let actualJournals = journals.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualJournals.pop();
    }

    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: {
        original: currentWorkspace,
        update: {
          journals: {
            journals: actualJournals,
            hasMore,
            userEntityId,
            state: <WorkspacesStateType>"READY"
          }
        }
      }
    });
  } catch (err){
    if (!(err instanceof MApiError)){
      throw err;
    }
    //update current workspace again in case
    currentWorkspace = getState().workspaces.currentWorkspace;

    //Error :(
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.workspace.journal.notification.viewLoadError"), 'error'));
    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: {
        original: currentWorkspace,
        update: {
          journals: {
            journals: currentWorkspace.journals ? currentWorkspace.journals.journals : [],
            hasMore: (currentWorkspace.journals && currentWorkspace.journals.hasMore) || false,
            userEntityId,
            state: <WorkspacesStateType>"ERROR"
          }
        }
      }
    });
  }
}