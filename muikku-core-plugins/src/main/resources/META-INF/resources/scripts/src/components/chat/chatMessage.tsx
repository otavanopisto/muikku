/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import mApi from '~/lib/mApi';
import promisify from '~/util/promisify';
import { IBareMessageType } from './chat';
import { UserType } from '~/reducers/user-index';
import { i18nType } from '~/reducers/base/i18n';

const REAL_NAMES_CACHE: {
  [key: string]: string;
} = {}

interface IChatMessageProps {
  canDelete: boolean;
  canToggleRealName: boolean;
  messsage: IBareMessageType;
  onMarkForDelete: () => void;
  deleted?: boolean;
  deletedTime?: string;
  i18n: i18nType,
}

interface IChatMessageState {
  showName: boolean;
  realName: string;
  showRemoveButton: boolean;
}

export class ChatMessage extends React.Component<IChatMessageProps, IChatMessageState> {
  constructor(props: IChatMessageProps){
    super(props);
    this.state = {
      showName: false,
      realName: null,
      showRemoveButton: false,
    }

    this.toggleRealName = this.toggleRealName.bind(this);
    this.removeMessage = this.removeMessage.bind(this);
    this.toggleShowRemoveButton = this.toggleShowRemoveButton.bind(this);
  }
  async toggleRealName() {
    if (this.state.showName) {
      this.setState({
        showName: false,
        realName: null,
      });
    } else if (this.props.messsage.userId && this.props.canToggleRealName){
      let userName: string = null;
      if (REAL_NAMES_CACHE[this.props.messsage.userId]) {
        userName = REAL_NAMES_CACHE[this.props.messsage.userId];
      } else {
        const user: any = (await promisify(mApi().chat.userInfo.read(this.props.messsage.userId,{}), 'callback')()) as any;
        userName = user.name;
        REAL_NAMES_CACHE[this.props.messsage.userId] = userName;
      }

      this.setState({
        showName: true,
        realName: userName
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
  removeMessage (){

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
        <span className="chat__message-meta-sender" onClick={this.toggleRealName}>
          {this.props.messsage.nick} {this.state.showName ? <span className="chat__message-meta-sender-real-name">({this.state.realName}) </span> : null}
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
