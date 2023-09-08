import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
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

/**
 * ChatSettingsProps
 */
interface ChatSettingsProps {
  i18n: i18nType;
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
   * @param props
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
   * componentWillReceiveProps
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: ChatSettingsProps) {
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
          this.props.i18n.text.get("plugin.profile.properties.saved"),
          "success"
        );

        this.setState({ locked: false });
      })
      .onOneFails(() => {
        this.props.displayNotification(
          this.props.i18n.text.get("plugin.profile.properties.failed"),
          "error"
        );

        this.setState({ locked: false });
      });
  }

  /**
   * onChatVisibilityChange
   * @param e
   */
  onChatVisibilityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({
      chatVisibility: e.target.value,
    });
  }

  /**
   * onChatNicknameChange
   * @param e
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
            {this.props.i18n.text.get("plugin.profile.titles.chatSettings")}
          </h2>
          <div className="application-sub-panel">
            <div className="application-sub-panel__body">
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="chatVisibility">
                    {this.props.i18n.text.get("plugin.profile.chat.visibility")}
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
                      {this.props.i18n.text.get(
                        "plugin.profile.chat.visibleToAll"
                      )}
                    </option>
                    <option value="DISABLED">
                      {this.props.i18n.text.get("plugin.profile.chat.disabled")}
                    </option>
                  </select>
                </div>
              </div>
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="chatNickname">
                    {this.props.i18n.text.get("plugin.profile.chat.setNick")}
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
                  {this.props.i18n.text.get(
                    "plugin.profile.chat.setNickDescription"
                  )}
                </div>
              </div>

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
 * @param state
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
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { saveProfileProperty, displayNotification, updateProfileChatSettings },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);
