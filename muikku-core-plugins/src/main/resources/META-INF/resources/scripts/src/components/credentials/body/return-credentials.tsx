import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Button from "~/components/general/button";
import "~/sass/elements/form.scss";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import {
  updateCredentials,
  UpdateCredentialsTriggerType,
} from "~/actions/base/credentials";
import { CredentialsState } from "~/reducers/base/credentials";
import { bindActionCreators } from "redux";
import LoginButton from "../../base/login-button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ReturnCredentialsProps
 */
interface ReturnCredentialsProps extends WithTranslation {
  displayNotification: DisplayNotificationTriggerType;
  updateCredentials: UpdateCredentialsTriggerType;
  credentials: CredentialsState;
}

/**
 * ReturnCredentialsState
 */
interface ReturnCredentialsState {
  username: string;
  newPassword: string;
  newPasswordConfirm: string;
  locked: boolean;
}

/**
 * ReturnCredentials
 */
class ReturnCredentials extends React.Component<
  ReturnCredentialsProps,
  ReturnCredentialsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ReturnCredentialsProps) {
    super(props);
    this.state = {
      username: "",
      newPassword: "",
      newPasswordConfirm: "",
      locked: false,
    };
  }

  /**
   * componentWillReceiveProps
   */
  componentWillReceiveProps() {
    this.setState({
      username: this.props.credentials.credentials.username,
    });
  }

  /**
   * handleNewCredentials
   */
  handleNewCredentials() {
    const newPassword1 = this.state.newPassword;
    const newPassword2 = this.state.newPasswordConfirm;
    const userName = this.state.username;
    const newUserCredentials = {
      username: this.state.username,
      password: this.state.newPassword,
      secret: this.props.credentials.credentials.secret,
    };
    if (userName == "") {
      this.props.displayNotification(
        this.props.i18n.t("validation.username"),
        "error"
      );
      return;
    }

    if (newPassword1 !== newPassword2) {
      this.props.displayNotification(
        this.props.i18n.t("validation.password", { context: "match" }),
        "error"
      );
      return;
    }

    if (newPassword1 == "" || newPassword2 == "") {
      this.props.displayNotification(
        this.props.i18n.t("validation.password"),
        "error"
      );
      return;
    }

    this.setState({
      locked: true,
    });

    this.props.updateCredentials(newUserCredentials);
  }

  /**
   * updateField
   * @param field field
   * @param e e
   */
  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>) {
    const nField: any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }

  /**
   * render
   */
  render() {
    const credentialsContent =
      this.props.credentials.state == "READY" ? (
        <div className="form">
          <div className="form__row">
            <div className="form-element form-element--forgot-password">
              <label htmlFor="resetCredentialsUsername">
                {this.props.i18n.t("labels.userName")}
              </label>
              <input
                id="resetCredentialsUsername"
                className="form-element__input"
                type="text"
                value={this.state.username}
                onChange={this.updateField.bind(this, "username")}
              />
            </div>
          </div>
          <div className="form__row">
            <div className="form-element form-element--forgot-password">
              <label htmlFor="resetCredentialsPassword1">
                {this.props.i18n.t("labels.password1")}
              </label>
              <input
                id="resetCredentialsPassword1"
                className="form-element__input"
                type="password"
                value={this.state.newPassword}
                onChange={this.updateField.bind(this, "newPassword")}
              />
            </div>
          </div>
          <div className="form__row">
            <div className="form-element form-element--forgot-password">
              <label htmlFor="resetCredentialsPassword2">
                {this.props.i18n.t("labels.password2")}
              </label>
              <input
                id="resetCredentialsPassword2"
                className="form-element__input"
                type="password"
                value={this.state.newPasswordConfirm}
                onChange={this.updateField.bind(this, "newPasswordConfirm")}
              />
            </div>
          </div>
          <div className="form__row">
            <div className="form-element form-element--button-container">
              <Button
                onClick={this.handleNewCredentials.bind(this)}
                buttonModifiers="reset-password"
              >
                {this.props.i18n.t("actions.save")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="credentials__changed">
          <div className="credentials__changed-message">
            {this.props.i18n.t("content.loginFromCredentials")}
          </div>
          <div className="credentials__changed-action">
            <LoginButton />
          </div>
        </div>
      );

    return <>{credentialsContent}</>;
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { displayNotification, updateCredentials },
    dispatch
  );
}

export default withTranslation()(
  connect(null, mapDispatchToProps)(ReturnCredentials)
);
