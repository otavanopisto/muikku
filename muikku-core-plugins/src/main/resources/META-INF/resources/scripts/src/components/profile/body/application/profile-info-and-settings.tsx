import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { ProfileType } from '~/reducers/main-function/profile';
import { saveProfileProperty, SaveProfilePropertyTriggerType } from '~/actions/main-function/profile';
import { bindActionCreators } from 'redux';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import moment from '~/lib/moment';
import UpdateAddressDialog from '../../dialogs/update-address';
import UpdateUsernamePasswordDialog from '../../dialogs/update-username-password';
import Button from '~/components/general/button';

function ProfileProperty(props: {
  i18n: i18nType,
  label: string,
  condition: boolean,
  value: string | Array<string | {
    key: any,
    value: string
  }>
}){
  if (!props.condition){
    return null;
  }
  return <div className="profile-element__item">
    <label className="profile_element-label">{props.i18n.text.get(props.label)}</label>
    {typeof props.value === "string" ?
      <div>{props.value}</div> :
      props.value.map((v)=>{
        return typeof v === "string" ? <div className="profile-user-data" key={v}>{v}</div> : <div className="profile-user-data" key={v.key}>{v.value}</div>
      })}
  </div>
}

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
      profileVacationStart: (props.profile.properties['profile-vacation-start'] && moment(props.profile.properties['profile-vacation-start'])) || null,
      profileVacationEnd: (props.profile.properties['profile-vacation-end'] && moment(props.profile.properties['profile-vacation-end'])) || null,
      phoneNumber: props.profile.properties['profile-phone'] || ""
    }
  }
  componentWillReceiveProps(nextProps: ProfileInfoAndSettingsProps){
    if (nextProps.profile.properties['profile-vacation-start'] && 
        this.props.profile.properties['profile-vacation-start'] !== nextProps.profile.properties['profile-vacation-start']){
      this.setState({
        profileVacationStart: moment(nextProps.profile.properties['profile-vacation-start'])
      });
    }
    
    if (nextProps.profile.properties['profile-vacation-end'] && 
        this.props.profile.properties['profile-vacation-end'] !== nextProps.profile.properties['profile-vacation-end']){
      this.setState({
        profileVacationEnd: moment(nextProps.profile.properties['profile-vacation-end'])
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
        this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.saved"), 'success')
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
    let studyTimeEndValues = [];
    if (this.props.status.profile.studyTimeEnd){
      studyTimeEndValues.push(this.props.i18n.time.format(moment(this.props.status.profile.studyTimeEnd, "ddd MMM DD hh:mm:ss ZZ YYYY").toDate()));
      if (this.props.status.profile.studyTimeLeftStr){
        studyTimeEndValues.push(this.props.status.profile.studyTimeLeftStr);
      }
    }
    return (<div className="profile-element">
        <h1 className="profile-element__title">{this.props.status.profile.displayName}</h1>
        <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.emails.length} label="plugin.profile.emailsLabel" 
          value={this.props.status.profile.emails}/>
        <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.addresses.length} label="plugin.profile.addressesLabel" 
         value={this.props.status.profile.addresses}/>
        <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.phoneNumbers.length} label="plugin.profile.phoneNumbers" 
         value={this.props.status.profile.phoneNumbers}/>
        <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.studyStartDate} label="plugin.profile.studyStartDateLabel" 
        value={this.props.i18n.time.format(moment(this.props.status.profile.studyStartDate, "ddd MMM DD hh:mm:ss ZZ YYYY").toDate())}/>
        <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.studyTimeEnd} label="plugin.profile.studyTimeEndLabel" 
        value={studyTimeEndValues}/>

        <div className="profile-element__item">
          <UpdateUsernamePasswordDialog>
            <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changePassword.buttonLabel')}</Button>
          </UpdateUsernamePasswordDialog>
        </div>

        {this.props.status.isStudent ? <div className="profile-element__item">
          <UpdateAddressDialog>
            <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.buttonLabel')}</Button>
          </UpdateAddressDialog>
        </div> : <form>
          <div className="profile-element__item">
            <label className="profile_element-label">{this.props.i18n.text.get('plugin.profile.phoneNumber.label')}</label>
            <input className="form-element__input" type="text" autoComplete="tel-national" onChange={this.onPhoneChange} value={this.state.phoneNumber}/>
          </div>
          <div className="profile-element__item">
            <label className="profile_element-label">{this.props.i18n.text.get('plugin.profile.awayStartDate.label')}</label>
            <DatePicker className="form-element__input" onChange={this.handleDateChange.bind(this, "profileVacationStart")}
             maxDate={this.state.profileVacationEnd || null} 
             locale={this.props.i18n.time.getLocale()} selected={this.state.profileVacationStart}/>
          </div>
          <div className="profile-element__item">
            <label className="profile_element-label">{this.props.i18n.text.get('plugin.profile.awayEndDate.label')}</label>
            <DatePicker className="form-element__input" onChange={this.handleDateChange.bind(this, "profileVacationEnd")}
             minDate={this.state.profileVacationStart || null}
             locale={this.props.i18n.time.getLocale()} selected={this.state.profileVacationEnd}/>
           </div>
          <div className="profile-element__item">
            <Button buttonModifiers="primary-function-save" onClick={this.save}>{this.props.i18n.text.get('plugin.profile.save.button')}</Button>
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