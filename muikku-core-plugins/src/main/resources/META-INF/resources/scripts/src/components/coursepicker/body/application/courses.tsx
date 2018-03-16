import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/message.scss';

import BodyScrollLoader from '~/components/general/body-scroll-loader';
import SelectableList from '~/components/general/selectable-list';
import {CoursePickerCoursesType, CoursePickerCoursesStateType, CoursePickerCourseListType, CoursePickerCourseType} from '~/reducers/main-function/coursepicker/coursepicker-courses';
import { loadMoreCourses, LoadMoreCoursesTriggerType } from '~/actions/main-function/coursepicker/coursepicker-courses';
import Course from './courses/course';
import {StateType} from '~/reducers';

interface CoursepickerWorkspacesProps {
  i18n: i18nType,
  coursepickerCoursesState: CoursePickerCoursesStateType,
  coursepickerHasMore: boolean,
  loadMoreCourses: LoadMoreCoursesTriggerType,
  coursepickerCoursesCourses: CoursePickerCourseListType
}

interface CoursepickerWorkspacesState {
}

class CoursepickerWorkspaces extends BodyScrollLoader<CoursepickerWorkspacesProps, CoursepickerWorkspacesState> {
  constructor(props: CoursepickerWorkspacesProps){
    super(props);
    
    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "coursepickerCoursesState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "coursepickerHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreCourses";
  }

  render(){
    if (this.props.coursepickerCoursesState === "LOADING"){
      return null;
    } else if (this.props.coursepickerCoursesState === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.coursepickerCoursesState.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("TODO it's empty")}</span></div>
    }    
    return (
    <div className="application-list_item-wrapper ">
      {this.props.coursepickerCoursesCourses.map((course: CoursePickerCourseType)=>{
        return <Course key={course.id} course={course}/>
      })}
      {this.props.coursepickerCoursesState === "LOADING_MORE" ? <div className="application-list__item loader-empty"/> : null}
    </div>)
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    coursepickerCoursesState: (state as any).coursepickerCourses.state,
    coursepickerHasMore: (state as any).coursepickerCourses.hasMore,
    coursepickerCoursesCourses: (state as any).coursepickerCourses.courses
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({loadMoreCourses}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoursepickerWorkspaces);