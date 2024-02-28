import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { ProfileState } from "~/reducers/main-function/profile";
import {
  saveProfileProperty,
  SaveProfilePropertyTriggerType,
  updateProfileChatSettings,
  UpdateProfileChatSettingsTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators, Dispatch } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/application-sub-panel.scss";
import { SimpleActionExecutor } from "~/actions/executor";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * ChatSettingsProps
 */
interface ChatSettingsProps extends WithTranslation<["common"]> {
  profile: ProfileState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType;
}

/**
 * ChatSettingState
 */
interface ChatSettingState {
  chatVisibility: string;
  chatNickname: string;
  locked: boolean;
}

/**
 * ChatSettings
 */
class ChatSettings extends React.Component<
  ChatSettingsProps,
  ChatSettingState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ChatSettingsProps) {
    super(props);

    this.save = this.save.bind(this);
    this.onChatNicknameChange = this.onChatNicknameChange.bind(this);
    this.onChatVisibilityChange = this.onChatVisibilityChange.bind(this);

    this.state = {
      chatVisibility:
        (props.profile.chatSettings && props.profile.chatSettings.visibility) ||
        null,
      chatNickname:
        (props.profile.chatSettings && props.profile.chatSettings.nick) || "",
      locked: false,
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ChatSettingsProps) {
    if (
      nextProps.profile.chatSettings &&
      nextProps.profile.chatSettings.visibility &&
      (!this.props.profile.chatSettings ||
        this.props.profile.chatSettings.visibility !==
          nextProps.profile.chatSettings.visibility)
    ) {
      this.setState({
        chatVisibility: nextProps.profile.chatSettings.visibility,
      });
    } else if (
      !nextProps.profile.chatSettings ||
      typeof nextProps.profile.chatSettings.visibility === "undefined"
    ) {
      this.setState({
        chatVisibility: "DISABLED",
      });
    }

    if (
      nextProps.profile.chatSettings &&
      nextProps.profile.chatSettings.nick &&
      (!this.props.profile.chatSettings ||
        this.props.profile.chatSettings.nick !==
          nextProps.profile.chatSettings.nick)
    ) {
      this.setState({
        chatNickname: nextProps.profile.chatSettings.nick,
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
        this.props.profile.chatSettings &&
          ((this.props.profile.chatSettings.visibility || null) !==
            this.state.chatVisibility ||
            (this.props.profile.chatSettings.nick || null) !==
              this.state.chatNickname),
        () => {
          this.props.updateProfileChatSettings({
            visibility: this.state.chatVisibility,
            nick: this.state.chatNickname,
            success: executor.succeeded,
            fail: executor.failed,
          });
        }
      )
      .onAllSucceed(() => {
        this.props.displayNotification(
          this.props.t("notifications.saveSuccess"),
          "success"
        );

        this.setState({ locked: false });
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.t("notifications.saveError"),
          "error"
        );

        this.setState({ locked: false });
      });
  }

  /**
   * onChatVisibilityChange
   * @param e e
   */
  onChatVisibilityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      chatVisibility: e.target.value,
    });
  }

  /**
   * onChatNicknameChange
   * @param e e
   */
  onChatNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      chatNickname: e.target.value,
    });
  }

  /**
   * render
   * @returns JSX.Element
   */
  public render() {
    if (
      this.props.profile.location !== "chat" ||
      !this.props.status.permissions.CHAT_AVAILABLE
    ) {
      return null;
    }

    return (
      <section>
        <form className="form">
          <h2 className="application-panel__content-header">
            {this.props.t("labels.chatSettings", { ns: "profile" })}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="application-sub-panel__item  application-sub-panel__item--profile">
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="chatVisibility">
                      {this.props.t("labels.chatVisibility", { ns: "profile" })}
                    </label>
                    <select
                      id="chatVisibility"
                      className="form-element__select"
                      value={
                        this.state.chatVisibility !== null
                          ? this.state.chatVisibility
                          : "DISABLED"
                      }
                      onChange={this.onChatVisibilityChange}
                    >
                      <option value="VISIBLE_TO_ALL">
                        {this.props.t("labels.chatVisibility", {
                          ns: "profile",
                          context: "all",
                        })}
                      </option>
                      <option value="DISABLED">
                        {this.props.t("labels.chatVisibility", {
                          ns: "profile",
                          context: "disabled",
                        })}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="application-sub-panel__item  application-sub-panel__item--profile">
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="chatNickname">
                      {this.props.t("labels.nick", { ns: "profile" })}
                    </label>
                    <input
                      id="chatNickname"
                      className="form-element__input"
                      type="text"
                      onChange={this.onChatNicknameChange}
                      value={
                        this.state.chatNickname !== null
                          ? this.state.chatNickname
                          : ""
                      }
                    />
                  </div>

                  <div className="form-element__description">
                    {this.props.t("content.nick", { ns: "profile" })}
                  </div>
                </div>
              </div>
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
    { saveProfileProperty, displayNotification, updateProfileChatSettings },
    dispatch
  );
}

export default withTranslation(["profile"])(
  connect(mapStateToProps, mapDispatchToProps)(ChatSettings)
);
