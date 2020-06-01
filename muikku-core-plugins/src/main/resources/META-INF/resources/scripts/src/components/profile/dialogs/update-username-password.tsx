import Dialog from '~/components/general/dialog';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';
import '~/sass/elements/buttons.scss';
import Button from '~/components/general/button';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import { bindActionCreators } from 'redux';

import mApi from '~/lib/mApi';
import { ProfileType } from '~/reducers/main-function/profile';
import { loadProfileUsername, LoadProfileUsernameTriggerType } from '~/actions/main-function/profile';

interface UpdateUsernamePasswordDialogProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  profile: ProfileType,
  displayNotification: DisplayNotificationTriggerType,
  loadProfileUsername: LoadProfileUsernameTriggerType
}

interface UpdateUsernamePasswordDialogState {
  username: string,
  oldPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
  locked: boolean
}

class UpdateUsernamePasswordDialog extends React.Component<UpdateUsernamePasswordDialogProps, UpdateUsernamePasswordDialogState> {
  constructor(props: UpdateUsernamePasswordDialogProps){
    super(props);

    this.update = this.update.bind(this);
    this.updateField = this.updateField.bind(this);

    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      locked: false
    }
  }
  componentWillReceiveProps(nextProps: UpdateUsernamePasswordDialogProps){
    if (nextProps.profile.username !== null && nextProps.profile.username !== this.state.username){
      this.setState({
        username: nextProps.profile.username
      });
    }
  }
  update(closeDialog: ()=>any){
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

    mApi().userplugin.credentials.update(values).callback((err: any, result: any)=>{
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
        closeDialog();
        this.setState({
          username: "",
          oldPassword: "",
          newPassword: "",
          newPasswordConfirm: ""
        });
        if (values.newPassword === ''){
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.username.successful"), "success");
        } else {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.successful"), "success");
        }

        this.props.loadProfileUsername();
      }
    });
  }

  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>){
    let nField:any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }

  render(){
    let content = (closeDialog: ()=>any)=><div>
        <p>{this.props.i18n.text.get('plugin.profile.changePassword.dialog.desription')}</p>
        <form>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.usernameField.label')}</label>
            <input type="text" className="form-element__input form-element__input--profile" value={this.state.username} onChange={this.updateField.bind(this, "username")}/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.oldPasswordField.label')}</label>
            <input type="password" className="form-element__input form-element__input--profile" value={this.state.oldPassword} onChange={this.updateField.bind(this, "oldPassword")}/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.newPasswordField1.label')}</label>
            <input type="password" className="form-element__input form-element__input--profile" value={this.state.newPassword} onChange={this.updateField.bind(this, "newPassword")}/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changePassword.dialog.newPasswordField2.label')}</label>
            <input type="password" className={`form-element__input form-element__input--profile ${this.state.newPassword !== this.state.newPasswordConfirm ? "form-element__input--profile-wrong" : ""}`}
              value={this.state.newPasswordConfirm} onChange={this.updateField.bind(this, "newPasswordConfirm")}/>
          </div>
        </form>
      </div>;
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["success","standard-ok"]} onClick={this.update.bind(this, closeDialog)} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.profile.changePassword.dialog.button.saveLabel')}
        </Button>
        <Button buttonModifiers={["cancel","standard-cancel"]} onClick={closeDialog} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.profile.changePassword.dialog.button.cancelLabel')}
        </Button>
      </div>
    }
    return <Dialog title={this.props.i18n.text.get('plugin.profile.changePassword.dialog.title')}
      content={content} footer={footer} modifier="change-password">
        {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    profile: state.profile
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({displayNotification, loadProfileUsername}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateUsernamePasswordDialog);
