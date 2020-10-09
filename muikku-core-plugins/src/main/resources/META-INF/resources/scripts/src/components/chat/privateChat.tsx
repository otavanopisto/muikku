/*global converse */
import * as React from 'react'
import mApi from '~/lib/mApi';
import '~/sass/elements/chat.scss';
import promisify from '~/util/promisify';
import { IAvailableChatRoomType, IBareMessageType, IChatRoomType } from './chat';
import { ChatMessage } from './chatMessage';

interface IPrivateChatProps {
  initializingStanza: Element;
  leaveChat: () => void;
  connection: Strophe.Connection;
  jid: string;
}

interface IPrivateChatState {
  messages: IBareMessageType[],
  minimized: boolean;
  messageNotification: boolean;
}

export class PrivateChat extends React.Component<IPrivateChatProps, IPrivateChatState> {

  private messagesListenerHandler: any = null;
  private presenceListenerHandler: any = null;
  private messagesEnd: React.RefObject<HTMLDivElement>;

  constructor(props: IPrivateChatProps) {
    super(props);

    this.state = {
      messages: [],
      minimized: JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]").includes(props.jid),
      messageNotification: !!this.props.initializingStanza,
    }

    this.messagesEnd = React.createRef();

    this.sendMessage = this.sendMessage.bind(this);
    this.onPrivateChatMessage = this.onPrivateChatMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.onPresence = this.onPresence.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
  }

  sendMessage(event: React.FormEvent) {
    event && event.preventDefault();

    // const text = this.state.currentMessageToBeSent.trim();

    // if (text) {
    //   this.props.connection.send($msg({
    //     from: this.props.connection.jid,
    //     to: this.props.chat.roomJID,
    //     type: "PrivateChat",
    //   }).c("body", text));

    //   this.setState({
    //     currentMessageToBeSent: "",
    //   }, this.scrollToBottom.bind(this, "smooth"));
    // }
  }

  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }

  onPrivateChatMessage(stanza: Element) {
    console.log(stanza);
    return;
    
    // const from = stanza.getAttribute("from");
    // const fromNick = from.split("/")[1];
    // const body = stanza.querySelector("body");
    // if (body) {
    //   const content = body.textContent;
    //   let date: Date = null;

    //   const delay = stanza.querySelector("delay");
    //   let userId: string = null;
    //   if (delay) {
    //     date = new Date(delay.getAttribute("stamp"));
    //     userId = delay.getAttribute("from").split("@")[0];
    //   } else {
    //     date = new Date();
    //   }

    //   const id = stanza.querySelector("stanza-id").getAttribute("id");

    //   // message is already loaded, this can happen when the server
    //   // broadcasts messages twice, as when you change your presense
    //   if (this.state.messages.find((m) => m.id === id)) {
    //     return;
    //   }

    //   if (!userId) {
    //     // we might not find it, if occupants is not ready
    //     const PrivateChatOccupant = this.state.occupants.find((o) => o.occupant.nick === fromNick);
    //     // whenever occupants get added this should be fixed
    //     if (PrivateChatOccupant) {
    //       userId = PrivateChatOccupant.occupant.userId;
    //     }
    //   }

    //   const messageReceived: IBareMessageType = {
    //     nick: fromNick,
    //     message: content,
    //     id,
    //     timestamp: date,
    //     userId,
    //     isSelf: userId === this.props.connection.jid.split("@")[0],
    //   };

    //   const newMessagesList = [...this.state.messages, messageReceived];
    //   this.setState({
    //     messages: newMessagesList,
    //   }, this.scrollToBottom.bind(this, "smooth"));
    // }

    // return true;
  }
  onEnterPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      this.sendMessage(null);

      return false;
    }
  }
  toggleMinimizeChats() {
    let minimizedChatList: string[] = JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]");
    const newMinimized = !this.state.minimized;
    this.setState({
      minimized: newMinimized,
    });
    if (newMinimized) {
      minimizedChatList.push(this.props.jid);
    } else {
      minimizedChatList = minimizedChatList.filter((r) => r !== this.props.jid);
    }

    window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedChatList));
  }
  onPresence(stanza: Element) {
    console.log(stanza);
    return true;
  }
  render() {
    return (
      <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>
        {this.state.minimized === true ? (
          <div onClick={this.toggleMinimizeChats} className={this.state.messageNotification ? "chat__minimized chat__minimized--private chat__nofication--private" : "chat__minimized chat__minimized--private"}>
            <div className="chat__minimized-title">{this.props.jid}</div>
            <div onClick={this.props.leaveChat} className="chat__button chat__button--close icon-cross"></div>
          </div>
        ) : (
          <div className="chat__panel chat__panel--private">
            <div className="chat__panel-header chat__panel-header--private">
              <div className="chat__panel-header-title">{this.props.jid}</div>
                <div onClick={this.toggleMinimizeChats} className="chat__button chat__button--minimize icon-minus"></div>
                <div onClick={this.props.leaveChat} className="chat__button chat__button--close icon-cross"></div>
            </div>

            <div className="chat__panel-body chat__panel-body--chatroom">
              <div className="chat__messages-container chat__messages-container--private">
                {/* {this.state.messages.map((message: any, i: any) => <PrivateMessage key={i} message={message} />)} */}
                <div className="chat__messages-last-message" ref={this.messagesEnd}></div>
              </div>
            </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={this.sendMessage}>
              <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder="Kirjoita viesti tähän..." name="chatMessage"></textarea>
              <button className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private" type="submit" value=""><span className="icon-arrow-right"></span></button>
            </form>
          </div>
        )}
      </div>
    )
  }
}
