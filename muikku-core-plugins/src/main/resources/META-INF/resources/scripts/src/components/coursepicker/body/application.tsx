import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import ApplicationPanel from '~/components/general/application-panel';
import HoverButton from '~/components/general/hover-button';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import Toolbar from './application/toolbar';
import CoursepickerWorkspaces from './application/courses';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';
import '~/sass/elements/text.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/container.scss';
import { CoursepickerFiltersType, CoursePickerBaseFilterType } from '~/reducers/main-function/coursepicker/coursepicker-filters';
import { CoursePickerCoursesType } from '~/reducers/main-function/coursepicker/coursepicker-courses';

interface CoursepickerApplicationProps {
  aside: React.ReactElement<any>,
  i18n: i18nType,
  coursepickerFilters: CoursepickerFiltersType,
  coursepickerCourses: CoursePickerCoursesType
}

interface CoursepickerApplicationState {
}

class CommunicatorApplication extends React.Component<CoursepickerApplicationProps, CoursepickerApplicationState> {
  constructor(props: CoursepickerApplicationProps){
    super(props);
    
    this.onCoursepickerFilterChange = this.onCoursepickerFilterChange.bind(this);
  }

  onCoursepickerFilterChange(e: React.ChangeEvent<HTMLSelectElement>){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    locationData.b = e.target.value;
    window.location.hash = "#?" + queryString.stringify(locationData, {arrayFormat: 'bracket'});
  }
  
  render(){
    let filterTranslationString = {
      "ALL_COURSES": "plugin.coursepicker.allcourses",
      "MY_COURSES": "plugin.coursepicker.owncourses",
      "AS_TEACHER": "plugin.coursepicker.teachercourses"
    }
    
    let title = <h2 className="text text--application-title">{this.props.i18n.text.get('plugin.coursepicker.pageTitle')}</h2>
    let toolbar = <Toolbar/>
    let primaryOption = <select className="form-field__select form-field__select--primary-function" value={this.props.coursepickerCourses.filters.baseFilter} onChange={this.onCoursepickerFilterChange}>
      {this.props.coursepickerFilters.baseFilters.map((filter: CoursePickerBaseFilterType)=>{
        return <option key={filter} value={filter}>{this.props.i18n.text.get(filterTranslationString[filter])}</option> 
      })} 
    </select>
    
    return (<div className="container container--full">
      <ApplicationPanel modifier="coursepicker" toolbar={toolbar} title={title} asideBefore={this.props.aside} primaryOption={primaryOption}>
        <CoursepickerWorkspaces/>
      </ApplicationPanel>
    </div>);
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
)(CommunicatorApplication);