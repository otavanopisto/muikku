import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/course.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/wcag.scss";

import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";
import Button from "~/components/general/button";
import WorkspaceSignupDialog from "../../../dialogs/workspace-signup";
import { WorkspaceType } from "~/reducers/workspaces";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";

/**
 * CourseProps
 */
interface CourseProps {
  i18n: i18nType;
  status: StatusType;
  workspace: WorkspaceType;
}

/**
 * CourseState
 */
interface CourseState {
  expanded: boolean;
  canSignUp?: boolean;
  loading: boolean;
}

/**
 * Course
 */
class Course extends React.Component<CourseProps, CourseState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CourseProps) {
    super(props);

    this.state = {
      expanded: false,
      canSignUp: undefined,
      loading: false,
    };

    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  /**
   * Toggles course body to expanding
   */
  async toggleExpanded() {
    /**
     * If we already have fetched signUp requirements
     * no need to get data again
     */
    if (this.state.canSignUp !== undefined) {
      this.setState({
        expanded: !this.state.expanded,
      });
    } else {
      /**
       * Otherwise we get requested data from api
       */
      this.setState({
        loading: true,
      });

      const canSignUp = await this.checkSignUpStatus();

      /**
       * Timeout for lazier loading because
       * otherwise it will flick loader-spinner
       */
      setTimeout(() => {
        this.setState({
          expanded: true,
          canSignUp,
          loading: false,
        });
      }, 500);
    }
  }

  /**
   * Sends api request to Api which returns data if
   * user can signUp for course or is already member of
   * the course
   * @returns Requirements object
   */
  checkSignUpStatus = async (): Promise<boolean> =>
    (await promisify(
      mApi().coursepicker.workspaces.canSignup.read(this.props.workspace.id),
      "callback"
    )()) as boolean;

  /**
   * render
   * @returns
   */
  render() {
    const hasFees = this.props.status.hasFees;

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
          {hasFees ? (
            <span
              className="application-list__fee-indicatoricon-coin-euro icon-coin-euro"
              title={this.props.i18n.text.get(
                "plugin.coursepicker.course.evaluationhasfee"
              )}
            />
          ) : null}
          <span className="application-list__header-secondary">
            {this.props.workspace.educationTypeName}
          </span>
        </ApplicationListItemHeader>
        {!this.state.loading && this.state.expanded ? (
          <div>
            <ApplicationListItemBody className="application-list__item-body--course">
              <article
                className="rich-text"
                dangerouslySetInnerHTML={{
                  __html: this.props.workspace.description,
                }}
              ></article>
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
                {this.props.workspace.isCourseMember
                  ? this.props.i18n.text.get("plugin.coursepicker.course.goto")
                  : this.props.i18n.text.get(
                      "plugin.coursepicker.course.checkout"
                    )}
              </Button>
              {this.state.canSignUp && this.props.status.loggedIn ? (
                <WorkspaceSignupDialog workspace={this.props.workspace}>
                  <Button
                    aria-label={this.props.workspace.name}
                    buttonModifiers={[
                      "primary-function-content",
                      "coursepicker-course-action",
                    ]}
                  >
                    {this.props.i18n.text.get(
                      "plugin.coursepicker.course.signup"
                    )}
                  </Button>
                </WorkspaceSignupDialog>
              ) : null}
            </ApplicationListItemFooter>
          </div>
        ) : (
          this.state.loading && <div className="loader-empty" />
        )}
      </ApplicationListItem>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Course);
