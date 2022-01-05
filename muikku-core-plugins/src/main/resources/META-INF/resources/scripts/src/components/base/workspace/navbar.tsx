import Navbar from "~/components/general/navbar";
import Link from "~/components/general/link";
import LoginButton from "../login-button";
import ForgotPasswordDialog from "../forgot-password-dialog";

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";

import "~/sass/elements/link.scss";
import "~/sass/elements/indicator.scss";
import Dropdown from "~/components/general/dropdown";
import {
  WorkspaceType,
  WorkspaceAssessementStateType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import EvaluationRequestDialog from "./evaluation-request-dialog";
import EvaluationCancelDialog from "./evaluation-cancel-dialog";
import {
  UpdateWorkspaceEditModeStateTriggerType,
  updateWorkspaceEditModeState,
} from "~/actions/workspaces";
import { bindActionCreators } from "redux";
import workspace from "~/components/guider/body/application/current-student/workspaces/workspace";

interface ItemDataElement {
  modifier: string;
  trail: string;
  text: string;
  href: string;
  to?: boolean;
  icon: string;
  condition?: boolean;
  badge?: number;
  openInNewTab?: string;
}

interface WorkspaceNavbarProps {
  activeTrail?: string;
  i18n: i18nType;
  navigation?: React.ReactElement<any>;
  status: StatusType;
  title: string;
  workspaceUrl: string;
  currentWorkspace: WorkspaceType;
  workspaceEditMode: WorkspaceEditModeStateType;
  updateWorkspaceEditModeState: UpdateWorkspaceEditModeStateTriggerType;
}

interface WorkspaceNavbarState {
  requestEvaluationOpen: boolean;
  requestCancelOpen: boolean;
}

function getTextForAssessmentState(
  state: WorkspaceAssessementStateType,
  i18n: i18nType,
) {
  let text;
  switch (state) {
    case "unassessed":
      text = "plugin.workspace.dock.evaluation.requestEvaluationButtonTooltip";
      break;
    case "pending":
    case "pending_pass":
    case "pending_fail":
      text = "plugin.workspace.dock.evaluation.cancelEvaluationButtonTooltip";
      break;
    default:
      text =
        "plugin.workspace.dock.evaluation.resendRequestEvaluationButtonTooltip";
      break;
  }

  return i18n.text.get(text);
}

function getIconForAssessmentState(state: WorkspaceAssessementStateType) {
  let icon;
  switch (state) {
    case "unassessed":
      icon = "unassessed";
      break;
    case "pending":
    case "pending_fail":
    case "pending_pass":
      icon = "pending";
      break;
    case "fail":
    case "incomplete":
      icon = "fail";
      break;
    case "pass":
      icon = "pass";
      break;
    default:
      icon = "canceled";
      break;
  }
  return icon;
}

function getClassNameForAssessmentState(state: WorkspaceAssessementStateType) {
  let className;
  switch (state) {
    case "pending":
    case "pending_fail":
    case "pending_pass":
      className = "pending";
      break;
    case "fail":
      className = "failed";
      break;
    case "incomplete":
      className = "incomplete";
      break;
    case "pass":
      className = "passed";
      break;
    case "unassessed":
    default:
      className = "unassessed";
      break;
  }
  return className;
}

class WorkspaceNavbar extends React.Component<
  WorkspaceNavbarProps,
  WorkspaceNavbarState
> {
  constructor(props: WorkspaceNavbarProps) {
    super(props);

    this.state = {
      requestEvaluationOpen: false,
      requestCancelOpen: false,
    };

    this.onRequestEvaluationOrCancel =
      this.onRequestEvaluationOrCancel.bind(this);
    this.toggleEditModeActive = this.toggleEditModeActive.bind(this);
  }
  toggleEditModeActive() {
    this.props.updateWorkspaceEditModeState(
      {
        active: !this.props.workspaceEditMode.active,
      },
      true,
    );
  }
  onRequestEvaluationOrCancel(state: string) {
    let text;
    switch (state) {
      case "pending":
      case "pending_pass":
      case "pending_fail":
        this.setState({
          requestCancelOpen: true,
        });
        break;
      case "unassessed":
      default:
        this.setState({
          requestEvaluationOpen: true,
        });
        break;
    }
  }
  render() {
    const itemData: ItemDataElement[] = [
      {
        modifier: "settings",
        trail: "workspace-management",
        text: "plugin.workspace.dock.workspace-edit",
        href: "/workspace/" + this.props.workspaceUrl + "/workspace-management",
        icon: "cogs",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_MANAGE_WORKSPACE,
      },
      {
        modifier: "home",
        trail: "index",
        text: "plugin.workspace.dock.home",
        href: "/workspace/" + this.props.workspaceUrl,
        icon: "home",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_HOME_VISIBLE,
      },
      {
        modifier: "help",
        trail: "help",
        text: "plugin.workspace.dock.guides",
        href: "/workspace/" + this.props.workspaceUrl + "/help",
        icon: "question",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_GUIDES_VISIBLE,
      },
      {
        modifier: "materials",
        trail: "materials",
        text: "plugin.workspace.dock.materials",
        href: "/workspace/" + this.props.workspaceUrl + "/materials",
        icon: "leanpub",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_MATERIALS_VISIBLE,
      },
      {
        modifier: "discussion",
        trail: "workspace-discussions",
        text: "plugin.workspace.dock.discussions",
        href: "/workspace/" + this.props.workspaceUrl + "/discussions",
        icon: "bubbles",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_DISCUSSIONS_VISIBLE,
      },
      {
        modifier: "users",
        trail: "users",
        text: "plugin.workspace.dock.members",
        href: "/workspace/" + this.props.workspaceUrl + "/users",
        icon: "users",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_USERS_VISIBLE,
      },
      {
        modifier: "journal",
        trail: "journal",
        text: "plugin.workspace.dock.journal",
        href: "/workspace/" + this.props.workspaceUrl + "/journal",
        icon: "book",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_JOURNAL_VISIBLE,
      },
      {
        modifier: "announcer",
        trail: "workspace-announcer",
        text: "plugin.workspace.dock.announcer",
        href: "/workspace/" + this.props.workspaceUrl + "/announcer",
        icon: "paper-plane",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_ANNOUNCER_TOOL,
      },
      {
        modifier: "evaluation",
        trail: "workspace-evaluation",
        text: "plugin.evaluation.evaluation",
        href: "/workspace/" + this.props.workspaceUrl + "/evaluation",
        icon: "evaluate",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_ACCESS_EVALUATION,
      },
    ];

    const assessmentRequestItem =
      this.props.currentWorkspace &&
      this.props.status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT
        ? {
            modifier: "assessment-request",
            item: (
              <Dropdown
                openByHover
                key="assessment-request"
                modifier="assessment"
                content={getTextForAssessmentState(
                  this.props.currentWorkspace.studentAssessments
                    .assessmentState,
                  this.props.i18n,
                )}
              >
                <Link
                  tabIndex={0}
                  as="span"
                  onClick={this.onRequestEvaluationOrCancel.bind(
                    this,
                    this.props.currentWorkspace.studentAssessments
                      .assessmentState,
                  )}
                  aria-label={getTextForAssessmentState(
                    this.props.currentWorkspace.studentAssessments
                      .assessmentState,
                    this.props.i18n,
                  )}
                  className={`link link--icon link--workspace-assessment link--workspace-assessment-${getClassNameForAssessmentState(
                    this.props.currentWorkspace.studentAssessments
                      .assessmentState,
                  )} link--workspace-navbar icon-assessment-${getIconForAssessmentState(
                    this.props.currentWorkspace.studentAssessments
                      .assessmentState,
                  )}`}
                ></Link>
              </Dropdown>
            ),
          }
        : null;

    const assessmentRequestMenuItem = assessmentRequestItem ? (
      <Link
        onClick={this.onRequestEvaluationOrCancel.bind(
          this,
          this.props.currentWorkspace.studentAssessments.assessmentState,
        )}
        className="link link--full link--menu link--assessment-request"
      >
        <span
          className={`link__icon icon-assessment-${getIconForAssessmentState(
            this.props.currentWorkspace.studentAssessments.assessmentState,
          )}`}
        />
        <span className="link--menu__text">
          {getTextForAssessmentState(
            this.props.currentWorkspace.studentAssessments.assessmentState,
            this.props.i18n,
          )}
        </span>
      </Link>
    ) : null;

    const trueNavigation: Array<React.ReactElement<any>> = [];
    if (this.props.navigation) {
      trueNavigation.push(this.props.navigation);
    }

    let editModeSwitch = null;
    if (this.props.workspaceEditMode.available) {
      editModeSwitch = (
        <span key="edit-mode-switch">
          <label htmlFor="editingMasterSwitch" className="visually-hidden">
            {this.props.i18n.text.get(
              "plugin.wcag.mainNavigation.editingMasterSwitch",
            )}
          </label>
          <input
            id="editingMasterSwitch"
            key="3"
            type="checkbox"
            className={`button-pill button-pill--editing-master-switch ${
              this.props.workspaceEditMode.active
                ? "button-pill--editing-master-switch-active"
                : ""
            }`}
            onChange={this.toggleEditModeActive}
            checked={this.props.workspaceEditMode.active}
          />
        </span>
      );
    }

    const navbarModifiers = this.props.workspaceEditMode.active
      ? "workspace-edit-mode"
      : "workspace";

    return (
      <Navbar
        mobileTitle={this.props.title}
        isProfileContainedInThisApp={false}
        modifier={navbarModifiers}
        navigation={trueNavigation}
        navbarItems={[assessmentRequestItem].concat(
          itemData.map((item) => {
            if (!item.condition) {
              return null;
            }
            return {
              modifier: item.modifier,
              item: (
                <Dropdown
                  openByHover
                  key={item.text}
                  content={this.props.i18n.text.get(item.text)}
                >
                  <Link
                    tabIndex={this.props.activeTrail == item.trail ? 0 : null}
                    as={this.props.activeTrail == item.trail ? "span" : null}
                    openInNewTab={item.openInNewTab}
                    href={
                      this.props.activeTrail !== item.trail ? item.href : null
                    }
                    to={
                      item.to && this.props.activeTrail !== item.trail
                        ? item.href
                        : null
                    }
                    className={`link link--icon link--full link--workspace-navbar ${
                      this.props.activeTrail === item.trail ? "active" : ""
                    }`}
                    aria-label={
                      this.props.activeTrail == item.trail
                        ? this.props.i18n.text.get(
                            "plugin.wcag.mainNavigation.currentPage.aria.label",
                          ) +
                          " " +
                          this.props.i18n.text.get(item.text)
                        : this.props.i18n.text.get(item.text)
                    }
                    role="menuitem"
                  >
                    <span className={`link__icon icon-${item.icon}`} />
                    {item.badge ? (
                      <span className="indicator indicator--workspace">
                        {item.badge >= 100 ? "99+" : item.badge}
                      </span>
                    ) : null}
                  </Link>
                </Dropdown>
              ),
            };
          }),
        )}
        defaultOptions={
          this.props.status.loggedIn
            ? [editModeSwitch]
            : [
                <LoginButton
                  modifier="login-main-function"
                  key="login-button"
                />,
                <ForgotPasswordDialog key="forgot-password-dialog">
                  <Link className="link link--forgot-password link--forgot-password-main-function">
                    <span>
                      {this.props.i18n.text.get(
                        "plugin.forgotpassword.forgotLink",
                      )}
                    </span>
                  </Link>
                </ForgotPasswordDialog>,
              ]
        }
        menuItems={[assessmentRequestMenuItem].concat(
          itemData.map((item: ItemDataElement) => {
            if (!item.condition) {
              return null;
            }
            return (
              <Link
                href={this.props.activeTrail !== item.trail ? item.href : null}
                to={
                  item.to && this.props.activeTrail !== item.trail
                    ? item.href
                    : null
                }
                className={`link link--full link--menu ${
                  this.props.activeTrail === item.trail ? "active" : ""
                }`}
              >
                <span
                  className={`link__icon link__icon--workspace icon-${item.icon}`}
                />
                {item.badge ? (
                  <span className="indicator indicator--workspace">
                    {item.badge >= 100 ? "99+" : item.badge}
                  </span>
                ) : null}
                <span className="link--menu__text">
                  {this.props.i18n.text.get(item.text)}
                </span>
              </Link>
            );
          }),
        )}
        extraContent={[
          <EvaluationRequestDialog
            isOpen={this.state.requestEvaluationOpen}
            key="evaluation-request-dialog"
            onClose={() => this.setState({ requestEvaluationOpen: false })}
          />,
          <EvaluationCancelDialog
            isOpen={this.state.requestCancelOpen}
            key="evaluation-cancel-dialog"
            onClose={() => this.setState({ requestCancelOpen: false })}
          />,
        ]}
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    title: state.title,
    currentWorkspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) =>
  bindActionCreators({ updateWorkspaceEditModeState }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceNavbar);
