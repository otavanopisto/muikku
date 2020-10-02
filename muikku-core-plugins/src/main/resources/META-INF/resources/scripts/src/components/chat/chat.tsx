import * as React from 'react'
import '~/sass/elements/chat.scss';
import mApi from '~/lib/mApi';
import { StateType } from '~/reducers';
import { connect } from 'react-redux';
import { Strophe } from "strophe.js";
import { Room } from './room';
import { Groupchat } from './groupchat';
import { UserChatSettingsType } from '~/reducers/main-function/user-index';
import promisify from "~/util/promisify";

export interface IChatRoomType {
  name: string;
  title: string;
  description: string;
}

/*
VARIABLES:

MuikkuUser
  Object that's contains basic info (firstName and lastName) of loggedin Muikku user.

MuikkuChatUser
  Object that's contains Muikku user's chat settings.

UserId
  The local part of BareJID/FullJID and equal as PyramusNickName, used only when querying private message senders MuikkuNickName.

BareJID
  The <user@host> by which a user is identified outside the context of any existing session or resource; contrast with FullJID and occupantBareJID.

FullJID
  The <user@host/resource> by which an online user is identified outside the context of a room; contrast with BareJID and occupantBareJID.

occupantBareJID
  The <room@service/nick> by which an occupant is identified within the context of a room; contrast with BareJID and FullJID.

RoomJID
  The <room@service> address of a room.

RoomID
  The localpart of a RoomJID, which might be opaque and thus lack meaning for human users (see under Business Rules for syntax); contrast with RoomName.

RoomName
  A user-friendly, natural-language name for a room, configured by the room owner and presented in Service Discovery queries; contrast with Room ID.

RoomPersistency
  Chat room persistency.

RoomDesc
  A user-friendly, natural-language description for a room, configured by the room owner pulled from Openfire and/or browserStorage.

RoomConfig
  This is used to gather necessary room configurations.

MuikkuNickName
  A user-friendly, natural-language nick name for the user, configured by the user itself via Muikku user profile view.

MuikkuFirstName
  Muikku user's first name

MuikkuLastName
  Muikku user's last name

MuikkuRealName
  Real nam eof Muikku user, consists of first name and last name.

PyramusUserID
  A pre-defined pyramus-student-# or pyramus-staff-# user ide. This is the local part (user) in bareJID and fullJID and resource part (nick) in occupantBareJID variables.
*/

export interface IChatMessageType {
  message: string;
  occupant: IChatOccupant;
}

export interface IPrebindResponseType {
  bound: boolean;
  bindEpochMilli: string;
  jid: string;
  sid: string;
  rid: number;
}

export interface IAvailableChatRoomType {
  roomName: string,
  roomJID: string,
  roomDesc: string,
  // roomPersistent: boolean,
}

export interface IChatOccupant {
  userId: string;
  nick: string;
  precense: "away" | "chat" | "dnd" | "xa";
  additional: {
    firstName?: string;
    lastName?: string;
  };
  isSelf: boolean;
  isStaff: boolean;
}

export interface IBareMessageType {
  message: string;
  nick: string;
  // because of the way this works the pyramus user id might not be ready yet
  // for a given message and might be null, until the occupants list is ready
  userId: string;
  timestamp: Date;
  id: string;
  isSelf: boolean;
}

interface IChatState {
  connection: Strophe.Connection;

  isInitialized: boolean,
  availableMucRooms: IAvailableChatRoomType[],
  showControlBox: boolean,
  showNewRoomForm: boolean,
  isStudent: boolean,
  openRoomNumber: number,
  openChatsJIDS: string[],
  selectedUserPresence: "away" | "chat" | "dnd" | "xa", // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2
  ready: boolean,

  roomNameField: string;
  roomDescField: string;
  // roomPersistent: boolean;
}

interface IChatProps {
  settings: UserChatSettingsType;
  currentLocale: string;
}

class Chat extends React.Component<IChatProps, IChatState> {
  constructor(props: IChatProps) {
    super(props);

    this.state = {
      connection: null,

      isInitialized: false,
      availableMucRooms: [],
      showControlBox: JSON.parse(window.sessionStorage.getItem("showControlBox")) || false,
      showNewRoomForm: false,
      isStudent: window.MUIKKU_IS_STUDENT,
      openRoomNumber: null,

      // we should have these open
      openChatsJIDS: JSON.parse(window.sessionStorage.getItem("openChats")) || [],
      selectedUserPresence: JSON.parse(window.sessionStorage.getItem("selectedUserPresence")) || "chat",
      ready: false,

      roomNameField: "",
      roomDescField: "",
      // roomPersistent: false,
    }

    this.toggleControlBox = this.toggleControlBox.bind(this);
    this.toggleCreateChatRoomForm = this.toggleCreateChatRoomForm.bind(this);
    this.toggleJoinLeaveChatRoom = this.toggleJoinLeaveChatRoom.bind(this);
    this.leaveChatRoom = this.leaveChatRoom.bind(this);
    this.joinChatRoom = this.joinChatRoom.bind(this);
    this.setUserAvailability = this.setUserAvailability.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this);
    // this.toggleRoomPersistent = this.toggleRoomPersistent.bind(this);
    this.createAndJoinChatRoom = this.createAndJoinChatRoom.bind(this);
    this.updateChatRoomConfig = this.updateChatRoomConfig.bind(this);
    this.initialize = this.initialize.bind(this);
    this.requestExtraInfoAboutRoom = this.requestExtraInfoAboutRoom.bind(this);
    this.onConnectionStatusChanged = this.onConnectionStatusChanged.bind(this);
  }

  public updateRoomNameField(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      roomNameField: e.target.value,
    });
  }

  public updateRoomDescField(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      roomDescField: e.target.value,
    });
  }

  // public toggleRoomPersistent() {
  //   this.setState({
  //     roomPersistent: !this.state.roomPersistent,
  //   });
  // }

  public updateChatRoomConfig(index: number, chat: IAvailableChatRoomType) {
    const newRooms = [...this.state.availableMucRooms];
    newRooms[index] = chat;
    this.setState({
      availableMucRooms: newRooms,
    });
  }

  async createAndJoinChatRoom(e: React.FormEvent) {
    e.preventDefault();

    // We need to trim and replace white spaces so new room will be created succefully
    const roomName = this.state.roomNameField;
    const roomDesc = this.state.roomDescField;

    if (!this.props.settings.nick) {
      console.warn("Can't create a chat room without a nickname specified");
      return;
    }

    try {
      const chatRoom: IChatRoomType = await (promisify(mApi().chat.publicRoom.create({
        title: roomName,
        description: roomDesc,
      }), 'callback')()) as IChatRoomType;
      const roomJID = chatRoom.name + '@conference.' + location.hostname;
      this.setState({
        availableMucRooms: this.state.availableMucRooms.concat([
          {
            roomDesc: chatRoom.description,
            roomName: chatRoom.title,
            roomJID,
          },
        ]),
      }, this.joinChatRoom.bind(this, roomJID));
    } catch (err) {
      // TODO do something about error
    }
  }

  // Toggle states for Control Box window opening/closing
  toggleControlBox() {
    if (this.state.showControlBox) {
      this.setState({
        showControlBox: false,
      });
      window.sessionStorage.setItem("showControlBox", "false");
    } else {
      this.setState({
        showControlBox: true,
      });
      window.sessionStorage.setItem("showControlBox", "true");
    }
  }
  // Toggle states for Chat Room Create Form window opening/closing
  toggleCreateChatRoomForm() {
    if (!this.state.showNewRoomForm) {
      this.setState({
        showNewRoomForm: true
      });

    } else {
      this.setState({
        showNewRoomForm: false
      });
    }
  }

  public joinChatRoom(roomJID: string) {
    // already joined
    if (this.state.openChatsJIDS.includes(roomJID)) {
      return;
    }
    // Lets push RoomJid to openChatList and set it to this.state.openChats
    const newJIDS = !this.state.openChatsJIDS.includes(roomJID) ?
      [...this.state.openChatsJIDS, roomJID] : this.state.openChatsJIDS;

    window.sessionStorage.setItem("openChats", JSON.stringify(newJIDS));

    this.setState({
      openChatsJIDS: newJIDS,
    });
  }

  public leaveChatRoom(roomJID: string) {
    const filteredJIDS = this.state.openChatsJIDS.filter(item => item !== roomJID);

    // Set the filtered openChatList to sessionStorage
    window.sessionStorage.setItem("openChats", JSON.stringify(filteredJIDS));

    // Set filtered and current openChatList to this.state.openChats
    this.setState({
      openChatsJIDS: filteredJIDS,
    });
  }

  // Toggles between joining and leaving the chat room
  public toggleJoinLeaveChatRoom(roomJID: string) {
    // Check whether current roomJID is allready part of openChatList
    if (this.state.openChatsJIDS.includes(roomJID)) {
      this.leaveChatRoom(roomJID);
    } else {
      this.joinChatRoom(roomJID);
    }
  }
  getWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room) => room.roomJID.startsWith("workspace-"));
  }
  getNotWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room) => !room.roomJID.startsWith("workspace-"));
  }
  setUserAvailability(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    this.state.connection.send($pres().c("show", {}, newStatus));
    this.setState({
      selectedUserPresence: newStatus as any,
    });
    window.sessionStorage.setItem("selectedUserPresence", JSON.stringify(newStatus));
  }
  componentDidMount() {
    if (this.props.settings && this.props.settings.visibility === "VISIBLE_TO_ALL") {
      this.initialize();
    }
  }
  componentDidUpdate(prevProps: IChatProps) {
    if (
      (prevProps.settings && prevProps.settings.visibility === "VISIBLE_TO_ALL") &&
      (!this.props.settings || this.props.settings.visibility === "DISABLED") &&
      this.state.isInitialized
    ) {
      this.stopChat();
    } else if (
      (!prevProps.settings || prevProps.settings.visibility === "DISABLED") &&
      (this.props.settings && this.props.settings.visibility === "VISIBLE_TO_ALL") &&
      !this.state.isInitialized
    ) {
      this.initialize();
    }
  }
  onConnectionStatusChanged(status: Strophe.Status, condition: string) {
    if (status === Strophe.Status.ATTACHED) {
      // We are atached. Send presence to server so it knows we're online
      this.state.connection.send($pres().c("show", {}, this.state.selectedUserPresence));
    }
    // I believe strophe retries automatically so disconnected does not need to be tried
    return true;
  }
  listExistantChatRooms() {
    const stanza = $iq({
      'from': this.state.connection.jid,
      'to': 'conference.' + location.hostname,
      'type': 'get'
    }).c("query", { xmlns: Strophe.NS.DISCO_ITEMS });
    this.state.connection.sendIQ(stanza, (answerStanza: Element) => {
      const rooms = answerStanza.querySelectorAll('query item');
      const currentRooms = [...this.state.availableMucRooms];
      rooms.forEach((n) => {
        const roomJID = n.getAttribute("jid");
        const roomName = n.getAttribute("name");
        const existsAlreadyIndex = currentRooms.findIndex((r) => r.roomJID === roomJID);
        if (existsAlreadyIndex >= 0) {
          const newReplacement: IAvailableChatRoomType = {
            roomJID,
            roomName,
            roomDesc: currentRooms[existsAlreadyIndex].roomDesc,
            // roomPersistent: currentRooms[existsAlreadyIndex].roomPersistent,
          };
          currentRooms[existsAlreadyIndex] = newReplacement;
        } else {
          currentRooms.push({
            roomJID,
            roomName,
            roomDesc: null,
            // roomPersistent: null,
          });
        }
      });

      this.setState({
        availableMucRooms: currentRooms.sort((a, b) => a.roomName.toLowerCase().localeCompare(b.roomName.toLowerCase())),
      });
    });
  }
  requestExtraInfoAboutRoom(room: IAvailableChatRoomType, refresh?: boolean) {
    if (room.roomDesc !== null && !refresh) {
      return;
    }

    const stanza = $iq({
      'from': this.state.connection.jid,
      'to': room.roomJID,
      'type': 'get'
    }).c("query", { xmlns: Strophe.NS.DISCO_INFO });

    this.state.connection.sendIQ(stanza, (answerStanza: Element) => {
      const fields = answerStanza.querySelectorAll('query field');
      const newRoom = {
        ...room,
      };
      fields.forEach((field) => {
        // muc#roominfo_description
        // muc#roominfo_subject
        // muc#roominfo_occupants
        // x-muc#roominfo_creationdate
        if (field.getAttribute("var") === "muc#roominfo_description") {
          newRoom.roomDesc = field.querySelector("value").textContent;
        }
      });

      const newAvailableMucRooms = [...this.state.availableMucRooms];
      const indexOfIt = newAvailableMucRooms.findIndex((r) => r.roomJID === room.roomJID);
      if (indexOfIt === -1) {
        return;
      }
      newAvailableMucRooms[indexOfIt] = newRoom;
      this.setState({
        availableMucRooms: newAvailableMucRooms,
      });
    });
  }
  public stopChat() {
    this.setState({
      isInitialized: false,
    });

    this.state.connection && this.state.connection.disconnect("Chat is disabled");
  }
  async initialize() {
    this.setState({
      isInitialized: true,
    });

    let session = window.sessionStorage.getItem("strophe-bosh-session");

    let prebind: IPrebindResponseType;
    const isRestore = !!session;
    if (session) {
      prebind = JSON.parse(session);
    } else {
      const prebindRequest = await fetch("/rest/chat/prebind");
      prebind = await prebindRequest.json();
    }

    const connection = new Strophe.Connection("/http-bind/", { 'keepalive': true });

    this.setState({
      connection,
    }, () => {
      connection.rawInput = function (data) { console.log('RECV: ' + data); };
      connection.rawOutput = function (data) { console.log('SENT: ' + data); };

      // Connect
      if (isRestore) {
        connection.restore(prebind.jid, this.onConnectionStatusChanged);
      } else {
        connection.attach(prebind.jid, prebind.sid, prebind.rid.toString(), this.onConnectionStatusChanged);
      }

      this.listExistantChatRooms();
    });
  }
  render() {
    if (!this.state.isInitialized || !this.state.connection) {
      return null;
    }

    const userStatusClassName =
      this.state.selectedUserPresence === "chat" ? "online" : this.state.selectedUserPresence === "away" ? "away" : "offline";

    return (
      <div className="chat">
        {/* Chat bubble */}
        {this.state.showControlBox ? null : <div onClick={this.toggleControlBox} className="chat__bubble">
          <span className="icon-chat"></span>
        </div>}

        {/* Chat controlbox */}
        {this.state.showControlBox && <div className="chat__panel chat__panel--controlbox">
          <div className="chat__panel-header chat__panel-header--controlbox">
            <span onClick={this.toggleCreateChatRoomForm} className="chat__button chat__button--new-room icon-plus"></span>
            <span onClick={this.toggleControlBox} className="chat__button chat__button--close icon-cross"></span>
          </div>

          <div className="chat__panel-body chat__panel-body--controlbox">
            <select value={this.state.selectedUserPresence} onChange={this.setUserAvailability} className={`chat__controlbox-user-status chat__controlbox-user-status--${userStatusClassName}`}>
              <option value="chat">Paikalla</option>
              <option value="away">Palaan pian</option>
              <option value="dnd">Do not Disturb</option>
              <option value="xa">Offline</option>
            </select>

            <div className="chat__controlbox-rooms-heading">Kurssikohtaiset huoneet: </div>
            <div className="chat__controlbox-rooms-listing chat__controlbox-rooms-listing--workspace">
              {this.getWorkspaceMucRooms().length > 0 ?
                this.getWorkspaceMucRooms().map((chat, i) => <Room requestExtraInfoAboutRoom={this.requestExtraInfoAboutRoom.bind(this, chat)} modifier="workspace" toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom.bind(this, chat.roomJID)} key={i} chat={chat} />)
                : <div className="chat__controlbox-room  chat__controlbox-room--empty">Ei huoneita</div>}
            </div>

            <div className="chat__controlbox-rooms-heading">Muut huoneet:</div>
            <div className="chat__controlbox-rooms-listing">
              {this.getNotWorkspaceMucRooms().length > 0 ?
                this.getNotWorkspaceMucRooms().map((chat, i) => <Room requestExtraInfoAboutRoom={this.requestExtraInfoAboutRoom.bind(this, chat)} toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom.bind(this, chat.roomJID)} key={i} chat={chat} />)
                : <div className="chat__controlbox-room chat__controlbox-room--empty">Ei huoneita</div>}
            </div>

            {this.state.showNewRoomForm && <div className="chat__subpanel">
              <div className="chat__subpanel-header chat__subpanel-header--new-room">
                <div className="chat__subpanel-title">Luo uusi huone</div>
                <div onClick={this.toggleCreateChatRoomForm} className="chat__button chat__button--close icon-cross"></div>
              </div>
              <div className="chat__subpanel-body">
                <form onSubmit={this.createAndJoinChatRoom}>
                  <div className="chat__subpanel-row">
                    <label className="chat__label">Huoneen nimi:</label>
                    <input
                      className="chat__textfield"
                      name="roomName"
                      type="text"
                      value={this.state.roomNameField}
                      onChange={this.updateRoomNameField}
                    />
                  </div>
                  <div className="chat__subpanel-row">
                    <label className="chat__label">Huoneen kuvaus:</label>
                    <textarea
                      className="chat__memofield"
                      name="roomDesc"
                      value={this.state.roomDescField}
                      onChange={this.updateRoomDescField}
                    />
                  </div>
                  {/* {(!this.state.isStudent) && <div className="chat__subpanel-row">
                    <label className="chat__label">Pysyvä huone:</label>
                    <input
                      className="chat__checkbox"
                      type="checkbox"
                      name="persistent"
                      checked={this.state.roomPersistent}
                      onChange={this.toggleRoomPersistent}
                    />
                  </div>} */}
                  <input className="chat__submit chat__submit--new-room" type="submit" value="Lisää huone" />
                </form>
              </div>
            </div>}
          </div>
        </div>}

        {/* Chatrooms */}
        <div className="chat__chatrooms-container">
          {this.state.availableMucRooms.map((chat, i) => this.state.openChatsJIDS.includes(chat.roomJID) ?
            <Groupchat
              presence={this.state.selectedUserPresence}
              connection={this.state.connection}
              nick={this.props.settings.nick}
              key={chat.roomJID}
              joinPrivateChat={() => null}
              leaveChatRoom={this.leaveChatRoom.bind(this, chat.roomJID)}
              chat={chat}
              onUpdateChatRoomConfig={this.updateChatRoomConfig.bind(this, i)}
            />
            : null)}

          {/* {this.state.privateChatData.map((privateChatData, i) => this.state.openChatsJIDS.includes(privateChatData.occupantBareJID) ?
            <PrivateMessages key={i} toggleJoinLeavePrivateChat={this.toggleJoinLeavePrivateChat} privateChatData={privateChatData} converse={this.converse} />
            : null)} */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    currentLocale: state.locales.current,
    settings: state.profile.chatSettings,
  }
};

function mapDispatchToProps() {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);
