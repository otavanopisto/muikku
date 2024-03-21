import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import {
  signupIntoWorkspace,
  SignupIntoWorkspaceTriggerType,
} from "~/actions/workspaces";
import { bindActionCreators } from "redux";
import {
  WorkspaceSignUpDetails,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * WorkspaceSignupDialogProps
 */
interface WorkspaceSignupDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  workspace?: WorkspaceDataType;
  status: StatusType;
  workspaceSignUpDetails?: WorkspaceSignUpDetails;
  currentWorkspace: WorkspaceDataType;
  signupIntoWorkspace: SignupIntoWorkspaceTriggerType;
  redirectOnSuccess?: boolean;
}

/**
 * WorkspaceSignupDialogState
 */
interface WorkspaceSignupDialogState {
  locked: boolean;
  message: string;
}

/**
 * WorkspaceSignupDialog
 */
class WorkspaceSignupDialog extends React.Component<
  WorkspaceSignupDialogProps,
  WorkspaceSignupDialogState
> {
  /**
   * constructor method
   * @param props props
   */
  constructor(props: WorkspaceSignupDialogProps) {
    super(props);
    this.state = {
      locked: false,
      message: "",
    };

    this.updateMessage = this.updateMessage.bind(this);
    this.signup = this.signup.bind(this);
  }

  /**
   * updateMessage
   * @param e e
   */
  updateMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ message: e.target.value });
  }

  /**
   * signup
   * @param closeDialog closeDialog
   */
  signup(closeDialog: () => void) {
    this.setState({ locked: true });
    const workspaceSignUpDetails =
      this.props.workspaceSignUpDetails || this.props.currentWorkspace;

    this.props.signupIntoWorkspace({
      workspace: {
        id: workspaceSignUpDetails.id,
        name: workspaceSignUpDetails.name,
        nameExtension: workspaceSignUpDetails.nameExtension,
        urlName: workspaceSignUpDetails.urlName,
      },
      /**
       * success
       */
      success: () => {
        this.setState({ locked: false, message: "" });
        closeDialog();
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({ locked: false });
      },
      message: this.state.message,
      redirectOnSuccess: this.props.redirectOnSuccess,
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const workspaceSignUpDetails =
      this.props.workspaceSignUpDetails || this.props.currentWorkspace;

    if (!workspaceSignUpDetails) {
      return null;
    }

    const hasFees = this.props.status.hasFees;

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div>
        <div>
          <div className="dialog__content-row">
            {this.props.t("content.signUp", {
              ns: "workspace",
              name: workspaceSignUpDetails.name,
              nameExtension: workspaceSignUpDetails.nameExtension || "",
            })}
          </div>
          {hasFees ? (
            <div className="form-element dialog__content-row">
              <p>
                <label>
                  {this.props.t("labels.evaluationHasFee", {
                    ns: "workspace",
                  })}
                </label>
              </p>
              <p>
                {this.props.t("content.evaluationHasFee", {
                  ns: "workspace",
                })}
              </p>
            </div>
          ) : null}
          <div className="form-element dialog__content-row">
            <p>
              <label htmlFor="signUpMessage">
                {this.props.t("labels.message", {
                  ns: "workspace",
                })}
              </label>
              <textarea
                id="signUpMessage"
                className="form-element__textarea"
                value={this.state.message}
                onChange={this.updateMessage}
              />
            </p>
          </div>
        </div>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "info"]}
          onClick={this.signup.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.signUp", {
            ns: "workspace",
          })}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="workspace-signup-dialog"
        title={this.props.t("labels.signUp", { ns: "workspace" })}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
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
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ signupIntoWorkspace }, dispatch);
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceSignupDialog)
);
