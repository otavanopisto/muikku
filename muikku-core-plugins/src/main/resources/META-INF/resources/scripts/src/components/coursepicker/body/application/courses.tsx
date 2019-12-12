import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/message.scss';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import SelectableList from '~/components/general/selectable-list';
import {i18nType} from '~/reducers/base/i18n';
import {CoursesStateType, WorkspaceCourseListType, WorkspaceCourseType} from '~/reducers/main-function/courses';
import { loadMoreCoursesFromServer, LoadMoreCoursesFromServerTriggerType } from '~/actions/main-function/courses';
import Course from './courses/course';
import {StateType} from '~/reducers';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';

interface CoursepickerWorkspacesProps {
  i18n: i18nType,
  coursepickerCoursesState: CoursesStateType,
  coursepickerHasMore: boolean,
  loadMoreCoursesFromServer: LoadMoreCoursesFromServerTriggerType,
  coursepickerCoursesCourses: WorkspaceCourseListType
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
    this.loadMoreTriggerFunctionLocation = "loadMoreCoursesFromServer";
  }

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
    return (<ApplicationList>
      {this.props.coursepickerCoursesCourses.map((course: WorkspaceCourseType)=>{
        return <Course key={course.id} course={course}/>
      })}
      {this.props.coursepickerCoursesState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty"/> : null}
    </ApplicationList>);
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
)(CoursepickerWorkspaces);