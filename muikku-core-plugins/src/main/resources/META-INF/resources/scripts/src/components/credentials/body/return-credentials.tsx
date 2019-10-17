import * as React from 'react';
import { connect, Dispatch} from 'react-redux';
import mApi, { MApiError } from '~/lib/mApi';
import promisify from '~/util/promisify';
import Panel from '~/components/general/panel';
import Button from '~/components/general/button';
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import { bindActionCreators } from 'redux';

interface ReturnCredentialsProps {
  secret: string,
  displayNotification: DisplayNotificationTriggerType,
  i18n: i18nType,
}

interface ReturnCredentialsState {
  username: string,
  newPassword: string,
  newPasswordConfirm: string,
  locked: boolean,
  handled: boolean
}

class ReturnCredentials extends React.Component<ReturnCredentialsProps, ReturnCredentialsState> {
  constructor(props: ReturnCredentialsProps){
    super(props);
    this.state = {
        
       username: "",
       newPassword: "",
       newPasswordConfirm:"",
       locked: false,
       handled: false
    }
  }
  async componentDidMount() {
    try {
    const data:any = await (promisify(mApi().forgotpassword.credentialReset.read(this.props.secret), 'callback')());
    this.setState({username: data.username});
    } catch (err){
      if (!(err instanceof MApiError)){
        throw err;
      }
       alert(err);
    }
  }
  handleNewCredentials() {
    let newPassword1 = this.state.newPassword;
    let newPassword2 = this.state.newPasswordConfirm;
    let userName = this.state.username;
    
    if(userName == "") {
      this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.emptypass"), "error");
      return;
    }
    
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
        secret : this.props.secret,
        password : newPassword1,
        username : userName
    };
    
     mApi().forgotpassword.credentialReset.create(values).callback((err: any, result: any)=>{
       this.setState({
         locked: false
       });       
       
       if (err) {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.failconfirm"),err);  
       } else {
         this.setState({
           username: "",
           newPassword: "",
           newPasswordConfirm: ""
         });
         this.props.displayNotification(this.props.i18n.text.get("plugin.profile.changePassword.dialog.notif.failconfirm"),err);
       }
     });
    
  } 
 
  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>){
    let nField:any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }
  
  
  render(){
    return (
      <Panel>
        <div className="form form--forgot-password">
          <div className="form-row">
            <div className="form-element">
              <label>TODO: Name</label>
              <input className="form-element__input" type="text" value={this.state.username} onChange={this.updateField.bind(this, "username")}/>
            </div>
           </div>
          <div className="form-row">
            <div className="form-element">
              <label>TODO: Password</label>
              <input  className="form-element__input" type="password" onChange={this.updateField.bind(this, "newPassword")}/>
            </div>
            <div className="form-element">
              <label>TODO: Password again</label>
              <input className="form-element__input" type="password" onChange={this.updateField.bind(this, "newPasswordConfirm")} />
            </div>
             <div className="form-element form-element--button-container">
              <Button onClick={this.handleNewCredentials.bind(this)} buttonModifiers="reset-password" >TODO: Change password</Button>
            </div>
          </div>
        </div>
       </Panel>);
  }

}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({displayNotification}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReturnCredentials);