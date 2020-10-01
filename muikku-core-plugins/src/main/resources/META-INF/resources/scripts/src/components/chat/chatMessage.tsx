/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import mApi from '~/lib/mApi';
import promisify from '~/util/promisify';
import { IBareMessageType } from './chat';
import { UserType } from '~/reducers/user-index';
import moment from "~/lib/moment";

const REAL_NAMES_CACHE: {
  [key: string]: string;
} = {}

interface IChatMessageProps {
  canDelete: boolean;
  messsage: IBareMessageType;
  onMarkForDelete: () => void;
  deleted?: boolean;
  deletedTime?: string;
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
    } else if (this.props.messsage.pyramusUserID){
      let userName: string = null;
      if (REAL_NAMES_CACHE[this.props.messsage.pyramusUserID]) {
        userName = REAL_NAMES_CACHE[this.props.messsage.pyramusUserID];
      } else {
        const user: UserType = (await promisify(mApi().user.users.basicinfo.read(this.props.messsage.pyramusUserID,{}), 'callback')()) as UserType;
        userName = user.firstName + " " + user.lastName;
        REAL_NAMES_CACHE[this.props.messsage.pyramusUserID] = userName;
      }

      this.setState({
        showName: true,
        realName: userName
      });
    }
  }
  toggleShowRemoveButton() {
    this.setState({
      showRemoveButton: !this.state.showRemoveButton,
    });
  }
  removeMessage (){

  }
  render() {
    const senderClass = this.props.messsage.isSelf ? "sender-me" : "sender-them";

    return  (<div className={`chat__message chat__message--${senderClass}`}>
      <div className="chat__message-meta">
        <span className="chat__message-meta-sender" onClick={this.toggleRealName}>
          {this.props.messsage.nick} {this.state.showName ? <span className="chat__message-meta-sender-real-name">({this.state.realName}) </span> : null}
        </span>
        <span className="chat__message-meta-timestamp">
          {moment(this.props.messsage.timestamp).format("L")}
        </span>
      </div>
      <div className="chat__message-content-container" onClick={this.toggleShowRemoveButton}>
        <div className="chat__message-content">
          {this.props.deleted ? <i>Viesti poistettu {moment(this.props.deletedTime).format("L")}</i>  : this.props.messsage.message}
        </div>
        {this.state.showRemoveButton ? <div className="chat__message-action-container">
          <div onClick={this.props.onMarkForDelete} className="chat__message-delete">Poista</div>
        </div> : null}
      </div>
    </div>
    );
  }
}
