import notificationActions from '~/actions/base/notifications';
import equals = require("deep-equal");

import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';

import {AnyActionType} from '~/actions';
import { GuiderStudentsType, GuiderStudentsFilterType, GuiderStudentsStateType, GuiderStudentListType, GuiderStudentsPatchType } from '~/reducers/main-function/guider/guider-students';

//HELPERS
const MAX_LOADED_AT_ONCE = 25;

export async function loadStudentsHelper(filters:GuiderStudentsFilterType | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  dispatch({
    type: "SET_CURRENT_GUIDER_STUDENT",
    payload: null
  });
  
  let state = getState();
  let guiderStudents:GuiderStudentsType = state.guiderStudents;
  let flagOwnerIdentifier:string = state.status.userSchoolDataIdentifier;
  
  //Avoid loading courses again for the first time if it's the same location
  if (initial && equals(filters, guiderStudents.filters) && guiderStudents.state === "READY"){
    return;
  }
  
  let actualFilters = filters || guiderStudents.filters;
  
  let guiderStudentsNextState:GuiderStudentsStateType;
  //If it's for the first time
  if (initial){
    //We set this state to loading
    guiderStudentsNextState = "LOADING";
  } else {
    //Otherwise we are loading more
    guiderStudentsNextState = "LOADING_MORE";
  }
  
  dispatch({
    type: "UPDATE_GUIDER_STUDENTS_ALL_PROPS",
    payload: {
      state: guiderStudentsNextState,
      filters: actualFilters
    }
  });
  
  //Generate the api query, our first result in the messages that we have loaded
  let firstResult = initial ? 0 : guiderStudents.students.length + 1;
  //We only concat if it is not the initial, that means adding to the next messages
  let concat = !initial;
  let maxResults = MAX_LOADED_AT_ONCE + 1;
  let search = actualFilters.query;
  
  let params = {
    firstResult,
    maxResults,
    includeHidden: true,
    flags: actualFilters.labelFilters,
    workspaceIds: actualFilters.workspaceFilters,
    flagOwnerIdentifier
  }
  
  if (actualFilters.query){
    (params as any).searchString = actualFilters.query;
  }
  
  try {
    let students:GuiderStudentListType = <GuiderStudentListType>await promisify(mApi().user.students.cacheClear().read(params), 'callback')();
  
    //TODO why in the world does the server return nothing rather than an empty array?
    //remove this hack fix the server side
    students = students || [];
    let hasMore:boolean = students.length === MAX_LOADED_AT_ONCE + 1;
    
    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualStudents = students.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualStudents.pop();
    }
    
    //Create the payload for updating all the communicator properties
    let payload:GuiderStudentsPatchType = {
      state: "READY",
      students: (concat ? guiderStudents.students.concat(actualStudents) : actualStudents),
      hasMore
    }
    
    //And there it goes
    dispatch({
      type: "UPDATE_GUIDER_STUDENTS_ALL_PROPS",
      payload
    });
  } catch (err){
    //Error :(
    dispatch(notificationActions.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_GUIDER_STUDENTS_STATE",
      payload: <GuiderStudentsStateType>"ERROR"
    });
  }
}