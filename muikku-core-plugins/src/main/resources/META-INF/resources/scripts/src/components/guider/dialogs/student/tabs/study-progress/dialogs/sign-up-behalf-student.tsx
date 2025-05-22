import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
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
import { Action, bindActionCreators, Dispatch } from "redux";
import { WorkspaceSuggestion } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * SaveExtraDetailsDialogProps
 */
interface SignUpBehalfOfStudentDialogProps {
  isOpen: boolean;
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

const guiderApi = MApi.getGuiderApi();

/**
 * SignUpBehalfOfStudentDialog
 * @param props props
 * @returns JSX.Element
 */
const SignUpBehalfOfStudentDialog: React.FC<
  SignUpBehalfOfStudentDialogProps
> = (props) => {
  const { isOpen, studentEntityId, workspaceSuggestion, children, onClose } =
    props;

  const [message, setMessage] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);

  const { t } = useTranslation(["studyMatrix"]);

  /**
   * Handles message change
   * @param e e
   */
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  /**
   * Handles apply click
   * @param closeDialog closeDialog
   */
  const handleApplyClick = async (closeDialog: () => void) => {
    setDisabled(true);

    try {
      await guiderApi.signupStudentToWorkspace({
        studentId: studentEntityId,
        workspaceId: workspaceSuggestion.id,
        signupStudentToWorkspaceRequest: {
          message,
        },
      });

      setDisabled(false);
      onClose();
      closeDialog();
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      displayNotification(
        t("notifications.signUpError", { ns: "studyMatrix" }),
        "error"
      );

      setDisabled(false);
    }
  };

  /**
   * Handles close click
   * @param closeDialog closeDialog
   */
  const handleCloseClick = (closeDialog: () => void) => {
    onClose();
    closeDialog();
  };

  if (!studentEntityId || !workspaceSuggestion) {
    return null;
  }

  let workspaceName = workspaceSuggestion.name;
  if (workspaceSuggestion.nameExtension) {
    workspaceName += ` (${workspaceSuggestion.nameExtension})`;
  }

  /**
   * Handles content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <div className="dialog__content-row">
        {t("labels.signUpStudentToWorkspace", {
          ns: "studyMatrix",
          workspaceName: workspaceName,
        })}
      </div>
      <div className="form-element dialog__content-row">
        <label htmlFor="signUpMessage">
          {t("labels.signUpMessage", { ns: "studyMatrix" })}
        </label>
        <textarea
          id="signUpMessage"
          className="form-element__textarea"
          value={message}
          onChange={handleMessageChange}
        />
      </div>
    </div>
  );

  /**
   * Handles footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "execute"]}
        onClick={() => handleApplyClick(closeDialog)}
        disabled={disabled}
      >
        {t("actions.signUpStudent", { ns: "studyMatrix" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={() => handleCloseClick(closeDialog)}
        disabled={disabled}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="workspace-signup-dialog"
      title={t("labels.signUpStudent", { ns: "studyMatrix" })}
      isOpen={isOpen}
      disableScroll={true}
      content={content}
      footer={footer}
      closeOnOverlayClick={false}
    >
      {children}
    </Dialog>
  );
};

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpBehalfOfStudentDialog);
