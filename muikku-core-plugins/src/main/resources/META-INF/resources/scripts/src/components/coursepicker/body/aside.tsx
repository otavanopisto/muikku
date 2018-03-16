import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import {CoursesType, CourseEducationFilterType, CourseCurriculumFilterType} from '~/reducers/main-function/courses';
import {StateType} from '~/reducers';

interface NavigationProps {
  i18n: i18nType,
  courses: CoursesType
}

interface NavigationState { 
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    return <div className="item-list item-list--aside-navigation">
      <span className="text item-list__topic">{this.props.i18n.text.get('plugin.coursepicker.filters.degree')}</span>
      {this.props.courses.avaliableFilters.educationTypes.map((educationType: CourseEducationFilterType)=>{
        let isActive = this.props.courses.activeFilters.educationFilters.includes(educationType.identifier);
        let hash = isActive ? 
            queryString.stringify(Object.assign({}, locationData, {e: (locationData.e || []).filter((i:string)=>i!==educationType.identifier)}), {arrayFormat: 'bracket'}) :
            queryString.stringify(Object.assign({}, locationData, {e: (locationData.e || []).concat(educationType.identifier)}), {arrayFormat: 'bracket'})
        return <Link key={educationType.identifier} className={`item-list__item ${isActive ? "active" : ""}`} href={"#?" + hash}>
          <span className="item-list__text-body text">
            {educationType.name}
          </span>
        </Link>
      })}      
      <span className="text item-list__topic">{this.props.i18n.text.get('plugin.coursepicker.filters.curriculum')}</span>
      {this.props.courses.avaliableFilters.curriculums.map((curriculum: CourseCurriculumFilterType)=>{
        let isActive = this.props.courses.activeFilters.curriculumFilters.includes(curriculum.identifier);
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

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    courses: state.courses
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);