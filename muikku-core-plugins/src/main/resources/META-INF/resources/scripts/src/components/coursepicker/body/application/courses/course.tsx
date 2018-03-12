import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';

import {i18nType} from '~/reducers/base/i18n';
import { CoursePickerCourseType } from '~/reducers/main-function/coursepicker/coursepicker-courses';

import '~/sass/elements/application-list.scss';
import '~/sass/elements/course-description.scss';
import '~/sass/elements/course.scss';

import { StatusType } from '~/reducers/base/status';
import {StateType} from '~/reducers';

interface CourseProps {
  i18n: i18nType,
  status: StatusType,
  course: CoursePickerCourseType
}

interface CourseState {
  expanded: boolean
}

class Course extends React.Component<CourseProps, CourseState>{
  constructor(props: CourseProps){
    super(props);
    
    this.state = {
      expanded: false
    }
    
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }
  toggleExpanded(){
    this.setState({expanded: !this.state.expanded})
  }
  render(){
    //Please fix this markup I have no idea which standard to use, this is more or less like communicator
    //you can move the toggle expanded function wherever you want that you need the action to be triggered
    return <div className={`application-list__item course ${this.state.expanded ? "course--open" : ""}`}>
      <div className="application-list__item-header application-list__item-header--course" onClick={this.toggleExpanded}>
        <span className="text text--coursepicker-course-icon icon-books"></span>
        <span className="text text--coursepicker-course-name">{this.props.course.name}</span>
        {this.props.course.nameExtension ? 
          <span className="text text--coursepicker-course-name-extension">({this.props.course.nameExtension})</span>
        : null}
        <span className="text text--coursepicker-course-type-name">{this.props.course.educationTypeName}</span>
      </div>
      {this.state.expanded ?
        <div>             
          <div className="application-list__item-body application-list__item-body--course">
            <article className="text text--coursepicker-course-description" dangerouslySetInnerHTML={{__html: this.props.course.description}}></article>
          </div>
          <div className="application-list__item-footer application-list__item-footer--course">
            <Link className="button button--primary-function-content" href={`${this.props.status.contextPath}/workspace/${this.props.course.urlName}`}>
              {this.props.course.isCourseMember ?
               this.props.i18n.text.get("plugin.coursepicker.course.goto") :
               this.props.i18n.text.get("plugin.coursepicker.course.checkout")}
            </Link>
          </div>
        </div>
      : null}
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Course);