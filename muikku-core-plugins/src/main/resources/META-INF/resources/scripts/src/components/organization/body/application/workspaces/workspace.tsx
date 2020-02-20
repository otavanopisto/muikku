import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import '~/sass/elements/course-description.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/application-list.scss';
import { StatusType } from '~/reducers/base/status';
import {StateType} from '~/reducers';
import { WorkspaceCourseType } from '~/reducers/main-function/courses';
import { ApplicationListItem, ApplicationListItemHeader, ApplicationListItemBody, ApplicationListItemFooter } from '~/components/general/application-list';

interface CourseProps {
  i18n: i18nType,
  status: StatusType,
  course: WorkspaceCourseType
}

interface CourseState {
  expanded: boolean
}

class Workspace extends React.Component<CourseProps, CourseState>{
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
    return <ApplicationListItem className={`course ${this.state.expanded ? "course--open" : ""}`} >
      <ApplicationListItemHeader className="application-list__item-header--course" onClick={this.toggleExpanded}>
        <span className="application-list__header-icon icon-books"></span>
        <span className="application-list__header-primary">{this.props.course.name} {this.props.course.nameExtension ? "(" + this.props.course.nameExtension + ")" : null}</span>
        <span className="application-list__header-secondary">{this.props.course.educationTypeName}</span>
      </ApplicationListItemHeader>
      {this.state.expanded ?
        <div>
          <ApplicationListItemBody className="application-list__item-body--course">
            <article className="rich-text" dangerouslySetInnerHTML={{__html: this.props.course.description}}></article>
          </ApplicationListItemBody>
          <ApplicationListItemFooter className="application-list__item-footer--course">
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
)(Workspace);