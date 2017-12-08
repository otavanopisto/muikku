import notificationActions from '~/actions/base/notifications';

import promisify from '~/util/promisify';
import mApi from '~/lib/mApi';

import {AnyActionType} from '~/actions';
import { CousePickerCoursesFilterType, CoursePickerCoursesType, CoursePickerCoursesStateType, CoursePickerCourseListType, CoursePickerCoursesPatchType } from '~/reducers/main-function/coursepicker/coursepicker-courses';

//HELPERS
const MAX_LOADED_AT_ONCE = 26;

export async function loadCoursesHelper(filters:CousePickerCoursesFilterType | null, initial:boolean, dispatch:(arg:AnyActionType)=>any, getState:()=>any){
  let state = getState();
  let coursepickerCourses:CoursePickerCoursesType = state.coursepickerCourses;
  
  //Avoid loading courses again for the first time if it's the same location
  if (initial && filters === coursepickerCourses.filters && coursepickerCourses.state === "READY"){
    return;
  }
  
  let actualFilters = filters || coursepickerCourses.filters;
  
  //If it's for the first time
  if (initial){
    //We set this state to loading
    dispatch({
      type: "UPDATE_COURSEPICKER_COURSES_STATE",
      payload: <CoursePickerCoursesStateType>"LOADING"
    });
  } else {
    //Otherwise we are loading more
    dispatch({
      type: "UPDATE_COURSEPICKER_COURSES_STATE",
      payload: <CoursePickerCoursesStateType>"LOADING_MORE"
    });
  }
  
  //Generate the api query, our first result in the messages that we have loaded
  let firstResult = initial ? 0 : coursepickerCourses.courses.length + 1;
  //We only concat if it is not the initial, that means adding to the next messages
  let concat = !initial;
  let maxResults = MAX_LOADED_AT_ONCE + 1;
  let search = actualFilters.query;
  
  let params = {
    firstResult,
    maxResults,
    orderBy: "alphabet",
    myWorkspaces: false,
    educationTypes: actualFilters.educationFilters,
    curriculums: actualFilters.curriculumFilters
  }
  
  try {
    let courses:CoursePickerCourseListType = <CoursePickerCourseListType>await promisify(mApi().coursepicker.workspaces.cacheClear().read(params), 'callback')();
    let hasMore:boolean = courses.length === MAX_LOADED_AT_ONCE + 1;
    
    //This is because of the array is actually a reference to a cached array
    //so we rather make a copy otherwise you'll mess up the cache :/
    let actualCourses = courses.concat([]);
    if (hasMore){
      //we got to get rid of that extra loaded message
      courses.pop();
    }
    
    //Create the payload for updating all the communicator properties
    let payload:CoursePickerCoursesPatchType = {
      state: "READY",
      courses: (concat ? coursepickerCourses.courses.concat(actualCourses) : actualCourses),
      hasMore,
      filters: actualFilters
    }
    
    //And there it goes
    dispatch({
      type: "UPDATE_COURSEPICKER_COURSES_ALL_PROPS",
      payload
    });
  } catch (err){
    //Error :(
    dispatch(notificationActions.displayNotification(err.message, 'error'));
    dispatch({
      type: "UPDATE_COURSEPICKER_COURSES_STATE",
      payload: <CoursePickerCoursesStateType>"ERROR"
    });
  }
}