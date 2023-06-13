import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";

/**
 * SignUpBehalfOfStudentParams
 */
interface SignUpBehalfOfStudentParams {
  /**
   * "Aka" entity id of the student.
   */
  userId: number;
  /**
   * Id of workspace where student is signing up.
   */
  workspaceId: number;
  /**
   * Message to be sent to the student.
   */
  message: string;
}

/**
 * SaveExtraDetailsDialogProps
 */
interface SignUpBehalfOfStudentDialogProps {
  i18n: i18nType;
  /**
   * Entity id of the student.
   */
  studentsUserEntityId?: number;
  /**
   * Id of workspace where student is signing up.
   */
  workspaceId?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * SaveExtraDetailsDialogState
 */
interface SignUpBehalfOfStudentDialogState {
  message: string;
  disabled: boolean;
}

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

    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  /**
   * Sign up for workspace behalf of student.
   * @param params params
   */
  signUpForWorkspaceBehalfOfStudent = async (
    params: SignUpBehalfOfStudentParams
  ) =>
    await promisify(
      mApi().guider.student.workspace.signup.create(
        params.userId,
        params.workspaceId,
        {
          message: params.message,
        }
      ),
      "callback"
    )();

  /**
   * handleMessageChange
   * @param e e
   */
  handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ message: e.target.value });
  };

  /**
   * handleSaveClick
   * @param closeDialog closeDialog
   */
  async handleSaveClick(closeDialog: () => void) {
    this.setState({
      disabled: true,
    });

    try {
      await this.signUpForWorkspaceBehalfOfStudent({
        userId: this.props.studentsUserEntityId,
        workspaceId: this.props.workspaceId,
        message: this.state.message,
      });

      this.setState({
        disabled: false,
      });
      closeDialog();
    } catch (err) {
      displayNotification("Virhe ilmoittautumisessa työtilaan", "error");

      this.setState({
        disabled: false,
      });
    }
  }

  /**
   * handleCloseClick
   * @param closeDialog closeDialog
   */
  handleCloseClick(closeDialog: () => void) {
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div className="form-element dialog__content-row">
        <p>
          <label htmlFor="signUpMessage">
            {this.props.i18n.text.get("plugin.workspaceSignUp.messageLabel")}
          </label>
          <textarea
            id="signUpMessage"
            className="form-element__textarea"
            value={this.state.message}
            onChange={this.handleMessageChange}
          />
        </p>
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
          onClick={this.handleSaveClick.bind(this, closeDialog)}
          disabled={this.state.disabled}
        >
          Tallenna
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.handleCloseClick.bind(this, closeDialog)}
          disabled={this.state.disabled}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="workspace-signup-dialog"
        isOpen={!!(this.props.studentsUserEntityId && this.props.workspaceId)}
        disableScroll={true}
        title="ILMOITA OPISKELIJA TYÖTILAAN"
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
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpBehalfOfStudentDialog);
