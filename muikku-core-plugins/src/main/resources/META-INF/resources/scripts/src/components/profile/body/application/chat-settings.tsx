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
import Select, { ActionMeta } from "react-select";
import {
  ChatSettingVisibilityOption,
  selectOptions,
} from "../../../chat/chat-helpers";
import { ChatUser } from "~/generated/client";

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
  chatUserSettings: ChatUser;
  chatEnabled: ChatSettingVisibilityOption;
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
      chatUserSettings: null,
      chatEnabled: selectOptions[0],
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

    const chatUserSettings = await chatApi.getChatSettings();
    const chatNick = chatUserSettings.nick || "";
    const chatEnabled =
      selectOptions.find(
        (option) => option.value === chatUserSettings.visibility
      ) || selectOptions[0];

    this.setState({
      locked: false,
      chatUserSettings,
      chatEnabled,
      chatNick,
    });
  };

  /**
   * save
   */
  async save() {
    const chatApi = MApi.getChatApi();
    const { chatEnabled, chatUserSettings, chatNick } = this.state;

    this.setState({ locked: true });

    await chatApi.updateChatSettings({
      updateChatSettingsRequest: {
        ...chatUserSettings,
        nick: chatNick,
        visibility: chatEnabled.value,
      },
    });

    this.setState({ locked: false });
  }

  /**
   * onChatVisibilityChange
   * @param newValue newValue
   * @param actionMeta actionMeta
   */
  onChatVisibilityChange(
    newValue: ChatSettingVisibilityOption,
    actionMeta: ActionMeta<ChatSettingVisibilityOption>
  ) {
    this.setState({
      chatEnabled: newValue,
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
                  <label htmlFor="chatVisibility">
                    {this.props.t("labels.chatVisibility", { ns: "profile" })}
                  </label>
                  <Select<ChatSettingVisibilityOption>
                    id="chatVisibility"
                    className="react-select-override"
                    classNamePrefix="react-select-override"
                    isDisabled={this.state.locked}
                    value={this.state.chatEnabled}
                    onChange={this.onChatVisibilityChange}
                    options={selectOptions}
                    styles={{
                      // eslint-disable-next-line jsdoc/require-jsdoc
                      container: (baseStyles, state) => ({
                        ...baseStyles,
                        width: "100%",
                      }),
                    }}
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
