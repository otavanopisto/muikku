import Navbar from "~/components/general/navbar";
import Link from "~/components/general/link";
import LoginButton from "../login-button";
import ForgotPasswordDialog from "../forgot-password-dialog";
import * as React from "react";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import "~/sass/elements/indicator.scss";
import Dropdown from "~/components/general/dropdown";
import {
  WorkspaceDataType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import EvaluationRequestDialog from "./evaluation-request-dialog";
import EvaluationCancelDialog from "./evaluation-cancel-dialog";
import {
  UpdateWorkspaceEditModeStateTriggerType,
  updateWorkspaceEditModeState,
} from "~/actions/workspaces";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import i18n from "~/locales/i18n";
import {
  WorkspaceAssessmentState,
  WorkspaceAssessmentStateType,
} from "~/generated/client";
import { Link as RouterLink } from "react-router-dom";

/**
 * ItemDataElement
 */
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

/**
 * WorkspaceNavbarProps
 */
interface WorkspaceNavbarProps extends WithTranslation {
  activeTrail?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: React.ReactElement<any>;
  status: StatusType;
  title?: string;
  workspaceUrl: string;
  currentWorkspace: WorkspaceDataType;
  workspaceEditMode: WorkspaceEditModeStateType;
  workspaceIsBeingEvaluated: boolean;
  updateWorkspaceEditModeState: UpdateWorkspaceEditModeStateTriggerType;
}

/**
 * WorkspaceNavbarState
 */
interface WorkspaceNavbarState {
  requestEvaluationOpen: boolean;
  requestCancelOpen: boolean;
}

/**
 * WorkspaceNavbar
 */
class WorkspaceNavbar extends React.Component<
  WorkspaceNavbarProps,
  WorkspaceNavbarState
> {
  /**
   * constructor
   * @param props props
   */
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

  /**
   * toggleEditModeActive
   */
  toggleEditModeActive() {
    this.props.updateWorkspaceEditModeState(
      {
        active: !this.props.workspaceEditMode.active,
      },
      true
    );
  }

  /**
   * onRequestEvaluationOrCancel
   * @param canCancel canCancel
   * @param isBeingEvaluated isBeingEvaluated
   */
  onRequestEvaluationOrCancel(canCancel: boolean, isBeingEvaluated: boolean) {
    // If workspace is being evaluated, just return
    if (isBeingEvaluated) {
      return;
    }

    if (canCancel) {
      this.setState({
        requestCancelOpen: true,
      });
    } else {
      this.setState({
        requestEvaluationOpen: true,
      });
    }
  }

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const itemData: ItemDataElement[] = [
      {
        modifier: "settings",
        trail: "workspace-management",
        text: t("labels.settings", { ns: "workspace" }),
        href: "/workspace/" + this.props.workspaceUrl + "/workspace-management",
        icon: "cogs",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_MANAGE_WORKSPACE,
      },
      {
        modifier: "home",
        trail: "index",
        text: t("labels.home", { ns: "workspace" }),
        href: "/workspace/" + this.props.workspaceUrl,
        icon: "home",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_HOME_VISIBLE,
      },
      {
        modifier: "help",
        trail: "help",
        text: t("labels.instructions", { ns: "workspace" }),
        href: "/workspace/" + this.props.workspaceUrl + "/help",
        icon: "question",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_GUIDES_VISIBLE,
      },
      {
        modifier: "materials",
        trail: "materials",
        text: t("labels.materials", { ns: "materials" }),
        href: "/workspace/" + this.props.workspaceUrl + "/materials",
        icon: "leanpub",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_MATERIALS_VISIBLE,
      },
      {
        modifier: "discussion",
        trail: "workspace-discussions",
        text: t("labels.discussion"),
        href: "/workspace/" + this.props.workspaceUrl + "/discussions",
        icon: "bubbles",
        to: true,
        condition:
          this.props.status.permissions.WORKSPACE_DISCUSSIONS_VISIBLE &&
          this.props.status.loggedIn,
      },
      {
        modifier: "users",
        trail: "users",
        text: t("labels.users", { ns: "users" }),
        href: "/workspace/" + this.props.workspaceUrl + "/users",
        icon: "users",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_USERS_VISIBLE,
      },
      {
        modifier: "journal",
        trail: "journal",
        text: t("labels.journal", { ns: "journal" }),
        href: "/workspace/" + this.props.workspaceUrl + "/journal",
        icon: "book",
        to: true,
        condition:
          this.props.status.permissions.WORKSPACE_JOURNAL_VISIBLE &&
          this.props.status.loggedIn,
      },
      {
        modifier: "announcer",
        trail: "workspace-announcer",
        text: t("labels.announcer"),
        href: "/workspace/" + this.props.workspaceUrl + "/announcer",
        icon: "paper-plane",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_ANNOUNCER_TOOL,
      },
      {
        modifier: "evaluation",
        trail: "workspace-evaluation",
        text: t("labels.evaluation"),
        href: "/workspace/" + this.props.workspaceUrl + "/evaluation",
        icon: "evaluate",
        to: true,
        condition: this.props.status.permissions.WORKSPACE_ACCESS_EVALUATION,
      },
    ];

    /**
     * Boolean variable to store value if workspace is combination or not
     */
    const isCombinationWorkspace =
      this.props.currentWorkspace &&
      this.props.currentWorkspace.additionalInfo &&
      this.props.currentWorkspace.additionalInfo.subjects.length > 1;

    /**
     * !DISCLAIMER!
     * Following by combinationWorkspace changes, there can be multiple assessmentState objects
     * So currently before module specific assessment are implemented, using first item of assessmentState list
     * is only option.
     */
    let assessmentState =
      this.props.currentWorkspace &&
      this.props.currentWorkspace.activity &&
      this.props.currentWorkspace.activity.assessmentStates.length > 0
        ? this.props.currentWorkspace.activity.assessmentStates[0]
        : undefined;

    let canCancelRequest =
      assessmentState && canCancelAssessmentRequest(assessmentState);

    if (isCombinationWorkspace) {
      assessmentState =
        this.props.currentWorkspace &&
        this.props.currentWorkspace.activity &&
        this.props.currentWorkspace.activity.assessmentStates.length > 0
          ? getPrioritizedAssessmentState(
              this.props.currentWorkspace.activity.assessmentStates
            )
          : undefined;

      canCancelRequest =
        assessmentState &&
        canCancelAssessmentRequest(
          this.props.currentWorkspace.activity.assessmentStates
        );
    }

    const assessmentRequestItem =
      this.props.status.permissions.WORKSPACE_REQUEST_WORKSPACE_ASSESSMENT &&
      assessmentState
        ? {
            modifier: "assessment-request",
            item: (
              <Dropdown
                openByHover
                key="assessment-request"
                modifier="assessment"
                content={getTextForAssessmentState(
                  canCancelRequest,
                  this.props.workspaceIsBeingEvaluated,
                  assessmentState.state
                )}
              >
                <Link
                  tabIndex={0}
                  as="span"
                  onClick={this.onRequestEvaluationOrCancel.bind(
                    this,
                    canCancelRequest,
                    this.props.workspaceIsBeingEvaluated
                  )}
                  aria-label={getTextForAssessmentState(
                    canCancelRequest,
                    this.props.workspaceIsBeingEvaluated,
                    assessmentState.state
                  )}
                  className={`link link--icon link--workspace-assessment link--workspace-assessment-${getClassNameForAssessmentState(
                    assessmentState.state
                  )} link--workspace-navbar icon-assessment-${getIconForAssessmentState(
                    assessmentState.state
                  )} ${
                    this.props.workspaceIsBeingEvaluated
                      ? "link--workspace-is-being-evaluated"
                      : ""
                  }`}
                  role="menuitem"
                ></Link>
              </Dropdown>
            ),
          }
        : null;

    const assessmentRequestMenuItem = assessmentRequestItem ? (
      <Link
        key="link--assessment-request"
        onClick={this.onRequestEvaluationOrCancel.bind(
          this,
          canCancelRequest,
          this.props.workspaceIsBeingEvaluated
        )}
        className="link link--full link--menu link--assessment-request"
      >
        <span
          className={`link__icon icon-assessment-${getIconForAssessmentState(
            assessmentState.state
          )}`}
        />
        <span className="link--menu-text">
          {getTextForAssessmentState(
            canCancelRequest,
            this.props.workspaceIsBeingEvaluated,
            assessmentState.state
          )}
        </span>
      </Link>
    ) : null;

    let editModeSwitch = null;
    if (this.props.workspaceEditMode.available) {
      editModeSwitch = (
        <span key="edit-mode-switch">
          <label htmlFor="editingMasterSwitch" className="visually-hidden">
            {t("wcag.editingMasterSwitch", { ns: "workspace" })}
          </label>
          <input
            id="editingMasterSwitch"
            key="3"
            type="checkbox"
            className={`button-pill button-pill--switch-vertical ${
              this.props.workspaceEditMode.active
                ? "button-pill--switch-vertical-active"
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

    t("labels.forgotPasswordLink");

    return (
      <Navbar
        // By default title comes from props but if it's not set, then use current workspace name or empty string
        mobileTitle={
          this.props.title || this.props.currentWorkspace?.name || ""
        }
        isProfileContainedInThisApp={false}
        modifier={navbarModifiers}
        navigation={this.props.navigation}
        navbarItems={[assessmentRequestItem].concat(
          itemData
            .map((item) => {
              if (!item.condition) {
                return null;
              }
              return {
                modifier: item.modifier,
                item: (
                  <Dropdown openByHover key={item.text} content={item.text}>
                    <RouterLink
                      tabIndex={this.props.activeTrail == item.trail ? 0 : null}
                      to={item.href}
                      className={`link link--icon link--full link--workspace-navbar ${
                        this.props.activeTrail === item.trail ? "active" : ""
                      }`}
                      aria-label={
                        this.props.activeTrail == item.trail
                          ? t("wcag.currentPage") + " " + item.text
                          : item.text
                      }
                      role="menuitem"
                    >
                      <span className={`link__icon icon-${item.icon}`} />
                      {item.badge ? (
                        <span className="indicator indicator--workspace">
                          {item.badge >= 100 ? "99+" : item.badge}
                        </span>
                      ) : null}
                    </RouterLink>
                  </Dropdown>
                ),
              };
            })
            .filter((item) => !!item)
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
                    <span>{t("labels.forgotPasswordLink")}</span>
                  </Link>
                </ForgotPasswordDialog>,
              ]
        }
        menuItems={[assessmentRequestMenuItem].concat(
          itemData
            .map((item: ItemDataElement) => {
              if (!item.condition) {
                return null;
              }
              return (
                <Link
                  key={item.modifier}
                  href={
                    this.props.activeTrail !== item.trail ? item.href : null
                  }
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
                  <span className="link--menu-text">{item.text}</span>
                </Link>
              );
            })
            .filter((item) => !!item)
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

/**
 * mapStateToProps
 *
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    currentWorkspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
    workspaceIsBeingEvaluated: state.workspaces.workspaceIsBeingEvaluated,
  };
}

/**
 * mapDispatchToProps
 *
 * @param dispatch dispatch
 */
const mapDispatchToProps = (dispatch: Dispatch<Action<AnyActionType>>) =>
  bindActionCreators({ updateWorkspaceEditModeState }, dispatch);

export default withTranslation(["workspace", "users", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceNavbar)
);

/**
 * Get text by assessment state
 *
 * @param canCancelRequest canCancelRequest
 * @param isBeingEvaluated isBeingEvaluated
 * @param state state
 * @returns localized text
 */
function getTextForAssessmentState(
  canCancelRequest: boolean,
  isBeingEvaluated: boolean,
  state: WorkspaceAssessmentStateType
) {
  let text;

  if (isBeingEvaluated) {
    return i18n.t("content.evaluationInProgress", { ns: "workspace" });
  }

  switch (state) {
    case "interim_evaluation":
    case "interim_evaluation_request":
    case "unassessed":
      text = i18n.t("labels.requestEvaluation", { ns: "workspace" });
      break;
    case "pending":
    case "pending_pass":
    case "pending_fail":
      if (canCancelRequest) {
        text = i18n.t("labels.cancel_evaluationRequest", { ns: "workspace" });
      } else {
        text = i18n.t("labels.requestNewEvaluation", {
          ns: "workspace",
        });
      }
      break;
    default:
      text = i18n.t("labels.requestNewEvaluation", { ns: "workspace" });
      break;
  }

  return text;
}

/**
 * Get icon by assessment state
 *
 * @param state state
 * @returns icon
 */
function getIconForAssessmentState(state: WorkspaceAssessmentStateType) {
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
    case "interim_evaluation":
      icon = "pass";
      break;
    case "interim_evaluation_request":
      icon = "pending";
      break;
    default:
      icon = "canceled";
      break;
  }
  return icon;
}

/**
 * Gets classname by assessment state
 *
 * @param state state
 * @returns classname
 */
function getClassNameForAssessmentState(state: WorkspaceAssessmentStateType) {
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
    case "interim_evaluation":
      className = "interim-evaluation";
      break;
    case "interim_evaluation_request":
      className = "interim-request";
      break;
    case "unassessed":
    default:
      className = "unassessed";
      break;
  }
  return className;
}

/**
 * Gets and returns priorizied assessement state
 * as following array shows. Only used with combination workspaces
 *
 * @param assessmentStates assessmentStates
 * @returns assessment state
 */
function getPrioritizedAssessmentState(
  assessmentStates: WorkspaceAssessmentState[]
) {
  /**
   * Priority array
   */
  const assessmentPriorityOrder: WorkspaceAssessmentStateType[] = [
    "fail",
    "incomplete",
    "pending",
    "pending_fail",
    "pending_pass",
    "pass",
    "unassessed",
  ];

  /**
   * If one of priorities happen to be found, then just return found
   * assessment state object
   */
  for (const p of assessmentPriorityOrder) {
    const assessmentState = assessmentStates.find((a) => a.state === p);

    if (assessmentState) {
      return assessmentState;
    }
  }

  return undefined;
}

/**
 * Checks if current assessment can be canceled depending if its combination or normal
 * workspace
 *
 * @param assessmentState assessmentState
 * @returns boolean if current request can be canceled
 */
function canCancelAssessmentRequest(
  assessmentState: WorkspaceAssessmentState | WorkspaceAssessmentState[]
) {
  /**
   * If "aka" combination workspace
   */
  if (Array.isArray(assessmentState)) {
    let count = 0;

    for (let i = 0; i < assessmentState.length; i++) {
      /**
       * If any of these happens then just return false
       */
      if (
        assessmentState[i].state === "unassessed" ||
        assessmentState[i].state === "pass" ||
        assessmentState[i].state === "incomplete" ||
        assessmentState[i].state === "fail" ||
        assessmentState[i].state === "interim_evaluation" ||
        assessmentState[i].state === "interim_evaluation_request"
      ) {
        return false;
      }

      /**
       * Otherwise bump counter
       */
      count++;
    }

    /**
     * If counter is same as array length we know that
     * every item in array has state some of pending or its variable
     */
    return count === assessmentState.length;
  } else {
    return (
      assessmentState.state === "pending" ||
      assessmentState.state === "pending_fail" ||
      assessmentState.state === "pending_pass"
    );
  }
}
