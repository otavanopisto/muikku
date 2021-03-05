import * as React from "react";
import { connect } from "react-redux";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { ProfileType } from "~/reducers/main-function/profile";
import ProfileProperty from "./components/profile-property";
import UpdateAddressDialog from '../../dialogs/update-address';
import { saveProfileProperty, SaveProfilePropertyTriggerType, updateProfileChatSettings, UpdateProfileChatSettingsTriggerType } from '~/actions/main-function/profile';
import { bindActionCreators, Dispatch } from 'redux';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';

interface IContactInformationProps {
  i18n: i18nType,
  profile: ProfileType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType;
}

interface IContactInformationState {
  phoneNumber: string;
}

class ContactInformation extends React.Component<IContactInformationProps, IContactInformationState> {
  constructor(props: IContactInformationProps) {
    super(props);

    this.save = this.save.bind(this);
    this.onPhoneChange = this.onPhoneChange.bind(this);

    this.state = {
      phoneNumber: props.profile.properties['profile-phone'] || "",
    }
  }

  componentWillReceiveProps(nextProps: IContactInformationProps) {
    if (nextProps.profile.properties['profile-phone'] &&
      this.props.profile.properties['profile-phone'] !== nextProps.profile.properties['profile-phone']) {
      this.setState({
        phoneNumber: nextProps.profile.properties['profile-phone']
      });
    }
  }

  save() {
    const cb = () => {
      this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.saved"), 'success')
    }

    if ((this.props.profile.properties['profile-phone'] || "") !== this.state.phoneNumber) {
      this.props.saveProfileProperty('profile-phone', this.state.phoneNumber.trim(), cb);
    }
  }

  onPhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      phoneNumber: e.target.value
    });
  }

  public render() {
    if (this.props.profile.location !== "contact") {
      return null;
    }

    return <div className="profile-element">
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
              <input id="profilePhoneNumber" className="form-element__input" type="text" autoComplete="tel-national" onChange={this.onPhoneChange} value={this.state.phoneNumber} />
            </div>
            : null}
        </section>

        <div className="profile-element__item">
          <Button buttonModifiers="primary-function-save" onClick={this.save}>{this.props.i18n.text.get('plugin.profile.save.button')}</Button>
        </div>
      </form>
    </div>;
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
  return bindActionCreators({ saveProfileProperty, displayNotification, updateProfileChatSettings }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInformation);