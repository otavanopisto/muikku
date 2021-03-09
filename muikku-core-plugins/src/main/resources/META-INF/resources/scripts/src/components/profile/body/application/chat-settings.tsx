import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { ProfileType } from "~/reducers/main-function/profile";
import { saveProfileProperty, SaveProfilePropertyTriggerType, updateProfileChatSettings, UpdateProfileChatSettingsTriggerType} from '~/actions/main-function/profile';
import { bindActionCreators, Dispatch } from 'redux';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import Button from '~/components/general/button';
import { StatusType } from "~/reducers/base/status";

import '~/sass/elements/application-sub-panel.scss';

interface IChatSettingsProps {
  i18n: i18nType,
  profile: ProfileType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
  saveProfileProperty: SaveProfilePropertyTriggerType;
  updateProfileChatSettings: UpdateProfileChatSettingsTriggerType;
}

interface IChatSettingState {
  chatVisibility: string,
  chatNickname: string,
}

class ChatSettings extends React.Component<IChatSettingsProps, IChatSettingState> {
  constructor(props: IChatSettingsProps) {
    super(props);

    this.save = this.save.bind(this);
    this.onChatNicknameChange = this.onChatNicknameChange.bind(this);
    this.onChatVisibilityChange = this.onChatVisibilityChange.bind(this);

    this.state = {
      chatVisibility: (props.profile.chatSettings && props.profile.chatSettings.visibility) || null,
      chatNickname: (props.profile.chatSettings && props.profile.chatSettings.nick) || "",
    }
  }

  componentWillReceiveProps(nextProps: IChatSettingsProps){
    if (nextProps.profile.chatSettings && nextProps.profile.chatSettings.visibility &&
        (!this.props.profile.chatSettings ||
        this.props.profile.chatSettings.visibility !== nextProps.profile.chatSettings.visibility)){
      this.setState({
        chatVisibility: nextProps.profile.chatSettings.visibility
      });
    } else if (!nextProps.profile.chatSettings || typeof nextProps.profile.chatSettings.visibility === "undefined"){
      this.setState({
        chatVisibility: "DISABLED"
      });
    }

    if (nextProps.profile.chatSettings && nextProps.profile.chatSettings.nick &&
        (!this.props.profile.chatSettings ||
          this.props.profile.chatSettings.nick !== nextProps.profile.chatSettings.nick)){
      this.setState({
        chatNickname: nextProps.profile.chatSettings.nick
      });
    }
  }

  save(){
    let totals = 0;
    let done = 0;
    let fail: boolean = false;
    const cb = ()=>{
      done++;
      if (totals === done && !fail){
        this.props.displayNotification(this.props.i18n.text.get("plugin.profile.properties.saved"), 'success')
      }
    }
    const failCB = () => {
      fail = true;
      done++;
    }

    if (this.props.profile.chatSettings) {
      if (((this.props.profile.chatSettings.visibility || null) !== this.state.chatVisibility) || ((this.props.profile.chatSettings.nick || null) !== this.state.chatNickname)){
        totals++;
        this.props.updateProfileChatSettings({
          visibility: this.state.chatVisibility,
          nick: this.state.chatNickname,
          success: cb,
          fail: failCB,
        });
      }
    }
  }

  onChatVisibilityChange(e: React.ChangeEvent<HTMLSelectElement>){
    this.setState({
      chatVisibility: e.target.value
    });
  }
  onChatNicknameChange(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({
      chatNickname: e.target.value
    });
  }

  public render() {
    if (this.props.profile.location !== "chat") {
      return null;
    }

    return <section>
      <form>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.chatSettings')}</h2>
        <div className="application-sub-panel">
          <div className="application-sub-panel__body">
            <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="chatVisibility" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.chat.visibility')}</label>
              <div className="application-sub-panel__item-data form-element">
                <select id="chatVisibility" className="form-element__select" value={this.state.chatVisibility !== null ? this.state.chatVisibility : "DISABLED"} onChange={this.onChatVisibilityChange}>
                  <option value="VISIBLE_TO_ALL">{this.props.i18n.text.get('plugin.profile.chat.visibleToAll')}</option>
                  <option value="DISABLED">{this.props.i18n.text.get('plugin.profile.chat.disabled')}</option>
                </select>
              </div>
            </div>

            <div className="application-sub-panel__item application-sub-panel__item--profile">
              <label htmlFor="chatNickname" className="application-sub-panel__item-title">{this.props.i18n.text.get('plugin.profile.chat.setNick')}</label>
              <div className="application-sub-panel__item-data form-element">
                <input id="chatNickname" className="form-element__input" type="text" onChange={this.onChatNicknameChange} value={this.state.chatNickname !== null ? this.state.chatNickname : ""} />
              </div>
              <div className="application-sub-panel__item-description">{this.props.i18n.text.get("plugin.profile.chat.setNickDescription")}</div>
            </div>

            <div className="application-sub-panel__item-actions">
              <Button buttonModifiers="primary-function-save" onClick={this.save}>{this.props.i18n.text.get('plugin.profile.save.button')}</Button>
            </div>
          </div>
        </div>
      </form>
    </section>;
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({saveProfileProperty, displayNotification, updateProfileChatSettings}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatSettings);