import * as React from "react";
import { connect } from "react-redux";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { ProfileType } from "~/reducers/main-function/profile";
import ProfileProperty from "./components/profile-property";
import {
  saveProfileProperty, SaveProfilePropertyTriggerType, updateProfileAddress,
  UpdateProfileAddressTriggerType, updateProfileChatSettings, UpdateProfileChatSettingsTriggerType
} from '~/actions/main-function/profile';
import { bindActionCreators, Dispatch } from 'redux';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';

interface IContactInformationProps {
  i18n: i18nType,
  profile: ProfileType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType;
  updateProfileAddress: UpdateProfileAddressTriggerType;
}

interface IContactInformationState {
  phoneNumber: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  municipality: string;
  locked: boolean;
}

class ContactInformation extends React.Component<IContactInformationProps, IContactInformationState> {
  constructor(props: IContactInformationProps) {
    super(props);

    this.save = this.save.bind(this);
    this.updateField = this.updateField.bind(this);

    this.state = {
      phoneNumber: props.profile.properties['profile-phone'] || "",
      street: "",
      postalCode: "",
      city: "",
      country: "",
      municipality: "",
      locked: false,
    }
  }

  componentWillReceiveProps(nextProps: IContactInformationProps) {
    if (nextProps.profile.properties['profile-phone'] &&
      this.props.profile.properties['profile-phone'] !== nextProps.profile.properties['profile-phone']) {
      this.setState({
        phoneNumber: nextProps.profile.properties['profile-phone']
      });
    }

    if (nextProps.profile.addresses && JSON.stringify(nextProps.profile.addresses) !== JSON.stringify(this.props.profile.addresses)) {
      let address = nextProps.profile.addresses.find(a => a.defaultAddress);
      if (!address) {
        address = nextProps.profile.addresses[0];
      }
      if (address) {
        this.setState({
          street: address.street || "",
          postalCode: address.postalCode || "",
          city: address.city || "",
          country: address.country || ""
        });
      }
    }

    if (nextProps.profile.student && JSON.stringify(nextProps.profile.student) !== JSON.stringify(this.props.profile.student)) {
      this.setState({
        municipality: nextProps.profile.student.municipality || ""
      });
    }
  }

  save() {
    let totals = 0;
    let done = 0;
    let succeed = 0;
    const cb = () => {
      done++;
      if (totals === done) {
        if (succeed === totals) {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.saved"), 'success');
        } else {
          this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.failed"), 'error');
        }
      }
    }

    if ((this.props.profile.properties['profile-phone'] || "") !== this.state.phoneNumber) {
      totals++;
      this.props.saveProfileProperty('profile-phone', this.state.phoneNumber.trim(), () => {
        succeed++;
        cb();
      });
    }

    if (this.props.status.isStudent) {
      totals++;
      this.props.updateProfileAddress({
        street: this.state.street,
        postalCode: this.state.postalCode,
        city: this.state.city,
        country: this.state.country,
        municipality: this.state.municipality,
        success: () => {
          succeed++;
          cb();
        },
        fail: cb,
      });
    }
  }

  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>) {
    let nField: any = {};
    nField[field] = e.target.value;
    this.setState(nField);
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
            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.emails.length} label="plugin.profile.emails.label"
              value={this.props.status.profile.emails} />
            {/* Displaying multiple addresses seems moot at this point, not gonna remove this entirely though until we are sure it's truly not needed
            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.addresses.length} label="plugin.profile.addresses.label"
              value={this.props.status.profile.addresses} />
            */}
            {this.props.status.isStudent && <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="profileStreetAddress" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.streetField.label')}</label>
              <div className="application-sub-panel__item-data form-element">
                <input id="profileStreetAddress" type="text" className="form-element__input" value={this.state.street} onChange={this.updateField.bind(this, "street")} autoComplete="address-line1" />
              </div>
            </div>}

            {this.props.status.isStudent && <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="profilePostalCode" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.postalCodeField.label')}</label>
              <div className="application-sub-panel__item-data form-element">
                <input id="profilePostalCode" type="text" className="form-element__input" value={this.state.postalCode} onChange={this.updateField.bind(this, "postalCode")} autoComplete="postal-code" />
              </div>
            </div>}

            {this.props.status.isStudent && <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="profileCity" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.cityField.label')}</label>
              <div className="application-sub-panel__item-data form-element">
                <input id="profileCity" type="text" className="form-element__input" value={this.state.city} onChange={this.updateField.bind(this, "city")} autoComplete="address-level2" />
              </div>
            </div>}

            {this.props.status.isStudent && <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="profileCountry" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.countryField.label')}</label>
              <div className="application-sub-panel__item-data form-element">
                <input id="profileCountry" type="text" className="form-element__input" value={this.state.country} onChange={this.updateField.bind(this, "country")} autoComplete="country-name" />
              </div>
            </div>}

            {this.props.status.isStudent && <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="profileMunicipality" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.municipalityField.label')}</label>
              <div className="application-sub-panel__item-data form-element">
                <input id="profileMunicipality" type="text" className="form-element__input" value={this.state.municipality} onChange={this.updateField.bind(this, "municipality")} autoComplete="address-level3" />
              </div>
            </div>}

            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.phoneNumbers.length} label="plugin.profile.phoneNumbers.label"
              value={this.props.status.profile.phoneNumbers} />

            {!this.props.status.isStudent ?
              <div className="application-sub-panel__item application-sub-panel__item--profile">
                <label htmlFor="profilePhoneNumber" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.phoneNumber.label')}</label>
                <div className="application-sub-panel__item-data form-element">
                  <input id="profilePhoneNumber" className="form-element__input" type="text" autoComplete="tel-national" onChange={this.updateField.bind(this, "phoneNumber")} value={this.state.phoneNumber} />
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
  return bindActionCreators({ saveProfileProperty, displayNotification, updateProfileChatSettings, updateProfileAddress }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInformation);