import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { withTranslation, WithTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ForgotPasswordDialogProps
 */
interface ForgotPasswordDialogProps extends WithTranslation {
  displayNotification: DisplayNotificationTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  modifier?: string;
}

/**
 * ForgotPasswordDialogState
 */
interface ForgotPasswordDialogState {
  email: string;
}

const emailRegexValidator =
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

/**
 * ForgotPasswordDialog
 */
class ForgotPasswordDialog extends React.Component<
  ForgotPasswordDialogProps,
  ForgotPasswordDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ForgotPasswordDialogProps) {
    super(props);

    this.state = {
      email: "",
    };

    this.resetPassword = this.resetPassword.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
  }

  /**
   * updateEmail
   * @param e e
   */
  updateEmail(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: e.target.value });
  }

  /**
   * resetPassword
   * @param closeDialog closeDialog
   * @param e e
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async resetPassword(closeDialog: () => any, e: React.ChangeEvent<any>) {
    const credentialsApi = MApi.getCredentialsApi();

    const { t } = this.props;
    if (!e.isDefaultPrevented()) {
      e.preventDefault();
    }

    if (!this.state.email) {
      this.props.displayNotification(t("validation.email"), "error");
      return;
    } else if (!emailRegexValidator.test(this.state.email)) {
      this.props.displayNotification(t("validation.emailInvalid"), "error");
      return;
    }

    try {
      await credentialsApi.resetCredentials({
        email: this.state.email,
      });

      this.props.displayNotification(
        t("content.passwordChangeMailSent", {
          ns: "frontPage",
          email: this.state.email,
        }),
        "success"
      );

      this.setState({
        email: "",
      });

      closeDialog();
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      this.props.displayNotification(
        t("content.noUserByEmail", {
          ns: "frontPage",
          email: this.state.email,
        }),
        "error"
      );
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;
    t("content.forgotPassword", { ns: "frontPage" });

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {t("content.forgotPassword", { ns: "frontPage" })}
        <br />
        <br />
        <form
          className="form"
          onSubmit={this.resetPassword.bind(this, closeDialog)}
        >
          <div className="form__row">
            <div className="form-element">
              <label htmlFor="forgotpasswordEmail">{t("labels.email")}</label>
              <input
                type="text"
                name="email"
                id="forgotpasswordEmail"
                value={this.state.email}
                onChange={this.updateEmail}
                className="form-element__input form-element__input--forgotpassword"
              />
            </div>
          </div>
        </form>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          {t("actions.cancel")}
        </Button>
        <Button
          buttonModifiers={["standard-ok", "success"]}
          onClick={this.resetPassword.bind(this, closeDialog)}
        >
          {t("actions.send")}
        </Button>
      </div>
    );

    return (
      <Dialog
        title={t("labels.forgotPassword")}
        content={content}
        footer={footer}
        modifier={
          this.props.modifier
            ? ["forgot-password", this.props.modifier]
            : "forgot-password"
        }
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["frontPage", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordDialog)
);
