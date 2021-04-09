import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import Button from '~/components/general/button';
import mApi from '~/lib/mApi';
import { ProfileType } from '~/reducers/main-function/profile';
import { loadProfileUsername, LoadProfileUsernameTriggerType } from '~/actions/main-function/profile';
import { bindActionCreators, Dispatch } from "redux";
import { displayNotification, DisplayNotificationTriggerType } from "~/actions/base/notifications";

interface ISecurityProps {
  i18n: i18nType;
  profile: ProfileType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  loadProfileUsername: LoadProfileUsernameTriggerType;
}

interface ISecurityState {
  username: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  locked: boolean;
}

class Security extends React.Component<ISecurityProps, ISecurityState> {
  constructor(props: ISecurityProps) {
    super(props);

    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      locked: false
    }

    this.update = this.update.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  componentWillReceiveProps(nextProps: ISecurityProps) {
    if (nextProps.profile.username !== null && nextProps.profile.username !== this.state.username) {
      this.setState({
        username: nextProps.profile.username
      });
    }
  }

  public update() {
    let newPassword1 = this.state.newPassword;
    let newPassword2 = this.state.newPasswordConfirm;

    if (newPassword1 && newPassword2 == "") {
      this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.emptypass"), "error");
      return;
    }

    if (newPassword1 !== newPassword2) {
      this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.failconfirm"), "error");
      return;
    }

    this.setState({
      locked: true
    });

    let values = {
      oldPassword: this.state.oldPassword,
      username: this.state.username,
      newPassword: this.state.newPassword
    };

    mApi().userplugin.credentials.update(values).callback((err: any, result: any) => {
      this.setState({
        locked: false
      });

      if (err) {
        if (result.status === 403) {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.unauthorized"), "error");
        } else if (result.status === 409) {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.alreadyinuse"), "error");
        } else {
          this.props.displayNotification(err.message, "error");
        }
      } else {
        if (values.newPassword === '') {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.username.successful"), "success");
        } else {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.successful"), "success");
        }

        this.props.loadProfileUsername();
      }
    });
  }

  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>) {
    let nField: any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }

  public render() {
    if (this.props.profile.location !== "security") {
      return null;
    }

    return (
      <section>
        <form>
          <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.security')}</h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">

              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label htmlFor="profileUsername" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.usernameField.label')}</label>
                <div className="application-sub-panel__item-data form-element">
                  <input id="profileUsername" type="text" className="form-element__input" value={this.state.username} onChange={this.updateField.bind(this, "username")} />
                </div>
              </div>

              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label htmlFor="profileOldPassword" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.oldPasswordField.label')}</label>
                <div className="application-sub-panel__item-data form-element">
                  <input id="profileOldPassword" type="password" className="form-element__input" value={this.state.oldPassword} onChange={this.updateField.bind(this, "oldPassword")} />
                </div>
              </div>

              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label htmlFor="profileNewPassword1" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.newPasswordField1.label')}</label>
                <div className="application-sub-panel__item-data form-element">
                  <input id="profileNewPassword1" type="password" className="form-element__input" value={this.state.newPassword} onChange={this.updateField.bind(this, "newPassword")} />
                </div>
              </div>

              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label htmlFor="profileNewPassword2" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.newPasswordField2.label')}</label>
                <div className="application-sub-panel__item-data form-element">
                  <input id="profileNewPassword2" type="password" className={`form-element__input ${this.state.newPassword !== this.state.newPasswordConfirm ? "form-element__input--profile-error" : ""}`}
                    value={this.state.newPasswordConfirm} onChange={this.updateField.bind(this, "newPasswordConfirm")} />
                </div>
              </div>

              <div className="application-sub-panel__item-actions">
                <Button buttonModifiers="primary-function-save" onClick={this.update}>{this.props.i18n.text.get('plugin.profile.save.button')}</Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification, loadProfileUsername }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Security);
