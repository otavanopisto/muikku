import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import '~/sass/elements/course-description.scss';
import '~/sass/elements/course.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/application-list.scss';
import { StatusType } from '~/reducers/base/status';
import {StateType} from '~/reducers';
import { WorkspaceType } from '~/reducers/workspaces';
import { ApplicationListItem, ApplicationListItemHeader, ApplicationListItemBody, ApplicationListItemFooter } from '~/components/general/application-list';

interface CourseProps {
  i18n: i18nType,
  status: StatusType,
  workspace: WorkspaceType
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
    let teachers = this.props.workspace.teachers.map((teacher, index) => {
      let teacherCount = this.props.workspace.teachers.length;
      let teacherFullName = teacherCount > 1 && teacherCount != index + 1 ? teacher.firstName +" "+ teacher.lastName + ", " : teacher.firstName +" "+ teacher.lastName;
        return <span key={teacher.lastName + index}>
          {teacherFullName}
         </span>
     });
    return   <ApplicationListItem className={`course ${this.state.expanded ? "course--open" : ""}`} >
      <ApplicationListItemHeader className="application-list__item-header--course" onClick={this.toggleExpanded}>
        <span className="application-list__header-icon icon-books"></span>
        <span className="application-list__header-primary">{this.props.workspace.name} {this.props.workspace.nameExtension ? "(" + this.props.workspace.nameExtension + ")" : null}</span>
        <span className="application-list__header-secondary">Todo: actions</span>
      </ApplicationListItemHeader>
      {this.state.expanded ?
        <div>
          <ApplicationListItemBody>
            <div className="application-list__item-body-meta-content">
              <div><label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.educationType.title")}</label><span>{this.props.workspace.educationTypeName}</span></div>
              <div><label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.teachers.title")}</label><span className="application-list__item-body">{teachers}</span></div>
              <div><label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.studentCount.title")}</label><span>{this.props.workspace.studentCount}</span></div>
             </div>
            <label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.description.title")}</label>
            <article className="rich-text" dangerouslySetInnerHTML={{__html: this.props.workspace.description}}></article>
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