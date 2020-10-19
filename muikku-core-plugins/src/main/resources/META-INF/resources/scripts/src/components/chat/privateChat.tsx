/*global converse */
import * as React from 'react'
import mApi from '~/lib/mApi';
import '~/sass/elements/chat.scss';
import { IBareMessageType } from './chat';
import { ChatMessage } from './chatMessage';
import promisify from '~/util/promisify';
import { i18nType } from '~/reducers/base/i18n';

interface IPrivateChatProps {
  initializingStanza: Element;
  leaveChat: () => void;
  connection: Strophe.Connection;
  jid: string;
  i18n: i18nType;
}

interface IPrivateChatState {
  nick: string,
  messages: IBareMessageType[],
  minimized: boolean;
  messageNotification: boolean;
  targetPrescense: "away" | "chat" | "dnd" | "xa";
  isStudent: boolean,

  currentMessageToBeSent: string;
}

export class PrivateChat extends React.Component<IPrivateChatProps, IPrivateChatState> {

  private messagesListenerHandler: any = null;
  private presenceListenerHandler: any = null;
  private isFocused: boolean = false;
  private messagesEnd: React.RefObject<HTMLDivElement>;

  constructor(props: IPrivateChatProps) {
    super(props);

    this.state = {
      nick: null,
      messages: [],
      minimized: JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]").includes(props.jid),
      messageNotification: !!this.props.initializingStanza,
      currentMessageToBeSent: "",
      targetPrescense: "xa",
      isStudent: (window as any).MUIKKU_IS_STUDENT,
    }

    this.messagesEnd = React.createRef();

    this.sendMessage = this.sendMessage.bind(this);
    this.onPrivateChatMessage = this.onPrivateChatMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.onPresence = this.onPresence.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.setCurrentMessageToBeSent = this.setCurrentMessageToBeSent.bind(this);
    this.onTextFieldFocus = this.onTextFieldFocus.bind(this);
    this.onTextFieldBlur = this.onTextFieldBlur.bind(this);
    this.requestPrescense = this.requestPrescense.bind(this);
  }

  componentDidMount() {
    this.messagesListenerHandler = this.props.connection.addHandler(this.onPrivateChatMessage, null, "message", "chat", null, this.props.jid, { matchBare: true });
    this.presenceListenerHandler = this.props.connection.addHandler(this.onPresence, null, "presence", null, null, this.props.jid, { matchBare: true });

    if (this.props.initializingStanza) {
      this.onPrivateChatMessage(this.props.initializingStanza);
    }

    this.requestPrescense();
    this.obtainNick();
  }

  async obtainNick() {
    const user: any = (await promisify(mApi().chat.userInfo.read(this.props.jid.split("@")[0],{}), "callback")()) as any;
    this.setState({
      nick: user.name,
    });
  }

  requestPrescense() {
    this.props.connection.send($pres({
      from: this.props.connection.jid,
      to: this.props.jid,
      type: "probe",
    }));
  }

  componentWillUnmount() {
    this.props.connection.deleteHandler(this.messagesListenerHandler);
    this.props.connection.deleteHandler(this.presenceListenerHandler);
  }

  onTextFieldFocus() {
    this.isFocused = true;
    if (this.state.messageNotification) {
      this.setState({
        messageNotification: false,
      });
    }
  }

  onTextFieldBlur() {
    this.isFocused = false;
  }

  setCurrentMessageToBeSent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      currentMessageToBeSent: e.target.value,
    });
  }

  sendMessage(event: React.FormEvent) {
    event && event.preventDefault();

    const text = this.state.currentMessageToBeSent.trim();

    if (text) {
      this.props.connection.send($msg({
        from: this.props.connection.jid,
        to: this.props.jid,
        type: "chat",
      }).c("body", text).up().c('active', { xmlns: 'http://jabber.org/protocol/chatstates' }));

      const newMessage = {
        nick: null as string,
        message: text,
        id: null as string,
        timestamp: new Date(),
        userId: this.props.connection.jid.split("@")[0],
        isSelf: true,
      }

      this.setState({
        currentMessageToBeSent: "",
        messages: [...this.state.messages, newMessage]
      }, this.scrollToBottom.bind(this, "smooth"));
    }
  }

  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }

  onPrivateChatMessage(stanza: Element) {
    const from = stanza.getAttribute("from");
    const fromNick: string = null;

    const body = stanza.querySelector("body");
    if (body) {
      const content = body.textContent;
      const date = new Date();
      const userId = from.split("@")[0];
      const id: string = null;

      const messageReceived: IBareMessageType = {
        nick: fromNick,
        message: content,
        id,
        timestamp: date,
        userId,
        isSelf: userId === this.props.connection.jid.split("@")[0],
      };

      const newMessagesList = [...this.state.messages, messageReceived];
      this.setState({
        messages: newMessagesList,
        messageNotification: this.state.messageNotification || (
          !this.isFocused
        ),
      }, this.scrollToBottom.bind(this, "smooth"));
    }

    return true;
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
      messageNotification: false,
    }, this.scrollToBottom);

    if (newMinimized) {
      minimizedChatList.push(this.props.jid);
    } else {
      minimizedChatList = minimizedChatList.filter((r) => r !== this.props.jid);
    }

    window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedChatList));
  }
  onPresence(stanza: Element) {
    console.log(stanza);
    const show = stanza.querySelector("show");
    const precense: any = show ? show.textContent : "chat";

    this.setState({
      targetPrescense: precense,
    });

    return true;
  }
  setMessageAsRemoved(data: any) {

  }
  render() {
    return (
      <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>
        {this.state.minimized === true ? (
          <div onClick={this.toggleMinimizeChats} className={this.state.messageNotification ? "chat__minimized chat__minimized--private chat__nofication--private" : "chat__minimized chat__minimized--private"}>
            <div className="chat__minimized-title">{this.state.nick}</div>
            <div onClick={this.props.leaveChat} className="chat__button chat__button--close icon-cross"></div>
          </div>
        ) : (
          <div className="chat__panel chat__panel--private">
            <div className="chat__panel-header chat__panel-header--private">
              <div className="chat__panel-header-title">{this.state.nick}</div>
                <div onClick={this.toggleMinimizeChats} className="chat__button chat__button--minimize icon-minus"></div>
                <div onClick={this.props.leaveChat} className="chat__button chat__button--close icon-cross"></div>
            </div>

            <div className="chat__panel-body chat__panel-body--chatroom">
              <div className="chat__messages-container chat__messages-container--private">
                  {this.state.messages.map((message, index) => <ChatMessage key={index} onMarkForDelete={this.setMessageAsRemoved.bind(this)}
                    canToggleRealName={!this.state.isStudent}
                    message={message} canDelete={false && message.isSelf} i18n={this.props.i18n} />)}
                <div className="chat__messages-last-message" ref={this.messagesEnd}></div>
              </div>
            </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={this.sendMessage}>
              <textarea
                className="chat__memofield chat__memofield--muc-message"
                onKeyDown={this.onEnterPress}
                placeholder={this.props.i18n.text.get("plugin.chat.writemsg")}
                value={this.state.currentMessageToBeSent}
                onChange={this.setCurrentMessageToBeSent}
                onFocus={this.onTextFieldFocus}
                onBlur={this.onTextFieldBlur}
              />
              <button className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private" type="submit" value=""><span className="icon-arrow-right"></span></button>
            </form>
          </div>
        )}
      </div>
    )
  }
}
