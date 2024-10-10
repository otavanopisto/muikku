import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Button, { IconButton } from "~/components/general/button";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { ProfileState } from "~/reducers/main-function/profile";
import ProfileProperty from "./components/profile-property";
import {
  saveProfileProperty,
  SaveProfilePropertyTriggerType,
  updateProfileAddress,
  UpdateProfileAddressTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { SimpleActionExecutor } from "~/actions/executor";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ContactInformationProps
 */
interface ContactInformationProps extends WithTranslation<["common"]> {
  profile: ProfileState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
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
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ContactInformationProps) {
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
          this.props.t("notifications.saveSuccess"),
          "success"
        );
      })
      .onOneFails(() => {
        this.setState({ locked: false });

        this.props.displayNotification(
          this.props.t("notifications.saveError"),
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
          this.props.t("notifications.saveSuccess"),
          "success"
        );
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.t("notifications.saveError"),
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
    const isOnlyStudentParent =
      this.props.status.roles.includes("STUDENT_PARENT") &&
      this.props.status.roles.length === 1;

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.t("labels.contactInfo")}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <ProfileProperty
                condition={!!this.props.status.profile.emails.length}
                label={this.props.t("labels.emails", {
                  count: this.props.status.profile.emails.length,
                })}
                value={this.props.status.profile.emails}
              />
              {/* Displaying multiple addresses seems moot at this point, not gonna remove this entirely though until we are sure it's truly not needed
            <ProfileProperty condition={!!this.props.status.profile.addresses.length} label="plugin.profile.addresses.label"
              value={this.props.status.profile.addresses} />
            */}
              {this.props.status.isStudent && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profileStreetAddress">
                        {this.props.t("labels.streetAddress", {
                          ns: "frontPage",
                        })}
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
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profilePostalCode">
                        {this.props.t("labels.postalCode", { ns: "frontPage" })}
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
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profileCity">
                        {this.props.t("labels.city", { ns: "frontPage" })}
                      </label>
                      <input
                        id="profileCity"
                        type="text"
                        className="form-element__input"
                        value={this.state.city}
                        onChange={(e) =>
                          this.updateField("city", e.target.value)
                        }
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profileCountry">
                        {this.props.t("labels.country", { ns: "frontPage" })}
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
                </div>
              )}

              {this.props.status.isStudent && (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profileMunicipality">
                        {this.props.t("labels.municipality", {
                          ns: "frontPage",
                        })}
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
                </div>
              )}

              <ProfileProperty
                condition={!!this.props.status.profile.phoneNumbers.length}
                label={this.props.t("labels.phone")}
                value={this.props.status.profile.phoneNumbers}
              />

              {!this.props.status.isStudent ? (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profilePhoneNumber">
                        {this.props.t("labels.phone")}
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
                </div>
              ) : null}

              {!this.props.status.isStudent && !isOnlyStudentParent ? (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label>
                        {this.props.t("labels.whatsAppintegration", {
                          ns: "profile",
                        })}
                      </label>
                      <div className="form-element form-element--icon-with-label">
                        <IconButton
                          icon="whatsapp"
                          buttonModifiers={[
                            "whatsapp-me",
                            this.props.profile.properties[
                              "profile-whatsapp"
                            ] === "true"
                              ? "whatsapp-active"
                              : "whatsapp-inactive",
                          ]}
                          onClick={this.handleActivateWhatsappClick}
                        />
                        {this.props.profile.properties["profile-whatsapp"] ===
                        "true" ? (
                          <span>
                            {this.props.t("labels.whatsAppintegration", {
                              ns: "profile",
                              context: "on",
                            })}
                          </span>
                        ) : (
                          <span>
                            {this.props.t("labels.whatsAppintegration", {
                              ns: "profile",
                              context: "off",
                            })}
                          </span>
                        )}
                      </div>
                      <div className="form-element__description">
                        {this.props.t("content.whatsAppIntegration", {
                          ns: "profile",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {!this.props.status.isStudent && !isOnlyStudentParent ? (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element form-element--appointment-calendar">
                      <legend className="form__legend">
                        {this.props.t("labels.appointmentCalendar", {
                          ns: "profile",
                        })}
                      </legend>
                      <fieldset className="form__fieldset">
                        <div className="form__fieldset-content form__fieldset-content--horizontal">
                          <label htmlFor="profileAppointmentCalendar">
                            {this.props.t("labels.appointmentCalendar", {
                              context: "url",
                              ns: "profile",
                            })}
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
                            {this.props.t("actions.test", { ns: "profile" })}
                          </Button>
                        </div>
                      </fieldset>
                      <div className="form-element__description">
                        {this.props.t("content.appointmentCalendar", {
                          ns: "profile",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {!this.props.status.isStudent && !isOnlyStudentParent ? (
                <div className="application-sub-panel__item  application-sub-panel__item--profile">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="profileExtraInfo">
                        {this.props.t("labels.additionalInfo", {
                          ns: "profile",
                        })}
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
                </div>
              ) : null}

              <div className="application-sub-panel__item  application-sub-panel__item--profile">
                <div className="form__buttons">
                  <Button
                    buttonModifiers="primary-function-save"
                    onClick={this.save}
                    disabled={this.state.locked}
                  >
                    {this.props.t("actions.save")}
                  </Button>
                </div>
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
      updateProfileAddress,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(ContactInformation)
);
