import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import {CoursepickerFiltersType,
  EducationFilterType,
  CurriculumFilterType} from '~/reducers/main-function/coursepicker/coursepicker-filters';
import { CoursePickerCoursesType } from '~/reducers/main-function/coursepicker/coursepicker-courses';

interface NavigationProps {
  i18n: i18nType,
  coursepickerFilters: CoursepickerFiltersType,
  coursepickerCourses: CoursePickerCoursesType
}

interface NavigationState {
  
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div/>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    coursepickerFilters: state.coursepickerFilters,
    coursepickerCourses: state.coursepickerCourses
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);