import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import { WorkspaceSuggestion } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * SaveExtraDetailsDialogProps
 */
interface SignUpBehalfOfStudentDialogProps extends WithTranslation {
  /**
   * Entity id of the student.
   */
  studentEntityId?: number;
  /**
   * Id of workspace where student is signing up.
   */
  workspaceSuggestion?: WorkspaceSuggestion;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  displayNotification: DisplayNotificationTriggerType;
  onClose: () => void;
}

/**
 * SaveExtraDetailsDialogState
 */
interface SignUpBehalfOfStudentDialogState {
  message: string;
  disabled: boolean;
}

const guiderApi = MApi.getGuiderApi();

/**
 * SaveExtraDetailsDialog
 */
class SignUpBehalfOfStudentDialog extends React.Component<
  SignUpBehalfOfStudentDialogProps,
  SignUpBehalfOfStudentDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SignUpBehalfOfStudentDialogProps) {
    super(props);
    this.state = {
      message: "",
      disabled: false,
    };

    this.handleApplyClick = this.handleApplyClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  /**
   * Handles message change
   *
   * @param e e
   */
  handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: e.target.value });
  };

  /**
   * Handle apply click
   *
   * @param closeDialog closeDialog
   */
  async handleApplyClick(closeDialog: () => void) {
    this.setState({
      disabled: true,
    });

    try {
      await guiderApi.signupStudentToWorkspace({
        studentId: this.props.studentEntityId,
        workspaceId: this.props.workspaceSuggestion.id,
        signupStudentToWorkspaceRequest: {
          message: this.state.message,
        },
      });

      this.setState(
        {
          disabled: false,
        },
        () => {
          this.props.onClose();
          closeDialog();
        }
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      // TODO: lokalisointi
      displayNotification(
        this.props.t("notifications.signUpError", { ns: "studymatrix" }),
        "error"
      );

      this.setState({
        disabled: false,
      });
    }
  }

  /**
   * Handle close click
   *
   * @param closeDialog closeDialog
   */
  handleCloseClick(closeDialog: () => void) {
    this.props.onClose();
    closeDialog();
  }

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    if (!this.props.studentEntityId || !this.props.workspaceSuggestion) {
      return null;
    }

    // Workspace name
    let workspaceName = this.props.workspaceSuggestion.name;

    // + with extension if it exists
    if (this.props.workspaceSuggestion.nameExtension) {
      workspaceName += ` (${this.props.workspaceSuggestion.nameExtension})`;
    }

    /**
     * Dialog content
     *
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div>
        <div className="dialog__content-row">
          {this.props.t("labels.signUpStudentToWorkspace", {
            ns: "studymatrix",
            workspaceName: workspaceName,
          })}
        </div>
        <div className="form-element dialog__content-row">
          <label htmlFor="signUpMessage">
            {this.props.t("labels.signUpMessage", { ns: "studymatrix" })}
          </label>
          <textarea
            id="signUpMessage"
            className="form-element__textarea"
            value={this.state.message}
            onChange={this.handleMessageChange}
          />
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
          buttonModifiers={["standard-ok", "execute"]}
          onClick={this.handleApplyClick.bind(this, closeDialog)}
          disabled={this.state.disabled}
        >
          {this.props.t("actions.signUpStudent", { ns: "studymatrix" })}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.handleCloseClick.bind(this, closeDialog)}
          disabled={this.state.disabled}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="workspace-signup-dialog"
        title={this.props.t("labels.signUpStudent", { ns: "studymatrix" })}
        isOpen={true}
        disableScroll={true}
        content={content}
        footer={footer}
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
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["studymatrix"])(
  connect(mapStateToProps, mapDispatchToProps)(SignUpBehalfOfStudentDialog)
);
