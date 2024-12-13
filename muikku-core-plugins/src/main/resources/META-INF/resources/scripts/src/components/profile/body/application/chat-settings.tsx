import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { ProfileState } from "~/reducers/main-function/profile";
import Button from "~/components/general/button";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/application-sub-panel.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import Select, { ActionMeta } from "react-select";
import {
  ChatSettingVisibilityOption,
  selectOptions,
} from "../../../chat/chat-helpers";
import { ChatUser, ChatUserVisibilityEnum } from "~/generated/client";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";

/**
 * ChatSettingsProps
 */
interface ChatSettingsProps extends WithTranslation<["common", "chat"]> {
  profile: ProfileState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * ChatSettingState
 */
interface ChatSettingState {
  chatUserSettings: ChatUser;
  chatVisiblity: ChatUserVisibilityEnum;
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
      chatVisiblity: "NONE",
      chatNick: "",
      locked: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    if (this.props.status.chatSettings) {
      this.setState({
        locked: false,
        chatVisiblity: this.props.status.chatSettings.visibility || "NONE",
        chatNick: this.props.status.chatSettings.nick || "",
      });
    }
  };

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate = (prevProps: ChatSettingsProps) => {
    if (prevProps.status.chatSettings !== this.props.status.chatSettings) {
      this.setState({
        locked: false,
        chatVisiblity: this.props.status.chatSettings.visibility || "NONE",
        chatNick: this.props.status.chatSettings.nick || "",
      });
    }
  };

  /**
   * save
   */
  async save() {
    const chatApi = MApi.getChatApi();
    const { chatVisiblity, chatUserSettings, chatNick } = this.state;

    this.setState({ locked: true });

    try {
      await chatApi.updateChatSettings({
        updateChatSettingsRequest: {
          ...chatUserSettings,
          nick: chatNick.trim(),
          visibility: chatVisiblity,
        },
      });

      this.props.displayNotification(
        this.props.t("notifications.updateSuccess", {
          context: "settings",
        }),
        "success"
      );
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      } else if (isResponseError(err)) {
        if (err.response.status === 400) {
          this.props.displayNotification(
            this.props.t("notifications.400_settings", {
              ns: "chat",
            }),
            "error"
          );
        }

        if (err.response.status === 409) {
          this.props.displayNotification(
            this.props.t("notifications.409_settings", {
              ns: "chat",
            }),
            "error"
          );
        }
      } else {
        this.props.displayNotification(
          this.props.t("notifications.updateError", {
            ns: "chat",
            context: "settings",
          }),
          "error"
        );
      }
    }

    this.setState({ locked: false, chatNick: chatNick.trim() });
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
      chatVisiblity: newValue.value,
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

    const options = selectOptions(this.props.t);

    const selectedOption = options.find(
      (option) => option.value === this.state.chatVisiblity
    );

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
                    <label htmlFor="chatSelectVisibility">
                      {this.props.t("labels.chatSelectVisibility", {
                        ns: "profile",
                      })}
                    </label>
                    <Select<ChatSettingVisibilityOption>
                      id="chatSelectVisibility"
                      className="react-select-override"
                      classNamePrefix="react-select-override"
                      isDisabled={this.state.locked}
                      value={selectedOption}
                      onChange={this.onChatVisibilityChange}
                      options={options}
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
                      value={this.state.chatNick}
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}

export default withTranslation(["profile", "chat"])(
  connect(mapStateToProps, mapDispatchToProps)(ChatSettings)
);
