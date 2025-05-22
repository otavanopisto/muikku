import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import { ProfileState } from "~/reducers/main-function/profile";
import {
  updateProfileAddress,
  UpdateProfileAddressTriggerType,
} from "~/actions/main-function/profile";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * UpdateAddressDialogProps
 */
interface UpdateAddressDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  profile: ProfileState;

  displayNotification: DisplayNotificationTriggerType;
  updateProfileAddress: UpdateProfileAddressTriggerType;
}

/**
 * UpdateAddressDialogState
 */
interface UpdateAddressDialogState {
  street: string;
  postalCode: string;
  city: string;
  country: string;
  municipality: string;
  locked: boolean;
}

/**
 * UpdateAddressDialog
 */
class UpdateAddressDialog extends React.Component<
  UpdateAddressDialogProps,
  UpdateAddressDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: UpdateAddressDialogProps) {
    super(props);

    this.update = this.update.bind(this);
    this.updateField = this.updateField.bind(this);

    this.state = {
      street: "",
      postalCode: "",
      city: "",
      country: "",
      municipality: "",
      locked: false,
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: UpdateAddressDialogProps) {
    if (
      nextProps.profile.addresses &&
      JSON.stringify(nextProps.profile.addresses) !==
        JSON.stringify(this.props.profile.addresses)
    ) {
      let address = nextProps.profile.addresses.find((a) => a.defaultAddress);
      if (!address) {
        address = nextProps.profile.addresses[0];
      }
      if (address) {
        this.setState({
          street: address.street || "",
          postalCode: address.postalCode || "",
          city: address.city || "",
          country: address.country || "",
        });
      }
    }

    if (
      nextProps.profile.student &&
      JSON.stringify(nextProps.profile.student) !==
        JSON.stringify(this.props.profile.student)
    ) {
      this.setState({
        municipality: nextProps.profile.student.municipality || "",
      });
    }
  }

  /**
   * update
   * @param closeDialog closeDialog
   */
  update(closeDialog: () => void) {
    this.props.updateProfileAddress({
      street: this.state.street,
      postalCode: this.state.postalCode,
      city: this.state.city,
      country: this.state.country,
      municipality: this.state.municipality,
      /**
       *
       */
      success: () => {
        closeDialog();
      },
      /**
       *
       */
      fail: () => undefined,
    });
  }

  /**
   * updateField
   * @param field field
   * @param e e
   */
  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nField: any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <p>
          {this.props.t("content.changeAddressMunicipality", { ns: "profile" })}
        </p>
        <form>
          <div className="form-element form-element--profile">
            <label htmlFor="profileStreetAddress">
              {this.props.t("labels.streetAddress", { ns: "frontPage" })}
            </label>
            <input
              id="profileStreetAddress"
              type="text"
              className="form-element__input form-element__input--profile"
              value={this.state.street}
              onChange={this.updateField.bind(this, "street")}
              autoComplete="address-line1"
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profilePostalCode">
              {this.props.t("labels.postalCode", { ns: "frontPage" })}
            </label>
            <input
              id="profilePostalCode"
              type="text"
              className="form-element__input form-element__input--profile"
              value={this.state.postalCode}
              onChange={this.updateField.bind(this, "postalCode")}
              autoComplete="postal-code"
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profileCity">
              {this.props.t("labels.city", { ns: "frontPage" })}
            </label>
            <input
              id="profileCity"
              type="text"
              className="form-element__input form-element__input--profile"
              value={this.state.city}
              onChange={this.updateField.bind(this, "city")}
              autoComplete="address-level2"
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profileCountry">
              {this.props.t("labels.country", { ns: "frontPage" })}
            </label>
            <input
              id="profileCountry"
              type="text"
              className="form-element__input form-element__input--profile"
              value={this.state.country}
              onChange={this.updateField.bind(this, "country")}
              autoComplete="country-name"
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profileMunicipality">
              {this.props.t("labels.municipality", { ns: "frontPage" })}
            </label>
            <input
              id="profileMunicipality"
              type="text"
              className="form-element__input form-element__input--profile"
              value={this.state.municipality}
              onChange={this.updateField.bind(this, "municipality")}
              autoComplete="address-level3"
            />
          </div>
        </form>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["success", "standard-ok"]}
          onClick={this.update.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.save")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        title={this.props.t("labels.changeAddressAndMunicipality", {
          ns: "profile",
        })}
        content={content}
        footer={footer}
        modifier="change-address"
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    profile: state.profile,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { displayNotification, updateProfileAddress },
    dispatch
  );
}

export default withTranslation(["profile"])(
  connect(mapStateToProps, mapDispatchToProps)(UpdateAddressDialog)
);
