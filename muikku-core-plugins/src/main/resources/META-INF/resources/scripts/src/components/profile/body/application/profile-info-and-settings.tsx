import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';

interface ProfileInfoAndSettingsProps {
  i18n: i18nType,
  status: StatusType
}

interface ProfileInfoAndSettingsState {
  profileVacationStart: any,
  profileVacationEnd: any
}

class ProfileInfoAndSettings extends React.Component<ProfileInfoAndSettingsProps, ProfileInfoAndSettingsState> {
  constructor(props: ProfileInfoAndSettingsProps){
    super(props);
    
    this.handleDateChange = this.handleDateChange.bind(this);
    
    this.state = {
      profileVacationStart: null,
      profileVacationEnd: null
    }
  }
  handleDateChange(stateLocation: string, newDate: any){
    let nState:any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(nState);
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
          <div className="profile-user-data">{this.props.i18n.time.format(this.props.status.profile.studyStartDate)}</div>
        </div> : null}
        {this.props.status.profile.studyTimeEnd ? <div>
          <label>{this.props.i18n.text.get('plugin.profile.studyTimeEndLabel')}</label>
          <div className="profile-user-data">{this.props.i18n.time.format(this.props.status.profile.studyTimeEnd)}</div>
          {this.props.status.profile.studyTimeLeftStr ? 
              <div className="profile-user-data">{this.props.i18n.time.format(this.props.status.profile.studyTimeLeftStr)}</div> : null}
        </div> : null}

        <div className="profile-change-password-container">
          <div className="profile-change-password">{this.props.i18n.text.get('plugin.profile.changePassword.buttonLabel')}</div>
        </div>

        {this.props.status.isStudent ? <div className="profile-change-address-municipality-container">
          <div className="profile-change-address-municipality">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.buttonLabel')}</div>
        </div> : <form>
          <div className="profile-basicinfo-section">
            <div className="profile-phone-wrapper">
              <label>{this.props.i18n.text.get('plugin.profile.phoneNumber.label')}</label><input type="text" name="profile-phone" size={20}/>
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
              <div className="save-profile-fields">{this.props.i18n.text.get('plugin.profile.save.button')}</div>
            </div>
          </div>
        </form>}
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileInfoAndSettings);