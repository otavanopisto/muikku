import * as React from 'react'
import '~/sass/elements/chat.scss';
import mApi from '~/lib/mApi';
import { StateType } from '~/reducers';
import { connect } from 'react-redux';
import { Strophe } from "strophe.js";
import { Room } from './room';
import { Groupchat } from './groupchat';
import { UserChatSettingsType } from '~/reducers/main-function/user-index';

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
  roomPersistent: boolean,
}

export interface IChatOccupant {
  userId: string;
  nick: string;
  precense: "away" | "chat" | "dnd" | "xa";
  firstName?: string;
  lastName?: string;
  isStudent: boolean;
  isStaff: boolean;
}

interface IChatState {
  connection: Strophe.Connection;

  isInitialized: boolean,
  availableMucRooms: IAvailableChatRoomType[],
  showControlBox: boolean,
  showNewRoomForm: boolean,
  isStudent: boolean,
  pyramusUserId: string,
  openRoomNumber: number,
  openChatsJIDS: string[],
  selectedUserPresence: "away" | "chat" | "dnd" | "xa", // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2
  ready: boolean,

  roomNameField: string;
  roomDescField: string;
  roomPersistent: boolean;
}

interface IChatProps {
  settings: UserChatSettingsType;
  currentLocale: string;
}

class Chat extends React.Component<IChatProps, IChatState> {
  private awaitingConfigurationForChatRoom: string = null;
  private awaitingChatRoomStanza: Strophe.Builder = null;
  private awaitingNewRoom: IAvailableChatRoomType = null;

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
      pyramusUserId: window.MUIKKU_LOGGED_USER,

      // we should have these open
      openChatsJIDS: JSON.parse(window.sessionStorage.getItem("openChats")) || [],
      selectedUserPresence: JSON.parse(window.sessionStorage.getItem("selectedUserPresence")) || "chat",
      ready: false,

      roomNameField: "",
      roomDescField: "",
      roomPersistent: false,
    }

    this.toggleControlBox = this.toggleControlBox.bind(this);
    this.toggleCreateChatRoomForm = this.toggleCreateChatRoomForm.bind(this);
    this.toggleJoinLeaveChatRoom = this.toggleJoinLeaveChatRoom.bind(this);
    this.leaveChatRoom = this.leaveChatRoom.bind(this);
    this.joinChatRoom = this.joinChatRoom.bind(this);
    this.setUserAvailability = this.setUserAvailability.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this);
    this.toggleRoomPersistent = this.toggleRoomPersistent.bind(this);
    this.createAndJoinChatRoom = this.createAndJoinChatRoom.bind(this);
    this.updateChatRoomConfig = this.updateChatRoomConfig.bind(this);
    this.initialize = this.initialize.bind(this);
    this.onPresenceMessage = this.onPresenceMessage.bind(this);
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

  public toggleRoomPersistent() {
    this.setState({
      roomPersistent: !this.state.roomPersistent,
    });
  }

  public updateChatRoomConfig(index: number, chat: IAvailableChatRoomType) {
    const newRooms = [...this.state.availableMucRooms];
    newRooms[index] = chat;
    this.setState({
      availableMucRooms: newRooms,
    });
  }

  // Notification handler for Received Private Messages.
  // Sets privateChatData and openChats states based on received notification.
  // Private chat window opens when openChats state has correct BareJID stored in it.
  // PrivateChatData state requires necessary occupant data for the private chat.
  // async onConverseMessage(data: any) {
  //   const converseUtils = this.evtConverse.env.utils;
  //   let type = data.stanza.getAttribute('type');

  //   const { Strophe } = this.evtConverse.env;
  //   let from = data.stanza.getAttribute('from');
  //   let bareJIDOfSender = Strophe.getBareJidFromJid(from);
  //   const isSameUserAsLoggedInUser = bareJIDOfSender === this.converse.bare_jid;

  //   if (
  //     type !== null &&
  //     type !== 'groupchat' &&
  //     from !== null &&
  //     !converseUtils.isOnlyChatStateNotification(data.stanza) &&
  //     !converseUtils.isOnlyMessageDeliveryReceipt(data.stanza) &&
  //     !isSameUserAsLoggedInUser
  //   ) {
  //     const newPrivateChatData = [...this.state.privateChatData];
  //     const newOpenChatsJIDS = [...this.state.openChatsJIDS];

  //     if (!newOpenChatsJIDS.includes(bareJIDOfSender)) {
  //       const userId: string = data.stanza.getAttribute('from').split('@')[0];

  //       // Fetch message sender's chatSettings
  //       let chatSettings: any = (await promisify(mApi().chat.settings.read(userId), 'callback')());

  //       // Setup sender's MuikkuNickName
  //       let muikkuNickName: string = chatSettings.nick;

  //       // Fetch senders user details in case user has not set MuikkuNickName yet
  //       let muikkuUser: any = (await promisify(mApi().user.users.basicinfo.read(chatSettings.userIdentifier, {}), 'callback')());

  //       // Check whether message sender has setup a nick name, if not we use hes/her real name
  //       if (!muikkuNickName) {
  //         muikkuNickName = muikkuUser.firstName + " " + muikkuUser.lastName;
  //       }

  //       // Gather chatData so it can be used in onOpenPrivateChat method
  //       let occupant: IChatOccupant = {
  //         userId,
  //         muikkuNickName,
  //         status: '',
  //         firstName: muikkuUser.firstName,
  //         lastName: muikkuUser.lastName,
  //         receivedMessageNotification: true,
  //       };

  //       // Pushing BareJID to openChatsList and gathered chatData to newprivateChatData
  //       // Setting states of openChats and privateChatData from previously set values
  //       newPrivateChatData.push({ occupantBareJID: bareJIDOfSender, occupant });
  //       newOpenChatsJIDS.push(bareJIDOfSender);
  //       this.setState({
  //         privateChatData: newPrivateChatData,
  //         openChatsJIDS: newOpenChatsJIDS
  //       });
  //     }
  //   }
  // }

  // Toggle Private Message Window
  // async toggleJoinLeavePrivateChat(occupant: IChatOccupant) {
  //   let openChatsList = [...this.state.openChatsJIDS];
  //   let newPrivateChatData = [...this.state.privateChatData];

  //   // Checking if message receiver is the same user as logged in user
  //   // and if true we stop right here as you should not be able to send
  //   // private messages to yourself.
  //   if (occupant.userId === window.MUIKKU_LOGGED_USER) {
  //     return;
  //   } else if (occupant.userId.startsWith("PYRAMUS-STAFF-") || window.MUIKKU_IS_STUDENT === false) {
  //     let bareoccupantBareJID = occupant.userId.toLowerCase() + "@dev.muikkuverkko.fi";

  //     // Lets check whether private chat window's BareJID exists in openChatsList
  //     // or not so we know do we close or open the chat window
  //     if (openChatsList.includes(bareoccupantBareJID)) {
  //       // Remove the BareJID of the chat window we are closing from openChatsList
  //       const filteredChats = openChatsList.filter(item => item !== bareoccupantBareJID);
  //       const filteredChatData = newPrivateChatData.filter((item) => item.occupantBareJID !== bareoccupantBareJID);

  //       // Set filtered openChatsList as filteredChats to this.state.openChats
  //       this.setState({
  //         openChatsJIDS: filteredChats,
  //         privateChatData: filteredChatData,
  //       })

  //       // Set current openChatList to sessionStorage
  //       window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));

  //     } else {
  //       // Lets push object to openChatList and set it to openChats state
  //       openChatsList.push(bareoccupantBareJID);
  //       newPrivateChatData.push({ occupantBareJID: bareoccupantBareJID, occupant });

  //       this.setState({
  //         openChatsJIDS: openChatsList,
  //         privateChatData: newPrivateChatData
  //       });
  //     }
  //   }
  // }

  // Nickname, persistency, room name and room description for new chat room
  // parseRoomDataFromEvent(form: HTMLFormElement) {
  //   let data = new FormData(form);
  //   let RoomJID = data.get('roomName').toString();
  //   let RoomPersistency = data.get('persistent');
  //   let RoomDesc = data.get('roomDesc');
  //   let RoomName = data.get('roomName');

  //   return {
  //     'RoomJID': RoomJID,
  //     'RoomPersistency': RoomPersistency,
  //     'RoomDesc': RoomDesc,
  //     'RoomName': RoomName
  //   }
  // }

  // // Creating new chat room
  // // TODO: Need to check if RoomName is mempty and show error notification
  async createAndJoinChatRoom(e: React.FormEvent) {
    e.preventDefault();

    // We need to trim and replace white spaces so new room will be created succefully
    const roomJID = this.state.roomNameField.trim().replace(/\s+/g, '-') + '@conference.' + location.hostname;
    const roomName = this.state.roomNameField;
    const roomPersistent = this.state.roomPersistent;
    const roomDesc = this.state.roomDescField;

    if (roomJID.startsWith("workspace-")) {
      console.warn("Creation of workspace- prefixed chat room is forbidden");
      return;
    }

    if (!this.props.settings.nick) {
      console.warn("Can't create a chat room without a nickname specified");
      return;
    }

    // const { Strophe, $pres, _ } = this.evtConverse.env;

    const occupantBareJID = roomJID + "/" + this.props.settings.nick;

    const presStanza = $pres({
      from: this.state.connection.jid,
      to: occupantBareJID,
    }).c("x", { 'xmlns': Strophe.NS.MUC });

    this.awaitingConfigurationForChatRoom = occupantBareJID;
    this.awaitingChatRoomStanza = $iq({
      from: this.state.connection.jid,
      to: roomJID,
      type: "set",
    })
      .c("query", { xmlns: "http://jabber.org/protocol/muc#owner" })
      .c("x", {
        xmlns: "jabber:x:data",
        type: "submit"
      }).c("field", {
        var: "FORM_TYPE"
      }).c("value", {}, "http://jabber.org/protocol/muc#roomconfig")
      .up().c("field", {
        var: "muc#roomconfig_roomname"
      }).c("value", {}, roomName)
      .up().c("field", {
        var: "muc#roomconfig_roomdesc"
      }).c("value", {}, roomDesc)
      .up().c("field", {
        var: "muc#roomconfig_persistentroom"
      }).c("value", {}, (roomPersistent ? 1 : 0).toString());
    this.awaitingNewRoom = {
      roomJID,
      roomName,
      roomDesc,
      roomPersistent,
    };

    this.state.connection.send(presStanza);

    // const stanza = $pres({
    //   'from': this.converse.connection.jid,
    //   'to': occupantBareJID
    // }).c("x", { 'xmlns': Strophe.NS.MUC })
    //   .c("history", { 'maxstanzas': this.converse.muc_history_max_stanzas }).up();

    // this.converse.api.send(stanza);

    // this.converse.api.user.status.set('online');

    // const chat = await this.converse.api.rooms.open(roomJID, _.extend({
    //   'nick': this.state.pyramusUserId,
    //   'maximize': true,
    //   'auto_configure': true,
    //   'publicroom': true,
    //   'roomconfig': {
    //     'persistentroom': roomPersistent,
    //     'roomname': roomName,
    //     'roomdesc': roomDesc
    //   }
    // }), true);
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
  onPresenceMessage(stanza: Element) {
    console.log(stanza);

    // we are being informed of our own user precense in the chatroom when
    // we have created a chatroom, we are looking for code 201 in that case
    // which means it was just created
    if (
      this.awaitingConfigurationForChatRoom &&
      stanza.getAttribute("from") === this.awaitingConfigurationForChatRoom
    ) {
      this.state.connection.sendIQ(this.awaitingChatRoomStanza, (answerStanza: Element) => {
        if (answerStanza.querySelector("error")) {
          // TODO do something about error https://xmpp.org/extensions/xep-0045.html#createroom-reserved
        } else {
          const newAvailableMucRooms = [...this.state.availableMucRooms, this.awaitingNewRoom];

          // we have already made a call to connect because of the pre stanza
          const newOpenChatsJIDS = [...this.state.openChatsJIDS, this.awaitingNewRoom.roomJID];

          this.setState({
            availableMucRooms: newAvailableMucRooms.sort((a, b) => a.roomName.toLowerCase().localeCompare(b.roomName.toLowerCase())),
            showNewRoomForm: false,
            roomPersistent: false,
            roomDescField: "",
            roomNameField: "",
            openChatsJIDS: newOpenChatsJIDS,
          });

          this.awaitingNewRoom = null;
        }
      });
      this.awaitingConfigurationForChatRoom = null;
      this.awaitingChatRoomStanza = null;
    }

    return true;
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
            roomPersistent: currentRooms[existsAlreadyIndex].roomPersistent,
          };
          currentRooms[existsAlreadyIndex] = newReplacement;
        } else {
          currentRooms.push({
            roomJID,
            roomName,
            roomDesc: null,
            roomPersistent: null,
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
      connection.addHandler(this.onPresenceMessage, null, 'presence', null, null, null);

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
        <div onClick={this.toggleControlBox} className="chat__bubble">
          <span className="icon-chat"></span>
        </div>

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
                  {(!this.state.isStudent) && <div className="chat__subpanel-row">
                    <label className="chat__label">Pysyvä huone:</label>
                    <input
                      className="chat__checkbox"
                      type="checkbox"
                      name="persistent"
                      checked={this.state.roomPersistent}
                      onChange={this.toggleRoomPersistent}
                    />
                  </div>}
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
              connection={this.state.connection}
              nick={this.props.settings.nick}
              key={i}
              joinPrivateChat={null}
              leaveChatRoom={this.leaveChatRoom.bind(this, chat.roomJID)}
              pyramusUserID={this.state.pyramusUserId}
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
