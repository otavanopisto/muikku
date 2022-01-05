import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Panel from "~/components/general/panel";
import Button from "~/components/general/button";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import {
  updateCredentials,
  UpdateCredentialsTriggerType,
} from "~/actions/base/credentials";
import { CredentialsType } from "~/reducers/base/credentials";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
import LoginButton from "../../base/login-button";

interface ReturnCredentialsProps {
  displayNotification: DisplayNotificationTriggerType;
  updateCredentials: UpdateCredentialsTriggerType;
  credentials: CredentialsType;
  i18n: i18nType;
}

interface ReturnCredentialsState {
  username: string;
  newPassword: string;
  newPasswordConfirm: string;
  locked: boolean;
}

class ReturnCredentials extends React.Component<
  ReturnCredentialsProps,
  ReturnCredentialsState
> {
  constructor(props: ReturnCredentialsProps) {
    super(props);
    this.state = {
      username: "",
      newPassword: "",
      newPasswordConfirm: "",
      locked: false,
    };
  }

  componentWillReceiveProps() {
    this.setState({
      username: this.props.credentials.username,
    });
  }
  handleNewCredentials() {
    const newPassword1 = this.state.newPassword;
    const newPassword2 = this.state.newPasswordConfirm;
    const userName = this.state.username;
    const newUserCredentials = {
      username: this.state.username,
      password: this.state.newPassword,
      secret: this.props.credentials.secret,
    };
    if (userName == "") {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotpassword.changeCredentials.messages.error.empty.username"
        ),
        "error"
      );
      return;
    }

    if (newPassword1 !== newPassword2) {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotpassword.changeCredentials.messages.error.passwordsDontMatch"
        ),
        "error"
      );
      return;
    }

    if (newPassword1 == "" || newPassword2 == "") {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.forgotpassword.changeCredentials.messages.error.empty.passwords"
        ),
        "error"
      );
      return;
    }

    this.setState({
      locked: true,
    });

    this.props.updateCredentials(newUserCredentials);
  }

  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>) {
    const nField: any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }

  render() {
    const credentialsContent =
      this.props.credentials.state == "READY" ? (
        <div className="form form--forgot-password">
          <div className="form-row">
            <div className="form-element form-element--forgot-password">
              <label htmlFor="resetCredentialsUsername">
                {this.props.i18n.text.get(
                  "plugin.forgotpassword.changeCredentials.input.name"
                )}
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
          <div className="form-row">
            <div className="form-element form-element--forgot-password">
              <label htmlFor="resetCredentialsPassword1">
                {this.props.i18n.text.get(
                  "plugin.forgotpassword.changeCredentials.input.password1"
                )}
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
          <div className="form-row">
            <div className="form-element form-element--forgot-password">
              <label htmlFor="resetCredentialsPassword2">
                {this.props.i18n.text.get(
                  "plugin.forgotpassword.changeCredentials.input.password2"
                )}
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
          <div className="form-row">
            <div className="form-element form-element--button-container">
              <Button
                onClick={this.handleNewCredentials.bind(this)}
                buttonModifiers="reset-password"
              >
                {this.props.i18n.text.get(
                  "plugin.forgotpassword.changeCredentials.button"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="credentials__changed">
          <div className="credentials__changed-message">
            {this.props.i18n.text.get(
              "plugin.forgotpassword.changeCredentials.messages.success.loginFromCredentials"
            )}
          </div>
          <div className="credentials__changed-action">
            <LoginButton />
          </div>
        </div>
      );

    return <Panel>{credentialsContent}</Panel>;
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { displayNotification, updateCredentials },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ReturnCredentials);
