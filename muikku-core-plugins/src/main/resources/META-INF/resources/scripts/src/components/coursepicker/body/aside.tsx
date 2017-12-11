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
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    return <div className="item-list item-list--aside-navigation">
      <span>TODO FIRST FILTERS LABEL</span>
      {this.props.coursepickerFilters.educationTypes.map((educationType: EducationFilterType)=>{
        let isActive = this.props.coursepickerCourses.filters.educationFilters.includes(educationType.identifier);
        let hash = isActive ? 
            queryString.stringify(Object.assign({}, locationData, {e: (locationData.e || []).filter((i:string)=>i!==educationType.identifier)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {e: (locationData.e || []).concat(educationType.identifier)}), {arrayFormat: 'bracket'})
        return <Link key={educationType.identifier} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
          <span className="item-list__text-body text">
            {educationType.name}
          </span>
        </Link>
      })}
      <span>TODO FIRST FILTERS LABEL</span>
      {this.props.coursepickerFilters.curriculums.map((curriculum: CurriculumFilterType)=>{
        let isActive = this.props.coursepickerCourses.filters.curriculumFilters.includes(curriculum.identifier);
        let hash = isActive ?
            queryString.stringify(Object.assign({}, locationData, {c: (locationData.c || []).filter((c:string)=>c!==curriculum.identifier)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {c: (locationData.c || []).concat(curriculum.identifier)}), {arrayFormat: 'bracket'});
        return <Link key={curriculum.identifier} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
          <span className="item-list__text-body text">
            {curriculum.name}
          </span>
        </Link>
      })}
   </div>
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