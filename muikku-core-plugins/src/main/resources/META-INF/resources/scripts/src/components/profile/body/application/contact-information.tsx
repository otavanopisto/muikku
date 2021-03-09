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

    return <section>
      <form>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.contactInformation')}</h2>
        <div className="application-sub-panel">
          <div className="application-sub-panel__body">
            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.emails.length} label="plugin.profile.emailsLabel"
              value={this.props.status.profile.emails} />
            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.addresses.length} label="plugin.profile.addressesLabel"
              value={this.props.status.profile.addresses} />

            {this.props.status.isStudent ? <div className="application-sub-panel__item application-sub-panel__item--profile">
              <UpdateAddressDialog>
                <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.buttonLabel')}</Button>
              </UpdateAddressDialog>
            </div> : null}

            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.phoneNumbers.length} label="plugin.profile.phoneNumbers"
              value={this.props.status.profile.phoneNumbers} />

            {!this.props.status.isStudent ?
              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label htmlFor="profilePhoneNumber" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.phoneNumber.label')}</label>
                <div className="application-sub-panel__item-data form-element">
                  <input id="profilePhoneNumber" className="form-element__input" type="text" autoComplete="tel-national" onChange={this.onPhoneChange} value={this.state.phoneNumber} />
                </div>
              </div>
              : null}

            <div className="application-sub-panel__item-actions">
              <Button buttonModifiers="primary-function-save" onClick={this.save}>{this.props.i18n.text.get('plugin.profile.save.button')}</Button>
            </div>
          </div>
        </div>
      </form>
    </section>;
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