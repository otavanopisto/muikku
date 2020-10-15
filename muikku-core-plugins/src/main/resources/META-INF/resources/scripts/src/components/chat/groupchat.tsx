/*global converse */
import * as React from 'react'
import mApi from '~/lib/mApi';
import { i18nType } from '~/reducers/base/i18n';
import '~/sass/elements/chat.scss';
import promisify from '~/util/promisify';
import { IAvailableChatRoomType, IBareMessageType, IChatOccupant, IChatRoomType } from './chat';
import { ChatMessage } from './chatMessage';

interface IGroupChatProps {
  chat: IAvailableChatRoomType;
  nick: string;
  leaveChatRoom: () => void;
  joinPrivateChat: (jid: string) => void;
  onUpdateChatRoomConfig: (chat: IAvailableChatRoomType) => void;
  requestExtraInfoAboutRoom: () => void;
  connection: Strophe.Connection;
  i18n: i18nType,
  presence: "away" | "chat" | "dnd" | "xa", // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2
}

interface IGroupChatOccupant {
  occupant: IChatOccupant;
  affilation: "none" | "owner";
  role: "moderator" | "participant";
}

interface IGroupChatState {
  messages: IBareMessageType[],
  openChatSettings: boolean;
  isStudent: boolean;
  isOwner: boolean;
  isModerator: boolean;
  showRoomInfo: boolean;
  minimized: boolean;
  occupants: IGroupChatOccupant[];
  showOccupantsList: boolean;

  roomNameField: string;
  roomDescField: string;
  // roomPersistent: boolean;

  updateFailed: boolean;

  currentMessageToBeSent: string;
}

export class Groupchat extends React.Component<IGroupChatProps, IGroupChatState> {

  private messagesListenerHandler: any = null;
  private presenceListenerHandler: any = null;
  private messagesEnd: React.RefObject<HTMLDivElement>;

  constructor(props: IGroupChatProps) {
    super(props);

    this.state = {
      messages: [],
      openChatSettings: false,
      isStudent: (window as any).MUIKKU_IS_STUDENT,
      isOwner: false,
      isModerator: false,
      showRoomInfo: false,
      minimized: JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]").includes(props.chat.roomJID),
      occupants: [],
      showOccupantsList: false,

      roomNameField: this.props.chat.roomName,
      roomDescField: this.props.chat.roomDesc,
      // roomPersistent: this.props.chat.roomPersistent,

      updateFailed: false,

      currentMessageToBeSent: "",
    }

    this.messagesEnd = React.createRef();

    this.sendMessageToChatRoom = this.sendMessageToChatRoom.bind(this);
    this.setChatroomConfiguration = this.setChatroomConfiguration.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.toggleOccupantsList = this.toggleOccupantsList.bind(this);
    this.onGroupChatMessage = this.onGroupChatMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.toggleChatRoomSettings = this.toggleChatRoomSettings.bind(this);
    this.setCurrentMessageToBeSent = this.setCurrentMessageToBeSent.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.onPresence = this.onPresence.bind(this);
    this.sendRoomPrescense = this.sendRoomPrescense.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this)
  }

  updateRoomNameField(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      roomNameField: e.target.value,
    });
  }

  updateRoomDescField(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      roomDescField: e.target.value,
    });
  }

  setCurrentMessageToBeSent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      currentMessageToBeSent: e.target.value,
    });
  }

  sendMessageToChatRoom(event: React.FormEvent) {
    event && event.preventDefault();

    const text = this.state.currentMessageToBeSent.trim();

    if (text) {
      this.props.connection.send($msg({
        from: this.props.connection.jid,
        to: this.props.chat.roomJID,
        type: "groupchat",
      }).c("body", text));

      this.setState({
        currentMessageToBeSent: "",
      }, this.scrollToBottom.bind(this, "smooth"));
    }
  }

  // Set chat room configurations
  async setChatroomConfiguration(event: React.FormEvent) {
    event.preventDefault();

    const chat: IAvailableChatRoomType = {
      ...this.props.chat,
      roomName: this.state.roomNameField,
      roomDesc: this.state.roomDescField,
    };

    try {
      const chatRoom: IChatRoomType = await (promisify(mApi().chat.publicRoom.update({
        title: chat.roomName,
        description: chat.roomDesc,
        name: Strophe.getNodeFromJid(chat.roomJID),
      }), 'callback')()) as IChatRoomType;

      chat.roomName = chatRoom.title;
      chat.roomDesc = chatRoom.description;

      this.setState({
        updateFailed: false,
        openChatSettings: false
      });
  
      this.props.onUpdateChatRoomConfig(chat);
    } catch {
      this.setState({
        updateFailed: true,
      });
    }
  }

  public toggleChatRoomSettings() {
    this.setState({
      openChatSettings: !this.state.openChatSettings,
      updateFailed: false,
    });
    this.props.requestExtraInfoAboutRoom();
  }

  toggleMinimizeChats() {
    const roomJID = this.props.chat.roomJID;
    let minimizedRoomList: string[] = JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]");
    const newMinimized = !this.state.minimized;
    this.setState({
      minimized: newMinimized,
    }, this.scrollToBottom);
    if (newMinimized) {
      minimizedRoomList.push(roomJID);
    } else {
      minimizedRoomList = minimizedRoomList.filter((r) => r !== roomJID);
    }

    window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
  }
  async toggleOccupantsList() {
    this.setState({
      showOccupantsList: !this.state.showOccupantsList,
    });
  }
  // Scroll selected view to the bottom
  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }
  onEnterPress(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      this.sendMessageToChatRoom(null);

      return false;
    }
  }
  componentDidUpdate(prevProps: IGroupChatProps) {
    if (prevProps.chat && this.props.chat) {
      if (prevProps.chat.roomName !== this.props.chat.roomName) {
        this.setState({
          roomNameField: this.props.chat.roomName || "",
        });
      }
      if (prevProps.chat.roomDesc !== this.props.chat.roomDesc) {
        this.setState({
          roomDescField: this.props.chat.roomDesc || "",
        });
      }
      // if (prevProps.chat.roomPersistent !== this.props.chat.roomPersistent) {
      //   this.setState({
      //     roomPersistent: this.props.chat.roomPersistent,
      //   });
      // }
    }

    if (
      this.props.chat.roomJID !== prevProps.chat.roomJID ||
      this.props.nick !== prevProps.nick ||
      this.props.connection !== prevProps.connection
    ) {
      this.leaveRoom(prevProps);
      this.joinRoom();
    } else if (this.props.presence !== prevProps.presence) {
      // we don't do this on the rejoining because it's automatically done
      // if rejoining
      this.sendRoomPrescense();
    }
  }
  onGroupChatMessage(stanza: Element) {
    const from = stanza.getAttribute("from");
    const fromNick = from.split("/")[1];
    const body = stanza.querySelector("body");
    if (body) {
      const content = body.textContent;
      let date: Date = null;

      const delay = stanza.querySelector("delay");
      let userId: string = null;
      if (delay) {
        date = new Date(delay.getAttribute("stamp"));
        userId = delay.getAttribute("from").split("@")[0];
      } else {
        date = new Date();
      }

      const id = stanza.querySelector("stanza-id").getAttribute("id");

      // message is already loaded, this can happen when the server
      // broadcasts messages twice, as when you change your presense
      if (this.state.messages.find((m) => m.id === id)) {
        return;
      }

      if (!userId) {
        // we might not find it, if occupants is not ready
        const groupChatOccupant = this.state.occupants.find((o) => o.occupant.nick === fromNick);
        // whenever occupants get added this should be fixed
        if (groupChatOccupant) {
          userId = groupChatOccupant.occupant.userId;
        }
      }

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
      }, this.scrollToBottom.bind(this, "smooth"));
    }

    return true;
  }
  onPresence(stanza: Element) {
    console.log(stanza);

    const from = stanza.getAttribute("from");
    const fromBare = from.split("/")[0];
    const fromNick = from.split("/")[1];

    const show = stanza.querySelector("show");
    const precense: any = show ? show.textContent : "chat";

    const item = stanza.querySelector("item");
    const jid = item.getAttribute("jid");
    const userJIDBare = jid.split("/")[0];
    const userId = userJIDBare.split("@")[0];
    const affilation: any = item.getAttribute("affiliation");
    const role: any = item.getAttribute("role");

    if (stanza.getAttribute("type") === "unavailable") {
      const newOccupants = this.state.occupants.filter((o) => {
        return (o.occupant.userId !== userId);
      });

      this.setState({
        occupants: newOccupants,
      });

      if (userId === this.props.connection.jid.split("@")[0]) {
        this.props.leaveChatRoom();
        return;
      }
    } else {
      const groupOccupant: IGroupChatOccupant = {
        occupant: {
          additional: null,
          nick: fromNick,
          isSelf: userId === this.props.connection.jid.split("@")[0],
          precense,
          userId,
          isStaff: userJIDBare.startsWith("muikku-staff"),
          jid: userJIDBare,
        },
        affilation,
        role,
      };
  
      if (groupOccupant.occupant.isSelf) {
        this.setState({
          isOwner: groupOccupant.affilation === "owner",
          isModerator: groupOccupant.role === "moderator" || groupOccupant.affilation === "owner",
        });
      }
  
      const newChatMessages = this.state.messages.map((m) => {
        if (m.nick === groupOccupant.occupant.nick && !m.userId) {
          return {
            ...m,
            userId: groupOccupant.occupant.userId,
            isSelf: groupOccupant.occupant.userId === this.props.connection.jid.split("@")[0],
          } as IBareMessageType;
        }
  
        return m;
      });
  
      let found = false;
      const newOccupants = this.state.occupants.map((o) => {
        if (o.occupant.userId === groupOccupant.occupant.userId) {
          groupOccupant.occupant.additional = o.occupant.additional;
          found = true;
          return groupOccupant;
        }
  
        return o;
      });
      if (!found) {
        newOccupants.push(groupOccupant);
      }
  
      this.setState({
        occupants: newOccupants,
        messages: newChatMessages,
      });
    }

    return true;
  }
  joinRoom(props: IGroupChatProps = this.props) {
    const roomJID = props.chat.roomJID;

    this.messagesListenerHandler = props.connection.addHandler(this.onGroupChatMessage, null, "message", "groupchat", null, roomJID, { matchBare: true });
    this.presenceListenerHandler = props.connection.addHandler(this.onPresence, null, "presence", null, null, roomJID, { matchBare: true });

    if (!props.nick) {
      console.warn("Cannot join room due to missing nick");
      return;
    }

    this.sendRoomPrescense(props);
  }
  sendRoomPrescense(props: IGroupChatProps = this.props) {
    const roomJID = props.chat.roomJID;

    // XEP-0045: 7.2 Entering a Room
    const presStanza = $pres({
      from: props.connection.jid,
      to: roomJID + "/" + props.nick,
    }).c("x", { 'xmlns': Strophe.NS.MUC }).up().c("show", {}, this.props.presence);

    props.connection.send(presStanza);
  }
  leaveRoom(props: IGroupChatProps = this.props) {
    props.connection.deleteHandler(this.messagesListenerHandler);
    props.connection.deleteHandler(this.presenceListenerHandler);

    const roomJID = props.chat.roomJID;

    // XEP-0045: 7.14 Exiting a Room
    const presStanza = $pres({
      from: props.connection.jid,
      to: roomJID,
      type: "unavailable"
    });

    this.setState({
      messages: [],
    });

    props.connection.send(presStanza);
  }
  componentDidMount() {
    this.joinRoom();
  }
  componentWillUnmount() {
    this.leaveRoom();
  }
  render() {
    let chatRoomTypeClassName = this.props.chat.roomJID.startsWith("workspace-") ? "workspace" : "other";

    const staffOccupants = this.state.occupants.filter((o) => o.occupant.isStaff);
    const studentOccupants = this.state.occupants.filter((o) => !o.occupant.isStaff);

    return (
      <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>

        {this.state.minimized === true ? (
          <div className={`chat__minimized chat__minimized--${chatRoomTypeClassName}`}>
            <div onClick={this.toggleMinimizeChats} className="chat__minimized-title">{this.props.chat.roomName}</div>
            <div onClick={this.props.leaveChatRoom} className="chat__button chat__button--close icon-cross"></div>
          </div>
        ) : (
            <div className={`chat__panel chat__panel--${chatRoomTypeClassName}`}>
              <div className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}>
                <div className="chat__panel-header-title">{this.props.chat.roomName}</div>
                <div onClick={this.toggleOccupantsList} className="chat__button chat__button--occupants icon-users"></div>
                <div onClick={this.toggleMinimizeChats} className="chat__button chat__button--minimize icon-minus"></div>
                {this.state.isOwner ? <div onClick={this.toggleChatRoomSettings} className="chat__button chat__button--room-settings icon-cogs"></div> : null}
                <div onClick={this.props.leaveChatRoom} className="chat__button chat__button--close icon-cross"></div>
              </div>

              {this.state.openChatSettings && <div className="chat__subpanel">
                <div className={`chat__subpanel-header chat__subpanel-header--room-settings-${chatRoomTypeClassName}`}>
                  <div className="chat__subpanel-title">Huoneen asetukset</div>
                  <div onClick={this.toggleChatRoomSettings} className="chat__button chat__button--close icon-cross"></div>
                </div>
                <div className="chat__subpanel-body">
                  <form onSubmit={this.setChatroomConfiguration}>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">{this.props.i18n.text.get("plugin.chat.room.name")}</label>
                      <input className="chat__textfield" name="newroomName" value={this.state.roomNameField} onChange={this.updateRoomNameField} type="text"></input>
                    </div>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">{this.props.i18n.text.get("plugin.chat.room.desc")}</label>
                      <textarea className="chat__memofield" name="newroomDescription" value={this.state.roomDescField} onChange={this.updateRoomDescField}></textarea>
                    </div>
                    {/* {(!this.state.isStudent) && <div className="chat__subpanel-row">
                      <label className="chat__label">Pysyvä huone: </label>
                      <input className="chat__checkbox" type="checkbox" name="persistent"></input>
                    </div>} */}
                    <input className={`chat__submit chat__submit--room-settings-${chatRoomTypeClassName}`} type="submit" value="Tallenna"></input>
                  </form>

                  <div>
                    {this.state.updateFailed ? "failed" : null}
                  </div>
                </div>
              </div>}

              <div className="chat__panel-body chat__panel-body--chatroom">
                <div className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}>
                  {this.state.messages.map((message) => <ChatMessage key={message.id} onMarkForDelete={null}
                    canToggleRealName={!this.state.isStudent}
                    messsage={message} canDelete={false && (this.state.isModerator || message.isSelf)} i18n={this.props.i18n} />)}
                  <div className="chat__messages-last-message" ref={this.messagesEnd}></div>
                </div>
                {this.state.showOccupantsList && <div className="chat__occupants-container">
                  <div className="chat__occupants-staff">
                    {staffOccupants.length > 0 ? "Henkilökunta" : ""}
                    {staffOccupants.map((staffOccupant) =>
                      <div className="chat__occupants-item" onClick={this.props.joinPrivateChat.bind(null, staffOccupant.occupant.jid, null)} key={staffOccupant.occupant.userId}>
                        <span className={"chat__online-indicator chat__occupant-" + staffOccupant.occupant.precense}></span>{staffOccupant.occupant.nick}</div>)}
                  </div>
                  <div className="chat__occupants-student">
                    {studentOccupants.length > 0 ? "Opiskelijat" : ""}
                    {studentOccupants.map((studentOccupant) =>
                      <div className="chat__occupants-item" onClick={this.props.joinPrivateChat.bind(this, studentOccupant.occupant.jid, null)} key={studentOccupant.occupant.userId}>
                        <span className={"chat__online-indicator chat__occupant-" + studentOccupant.occupant.precense}></span>{studentOccupant.occupant.nick}</div>)}
                  </div>
                </div>}
              </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={this.sendMessageToChatRoom}>
                <input name="chatRecipient" className="chat__muc-recipient" value={this.props.chat.roomJID} readOnly />
                <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder={this.props.i18n.text.get("plugin.chat.room.writemsg")} onChange={this.setCurrentMessageToBeSent} value={this.state.currentMessageToBeSent} />
                <button className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`} type="submit" value=""><span className="icon-arrow-right"></span></button>
              </form>
            </div>)
        }
      </div>
    );
  }
}
