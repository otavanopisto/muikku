import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { ProfileType } from '~/reducers/main-function/profile';
import { saveProfileProperty, SaveProfilePropertyTriggerType, updateProfileChatSettings, UpdateProfileChatSettingsTriggerType } from '~/actions/main-function/profile';
import { bindActionCreators } from 'redux';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import moment from '~/lib/moment';
import UpdateAddressDialog from '../../dialogs/update-address';
import UpdateUsernamePasswordDialog from '../../dialogs/update-username-password';
import Button from '~/components/general/button';
import { DateFormElement, FormElementLabel } from '~/components/general/form-element';

function ProfileProperty(props: {
  i18n: i18nType,
  label: string,
  condition: boolean,
  value: string | Array<string | {
    key: any,
    value: string
  }>
}) {
  if (!props.condition) {
    return null;
  }
  return <div className="profile-element__item">
    <label className="profile-element__label">{props.i18n.text.get(props.label)}</label>
    {typeof props.value === "string" ?
      <div>{props.value}</div> :
      props.value.map((v) => {
        return typeof v === "string" ? <div className="profile-element__data" key={v}>{v}</div> : <div className="profile-element__data" key={v.key}>{v.value}</div>
      })}
  </div>
}

interface ProfileInfoAndSettingsProps {
  i18n: i18nType,
  status: StatusType,
  profile: ProfileType,
  saveProfileProperty: SaveProfilePropertyTriggerType,
  displayNotification: DisplayNotificationTriggerType,
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType
}

interface ProfileInfoAndSettingsState {
  profileVacationStart: any,
  profileVacationEnd: any,
  phoneNumber: string,
  chatVisibility: string,
  chatNickname: string,
  vacationAutoReply: string,
  vacationAutoReplySubject: string,
  vacationAutoReplyMsg: string,
}

class ProfileInfoAndSettings extends React.Component<ProfileInfoAndSettingsProps, ProfileInfoAndSettingsState> {
  constructor(props: ProfileInfoAndSettingsProps) {
    super(props);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);
    this.onChatVisibilityChange = this.onChatVisibilityChange.bind(this);
    this.onChatNicknameChange = this.onChatNicknameChange.bind(this);
    this.onVacationAutoReplyChange = this.onVacationAutoReplyChange.bind(this);
    this.onVacationAutoReplySubjectChange = this.onVacationAutoReplySubjectChange.bind(this);
    this.onVacationAutoReplyMsgChange = this.onVacationAutoReplyMsgChange.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      profileVacationStart: (props.profile.properties['profile-vacation-start'] && moment(props.profile.properties['profile-vacation-start'])) || null,
      profileVacationEnd: (props.profile.properties['profile-vacation-end'] && moment(props.profile.properties['profile-vacation-end'])) || null,
      phoneNumber: props.profile.properties['profile-phone'] || "",
      chatVisibility: (props.profile.chatSettings && props.profile.chatSettings.visibility) || null,
      chatNickname: (props.profile.chatSettings && props.profile.chatSettings.nick) || "",
      vacationAutoReply: props.profile.properties['communicator-auto-reply'] || "",
      vacationAutoReplySubject: props.profile.properties['communicator-auto-reply-subject'] || "",
      vacationAutoReplyMsg: props.profile.properties['communicator-auto-reply-msg'] || "",
    }
  }
  componentWillReceiveProps(nextProps: ProfileInfoAndSettingsProps) {
    if (nextProps.profile.properties['profile-vacation-start'] &&
      this.props.profile.properties['profile-vacation-start'] !== nextProps.profile.properties['profile-vacation-start']) {
      this.setState({
        profileVacationStart: moment(nextProps.profile.properties['profile-vacation-start'])
      });
    }

    if (nextProps.profile.properties['profile-vacation-end'] &&
      this.props.profile.properties['profile-vacation-end'] !== nextProps.profile.properties['profile-vacation-end']) {
      this.setState({
        profileVacationEnd: moment(nextProps.profile.properties['profile-vacation-end'])
      });
    }

    if (nextProps.profile.properties['profile-phone'] &&
      this.props.profile.properties['profile-phone'] !== nextProps.profile.properties['profile-phone']) {
      this.setState({
        phoneNumber: nextProps.profile.properties['profile-phone']
      });
    }

    if (nextProps.profile.properties['communicator-auto-reply'] &&
      this.props.profile.properties['communicator-auto-reply'] !== nextProps.profile.properties['communicator-auto-reply']) {
      this.setState({
        vacationAutoReply: nextProps.profile.properties['communicator-auto-reply']
      });
    }

    if (nextProps.profile.properties['communicator-auto-reply-subject'] &&
      this.props.profile.properties['communicator-auto-reply-subject'] !== nextProps.profile.properties['communicator-auto-reply-subject']) {
      this.setState({
        vacationAutoReplySubject: nextProps.profile.properties['communicator-auto-reply-subject']
      });
    }

    if (nextProps.profile.properties['communicator-auto-reply-msg'] &&
      this.props.profile.properties['communicator-auto-reply-msg'] !== nextProps.profile.properties['communicator-auto-reply-msg']) {
      this.setState({
        vacationAutoReplyMsg: nextProps.profile.properties['communicator-auto-reply-msg']
      });
    }

    if (nextProps.profile.chatSettings && nextProps.profile.chatSettings.visibility &&
      (!this.props.profile.chatSettings ||
        this.props.profile.chatSettings.visibility !== nextProps.profile.chatSettings.visibility)) {
      this.setState({
        chatVisibility: nextProps.profile.chatSettings.visibility
      });
    } else if (!nextProps.profile.chatSettings || typeof nextProps.profile.chatSettings.visibility === "undefined") {
      this.setState({
        chatVisibility: "DISABLED"
      });
    }

    if (nextProps.profile.chatSettings && nextProps.profile.chatSettings.nick &&
      (!this.props.profile.chatSettings ||
        this.props.profile.chatSettings.nick !== nextProps.profile.chatSettings.nick)) {
      this.setState({
        chatNickname: nextProps.profile.chatSettings.nick
      });
    }
  }
  handleDateChange(stateLocation: string, newDate: any) {
    let nState: any = {};
    nState[stateLocation] = newDate;
    (this.setState as any)(nState);
  }
  onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      phoneNumber: e.target.value
    });
  }

  onVacationAutoReplyChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vacationAutoReply: e.target.checked ? "ENABLED" : ""
    });
  }
  onVacationAutoReplySubjectChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      vacationAutoReplySubject: e.target.value
    });
  }
  onVacationAutoReplyMsgChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      vacationAutoReplyMsg: e.target.value
    });
  }
  onChatVisibilityChange(e: React.ChangeEvent<HTMLSelectElement>){
    this.setState({
      chatVisibility: e.target.value
    });
  }
  onChatNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      chatNickname: e.target.value
    });
  }
  save() {
    let totals = 0;
    let done = 0;
    let fail: boolean = false;
    const cb = () => {
      done++;
      if (totals === done && !fail) {
        this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.saved"), 'success')
      }
    }
    const failCB = () => {
      fail = true;
      done++;
    }

    if (!this.props.status.isStudent) {
      if (this.props.profile.properties['profile-vacation-start'] !== this.state.profileVacationStart) {
        totals++;
        this.props.saveProfileProperty('profile-vacation-start', this.state.profileVacationStart ? this.state.profileVacationStart.toISOString() : null, cb);
      }
    }

    if (!this.props.status.isStudent) {
      if (this.props.profile.properties['profile-vacation-end'] !== this.state.profileVacationEnd) {
        totals++;
        this.props.saveProfileProperty('profile-vacation-end', this.state.profileVacationEnd ? this.state.profileVacationEnd.toISOString() : null, cb);
      }
    }

    if (!this.props.status.isStudent) {
      if ((this.props.profile.properties['profile-phone'] || "") !== this.state.phoneNumber) {
        totals++;
        this.props.saveProfileProperty('profile-phone', this.state.phoneNumber.trim(), cb);
      }
    }
    if (!this.props.status.isStudent) {
      if ((this.props.profile.properties['communicator-auto-reply'] || "") !== this.state.vacationAutoReply) {
        totals++;
        this.props.saveProfileProperty('communicator-auto-reply', this.state.vacationAutoReply, cb);
      }
    }
    if (!this.props.status.isStudent) {
      if ((this.props.profile.properties['communicator-auto-reply-subject'] || "") !== this.state.vacationAutoReplySubject) {
        totals++;
        this.props.saveProfileProperty('communicator-auto-reply-subject', this.state.vacationAutoReplySubject, cb);
      }
    }
    if (!this.props.status.isStudent) {
      if ((this.props.profile.properties['communicator-auto-reply-msg'] || "") !== this.state.vacationAutoReplyMsg) {
        totals++;
        this.props.saveProfileProperty('communicator-auto-reply-msg', this.state.vacationAutoReplyMsg, cb);
      }
    }
    if (this.props.profile.chatSettings) {
      if (((this.props.profile.chatSettings.visibility || null) !== this.state.chatVisibility) || ((this.props.profile.chatSettings.nick || null) !== this.state.chatNickname)) {
        totals++;
        this.props.updateProfileChatSettings({
          visibility: this.state.chatVisibility,
          nick: this.state.chatNickname,
          success: cb,
          fail: failCB,
        });
      }
    }
  }

  render() {
    let studyTimeEndValues = [];
    let vacationStartLabels: FormElementLabel = {
      label: this.props.i18n.text.get('plugin.profile.awayStartDate.label')
    }
    let vacationEndLabels: FormElementLabel = {
      label: this.props.i18n.text.get('plugin.profile.awayEndDate.label')
    }

    if (this.props.status.profile.studyTimeEnd) {
      studyTimeEndValues.push(this.props.i18n.time.format(moment(this.props.status.profile.studyTimeEnd, "ddd MMM DD hh:mm:ss ZZ YYYY").toDate()));
      if (this.props.status.profile.studyTimeLeftStr) {
        studyTimeEndValues.push(this.props.status.profile.studyTimeLeftStr);
      }
    }
    return (<div className="profile-element">
      <h2 className="profile-element__title">{this.props.status.profile.displayName}</h2>
      <div className="profile-element__item">
        <UpdateUsernamePasswordDialog>
          <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changePassword.buttonLabel')}</Button>
        </UpdateUsernamePasswordDialog>
      </div>

      <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.studyStartDate} label="plugin.profile.studyStartDateLabel"
        value={this.props.i18n.time.format(moment(this.props.status.profile.studyStartDate, "ddd MMM DD hh:mm:ss ZZ YYYY").toDate())} />
      <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.studyTimeEnd} label="plugin.profile.studyTimeEndLabel"
        value={studyTimeEndValues} />
      <form>
        <section>
          <h3 className="profile-element__sub-title">{this.props.i18n.text.get('plugin.profile.titles.contactInfo')}</h3>
          <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.emails.length} label="plugin.profile.emailsLabel"
            value={this.props.status.profile.emails} />
          <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.addresses.length} label="plugin.profile.addressesLabel"
            value={this.props.status.profile.addresses} />
          {this.props.status.isStudent ? <div className="profile-element__item">
            <UpdateAddressDialog>
              <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.buttonLabel')}</Button>
            </UpdateAddressDialog>
          </div> : null}

          <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.phoneNumbers.length} label="plugin.profile.phoneNumbers"
            value={this.props.status.profile.phoneNumbers} />

          {!this.props.status.isStudent ?
            <div className="profile-element__item form-element">
              <label htmlFor="profilePhoneNumber" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.phoneNumber.label')}</label>
              <input id="profilePhoneNumber" className="form-element__input" type="text" autoComplete="tel-national" onChange={this.onPhoneChange} value={this.state.phoneNumber}/>
            </div>
          : null}

        </section>

        {!this.props.status.isStudent ?
          <section>
            <h3 className="profile-element__sub-title">{this.props.i18n.text.get('plugin.profile.titles.vacationSettings')}</h3>
            <div className="profile-element__item form-element">
              <label htmlFor="profileVacationStart" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.awayStartDate.label')}</label>
                <DatePicker id="profileVacationStart" className="form-element__input" onChange={this.handleDateChange.bind(this, "profileVacationStart")}
                maxDate={this.state.profileVacationEnd || null}
                locale={this.props.i18n.time.getLocale()} selected={this.state.profileVacationStart}/>
            </div>
            <div className="profile-element__item form-element">
              <label htmlFor="profileVacationEnd" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.awayEndDate.label')}</label>
                <DatePicker id="profileVacationEnd" className="form-element__input" onChange={this.handleDateChange.bind(this, "profileVacationEnd")}
                minDate={this.state.profileVacationStart || null}
                locale={this.props.i18n.time.getLocale()} selected={this.state.profileVacationEnd}/>
            </div>

            <div className={`profile-element__item profile-element__item--additional-info ${!this.state.profileVacationStart || !this.state.profileVacationEnd ? "NON-ACTIVE" : ""} form-element`}>
              <div className="profile-element__check-option-container">
                <input
                  checked={this.state.vacationAutoReply === "ENABLED" ? true : null}
                  value={this.state.vacationAutoReply}
                  id="profileVacationAutoReply" type="checkbox"
                  onChange={this.onVacationAutoReplyChange} />
                <label htmlFor="profileVacationAutoReply" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.vacationAutoReply.label')}</label>
              </div>
              <div className="profile-element__description">{this.props.i18n.text.get('plugin.profile.vacationAutoReply.description')}</div>
            </div>

            {this.state.vacationAutoReply === "ENABLED" &&
              <div className={`profile-element__item profile-element__item--additional-info ${!this.state.profileVacationStart || !this.state.profileVacationEnd ? "NON-ACTIVE" : ""} form-element`}>
                <label htmlFor="profileVacationAutoReplySubject" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.vacationAutoReplySubject.label')}</label>
                <input
                  className="form-element__input form-element__input--profile-auto-reply" id="profileVacationAutoReplySubject"
                  type="text"
                  onChange={this.onVacationAutoReplySubjectChange}
                  value={this.state.vacationAutoReplySubject}></input>
              </div>}

            {this.state.vacationAutoReply === "ENABLED" &&
              <div className={`profile-element__item profile-element__item--additional-info ${!this.state.profileVacationStart || !this.state.profileVacationEnd ? "NON-ACTIVE" : ""} form-element`}>
                <label htmlFor="profileVacationAutoReplyMsg" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.vacationAutoReplyMsg.label')}</label>
                <textarea
                  className="form-element__textarea form-element__textarea--profile-auto-reply" id="profileVacationAutoReplyMsg"
                  onChange={this.onVacationAutoReplyMsgChange}
                  value={this.state.vacationAutoReplyMsg}></textarea>
              </div>}

          </section>
        : null}

        <section>
          <h3 className="profile-element__sub-title">{this.props.i18n.text.get('plugin.profile.titles.chatSettings')}</h3>
          <div className="profile-element__item form-element">
            <label htmlFor="chatVisibility" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.chat.visibility')}</label>
            <select id="chatVisibility" className="form-element__select" value={this.state.chatVisibility !== null ? this.state.chatVisibility : "DISABLED"} onChange={this.onChatVisibilityChange}>
              <option value="VISIBLE_TO_ALL">{this.props.i18n.text.get('plugin.profile.chat.visibleToAll')}</option>
              <option value="DISABLED">{this.props.i18n.text.get('plugin.profile.chat.disabled')}</option>
            </select>
          </div>

          <div className="profile-element__item form-element">
            <label htmlFor="chatNickname" className="profile-element__label">{this.props.i18n.text.get('plugin.profile.chat.setNick')}</label>
            <input id="chatNickname" className="form-element__input" type="text" onChange={this.onChatNicknameChange} value={this.state.chatNickname !== null ? this.state.chatNickname : ""}/>
            <div className="profile-element__description">{this.props.i18n.text.get("plugin.profile.chat.setNickDescription")}</div>
          </div>
        </section>
        <div className="profile-element__item">
          <Button buttonModifiers="primary-function-save" onClick={this.save}>{this.props.i18n.text.get('plugin.profile.save.button')}</Button>
        </div>
      </form>
    </div>);
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    profile: state.profile
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ saveProfileProperty, displayNotification, updateProfileChatSettings }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileInfoAndSettings);
