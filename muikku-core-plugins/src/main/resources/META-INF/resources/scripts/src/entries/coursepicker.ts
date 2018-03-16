import App from '~/containers/coursepicker';
import reducer from '~/reducers/coursepicker';
import runApp from '~/run';
import {Action} from 'redux';
import mainFunctionDefault from '~/util/base-main-function';

import * as queryString from 'query-string';

import titleActions from '~/actions/base/title';
import { loadUserIndexBySchoolData } from '~/actions/main-function/user-index';
import { loadCoursesFromServer, loadAvaliableEducationFiltersFromServer, loadAvaliableCurriculumFiltersFromServer } from '~/actions/main-function/courses';
import { UserType } from 'reducers/main-function/user-index';
import { CoursesActiveFiltersType } from '~/reducers/main-function/courses';

let store = runApp(reducer, App);
mainFunctionDefault(store);
store.dispatch(titleActions.updateTitle(store.getState().i18n.text.get('TODO coursepicker title')));
store.dispatch(<Action>loadAvaliableEducationFiltersFromServer());
store.dispatch(<Action>loadAvaliableCurriculumFiltersFromServer());

function loadLocation(originalData: any){
  let filters:CoursesActiveFiltersType = {
    educationFilters: originalData.e || [],
    curriculumFilters: originalData.c || [],
    query: originalData.q || null,
    baseFilter: originalData.b || "ALL_COURSES"
  }
  store.dispatch(<Action>loadCoursesFromServer(filters));
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
      c: [user.curriculumIdentifier]
    }, {arrayFormat: 'bracket'});
  } else if (!currentLocationHasData){
    loadLocation(currentLocationData);
  }
}));