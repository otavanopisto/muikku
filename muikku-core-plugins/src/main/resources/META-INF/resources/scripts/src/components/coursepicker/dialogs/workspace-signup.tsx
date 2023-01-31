import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
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
import { WorkspaceSignUpDetails, WorkspaceType } from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * WorkspaceSignupDialogProps
 */
interface WorkspaceSignupDialogProps
  extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => void;
  workspace?: WorkspaceType;
  status: StatusType;
  workspaceSignUpDetails?: WorkspaceSignUpDetails;
  currentWorkspace: WorkspaceType;
  signupIntoWorkspace: SignupIntoWorkspaceTriggerType;
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
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const workspaceSignUpDetails =
      this.props.workspaceSignUpDetails || this.props.currentWorkspace;

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
            {
              // TODO: use i18next
            }
            {this.props.i18nOLD.text.get(
              "plugin.workspaceSignUp.courseDescription",
              workspaceSignUpDetails.name,
              workspaceSignUpDetails.nameExtension || ""
            )}
          </div>
          {hasFees ? (
            <div className="form-element dialog__content-row">
              <p>
                <label>
                  {
                    // TODO: use i18next
                  }
                  {this.props.i18nOLD.text.get(
                    "plugin.workspaceSignUp.fee.label"
                  )}
                </label>
              </p>
              <p>
                {
                  // TODO: use i18next
                }
                {this.props.i18nOLD.text.get(
                  "plugin.workspaceSignUp.fee.content"
                )}
              </p>
            </div>
          ) : null}
          <div className="form-element dialog__content-row">
            <p>
              <label htmlFor="signUpMessage">
                {
                  // TODO: use i18next
                }
                {this.props.i18nOLD.text.get(
                  "plugin.workspaceSignUp.messageLabel"
                )}
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
          {/* {this.props.t("workspaces:actions.signIn")} */} asd
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="workspace-signup-dialog"
        // TODO: use i18next
        title={this.props.i18nOLD.text.get("plugin.workspaceSignUp.title")}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
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
    i18nOLD: state.i18nOLD,
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

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceSignupDialog)
);
