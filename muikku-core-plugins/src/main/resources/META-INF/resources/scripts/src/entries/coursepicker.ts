import App from '~/containers/coursepicker';
import reducer from '~/reducers/coursepicker';
import runApp from '~/run';
import {Action} from 'redux';
import mainFunctionDefault from '~/util/base-main-function';

import * as queryString from 'query-string';

import actions from '~/actions/main-function';
import titleActions from '~/actions/base/title';
import { loadUserIndexBySchoolData } from '~/actions/main-function/user-index';
import { updateEducationFilters, updateCurriculumFilters } from '~/actions/main-function/coursepicker/coursepicker-filters';
import { CousePickerCoursesFilterType } from '~/reducers/main-function/coursepicker/coursepicker-courses';
import { loadCourses } from '~/actions/main-function/coursepicker/coursepicker-courses';
import { UserType } from 'reducers/main-function/user-index';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('TODO coursepicker title')));
store.dispatch(<Action>updateEducationFilters());
store.dispatch(<Action>updateCurriculumFilters());

function loadLocation(originalData: any){
  let filters:CousePickerCoursesFilterType = {
    "educationFilters": originalData.e || [],
    "curriculumFilters": originalData.c || [],
    "query": originalData.q || null,
    "baseFilter": originalData.b || "ALL_COURSES"
  }
  store.dispatch(<Action>loadCourses(filters));
}

window.addEventListener("hashchange", ()=>{
  loadLocation(queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'}));
}, false);

let currentLocationData = queryString.parse(window.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
let currentLocationHasData = Object.keys(currentLocationData).length;
if (currentLocationHasData){
  loadLocation(currentLocationData);
}

store.dispatch(<Action>loadUserIndexBySchoolData(store.getState().status.userSchoolDataIdentifier, (user:UserType)=>{
  if (!currentLocationHasData && user.curriculumIdentifier){
    location.hash = "#?" + queryString.stringify({
      c: user.curriculumIdentifier
    }, {arrayFormat: 'bracket'});
  } else if (!currentLocationHasData){
    loadLocation(currentLocationData);
  }
}));