import * as React from "react";
import { connect } from "react-redux";
import Button, { IconButton } from "~/components/general/button";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { ProfileState } from "~/reducers/main-function/profile";
import ProfileProperty from "./components/profile-property";
import {
  saveProfileProperty,
  SaveProfilePropertyTriggerType,
  updateProfileAddress,
  UpdateProfileAddressTriggerType,
  updateProfileChatSettings,
  UpdateProfileChatSettingsTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators, Dispatch } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { SimpleActionExecutor } from "~/actions/executor";
import { AnyActionType } from "~/actions";

/**
 * ContactInformationProps
 */
interface ContactInformationProps {
  i18n: i18nType;
  profile: ProfileState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType;
  updateProfileAddress: UpdateProfileAddressTriggerType;
}

/**
 * ContactInformationState
 */
interface ContactInformationState {
  phoneNumber: string;
  appointmentCalendar: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  municipality: string;
  locked: boolean;
  extraInfo: string;
}

/**
 * ContactInformation
 */
class ContactInformation extends React.Component<
  ContactInformationProps,
  ContactInformationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ContactInformationProps) {
    super(props);

    this.save = this.save.bind(this);

    this.state = {
      phoneNumber: props.profile.properties["profile-phone"] || "",
      extraInfo: props.profile.properties["profile-extraInfo"] || "",
      appointmentCalendar:
        props.profile.properties["profile-appointmentCalendar"] || "",
      street: "",
      postalCode: "",
      city: "",
      country: "",
      municipality: "",
      locked: false,
    };
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: ContactInformationProps) {
    if (
      nextProps.profile.properties["profile-phone"] &&
      this.props.profile.properties["profile-phone"] !==
        nextProps.profile.properties["profile-phone"]
    ) {
      this.setState({
        phoneNumber: nextProps.profile.properties["profile-phone"],
      });
    }
    if (
      nextProps.profile.properties["profile-appointmentCalendar"] &&
      this.props.profile.properties["profile-appointmentCalendar"] !==
        nextProps.profile.properties["profile-appointmentCalendar"]
    ) {
      this.setState({
        appointmentCalendar:
          nextProps.profile.properties["profile-appointmentCalendar"],
      });
    }

    if (
      nextProps.profile.properties["profile-extraInfo"] &&
      this.props.profile.properties["profile-extraInfo"] !==
        nextProps.profile.properties["profile-extraInfo"]
    ) {
      this.setState({
        extraInfo: nextProps.profile.properties["profile-extraInfo"],
      });
    }

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
   * save
   */
  save() {
    this.setState({ locked: true });

    const executor = new SimpleActionExecutor();
    executor
      .addAction(
        (this.props.profile.properties["profile-phone"] || "") !==
          this.state.phoneNumber,
        () => {
          this.props.saveProfileProperty({
            key: "profile-phone",
            value: this.state.phoneNumber.trim(),
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(
        (this.props.profile.properties["profile-appointmentCalendar"] || "") !==
          this.state.appointmentCalendar,
        () => {
          this.props.saveProfileProperty({
            key: "profile-appointmentCalendar",
            value: this.state.appointmentCalendar.trim(),
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(
        (this.props.profile.properties["profile-extraInfo"] || "") !==
          this.state.extraInfo,
        () => {
          this.props.saveProfileProperty({
            key: "profile-extraInfo",
            value: this.state.extraInfo.trim(),
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .addAction(this.props.status.isStudent, () => {
        this.props.updateProfileAddress({
          street: this.state.street,
          postalCode: this.state.postalCode,
          city: this.state.city,
          country: this.state.country,
          municipality: this.state.municipality,
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .onAllSucceed(() => {
        this.setState({ locked: false });

        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.saved"),
          "success"
        );
      })
      .onOneFails(() => {
        this.setState({ locked: false });

        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.failed"),
          "error"
        );
      });
  }

  /**
   * updateField
   * @param key key
   * @param value value
   */
  updateField = <T extends keyof ContactInformationState>(
    key: T,
    value: ContactInformationState[T]
  ) => {
    this.setState({
      ...this.state,
      [key]: value,
    });
  };

  /**
   * handleActivateWhatsappClick
   @param e e
   */
  handleActivateWhatsappClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const executor = new SimpleActionExecutor();

    const newValue = !(
      this.props.profile.properties["profile-whatsapp"] === "true"
    );

    executor
      .addAction(true, () => {
        this.props.saveProfileProperty({
          key: "profile-whatsapp",
          value: newValue.toString(),
          success: executor.succeeded,
          fail: executor.failed,
        });
      })
      .onAllSucceed(() => {
        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.saved"),
          "success"
        );
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.failed"),
          "error"
        );
      });
  };

  /**
   * render
   * @returns JSX.Element
   */
  public render() {
    if (
      this.props.profile.location !== "contact" ||
      !this.props.status.profile
    ) {
      return null;
    }
    const hasACalendar = !this.state.appointmentCalendar;

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.i18n.text.get(
              "plugin.profile.titles.contactInformation"
            )}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <ProfileProperty
                i18n={this.props.i18n}
                condition={!!this.props.status.profile.emails.length}
                label="plugin.profile.emails.label"
                value={this.props.status.profile.emails}
              />
              {/* Displaying multiple addresses seems moot at this point, not gonna remove this entirely though until we are sure it's truly not needed
            <ProfileProperty i18n={this.props.i18n} condition={!!this.props.status.profile.addresses.length} label="plugin.profile.addresses.label"
              value={this.props.status.profile.addresses} />
            */}
              {this.props.status.isStudent && (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profileStreetAddress">
                      {this.props.i18n.text.get(
                        "plugin.profile.changeAddressMunicipality.dialog.streetField.label"
                      )}
                    </label>
                    <input
                      id="profileStreetAddress"
                      type="text"
                      className="form-element__input"
                      value={this.state.street}
                      onChange={(e) =>
                        this.updateField("street", e.target.value)
                      }
                      autoComplete="address-line1"
                    />
                  </div>
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profilePostalCode">
                      {this.props.i18n.text.get(
                        "plugin.profile.changeAddressMunicipality.dialog.postalCodeField.label"
                      )}
                    </label>
                    <input
                      id="profilePostalCode"
                      type="text"
                      className="form-element__input"
                      value={this.state.postalCode}
                      onChange={(e) =>
                        this.updateField("postalCode", e.target.value)
                      }
                      autoComplete="postal-code"
                    />
                  </div>
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profileCity">
                      {this.props.i18n.text.get(
                        "plugin.profile.changeAddressMunicipality.dialog.cityField.label"
                      )}
                    </label>
                    <input
                      id="profileCity"
                      type="text"
                      className="form-element__input"
                      value={this.state.city}
                      onChange={(e) => this.updateField("city", e.target.value)}
                      autoComplete="address-level2"
                    />
                  </div>
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profileCountry">
                      {this.props.i18n.text.get(
                        "plugin.profile.changeAddressMunicipality.dialog.countryField.label"
                      )}
                    </label>
                    <input
                      id="profileCountry"
                      type="text"
                      className="form-element__input"
                      value={this.state.country}
                      onChange={(e) =>
                        this.updateField("country", e.target.value)
                      }
                      autoComplete="country-name"
                    />
                  </div>
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profileMunicipality">
                      {this.props.i18n.text.get(
                        "plugin.profile.changeAddressMunicipality.dialog.municipalityField.label"
                      )}
                    </label>
                    <input
                      id="profileMunicipality"
                      type="text"
                      className="form-element__input"
                      value={this.state.municipality}
                      onChange={(e) =>
                        this.updateField("municipality", e.target.value)
                      }
                      autoComplete="address-level3"
                    />
                  </div>
                </div>
              )}

              <ProfileProperty
                i18n={this.props.i18n}
                condition={!!this.props.status.profile.phoneNumbers.length}
                label="plugin.profile.phoneNumbers.label"
                value={this.props.status.profile.phoneNumbers}
              />

              {!this.props.status.isStudent ? (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profilePhoneNumber">
                      {this.props.i18n.text.get(
                        "plugin.profile.phoneNumber.label"
                      )}
                    </label>
                    <input
                      id="profilePhoneNumber"
                      className="form-element__input"
                      type="text"
                      autoComplete="tel-national"
                      onChange={(e) =>
                        this.updateField("phoneNumber", e.target.value)
                      }
                      value={this.state.phoneNumber}
                    />
                  </div>
                </div>
              ) : null}

              {!this.props.status.isStudent ? (
                <div className="form__row">
                  <div className="form-element">
                    <label>
                      {this.props.i18n.text.get(
                        "plugin.profile.whatsappIntegration.label"
                      )}
                    </label>
                    <div className="form-element form-element--icon-with-label">
                      <IconButton
                        icon="whatsapp"
                        buttonModifiers={[
                          "whatsapp-me",
                          this.props.profile.properties["profile-whatsapp"] ===
                          "true"
                            ? "whatsapp-active"
                            : "whatsapp-inactive",
                        ]}
                        onClick={this.handleActivateWhatsappClick}
                      />
                      {this.props.profile.properties["profile-whatsapp"] ===
                      "true" ? (
                        <span>
                          {this.props.i18n.text.get(
                            "plugin.profile.whatsappIntegration.on.label"
                          )}
                        </span>
                      ) : (
                        <span>
                          {this.props.i18n.text.get(
                            "plugin.profile.whatsappIntegration.off.label"
                          )}
                        </span>
                      )}
                    </div>
                    <div className="form-element__description">
                      {this.props.i18n.text.get(
                        "plugin.profile.whatsappIntegration.description"
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {!this.props.status.isStudent ? (
                <div className="form__row">
                  <div className="form-element form-element--appointment-calendar">
                    <legend className="form__legend">
                      {this.props.i18n.text.get(
                        "plugin.profile.appointmentCalendar.legend"
                      )}
                    </legend>
                    <fieldset className="form__fieldset">
                      <div className="form__fieldset-content form__fieldset-content--horizontal">
                        <label htmlFor="profileAppointmentCalendar">
                          {this.props.i18n.text.get(
                            "plugin.profile.appointmentCalendar.label"
                          )}
                        </label>
                        <input
                          id="profileAppointmentCalendar"
                          className="form-element__input"
                          type="text"
                          autoComplete="tel-national"
                          onChange={(e) =>
                            this.updateField(
                              "appointmentCalendar",
                              e.target.value
                            )
                          }
                          value={this.state.appointmentCalendar}
                        />
                        <Button
                          href={this.state.appointmentCalendar}
                          buttonModifiers="primary-function-content"
                          openInNewTab="_blank"
                          disabled={hasACalendar}
                        >
                          {this.props.i18n.text.get(
                            "plugin.profile.appointmentCalendar.testButton"
                          )}
                        </Button>
                      </div>
                    </fieldset>
                    <div className="form-element__description">
                      {this.props.i18n.text.get(
                        "plugin.profile.appointmentCalendar.description"
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              {!this.props.status.isStudent ? (
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="profileExtraInfo">
                      {this.props.i18n.text.get(
                        "plugin.profile.extraInfo.label"
                      )}
                    </label>
                    <div className="form-element__textarea-container">
                      <textarea
                        id="profileExtraInfo"
                        className="form-element__textarea form-element__textarea--profile-extra-info"
                        onChange={(e) =>
                          this.updateField("extraInfo", e.target.value)
                        }
                        value={this.state.extraInfo}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="form__buttons">
                <Button
                  buttonModifiers="primary-function-save"
                  onClick={this.save}
                  disabled={this.state.locked}
                >
                  {this.props.i18n.text.get("plugin.profile.save.button")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      saveProfileProperty,
      displayNotification,
      updateProfileChatSettings,
      updateProfileAddress,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactInformation);
