import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import Course from './courses/course';
import {i18nType} from '~/reducers/base/i18n';
import {CoursesStateType, WorkspaceCourseListType, WorkspaceCourseType} from '~/reducers/main-function/courses';
import { loadMoreCoursesFromServer, LoadMoreCoursesFromServerTriggerType } from '~/actions/main-function/courses';


interface CoursesProps {
  i18n: i18nType,
  coursepickerCoursesState: CoursesStateType,
  coursepickerHasMore: boolean,
  loadMoreCoursesFromServer: LoadMoreCoursesFromServerTriggerType,
  coursepickerCoursesCourses: WorkspaceCourseListType
}

interface CoursesState {
}

class Courses extends React.Component<CoursesProps, CoursesState> {
  render(){
    if (this.props.coursepickerCoursesState === "LOADING"){
      return null;
    } else if (this.props.coursepickerCoursesState === "ERROR"){
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.coursepickerCoursesCourses.length === 0){
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.coursepicker.searchResult.empty")}</span></div>
    }
    return (
        <ApplicationList>
        {this.props.coursepickerCoursesCourses.map((course: WorkspaceCourseType)=>{
          return <Course key={course.id} course={course}/>
        })}
        {this.props.coursepickerCoursesState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty"/> : null}
        </ApplicationList>
    );
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    coursepickerCoursesState: state.courses.state,
    coursepickerHasMore: state.courses.hasMore,
    coursepickerCoursesCourses: state.courses.courses
  }
};


function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({loadMoreCoursesFromServer}, dispatch);
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Courses);
