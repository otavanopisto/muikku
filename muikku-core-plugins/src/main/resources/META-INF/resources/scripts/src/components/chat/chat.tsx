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
  userId: string,
  muikkuNickName: string,
  status: string,
  firstName: string,
  lastName: string,
  receivedMessageNotification: boolean,
}

interface IPrivateChatData {
  occupantBareJID: string;
  occupant: IChatOccupant;
}

interface IChatState {
  isInitialized: boolean,
  messages: Object[],
  availableMucRooms: IAvailableChatRoomType[],
  showControlBox: boolean,
  showNewRoomForm: boolean,
  isStudent: boolean,
  pyramusUserId: string,
  openRoomNumber: number,
  // chats that are supposed to be open
  openChatsJIDS: string[],
  // chats that are open by having a XMPP connection open
  openedChatsJIDS: string[],
  selectedUserPresence: "away" | "chat" | "dnd" | "xa", // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2
  privateChatData: IPrivateChatData[],
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
  private connection: Strophe.Connection;

  private awaitingConfigurationForChatRoom: string = null;
  private awaitingChatRoomStanza: Strophe.Builder = null;

  constructor(props: IChatProps) {
    super(props);

    this.state = {
      isInitialized: false,
      messages: [],
      availableMucRooms: [],
      showControlBox: JSON.parse(window.sessionStorage.getItem("showControlBox")) || false,
      showNewRoomForm: false,
      isStudent: window.MUIKKU_IS_STUDENT,
      openRoomNumber: null,
      pyramusUserId: window.MUIKKU_LOGGED_USER,
      
      // we should have these open
      openChatsJIDS: JSON.parse(window.sessionStorage.getItem("openChats")) || [],
      // but these are the ones actually open
      openedChatsJIDS: [],

      selectedUserPresence: JSON.parse(window.sessionStorage.getItem("selectedUserPresence")) || "chat",
      privateChatData: [],
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
    // this.toggleJoinLeavePrivateChat = this.toggleJoinLeavePrivateChat.bind(this);
    this.getUserAvailability = this.getUserAvailability.bind(this);
    this.setUserAvailability = this.setUserAvailability.bind(this);
    // this.onConverseMessage = this.onConverseMessage.bind(this);
    this.onConverseInitialized = this.onConverseInitialized.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this);
    this.toggleRoomPersistent = this.toggleRoomPersistent.bind(this);
    this.createAndJoinChatRoom = this.createAndJoinChatRoom.bind(this);
    this.updateChatRoomConfig = this.updateChatRoomConfig.bind(this);
    this.initialize = this.initialize.bind(this);
    this.onGroupChatMessage = this.onGroupChatMessage.bind(this);
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
      alert("Creation of workspace- prefixed chat room is forbidden");
      return;
    }

    // const { Strophe, $pres, _ } = this.evtConverse.env;

    const occupantBareJID = roomJID + "/" + this.state.pyramusUserId;

    const presStanza = $pres({
      from: this.connection.jid,
      to: occupantBareJID,
    }).c("x", { 'xmlns': Strophe.NS.MUC });

    this.awaitingConfigurationForChatRoom = occupantBareJID;
    this.awaitingChatRoomStanza = $iq({
      from: this.connection.jid,
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
    this.connection.send(presStanza);

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

    const newAvailableMucRoom: IAvailableChatRoomType = {
      roomJID,
      roomName,
      roomDesc,
      roomPersistent,
    };

    const newAvailableMucRooms = [...this.state.availableMucRooms, newAvailableMucRoom];

    // we have already made a call to connect because of the pre stanza
    const newOpenChatsJIDS = [...this.state.openChatsJIDS, roomJID];
    const newOpenedChatsJIDS = [...this.state.openedChatsJIDS, roomJID];

    this.setState({
      availableMucRooms: newAvailableMucRooms.sort((a, b) => a.roomName.toLowerCase().localeCompare(b.roomName.toLowerCase())),
      showNewRoomForm: false,
      roomPersistent: false,
      roomDescField: "",
      roomNameField: "",
      openChatsJIDS: newOpenChatsJIDS,
      openedChatsJIDS: newOpenedChatsJIDS,
    });
  }

  // Getting available chat rooms to be listed in the control box
  async getAvailableChatRooms(iq: XMLDocument) {
    // Handle the IQ stanza returned from the server, containing all its public groupchats.
    let availableChatRooms = iq.querySelectorAll('query item');

    if (availableChatRooms.length) {
      // const nodesArray = [].slice.call(availableChatRooms);
      // const availableMucRoomsList = [...this.state.availableMucRooms];

      // await Promise.all(nodesArray.map(async (node: any) => {
      //   const roomName = node.attributes.name.nodeValue;
      //   const roomJID = node.attributes.jid.value;

      //   // const chat = await this.converse.api.rooms.get(roomJID);
      //   const roomDesc = chat.attributes.roomconfig.roomdesc;
      //   const roomPersistent = chat.attributes.roomconfig.persistentroom;

      //   const newRoomToAdd = {
      //     roomName,
      //     roomJID,
      //     roomDesc,
      //     roomPersistent,
      //     chatObject: chat,
      //   }

      //   availableMucRoomsList.push(newRoomToAdd);
      // }));
      // this.setState({
      //   availableMucRooms: availableMucRoomsList,
      // });
    } else {

    }

    return true;
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
    if (this.state.openedChatsJIDS.includes(roomJID)) {
      return;
    }
    // Lets push RoomJid to openChatList and set it to this.state.openChats
    const newJIDS = !this.state.openChatsJIDS.includes(roomJID) ?
      [...this.state.openChatsJIDS, roomJID] : this.state.openChatsJIDS;
    const newOpenedChatsJIDS = [...this.state.openedChatsJIDS, roomJID];

    window.sessionStorage.setItem("openChats", JSON.stringify(newJIDS));

    this.setState({
      openChatsJIDS: newJIDS,
      openedChatsJIDS: newOpenedChatsJIDS,
    });

    // XEP-0045: 7.2 Entering a Room
    const presStanza = $pres({
      from: this.connection.jid,
      to: roomJID + "/" + this.props.settings.nick,
    }).c("x", { 'xmlns': Strophe.NS.MUC });
    //.up().c("show", {}, this.state.selectedUserPresence);

    this.connection.send(presStanza);
  }

  public leaveChatRoom(roomJID: string) {
    const filteredJIDS = this.state.openChatsJIDS.filter(item => item !== roomJID);
    const filteredOpenedJIDS = this.state.openedChatsJIDS.filter(item => item !== roomJID);

    // Set the filtered openChatList to sessionStorage
    window.sessionStorage.setItem("openChats", JSON.stringify(filteredJIDS));

    // Set filtered and current openChatList to this.state.openChats
    this.setState({
      openChatsJIDS: filteredJIDS,
      openedChatsJIDS: filteredOpenedJIDS,
    });

    // XEP-0045: 7.14 Exiting a Room
    const presStanza = $pres({
      from: this.connection.jid,
      to: roomJID,
      type: "unavailable"
    });

    this.connection.send(presStanza);
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
    // let newStatus = e.target.value;
    // this.converse.api.user.status.set(newStatus);
    // this.getUserAvailability();
  }
  getUserAvailability() {
    // let userPresence = this.converse.api.user.status.get();
    // this.setState({
    //   selectedUserPresence: userPresence
    // });
  }
  componentDidMount() {
    if (this.props.settings && this.props.settings.visibility === "VISIBLE_TO_ALL") {
      this.initialize();
    }
  }
  componentDidUpdate(prevProps: IChatProps, prevState: IChatState) {
    if (this.state.isInitialized) {
      const addedGroupChatsInfo = this.state.availableMucRooms.filter((c) => !prevState.availableMucRooms.find((ic) => ic.roomJID !== c.roomJID));
      addedGroupChatsInfo.forEach((c) => {
        if (this.state.openChatsJIDS.includes(c.roomJID)) {
          this.joinChatRoom(c.roomJID);
        }
      });
    }

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
  onGroupChatMessage(stanza: Element) {
    console.log(stanza);
    return true;
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
      this.connection.sendIQ(this.awaitingChatRoomStanza, (answerStanza: Element) => {
        if (answerStanza.querySelector("error")) {
          // TODO do something about error https://xmpp.org/extensions/xep-0045.html#createroom-reserved
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
      this.connection.send($pres().c("show", {}, this.state.selectedUserPresence));
    }
    // I believe strophe retries automatically so disconnected does not need to be tried
    return true;
  }
  listExistantChatRooms() {
    const stanza = $iq({
      'from': this.connection.jid,
      'to': 'conference.' + location.hostname,
      'type': 'get'
    }).c("query", { xmlns: Strophe.NS.DISCO_ITEMS });
    this.connection.sendIQ(stanza, (answerStanza: Element) => {
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
      'from': this.connection.jid,
      'to': room.roomJID,
      'type': 'get'
    }).c("query", { xmlns: Strophe.NS.DISCO_INFO });

    this.connection.sendIQ(stanza, (answerStanza: Element) => {
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

    this.connection && this.connection.disconnect("Chat is disabled");
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

    this.connection = new Strophe.Connection("/http-bind/", { 'keepalive': true });
    this.connection.addHandler(this.onGroupChatMessage, null, 'message', 'groupchat', null, null);
    this.connection.addHandler(this.onPresenceMessage, null, 'presence', null, null, null);

    this.connection.rawInput = function (data) { console.log('RECV: ' + data); };
    this.connection.rawOutput = function (data) { console.log('SENT: ' + data); };

    // Connect
    if (isRestore) {
      this.connection.restore(prebind.jid, this.onConnectionStatusChanged);
    } else {
      this.connection.attach(prebind.jid, prebind.sid, prebind.rid.toString(), this.onConnectionStatusChanged);
    }

    this.listExistantChatRooms();

    // this.evtConverse = (window as any).converse;

    // this.evtConverse.plugins.add("muikku-chat-ui", {

    //   initialize: function () {
    //     const initializedConverseInstance = this._converse;
    //     _this.converse = initializedConverseInstance;
    //     _this.onConverseInitialized();
    //   },
    // });
  }
  onConverseInitialized() {
    // this.setState({
    //   isConnectionOk: true,
    //   ready: true,
    //   showMaterial: true,
    // });

    // this.converse.on("disconnect", () => {
    //   this.setState({
    //     isConnectionOk: false,
    //   });
    // });
    // this.converse.on("reconnected", () => {
    //   this.setState({
    //     isConnectionOk: true,
    //   });
    // });

    // this.converse.on("connected", () => {
    //   this.converse.api.listen.on('message', this.onConverseMessage);
    //   const { Strophe, $iq } = this.evtConverse.env;
    //   let from = window.MUIKKU_LOGGED_USER;
    //   const iq: any = $iq({
    //     'to': 'conference.dev.muikkuverkko.fi',
    //     'from': from + "@dev.muikkuverkko.fi",
    //     'type': "get"
    //   }).c("query", { xmlns: Strophe.NS.DISCO_ITEMS });

    //   this.converse.api.sendIQ(iq)
    //     .then((iq: XMLDocument) => this.getAvailableChatRooms(iq))
    //     .catch((iq: any) => console.log(iq));

    //   // Get showControlBox status from sessionStroage and set correcponding states
    //   // We either show the control box or chat bubble button, if sessionStorage does not
    //   // return value for the key then we have default state (chat bubble is visible then).
    //   let chatControlBoxStatus = window.sessionStorage.getItem("showControlBox");
    //   if (chatControlBoxStatus) {
    //     if (chatControlBoxStatus === "opened") {
    //       this.setState({
    //         showControlBox: true,
    //         showChatButton: false
    //       });
    //     } else {
    //       this.setState({
    //         showControlBox: false,
    //         showChatButton: true
    //       });
    //     }
    //   } else {
    //     this.setState({
    //       showControlBox: false,
    //       showChatButton: true
    //     });
    //   }

    //   // Fetch user presence status
    //   const userPresence = this.converse.api.user.status.get();
    //   this.setState({
    //     selectedUserPresence: userPresence
    //   });
    // });
  }
  render() {
    if (!this.state.isInitialized) {
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
