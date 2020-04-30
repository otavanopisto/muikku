/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import converse from '~/lib/converse';
import { PrivateMessage } from './privatemessage';
import mApi, { MApiError } from '~/lib/mApi';
import promisify, { promisifyNewConstructor } from '~/util/promisify';

interface Iprops {
  chat?: any,
  converse?: any,
  orderNumber?: any,
  onOpenPrivateChat?: any,
  chatObject?: any,
  openPrivateChat?: any,
  privateChat?: any,
  jid?: any,
  info?: any
}

interface Istate {
  jid?: string,
  converse?: any,
  roomJid?: string,
  minimized?: boolean,
  roomName?: string,
  minimizedChats?: any,
  messages?: any,
  minimizedClass?: string,
  jidTo?: string,
  nickTo?: string,
  fnTo?: string,
  lnTo?: string,
  chat?: any,
  chatRecipientNick?: string,
  info?: any,
  messageNotification?: any
}

declare namespace JSX {
  interface ElementClass {
    render: any,
    converse: any;
  }
}

declare global {
  interface Window {
    MUIKKU_IS_STUDENT: boolean,
    PROFILE_DATA: any,
    MUIKKU_LOGGED_USER: string
  }
}

export class PrivateMessages extends React.Component<Iprops, Istate> {

  private myRef: any;
  private messagesEnd: any;

  constructor(props: any) {
    super(props);
    this.state = {
      jid: window.MUIKKU_LOGGED_USER + "@dev.muikkuverkko.fi".toLowerCase(),
      converse: this.props.converse,
      roomJid: "",
      minimized: false,
      roomName: "",
      minimizedChats: [],
      messages: [],
      minimizedClass: "",
      jidTo: "",
      nickTo: "",
      fnTo: "",
      lnTo: "",
      chat: Object,
      chatRecipientNick: "",
      info: [],
      messageNotification: this.props.info.info.receivedMessageNotification,
    }
    this.myRef = null;
    this.openConversation = this.openConversation.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    // this.onEnterPress = this.onEnterPress.bind(this);
  }
  minimizeChats(roomJid: any) {
    let minimizedRoomList = this.state.minimizedChats;

    if (this.state.minimized === false) {
      this.setState({
        minimized: true,
        minimizedClass: "order-minimized",
        messageNotification: false
      });

      if (!minimizedRoomList.includes(roomJid)) {
        minimizedRoomList.push(roomJid);

        this.setState({ minimizedChats: minimizedRoomList })
        window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
      }
    } else {

      if (minimizedRoomList.includes(roomJid)) {
        const filteredRooms = minimizedRoomList.filter((item: any) => item !== roomJid)
        this.setState({ minimizedChats: filteredRooms })

        var result = JSON.parse(window.sessionStorage.getItem('minimizedChats')) || [];

        const filteredChats = result.filter(function (item: any) {
          return item !== roomJid;
        })

        window.sessionStorage.setItem("minimizedChats", JSON.stringify(filteredChats));

        return;
      }

      this.setState({
        minimized: false,
        minimizedClass: "",
        messageNotification: false
      }, this.scrollToBottom.bind(this, "auto"));
    }
  }
  async sendMessage(event: any) {
    event.preventDefault();
    let text = event.target.chatMessage.value;

    let spoiler_hint = "undefined";

    const attrs = this.state.chat.getOutgoingMessageAttributes(text, spoiler_hint);

    let message = this.state.chat.messages.findWhere('correcting');

    if (message) {
      const older_versions = message.get('older_versions') || [];
      older_versions.push(message.get('message'));
      message.save({
        'correcting': false,
        'edited': this.state.chat.moment().format(),
        'message': text,
        'older_versions': older_versions,
        'references': text
      });
    } else {
      message = this.state.chat.messages.create(attrs);
    }
    event.target.chatMessage.value = '';
    // TODO: null check for sending messages
    if (text !== "" || text !== null) {
      this.state.converse.api.send(this.state.chat.createMessageStanza(message));
      this.getPrivateMessages(message);
      return true;
    }
  }
  scrollToBottom(method: string = "smooth") {
    if (this.messagesEnd){
      this.messagesEnd.scrollIntoView({ behavior: method });
    }
  }
  onEnterPress(e: any) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      return false;
    }
  }
  openConversation(jid: any) {
    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    this.state.converse.api.chats.open(jid).then(async (chat: any) => {
      this.setState({
        chat: chat,
        chatRecipientNick: chat.attributes.nickname || this.state.nickTo
      })

      let result;
      try {
        result = await this.state.converse.api.archive.query({ 'with': jid });
      } catch (e) {
        console.log("Failed to load archived messages " + e.innerHTML);
      }

      let sessionResult = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

      if (!sessionResult.includes(jid)) {
        sessionResult.push(jid);
      }
      window.sessionStorage.setItem("openChats", JSON.stringify(sessionResult));

      let messages = this.state.messages;
      let olderMessages: any;
      olderMessages = result.messages;
      let newArrFromOldMessages: any;
      newArrFromOldMessages = new (Array);
      let i: any;
      let text: any;
      let from: any;
      let stamp: any;
      let user: any;
      let nickname: any;
      let userName: any;
      let nick: any;
      let senderClass: any;

      for (i = 0; i < olderMessages.length; i++) {
        let pathForStamp = './/*[local-name()="delay"]/@stamp';
        let pathForFrom = './/*[local-name()="message"]/@from';
        stamp = olderMessages[i].ownerDocument.evaluate(pathForStamp, olderMessages[i], null, XPathResult.STRING_TYPE, null).stringValue;
        from = olderMessages[i].ownerDocument.evaluate(pathForFrom, olderMessages[i], null, XPathResult.STRING_TYPE, null).stringValue;

        text = olderMessages[i].textContent;
        from = from.split("@")[0];
        from = from.toUpperCase();

        if (from.startsWith("PYRAMUS-STAFF-") || from.startsWith("PYRAMUS-STUDENT-")) {
          user = (await promisify(mApi().user.users.basicinfo.read(from, {}), 'callback')());
          nickname = (await promisify(mApi().chat.settings.read(from), 'callback')());
          userName = user.firstName + " " + user.lastName;
          nick = nickname.nick;
        } else {
          userName = from;
          nick = from;
        }

        if (from === window.MUIKKU_LOGGED_USER) {
          senderClass = "sender-me";
        } else {
          senderClass = "sender-them";
        }

        if (!text.startsWith("messageID=")) {
          newArrFromOldMessages.push({ message: text, from: userName + " (" + nick + ")", id: "", stamp: stamp, senderClass: senderClass });
        }
      }
      this.setState({
        messages: newArrFromOldMessages,
        roomJid: jid
      }, this.scrollToBottom.bind(this, "auto"));
    });
    return;
  }
  async getPrivateMessages(data: any) {

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    if (data.chatbox && data.chatbox.attributes.message_type === "chat") {
      let message = data.stanza.textContent;
      let from: any;
      let user: any;
      let nickname: any;
      let nick: any;
      let userName: any;

      var msg = data.chatbox.messages.models[data.chatbox.messages.models.length - 1];

      from = msg.attributes.from;
      from = from.split("@")[0];
      from = from.toUpperCase();

      if (from.startsWith("PYRAMUS-STAFF-") || from.startsWith("PYRAMUS-STUDENT-")) {
        user = (await promisify(mApi().user.users.basicinfo.read(from, {}), 'callback')());
        nickname = (await promisify(mApi().chat.settings.read(from), 'callback')());
        userName = user.firstName + " " + user.lastName;
        nick = nickname.nick;
      } else {
        userName = from;
        nick = from;
      }

      let newMessage = {
        message: msg.attributes.message,
        from: userName + " '" + nick + "' ",
        id: msg.attributes.id,
        stamp: msg.attributes.time,
        senderClass: "sender-" + msg.attributes.sender
      }

      let isExists = this.state.messages.some(function (curr: any) {
        if (curr.id === msg.attributes.id) {
          return true;
        }
      });

      if (isExists !== true) {
        this.state.messages.push(newMessage);
      }
      if (this.state.minimized) {
        this.setState({
          messageNotification: true
        });
      }
      this.setState({ messages: this.state.messages }, this.scrollToBottom.bind(this, "smooth"));
    } else if (data.attributes && data.attributes.type === "chat") {

      let message = data.attributes.message;
      let from = data.attributes.from;
      from = from.split("@")[0];
      from = from.toUpperCase();
      let senderClass = "sender-" + data.attributes.sender;
      let user: any;
      let nickname: any;
      let nick: any;
      let userName: any;

      if (from.startsWith("PYRAMUS-STAFF-") || from.startsWith("PYRAMUS-STUDENT-")) {
        user = (await promisify(mApi().user.users.basicinfo.read(from, {}), 'callback')());
        nickname = (await promisify(mApi().chat.settings.read(from), 'callback')());
        userName = user.firstName + " " + user.lastName;
        nick = nickname.nick;
      } else {
        userName = from;
        nick = from;
      }
      if (this.state.minimized) {
        this.setState({
          messageNotification: true
        });
      }
      this.setState({ messages: this.state.messages }, this.scrollToBottom.bind(this, "smooth"));
    }
  }
  componentDidMount() {

    let __this = this;

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    let privateChatData = this.props.info;

    if (privateChatData) {
      let jid = privateChatData.jid;
      let nick = privateChatData.info.nick;
      let firstName = privateChatData.info.firstName;
      let lastName = privateChatData.info.lastName;

      this.setState({
        jidTo: jid,
        nickTo: nick,
        fnTo: firstName,
        lnTo: lastName,
        info: privateChatData
      });

      this.openConversation(jid);

      this.props.converse.api.listen.on('message', function (messageXML: any) {
        __this.getPrivateMessages(messageXML);
      });

      let minimizedChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("minimizedChats"));

      if (minimizedChatsFromSessionStorage) {
        this.setState({
          minimizedChats: minimizedChatsFromSessionStorage
        });

        minimizedChatsFromSessionStorage.map((item: any) => {
          if (item === privateChatData.jid) {
            this.setState({
              minimized: true
            });
          }
        })
      }
    }
  }
  componentDidUpdate() {

  }
  render() {
    return (

      <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>

        {this.state.minimized === true ? (
          <div onClick={() => this.minimizeChats(this.state.roomJid)} className={this.state.messageNotification === true ? "chat__message-notification chat__minimized chat__minimized--private" : "chat__minimized chat__minimized--private"}>
            <div className="chat__minimized-title">{this.state.fnTo + " '" + this.state.nickTo + "' " + this.state.lnTo}</div>
            <div onClick={() => this.props.onOpenPrivateChat(this.state.info.info)} className="chat__button chat__button--close icon-close"></div>
          </div>
        ) : (
            <div className="chat__panel chat__panel--private">
              <div className="chat__panel-header chat__panel-header--private">
                <div className="chat__panel-header-title">{this.state.fnTo + " '" + this.state.nickTo + "' " + this.state.lnTo}</div>
                <div onClick={() => this.minimizeChats(this.state.roomJid)} className="chat__button chat__button--minimize icon-remove"></div>
                <div onClick={() => this.props.onOpenPrivateChat(this.state.info.info)} className="chat__button chat__button--close icon-close"></div>
              </div>

              <div className="chat__panel-body chat__panel-body--chatroom">
                <div className="chat__messages-container chat__messages-container--private" ref={(ref) => this.myRef = ref}>
                  {this.state.messages.map((message: any, i: any) => <PrivateMessage key={i} message={message} />)}
                  <div className="chat__messages-last-message" ref={(el) => { this.messagesEnd = el; }}></div>
                </div>
              </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={(e) => this.sendMessage(e)}>
                <input name="chatRecipient" className="chat__muc-recipient" value={this.state.roomJid} readOnly />
                <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder="Kirjoita viesti tähän..." name="chatMessage"></textarea>
                <button className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private" type="submit" value=""><span className="icon-arrow-right-thin"></span></button>
              </form>
            </div>
          )}
      </div>
    );
  }
}
