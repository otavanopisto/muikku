/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import mApi from '~/lib/mApi';
import promisify from '~/util/promisify';
import { IBareMessageType } from './chat';
import { i18nType } from '~/reducers/base/i18n';

interface IChatUserInfoType {
  name: string;
  nick: string;
  studyProgramme: string;
}

const USER_INFO_CACHE: {
  [key: string]: IChatUserInfoType;
} = {}

interface IChatMessageProps {
  canDelete: boolean;
  canToggleInfo: boolean;
  messsage: IBareMessageType;
  onMarkForDelete: () => void;
  deleted?: boolean;
  deletedTime?: string;
  i18n: i18nType,
}

interface IChatMessageState {
  showInfo: boolean;
  realName: string;
  studyProgramme: string;
  showRemoveButton: boolean;
}

export class ChatMessage extends React.Component<IChatMessageProps, IChatMessageState> {
  constructor(props: IChatMessageProps){
    super(props);

    this.state = {
      showInfo: false,
      realName: null,
      studyProgramme: null,
      showRemoveButton: false,
    }

    this.toggleInfo = this.toggleInfo.bind(this);
    this.toggleShowRemoveButton = this.toggleShowRemoveButton.bind(this);
  }
  async toggleInfo() {
    if (this.state.showInfo) {
      this.setState({
        showInfo: false,
        realName: null,
      });
    } else if (this.props.messsage.userId && this.props.canToggleInfo){
      let userName: string = null;
      let studyProgramme: string = null;
      if (USER_INFO_CACHE[this.props.messsage.userId]) {
        userName = USER_INFO_CACHE[this.props.messsage.userId].name;
        studyProgramme = USER_INFO_CACHE[this.props.messsage.userId].studyProgramme;
      } else {
        const user: IChatUserInfoType = (await promisify(mApi().chat.userInfo.read(this.props.messsage.userId,{}), 'callback')()) as any;
        USER_INFO_CACHE[this.props.messsage.userId] = user;
        userName = user.name;
        studyProgramme = user.studyProgramme;
      }

      this.setState({
        showInfo: true,
        realName: userName,
        studyProgramme,
      });
    }
  }
  toggleShowRemoveButton() {
    if (this.props.canDelete && !this.props.deleted) {
      this.setState({
        showRemoveButton: !this.state.showRemoveButton,
      });
    }
  }
  componentDidUpdate() {
    if ((!this.props.canDelete || this.props.deleted) && this.state.showRemoveButton) {
      this.setState({
        showRemoveButton: false,
      });
    }
  }
  render() {
    const senderClass = this.props.messsage.isSelf ? "sender-me" : "sender-them";

    return  (<div className={`chat__message chat__message--${senderClass}`}>
      <div className="chat__message-meta">
        <span className={`chat__message-meta-sender ${this.props.canToggleInfo && "chat__message-meta-sender--access-to-realname"}`} onClick={this.toggleInfo}>
          {this.props.messsage.nick}
          {this.state.showInfo && <span className="chat__message-meta-sender-real-name">({this.state.realName})</span>}
          {this.state.showInfo && (this.state.studyProgramme && this.state.studyProgramme !== "null") && <span className="chat__message-meta-sender-study-programme">({this.state.studyProgramme})</span>}
        </span>
        <span className="chat__message-meta-timestamp">
          {this.props.i18n.time.formatDaily(this.props.messsage.timestamp)}
        </span>
      </div>
      <div className="chat__message-content-container" onClick={this.toggleShowRemoveButton}>
        <div className="chat__message-content">
          {this.props.deleted ? <i>{this.props.i18n.text.get("plugin.chat.message.deleted")} {this.props.i18n.time.formatDaily(this.props.deletedTime)}</i>  : this.props.messsage.message}
        </div>
        {this.state.showRemoveButton ? <div className="chat__message-action-container">
          <div onClick={this.props.onMarkForDelete} className="chat__message-delete">{this.props.i18n.text.get("plugin.chat.message.delete")}</div>
        </div> : null}
      </div>
    </div>
    );
  }
}
