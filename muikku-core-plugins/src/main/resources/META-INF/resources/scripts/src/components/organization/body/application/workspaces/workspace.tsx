import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/course.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import {
  WorkspacesActiveFiltersType,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import WorkspaceDialog from "~/components/organization/dialogs/edit-workspace";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * CourseProps
 */
interface CourseProps extends WithTranslation {
  status: StatusType;
  workspace: WorkspaceDataType;
  activeFilters: WorkspacesActiveFiltersType;
}

/**
 * CourseState
 */
interface CourseState {
  expanded: boolean;
}

/**
 * Workspace
 */
class Workspace extends React.Component<CourseProps, CourseState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CourseProps) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  /**
   * toggleExpanded
   */
  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const actions = (
      <div>
        <WorkspaceDialog
          activeFilters={this.props.activeFilters}
          workspace={this.props.workspace}
        >
          <span className="icon-pencil"></span>
        </WorkspaceDialog>
      </div>
    );
    return (
      <ApplicationListItem
        className={`course ${this.state.expanded ? "course--open" : ""}`}
      >
        <ApplicationListItemHeader
          className="application-list__item-header--course"
          onClick={this.toggleExpanded}
        >
          <span
            className={`application-list__header-icon icon-books ${
              !this.props.workspace.published ? "state-UNPUBLISHED" : ""
            }`}
          ></span>
          <span className="application-list__header-primary">
            {this.props.workspace.name}{" "}
            {this.props.workspace.nameExtension
              ? "(" + this.props.workspace.nameExtension + ")"
              : null}
          </span>
          <span className="application-list__header-secondary">{actions}</span>
        </ApplicationListItemHeader>
        {this.state.expanded ? (
          <div>
            <ApplicationListItemBody>
              <div className="application-list__item-body-meta-content">
                <div>
                  <label>
                    {t("labels.educationType", { ns: "workspace" })}:
                  </label>
                  <span>{this.props.workspace.educationTypeName}</span>
                </div>
                <div>
                  <label>{t("labels.teacher", { ns: "users" })}:</label>
                  <span className="application-list__item-body">
                    {this.props.workspace.teachers.map((teacher, index) => {
                      const teacherCount = this.props.workspace.teachers.length;
                      const teacherFullName =
                        teacherCount > 1 && teacherCount != index + 1
                          ? teacher.firstName + " " + teacher.lastName + ", "
                          : teacher.firstName + " " + teacher.lastName;
                      return (
                        <span key={teacher.lastName + index}>
                          {teacherFullName}
                        </span>
                      );
                    })}
                  </span>
                </div>
                <div>
                  <label>
                    {t("labels.student", { ns: "users", context: "count" })}:
                  </label>
                  <span>{this.props.workspace.studentCount}</span>
                </div>
                <div>
                  <label>{t("labels.description")}</label>
                  <article
                    className="rich-text"
                    dangerouslySetInnerHTML={{
                      __html: this.props.workspace.description,
                    }}
                  ></article>
                </div>
              </div>
            </ApplicationListItemBody>
            <ApplicationListItemFooter className="application-list__item-footer--course">
              <Button
                aria-label={this.props.workspace.name}
                buttonModifiers={[
                  "primary-function-content ",
                  "coursepicker-course-action",
                ]}
                href={`${this.props.status.contextPath}/workspace/${this.props.workspace.urlName}`}
              >
                {t("labels.goto", { ns: "workspace" })}
              </Button>
            </ApplicationListItemFooter>
          </div>
        ) : null}
      </ApplicationListItem>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    activeFilters: state.organizationWorkspaces.activeFilters,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common", "users", "workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(Workspace)
);
