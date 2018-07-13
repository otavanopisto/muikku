import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { ProfileType } from '~/reducers/main-function/profile';
import Moment from '~/lib/moment';
import { saveProfileProperty, SaveProfilePropertyTriggerType } from '~/actions/main-function/profile';
import { bindActionCreators } from 'redux';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import moment from '~/lib/moment';

import UpdateUsernamePasswordDialog from '../../dialogs/update-username-password';

interface ProfileInfoAndSettingsProps {
  i18n: i18nType,
  status: StatusType,
  profile: ProfileType,
  
  saveProfileProperty: SaveProfilePropertyTriggerType,
  displayNotification: DisplayNotificationTriggerType
}

interface ProfileInfoAndSettingsState {
  profileVacationStart: any,
  profileVacationEnd: any,
  phoneNumber: string
}

class ProfileInfoAndSettings extends React.Component<ProfileInfoAndSettingsProps, ProfileInfoAndSettingsState> {
  constructor(props: ProfileInfoAndSettingsProps){
    super(props);
    
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.save = this.save.bind(this);
    
    this.state = {
      profileVacationStart: null,
      profileVacationEnd: null,
      phoneNumber: ""
    }
  }
  componentWillReceiveProps(nextProps: ProfileInfoAndSettingsProps){
    if (nextProps.profile.properties['profile-vacation-start'] && 
        this.props.profile.properties['profile-vacation-start'] !== nextProps.profile.properties['profile-vacation-start']){
      this.setState({
        profileVacationStart: Moment(nextProps.profile.properties['profile-vacation-start'])
      });
    }
    
    if (nextProps.profile.properties['profile-vacation-end'] && 
        this.props.profile.properties['profile-vacation-end'] !== nextProps.profile.properties['profile-vacation-end']){
      this.setState({
        profileVacationEnd: Moment(nextProps.profile.properties['profile-vacation-end'])
      });
    }
    
    if (nextProps.profile.properties['profile-phone'] && 
        this.props.profile.properties['profile-phone'] !== nextProps.profile.properties['profile-phone']){
      this.setState({
        phoneNumber: nextProps.profile.properties['profile-phone']
      });
    }
  }
  handleDateChange(stateLocation: string, newDate: any){
    let nState:any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(nState);
  }
  onPhoneChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      phoneNumber: e.target.value
    });
  }
  save(){
    let totals = 0;
    let done = 0;
    let cb = ()=>{
      done++;
      if (totals === done){
        this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.saved"), 'info')
      }
    }
    if (this.props.profile.properties['profile-vacation-start'] !== this.state.profileVacationStart){
      totals++;
      this.props.saveProfileProperty('profile-vacation-start', this.state.profileVacationStart ? this.state.profileVacationStart.toISOString() : null, cb);
    }
    
    if (this.props.profile.properties['profile-vacation-end'] !== this.state.profileVacationEnd){
      totals++;
      this.props.saveProfileProperty('profile-vacation-end', this.state.profileVacationEnd ? this.state.profileVacationEnd.toISOString() : null, cb);
    }
    
    if ((this.props.profile.properties['profile-phone'] || "") !== this.state.phoneNumber){
      totals++;
      this.props.saveProfileProperty('profile-phone', this.state.phoneNumber.trim(), cb);
    }
  }
  render(){
    return (<div className="container container--full">
        <h1 className="profile-user-realname">{this.props.status.profile.displayName}</h1>
        {this.props.status.profile.emails.length ? <div>
          <label>{this.props.i18n.text.get('plugin.profile.emailsLabel')}</label>
          {this.props.status.profile.emails.map((email)=>{
            return <div className="profile-user-data" key={email}>{email}</div>
          })}
        </div> : null}
        {this.props.status.profile.addresses.length ? <div>
          <label>{this.props.i18n.text.get('plugin.profile.addressesLabel')}</label>
          {this.props.status.profile.addresses.map((address)=>{
            return <div className="profile-user-data" key={address}>{address}</div>
          })}
        </div> : null}
        {this.props.status.profile.phoneNumbers.length ? <div>
          <label>{this.props.i18n.text.get('plugin.profile.phoneNumbers')}</label>
          {this.props.status.profile.phoneNumbers.map((phoneNumber)=>{
            return <div className="profile-user-data" key={phoneNumber}>{phoneNumber}</div>
          })}
        </div> : null}
        {this.props.status.profile.studyStartDate ? <div>
          <label>{this.props.i18n.text.get('plugin.profile.studyStartDateLabel')}</label>
          <div className="profile-user-data">{this.props.i18n.time.format(moment(this.props.status.profile.studyStartDate, "ddd MMM DD hh:mm:ss ZZ YYYY").toDate())}</div>
        </div> : null}
        {this.props.status.profile.studyTimeEnd ? <div>
          <label>{this.props.i18n.text.get('plugin.profile.studyTimeEndLabel')}</label>
          <div className="profile-user-data">{this.props.i18n.time.format(moment(this.props.status.profile.studyTimeEnd, "ddd MMM DD hh:mm:ss ZZ YYYY").toDate())}</div>
          {this.props.status.profile.studyTimeLeftStr ? 
              <div className="profile-user-data">{this.props.status.profile.studyTimeLeftStr}</div> : null}
        </div> : null}

        <div className="profile-change-password-container">
          <UpdateUsernamePasswordDialog>
            <div className="profile-change-password">{this.props.i18n.text.get('plugin.profile.changePassword.buttonLabel')}</div>
          </UpdateUsernamePasswordDialog>
        </div>

        {this.props.status.isStudent ? <div className="profile-change-address-municipality-container">
          <div className="profile-change-address-municipality">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.buttonLabel')}</div>
        </div> : <form>
          <div className="profile-basicinfo-section">
            <div className="profile-phone-wrapper">
              <label>{this.props.i18n.text.get('plugin.profile.phoneNumber.label')}</label>
              <input type="text" autoComplete="tel-national" size={20} onChange={this.onPhoneChange} value={this.state.phoneNumber}/>
            </div>
          </div>
          <div className="profile-vacationinfo-section">
            <div className="profile-vacation-wrapper">
              <div className="profile-vacation-date">
                <label>{this.props.i18n.text.get('plugin.profile.awayStartDate.label')}</label>
                <DatePicker selected={this.state.profileVacationStart} onChange={this.handleDateChange.bind(this, "profileVacationStart")}
                locale={this.props.i18n.time.getLocale()}/>
              </div>
              <div className="profile-vacation-date">
                <label>{this.props.i18n.text.get('plugin.profile.awayEndDate.label')}</label>
                <DatePicker selected={this.state.profileVacationEnd} onChange={this.handleDateChange.bind(this, "profileVacationEnd")}
                locale={this.props.i18n.time.getLocale()}/>
              </div>
            </div>

            <div className="profile-button-wrapper">
              <div className="save-profile-fields" onClick={this.save}>{this.props.i18n.text.get('plugin.profile.save.button')}</div>
            </div>
          </div>
        </form>}
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status,
    profile: state.profile
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({saveProfileProperty, displayNotification}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileInfoAndSettings);