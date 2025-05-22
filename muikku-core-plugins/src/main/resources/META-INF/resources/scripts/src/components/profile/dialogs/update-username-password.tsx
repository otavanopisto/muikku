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
import { Action, bindActionCreators, Dispatch } from "redux";
import { ProfileState } from "~/reducers/main-function/profile";
import {
  loadProfileUsername,
  LoadProfileUsernameTriggerType,
} from "~/actions/main-function/profile";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * UpdateUsernamePasswordDialogProps
 */
interface UpdateUsernamePasswordDialogProps
  extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  profile: ProfileState;
  displayNotification: DisplayNotificationTriggerType;
  loadProfileUsername: LoadProfileUsernameTriggerType;
}

/**
 * UpdateUsernamePasswordDialogState
 */
interface UpdateUsernamePasswordDialogState {
  username: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  locked: boolean;
}

/**
 * UpdateUsernamePasswordDialog
 */
class UpdateUsernamePasswordDialog extends React.Component<
  UpdateUsernamePasswordDialogProps,
  UpdateUsernamePasswordDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: UpdateUsernamePasswordDialogProps) {
    super(props);

    this.update = this.update.bind(this);
    this.updateField = this.updateField.bind(this);

    this.state = {
      username: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      locked: false,
    };
  }
  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(
    nextProps: UpdateUsernamePasswordDialogProps
  ) {
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
   * @param closeDialog closeDialog
   */
  async update(closeDialog: () => void) {
    const userpluginApi = MApi.getUserpluginApi();

    const newPassword1 = this.state.newPassword;
    const newPassword2 = this.state.newPasswordConfirm;

    if (newPassword1 && newPassword2 == "") {
      this.props.displayNotification(
        this.props.t("validation.password"),
        "error"
      );
      return;
    }

    if (newPassword1 !== newPassword2) {
      this.props.displayNotification(
        this.props.t("validation.password", { context: "match" }),
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

    try {
      await userpluginApi.updateUserPluginCredentials({
        updateUserPluginCredentialsRequest: values,
      });

      this.setState({
        locked: false,
        username: "",
        oldPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });

      if (values.newPassword === "") {
        this.props.displayNotification(
          this.props.t("notifications.updateSuccess", {
            context: "credentials",
          }),
          "success"
        );
      } else {
        this.props.displayNotification(
          this.props.t("notifications.updateSuccess", {
            context: "password",
          }),
          "success"
        );
      }

      this.props.loadProfileUsername();

      closeDialog();
    } catch (err) {
      this.setState({
        locked: false,
      });

      if (!isMApiError(err)) {
        throw err;
      } else if (isResponseError(err)) {
        if (err.response.status === 403) {
          this.props.displayNotification(
            this.props.t("notifications.403", {
              context: "password",
            }),
            "error"
          );
        } else if (err.response.status === 409) {
          this.props.displayNotification(
            this.props.t("notifications.409", {
              context: "userName",
            }),
            "error"
          );
        }
      } else {
        this.props.displayNotification(err.message, "error");
      }
    }
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
        <p>{this.props.t("content.changePassword", { ns: "profile" })}</p>
        <form>
          <div className="form-element form-element--profile">
            <label htmlFor="profileUsername">
              {this.props.t("labels.userName")}
            </label>
            <input
              id="profileUsername"
              type="text"
              className="form-element__input form-element__input--profile"
              value={this.state.username}
              onChange={this.updateField.bind(this, "username")}
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profileOldPassword">
              {this.props.t("labels.oldPassword")}
            </label>
            <input
              id="profileOldPassword"
              type="password"
              className="form-element__input form-element__input--profile"
              value={this.state.oldPassword}
              onChange={this.updateField.bind(this, "oldPassword")}
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profileNewPassword1">
              {this.props.t("labels.password1")}
            </label>
            <input
              id="profileNewPassword1"
              type="password"
              className="form-element__input form-element__input--profile"
              value={this.state.newPassword}
              onChange={this.updateField.bind(this, "newPassword")}
            />
          </div>
          <div className="form-element form-element--profile">
            <label htmlFor="profileNewPassword2">
              {this.props.t("labels.password2")}
            </label>
            <input
              id="profileNewPassword2"
              type="password"
              className={`form-element__input form-element__input--profile ${
                this.state.newPassword !== this.state.newPasswordConfirm
                  ? "form-element__input--profile-error"
                  : ""
              }`}
              value={this.state.newPasswordConfirm}
              onChange={this.updateField.bind(this, "newPasswordConfirm")}
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
        title={this.props.t("labels.changePassword")}
        content={content}
        footer={footer}
        modifier="change-password"
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
    { displayNotification, loadProfileUsername },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(UpdateUsernamePasswordDialog)
);
