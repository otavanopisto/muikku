import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import { CoursePickerCoursesType } from '~/reducers/main-function/coursepicker/coursepicker-courses';

interface CoursepickerToolbarProps {
  i18n: i18nType,
  coursepickerCourses: CoursePickerCoursesType
}

interface CoursepickerToolbarState {
  searchquery: string
}

class CoursepickerToolbar extends React.Component<CoursepickerToolbarProps, CoursepickerToolbarState> {
  private searchTimer:number;
  constructor(props: CoursepickerToolbarProps){
    super(props);
    
    this.state = {
      searchquery: this.props.coursepickerCourses.filters.query || ""
    }
    
    this.setSearchQuery = this.setSearchQuery.bind(this);
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    
    this.searchTimer = null;
  }
  
  updateSearchWithQuery(query: string){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    locationData.q = query;
    window.location.hash = "#?" + queryString.stringify(locationData, {arrayFormat: 'bracket'});
  }
  
  setSearchQuery(e: React.ChangeEvent<HTMLInputElement>){
    clearTimeout(this.searchTimer);
    
    this.setState({
      searchquery: e.target.value
    });
    
    this.searchTimer = setTimeout(this.updateSearchWithQuery.bind(this, e.target.value), 400);
  }
  
  componentWillReceiveProps(nextProps: CoursepickerToolbarProps){
    if ((nextProps.coursepickerCourses.filters.query || "") !== this.state.searchquery){
      this.setState({
        searchquery: nextProps.coursepickerCourses.filters.query || ""
      });
    }
  }

  render(){
      return ( 
        <div className="application-panel__toolbar">
          <div className="application-panel__toolbar-actions-main">
            <input className="form-field__input form-field__input--main-function-search icon-search" value={this.state.searchquery} onChange={this.setSearchQuery}/>
            <div className="form-field__input-decoration--main-function-search icon-search"></div>
          </div>
        </div>
      )
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    coursepickerCourses: state.coursepickerCourses
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CoursepickerToolbar);