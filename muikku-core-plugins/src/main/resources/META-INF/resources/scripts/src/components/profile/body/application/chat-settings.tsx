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
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import MApi from "~/api/api";

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
  chatEnable: boolean;
  chatNick: string;
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
      chatEnable: false,
      chatNick: "",
      locked: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    const chatApi = MApi.getChatApi();

    this.setState({ locked: true });

    const settings = await chatApi.getChatSettings();

    this.setState({
      locked: false,
      chatEnable: settings.enabled,
      chatNick: settings.nick || "",
    });
  };

  /**
   * save
   */
  async save() {
    const chatApi = MApi.getChatApi();
    const { chatEnable, chatNick } = this.state;

    this.setState({ locked: true });

    await chatApi.updateChatSettings({
      updateChatSettingsRequest: {
        enabled: chatEnable,
        nick: chatNick,
      },
    });

    this.setState({ locked: false });
  }

  /**
   * onChatVisibilityChange
   * @param e e
   */
  onChatVisibilityChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      chatEnable: e.target.checked,
    });
  }

  /**
   * onChatNicknameChange
   * @param e e
   */
  onChatNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      chatNick: e.target.value,
    });
  }

  /**
   * render
   * @returns JSX.Element
   */
  public render() {
    if (this.props.profile.location !== "chat") {
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
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="chatNick">
                    {this.props.t("labels.chatVisibility", { ns: "profile" })}
                  </label>
                  <input
                    id="chatNick"
                    className="form-element__input"
                    type="checkbox"
                    checked={this.state.chatEnable}
                    onChange={this.onChatVisibilityChange}
                    disabled={this.state.locked}
                  />
                </div>
              </div>
              <div className="form__row">
                <div className="form-element">
                  <label htmlFor="chatNick">
                    {this.props.t("labels.nick", { ns: "profile" })}
                  </label>
                  <input
                    id="chatNick"
                    className="form-element__input"
                    type="text"
                    onChange={this.onChatNicknameChange}
                    value={this.state.chatNick}
                    disabled={this.state.locked}
                  />
                </div>

                <div className="form-element__description">
                  {this.props.t("content.nick", { ns: "profile" })}
                </div>
              </div>

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
