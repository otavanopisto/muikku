import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StatusType } from "~/reducers/base/status";
import Button from "~/components/general/button";
import mApi from "~/lib/mApi";
import { ProfileType } from "~/reducers/main-function/profile";
import {
  loadProfileUsername,
  LoadProfileUsernameTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators, Dispatch } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * SecurityProps
 */
interface SecurityProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  profile: ProfileType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  loadProfileUsername: LoadProfileUsernameTriggerType;
}

/**
 * SecurityState
 */
interface SecurityState {
  username: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  locked: boolean;
}

/**
 * Security
 */
class Security extends React.Component<SecurityProps, SecurityState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SecurityProps) {
    super(props);

    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      locked: false,
    };

    this.update = this.update.bind(this);
    this.updateField = this.updateField.bind(this);
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: SecurityProps) {
    if (
      nextProps.profile.username !== null &&
      nextProps.profile.username !== this.state.username
    ) {
      this.setState({
        username: nextProps.profile.username,
      });
    }
  }

  /**
   * update
   */
  public update() {
    const newPassword1 = this.state.newPassword;
    const newPassword2 = this.state.newPasswordConfirm;

    if (newPassword1 && newPassword2 == "") {
      this.props.displayNotification(
        this.props.t(
          "validation.password"
        ),
        "error"
      );
      return;
    }

    if (newPassword1 !== newPassword2) {
      this.props.displayNotification(
        this.props.t(
          "validation.password", {context: "match"}
        ),
        "error"
      );
      return;
    }

    this.setState({
      locked: true,
    });

    const values = {
      oldPassword: this.state.oldPassword,
      username: this.state.username,
      newPassword: this.state.newPassword,
    };

    mApi()
      .userplugin.credentials.update(values)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .callback((err: any, result: any) => {
        this.setState({
          locked: false,
        });

        if (err) {
          if (result.status === 403) {
            this.props.displayNotification(
              this.props.t(
                "notifications.403", {context: "password"}
              ),
              "error"
            );
          } else if (result.status === 409) {
            this.props.displayNotification(
              this.props.t(
                "notifications.409", {context: "userName"}),
              "error"
            );
          } else {
            this.props.displayNotification(err.message, "error");
          }
        } else {
          if (values.newPassword === "") {
            this.props.displayNotification(
              this.props.t(
                "notifications.updateSuccess", {context: "credentials"}
              ),
              "success"
            );
          } else {
            this.props.displayNotification(
              this.props.t(
                "notifications.updateSuccess", {context: "password"}
              ),
              "success"
            );
          }

          this.props.loadProfileUsername();
        }
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
   * @returns JSX.Element
   */
  public render() {
    if (this.props.profile.location !== "security") {
      return null;
    }

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.t("labels.signIn")}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="profileUsername">
                    {this.props.t(
                      "labels.userName"
                    )}
                  </label>
                  <input
                    id="profileUsername"
                    type="text"
                    className="form-element__input"
                    value={this.state.username}
                    onChange={this.updateField.bind(this, "username")}
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="profileOldPassword">
                    {this.props.t(
                      "labels.oldPassword"
                    )}
                  </label>
                  <input
                    id="profileOldPassword"
                    type="password"
                    className="form-element__input"
                    value={this.state.oldPassword}
                    onChange={this.updateField.bind(this, "oldPassword")}
                  />
                </div>
              </div>

              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="profileNewPassword1">
                    {this.props.t(
                      "labels.newPassword1"
                    )}
                  </label>
                  <input
                    id="profileNewPassword1"
                    type="password"
                    className="form-element__input"
                    value={this.state.newPassword}
                    onChange={this.updateField.bind(this, "newPassword")}
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="profileNewPassword2">
                    {this.props.t(
                      "labels.newPassword2"
                    )}
                  </label>
                  <input
                    id="profileNewPassword2"
                    type="password"
                    className={`form-element__input ${
                      this.state.newPassword !== this.state.newPasswordConfirm
                        ? "form-element__input--profile-error"
                        : ""
                    }`}
                    value={this.state.newPasswordConfirm}
                    onChange={this.updateField.bind(this, "newPasswordConfirm")}
                  />
                </div>
              </div>

              <div className="form__buttons">
                <Button
                  buttonModifiers="primary-function-save"
                  onClick={this.update}
                  disabled={this.state.locked}
                >
                  {this.props.t("actions.save")}
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
    i18nOLD: state.i18nOLD,
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
    { displayNotification, loadProfileUsername },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(Security)
);
