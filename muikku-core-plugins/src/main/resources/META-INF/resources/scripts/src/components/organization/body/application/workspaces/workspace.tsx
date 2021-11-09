import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import '~/sass/elements/course.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/application-list.scss';
import { StatusType } from '~/reducers/base/status';
import { StateType } from '~/reducers';
import { WorkspacesActiveFiltersType, WorkspaceType } from '~/reducers/workspaces';
import WorkspaceDialog from '~/components/organization/dialogs/edit-workspace';
import { ApplicationListItem, ApplicationListItemHeader, ApplicationListItemBody, ApplicationListItemFooter } from '~/components/general/application-list';
import Button from '~/components/general/button';


interface CourseProps {
  i18n: i18nType,
  status: StatusType,
  workspace: WorkspaceType,
  activeFilters: WorkspacesActiveFiltersType,
}

interface CourseState {
  expanded: boolean
}

class Workspace extends React.Component<CourseProps, CourseState>{
  constructor(props: CourseProps) {
    super(props);

    this.state = {
      expanded: false
    }

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }
  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded })
  }
  render() {
    let actions = <div><WorkspaceDialog activeFilters={this.props.activeFilters} workspace={this.props.workspace} ><span className="icon-pencil"></span></WorkspaceDialog></div>;
    return <ApplicationListItem className={`course ${this.state.expanded ? "course--open" : ""}`} >
      <ApplicationListItemHeader className="application-list__item-header--course" onClick={this.toggleExpanded}>
        <span className={`application-list__header-icon icon-books ${!this.props.workspace.published ? "state-UNPUBLISHED" : ""}`}></span>
        <span className="application-list__header-primary">{this.props.workspace.name} {this.props.workspace.nameExtension ? "(" + this.props.workspace.nameExtension + ")" : null}</span>
        <span className="application-list__header-secondary">{actions}</span>
      </ApplicationListItemHeader>
      {this.state.expanded ?
        <div>
          <ApplicationListItemBody>
            <div className="application-list__item-body-meta-content">
              <div><label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.educationType.title")}</label><span>{this.props.workspace.educationTypeName}</span></div>
              <div><label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.teachers.title")}</label><span className="application-list__item-body">
                {this.props.workspace.teachers.map((teacher, index) => {
                  let teacherCount = this.props.workspace.teachers.length;
                  let teacherFullName = teacherCount > 1 && teacherCount != index + 1 ? teacher.firstName + " " + teacher.lastName + ", " : teacher.firstName + " " + teacher.lastName;
                  return <span key={teacher.lastName + index}>
                    {teacherFullName}
                  </span>
                })}
              </span></div>
              <div><label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.studentCount.title")}</label><span>{this.props.workspace.studentCount}</span></div>
            </div>
            <label>{this.props.i18n.text.get("plugin.organization.workspaces.workspace.description.title")}</label>
            <article className="rich-text" dangerouslySetInnerHTML={{ __html: this.props.workspace.description }}></article>
          </ApplicationListItemBody>
          <ApplicationListItemFooter className="application-list__item-footer--course">
            <Button aria-label={this.props.workspace.name} buttonModifiers={["primary-function-content ", "coursepicker-course-action"]} href={`${this.props.status.contextPath}/workspace/${this.props.workspace.urlName}`}>
              {this.props.i18n.text.get("plugin.organization.workspaces.workspace.goto")}
            </Button>
          </ApplicationListItemFooter>
        </div>
        : null}
    </ApplicationListItem>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    activeFilters: state.organizationWorkspaces.activeFilters
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workspace);
