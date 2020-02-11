import notificationActions from '~/actions/base/notifications';

import promisify from '~/util/promisify';
import mApi, { MApiError } from '~/lib/mApi';

import {AnyActionType} from '~/actions';
import { CoursesActiveFiltersType, CoursesStateType, WorkspaceCourseListType, CoursesPatchType, CoursesType } from '~/reducers/main-function/courses';
import { StateType } from '~/reducers';

//HELPERS
const MAX_LOADED_AT_ONCE = 26;

export async function loadCoursesHelper(filters:CoursesActiveFiltersType | null, organization:boolean, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>StateType){
  let state: StateType = getState();
  let courses:CoursesType = state.courses;
  let hasEvaluationFees:boolean = state.userIndex && 
    state.userIndex.usersBySchoolData[state.status.userSchoolDataIdentifier] &&
    state.userIndex.usersBySchoolData[state.status.userSchoolDataIdentifier].hasEvaluationFees
  
  //Avoid loading courses again for the first time if it's the same location
  if (initial && filters === courses.activeFilters && courses.state === "READY"){
    return;
  }
  
  let actualFilters = filters || courses.activeFilters;
  
  let coursepickerNextState:CoursesStateType;
  //If it's for the first time
  if (initial){
    //We set this state to loading
    coursepickerNextState = "LOADING";
  } else {
    //Otherwise we are loading more
    coursepickerNextState = "LOADING_MORE";
  }
  
  let newCoursesPropsWhileLoading:CoursesPatchType = {
    state: coursepickerNextState,
    activeFilters: actualFilters
  }
  
  dispatch({
    type: "UPDATE_COURSES_ALL_PROPS",
    payload: newCoursesPropsWhileLoading
  });
  
  //Generate the api query, our first result in the messages that we have loaded
  let firstResult = initial ? 0 : courses.courses.length + 1;
  //We only concat if it is not the initial, that means adding to the next messages
  let concat = !initial;
  let maxResults = MAX_LOADED_AT_ONCE + 1;
  
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
    
    let nCourses:WorkspaceCourseListType = organization == false ? <WorkspaceCourseListType>await promisify(mApi().coursepicker.workspaces.cacheClear().read(params), 'callback')() : <WorkspaceCourseListType>await promisify(mApi().organization.workspaces.cacheClear().read(params), 'callback')();
  
    //TODO why in the world does the server return nothing rather than an empty array?
    //remove this hack fix the server side
    nCourses = nCourses || [];
    let hasMore:boolean = nCourses.length === MAX_LOADED_AT_ONCE + 1;
    
    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualCourses = nCourses.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      actualCourses.pop();
    }
    
    //Create the payload for updating all the coursepicker properties
    if (hasEvaluationFees){
      actualCourses = await Promise.all(actualCourses.map(async (course)=>{
        return Object.assign(course, {
          feeInfo: await promisify(mApi().workspace.workspaces.feeInfo.read(course.id), 'callback')()
        });
      }));
    }
    
    let payload:CoursesPatchType = {
      state: "READY",
      courses: (concat ? courses.courses.concat(actualCourses) : actualCourses),
      hasMore
    }
    
    //And there it goes
    dispatch({
      type: "UPDATE_COURSES_ALL_PROPS",
      payload
    });
  } catch (err){
    if (!(err instanceof MApiError)){
      throw err;
    }
    //Error :(
    dispatch(notificationActions.displayNotification(getState().i18n.text.get("plugin.coursepicker.errormessage.courseLoad"), 'error'));
    dispatch({
      type: "UPDATE_COURSES_STATE",
      payload: <CoursesStateType>"ERROR"
    });
  }
}
