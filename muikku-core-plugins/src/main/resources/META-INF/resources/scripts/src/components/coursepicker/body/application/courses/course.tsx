import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';

import {i18nType} from '~/reducers/base/i18n';
import { WorkspaceCourseType } from '~/reducers/main-function/courses';

import '~/sass/elements/course-description.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/rich-text.scss';

import { StatusType } from '~/reducers/base/status';
import {StateType} from '~/reducers';
import { ApplicationListItem, ApplicationListItemHeader, ApplicationListItemBody, ApplicationListItemFooter } from '~/components/general/application-list';
import Button from '~/components/general/button';
import WorkspaceSignupDialog from '../workspace-signup-dialog';

interface CourseProps {
  i18n: i18nType,
  status: StatusType,
  course: WorkspaceCourseType
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
    return <ApplicationListItem className={`course ${this.state.expanded ? "course--open" : ""}`} >
      <ApplicationListItemHeader className="application-list__item-header--course" onClick={this.toggleExpanded}>
        <span className="text text--course-icon icon-books"></span>
        <span className="text text--list-item-title">{this.props.course.name} {this.props.course.nameExtension ? (this.props.course.nameExtension) : null}</span>
        {this.props.course.feeInfo && this.props.course.feeInfo.evaluationHasFee ? <span className="text text--course-has-fees icon-coin-euro" title={this.props.i18n.text.get("plugin.coursepicker.course.evaluationhasfee")}/> : null}
        <span className="text text--list-item-type-title">{this.props.course.educationTypeName}</span>
      </ApplicationListItemHeader>        
      {this.state.expanded ?
        <div>
          <ApplicationListItemBody className="application-list__item-body--course">
            <article className="text text--coursepicker-course-description rich-text" dangerouslySetInnerHTML={{__html: this.props.course.description}}></article>
          </ApplicationListItemBody>
          <ApplicationListItemFooter className="application-list__item-footer--course">
            <Button buttonModifiers={["primary-function-content ", "coursepicker-course-action"]} href={`${this.props.status.contextPath}/workspace/${this.props.course.urlName}`}>
              {this.props.course.isCourseMember ?
               this.props.i18n.text.get("plugin.coursepicker.course.goto") :
               this.props.i18n.text.get("plugin.coursepicker.course.checkout")}
            </Button>
            {this.props.course.canSignup && this.props.status.loggedIn ?
              <WorkspaceSignupDialog course={this.props.course}><Button buttonModifiers={["primary-function-content", "coursepicker-course-action"]}>
                {this.props.i18n.text.get("plugin.coursepicker.course.signup")}
              </Button></WorkspaceSignupDialog> : null}
          </ApplicationListItemFooter>
        </div>
      : null}
    </ApplicationListItem>
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