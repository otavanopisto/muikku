/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import { ChatMessage } from './chatMessage';
import { IChatOccupant, IAvailableChatRoomType } from './chat';

interface Iprops {
  chat: IAvailableChatRoomType,
  leaveChatRoom: () => void,
  joinPrivateChat: (occupant: IChatOccupant) => void,
  onUpdateChatRoomConfig: (chat: IAvailableChatRoomType) => void,
  pyramusUserID: string,
}

interface Istate {
  groupMessages: Object[],
  availableMucRooms: Object,
  openChatSettings: boolean,
  isStudent: boolean,
  isLastRoomConfigSavedSuccesfully: boolean,
  showRoomInfo: boolean,
  minimized: boolean,
  minimizedChats: Object[],
  chatRoomType: string,
  chatRoomOccupants: any,
  studentOccupants: Object[],
  staffOccupants: Object[],
  showOccupantsList: boolean,
  occupantsListOpened: Object[],

  roomNameField: string;
  roomDescField: string;
  roomPersistent: boolean;
}

export class Groupchat extends React.Component<Iprops, Istate> {

  private messagesEnd: React.RefObject<HTMLDivElement>;

  constructor(props: Iprops) {
    super(props);
    this.state = {
      groupMessages: [],
      availableMucRooms: [],
      openChatSettings: false,
      isStudent: false,
      isLastRoomConfigSavedSuccesfully: null,
      showRoomInfo: false,
      minimized: false,
      minimizedChats: [],
      chatRoomType: "",
      chatRoomOccupants: [],
      studentOccupants: [],
      staffOccupants: [],
      showOccupantsList: false,
      occupantsListOpened: [],

      roomNameField: this.props.chat.roomName,
      roomDescField: this.props.chat.roomDesc,
      roomPersistent: this.props.chat.roomPersistent,
    }
    this.messagesEnd = React.createRef();

    this.sendMessageToChatRoom = this.sendMessageToChatRoom.bind(this);
    this.setChatroomConfiguration = this.setChatroomConfiguration.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.sendChatroomConfiguration = this.sendChatroomConfiguration.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.toggleOccupantsList = this.toggleOccupantsList.bind(this);
    this.refreshChat = this.refreshChat.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.toggleChatRoomSettings = this.toggleChatRoomSettings.bind(this);
  }

  sendMessageToChatRoom(event: any) {
    // event.preventDefault();

    // let text = event.target.chatMessage.value;
    // let chat = this.props.chat.chatObject;

    // var spoiler_hint = "undefined";

    // const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

    // attrs.fullname = window.PROFILE_DATA.displayName;
    // attrs.identifier = window.MUIKKU_LOGGED_USER;
    // attrs.from = this.state.bareJID;
    // attrs.to = this.props.chat.roomJID;
    // attrs.nick = chat.attributes.nick || window.PROFILE_DATA.displayName;

    // let message = chat.messages.findWhere('correcting');

    // if (message) {
    //   message.save({
    //     'correcting': false,
    //     'edited': chat.moment().format(),
    //     'message': text,
    //     'references': text,
    //     'fullname': window.PROFILE_DATA.displayName
    //   });
    // } else {
    //   message = chat.messages.create(attrs);
    // }
    // event.target.chatMessage.value = '';

    // if (text !== null || text !== "") {
    //   this.props.converse.api.send(chat.createMessageStanza(message));
    // }
    // this.scrollToBottom.bind(this, "smooth");
  }

  // Set chat room configurations
  async setChatroomConfiguration(event: React.FormEvent) {
    event.preventDefault();

    // let roomName = this.state.roomNameField;
    // let roomDesc = this.state.roomDescField;
    // let roomPersistency = this.state.roomPersistent;

    // const { $build, _ } = this.props.evtConverse.env;

    // const stanza = await this.getChatroomConfiguration();

    // const newroomConfig: any = [];
    // const fields = stanza.querySelectorAll('field');

    // // Go through chat room configuration fields and update when necessary
    // _.each(fields, (field: any) => {
    //   const fieldname = field.getAttribute('var').replace('muc#roomConfig_', ''),
    //     type = field.getAttribute('type');
    //   let value;

    //   // // Check if fieldname is part of roomConfig in hand
    //   // if (fieldname in roomConfig) {
    //   //   switch (type) {
    //   //     case 'boolean':
    //   //       value = roomConfig[fieldname] ? 1 : 0;
    //   //       break;
    //   //     case 'list-multi':
    //   //       // TODO: we don't yet handle "list-multi" types
    //   //       value = field.innerHTML;
    //   //       break;

    //   //     default:
    //   //       value = roomConfig[fieldname];
    //   //   }
    //   //   field.innerHTML = $build('value').t(value);
    //   // }
    //   // Set updated field values and pass them to sendChatroomConfiguration()
    //   newroomConfig.push(field);
    // });

    // if (await this.sendChatroomConfiguration(newroomConfig)) {
    //   // Update necessary chat room states
    //   this.props.onUpdateChatRoomConfig({
    //     roomName,
    //     roomDesc,
    //     roomPersistent: !!roomPersistency,
    //     chatObject: this.props.chat.chatObject,
    //     roomJID: this.props.chat.roomJID,
    //   });
    // };
  }

  public toggleChatRoomSettings() {
    this.setState({
      openChatSettings: !this.state.openChatSettings,
    });
  }

  // Open chat room window
  async openMucConversation(roomJID: string) {


  }
  // Load chat room messages
  async getMUCMessages(stanza: any) {

    // if (stanza && stanza.attributes.type === "groupchat") {
    //   let message = stanza.attributes.message;
    //   // Message sender JID, can be OccupantJID or bareJID -> We parse this later
    //   let from = stanza.attributes.from;
    //   let senderClass = "";
    //   let user: any;
    //   let chatSettings: any;
    //   let messageId: any;
    //   let deleteId: any;
    //   let MuikkuNickName: any;
    //   let userName: any;
    //   let deletedTime: any;

    //   // Check if message has sender, if not then we skip it
    //   if (from) {

    //     // Try to split the sender's JID in case we get OccupantJID and
    //     // extract the resource part of it and pass it on.
    //     from = from.split("/").pop();

    //     // Check if the sender's JID is from PYRAMUS user (applies top both OccupantJID and bareJID)
    //     if (from.startsWith("PYRAMUS-")) {

    //       // Try to split the sender's JID in case we got bareJID so we can extract the local part of it.
    //       // In case of OcucpantJID we don't do anything as it has been extracted previously already.
    //       from = from.split("@");
    //       from = from[0];

    //       // Get user's MuikkuNickName
    //       chatSettings = (await promisify(mApi().chat.settings.read(from), 'callback')());
    //       MuikkuNickName = chatSettings.nick;

    //       // Check if user has MuikkuNickName, if not then we use real name
    //       if (MuikkuNickName == "" || MuikkuNickName == undefined) {
    //         user = (await promisify(mApi().user.users.basicinfo.read(from, {}), 'callback')());
    //         userName = user.firstName + " " + user.lastName;
    //         MuikkuNickName = userName;
    //       }

    //       // In case sender's JID is not from PYRAMUS user then we just use the given sender's JID
    //     } else {
    //       MuikkuNickName = from;
    //     }
    //   }

    //   if (message !== "") {
    //     messageId = stanza.attributes.id;
    //   } else {
    //     messageId = "null";
    //   }

    //   // Check if message was written by logged in user and set senderClass accordingly
    //   if (from === window.MUIKKU_LOGGED_USER) {
    //     senderClass = "sender-me";
    //   } else {
    //     senderClass = "sender-them";
    //   }

    //   // Check if message has timestamp, if not then it's newly
    //   // created message and we set current time in it.
    //   let timeStamp: any;
    //   if (stanza.attributes.time) {
    //     timeStamp = stanza.attributes.time;
    //   } else {
    //     timeStamp = new Date().toString();
    //   }

    //   let groupMessage: any = {
    //     from: MuikkuNickName,
    //     content: message,
    //     senderClass: senderClass,
    //     timeStamp: timeStamp,
    //     messageId: messageId,
    //     deleted: false,
    //     deletedTime: "",
    //     userIdentifier: from
    //   };

    //   if (message !== "") {
    //     let tempGroupMessages = new Array;

    //     if (this.state.groupMessages.length !== 0) {
    //       tempGroupMessages = [...this.state.groupMessages];
    //     }

    //     if (!message.startsWith("messageID=")) {
    //       tempGroupMessages.push(groupMessage);
    //     } else {
    //       deleteId = message.split("=").pop();
    //       deletedTime = stanza.attributes.dateTime;
    //     }

    //     let i: any;
    //     for (i = 0; i < tempGroupMessages.length; i++) {
    //       let groupMessageId = tempGroupMessages[i].messageId;
    //       if (deleteId && groupMessageId === deleteId) {
    //         tempGroupMessages[i] = { ...tempGroupMessages[i], deleted: true, deletedTime: deletedTime }
    //       }
    //     }

    //     tempGroupMessages.sort((a: any, b: any) => (a.timeStamp > b.timeStamp) ? 1 : -1)

    //     this.setState({
    //       groupMessages: tempGroupMessages
    //     }, this.scrollToBottom.bind(this, "smooth"));
    //     return;
    //   }
    // } else {
    //   return;
    // }
  }
  // Set chat room message as removed
  setMessageAsRemoved(data: any) {
    //   let text = data;
    //   const chat = this.props.chat.chatObject;

    //   let spoiler_hint = "undefined";

    //   const attrs = chat.getOutgoingMessageAttributes("messageID=" + text.messageId, spoiler_hint);

    //   let today = new Date();
    //   let date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    //   let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //   let dateTime = date + ' ' + time;

    //   attrs.dateTime = dateTime;

    //   let message = chat.messages.findWhere('correcting')

    //   if (message) {
    //     message.save({
    //       'correcting': false,
    //       'edited': chat.moment().format(),
    //       'message': text,
    //       'references': text,
    //       'fullname': window.PROFILE_DATA.displayName,
    //       'dateTime': dateTime
    //     });
    //   } else {
    //     message = chat.messages.create(attrs);
    //   }

    //   this.props.converse.api.send(chat.createMessageStanza(message));
    //   this.getMUCMessages(message);
    // }
    // // Send message to the chat room
    // sendMessageToChatRoom(event: any) {
    //   event.preventDefault();

    //   let text = event.target.chatMessage.value;
    //   let chat = this.props.chat.chatObject;

    //   var spoiler_hint = "undefined";

    //   const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

    //   attrs.fullname = window.PROFILE_DATA.displayName;
    //   attrs.identifier = window.MUIKKU_LOGGED_USER;
    //   attrs.from = this.state.bareJID;
    //   attrs.to = this.props.chat.roomJID;
    //   attrs.nick = chat.attributes.nick || window.PROFILE_DATA.displayName;

    //   let message = chat.messages.findWhere('correcting');

    //   if (message) {
    //     message.save({
    //       'correcting': false,
    //       'edited': chat.moment().format(),
    //       'message': text,
    //       'references': text,
    //       'fullname': window.PROFILE_DATA.displayName
    //     });
    //   } else {
    //     message = chat.messages.create(attrs);
    //   }
    //   event.target.chatMessage.value = '';

    //   if (text !== null || text !== "") {
    //     this.props.converse.api.send(chat.createMessageStanza(message));
    //   }
    //   this.scrollToBottom.bind(this, "smooth");
    // }
    // // Open chat room settings
    // toggleChatRoomSettings() {
    //   if (this.state.openChatSettings === false && window.MUIKKU_IS_STUDENT === false) {
    //     this.setState({
    //       openChatSettings: true,
    //       isLastRoomConfigSavedSuccesfully: null,
    //     });
    //   } else {
    //     this.setState({
    //       openChatSettings: false
    //     });
    //   }
    // }
    // // Set chat room configurations
    // async setChatroomConfiguration(event: React.FormEvent) {
    //   event.preventDefault();

    //   let roomName = this.state.roomNameField;
    //   let roomDesc = this.state.roomDescField;
    //   let roomPersistency = this.state.roomPersistent;

    //   const { $build, _ } = this.props.evtConverse.env;

    //   const stanza = await this.getChatroomConfiguration();

    //   const newroomConfig: any = [];
    //   const fields = stanza.querySelectorAll('field');

    //   // Go through chat room configuration fields and update when necessary
    //   _.each(fields, (field: any) => {
    //     const fieldname = field.getAttribute('var').replace('muc#roomConfig_', ''),
    //       type = field.getAttribute('type');
    //     let value;

    //     // // Check if fieldname is part of roomConfig in hand
    //     // if (fieldname in roomConfig) {
    //     //   switch (type) {
    //     //     case 'boolean':
    //     //       value = roomConfig[fieldname] ? 1 : 0;
    //     //       break;
    //     //     case 'list-multi':
    //     //       // TODO: we don't yet handle "list-multi" types
    //     //       value = field.innerHTML;
    //     //       break;

    //     //     default:
    //     //       value = roomConfig[fieldname];
    //     //   }
    //     //   field.innerHTML = $build('value').t(value);
    //     // }
    //     // Set updated field values and pass them to sendChatroomConfiguration()
    //     newroomConfig.push(field);
    //   });

    //   if (await this.sendChatroomConfiguration(newroomConfig)) {
    //     // Update necessary chat room states
    //     this.props.onUpdateChatRoomConfig({
    //       roomName,
    //       roomDesc,
    //       roomPersistent: !!roomPersistency,
    //       chatObject: this.props.chat.chatObject,
    //       roomJID: this.props.chat.roomJID,
    //     });
    //   };
  }
  // Send an IQ stanza with the groupchat configuration.
  async sendChatroomConfiguration(roomConfig: any = []) {
    // const { Strophe, $iq } = this.props.evtConverse.env;
    // const iq = $iq({ to: this.props.chat.roomJID, type: "set" })
    //   .c("query", { xmlns: Strophe.NS.MUC_OWNER })
    //   .c("x", { xmlns: Strophe.NS.XFORM, type: "submit" });

    // roomConfig.forEach((node: any) => iq.cnode(node).up());

    // try {
    //   await this.props.converse.api.sendIQ(iq);
    //   this.setState({
    //     isLastRoomConfigSavedSuccesfully: true,
    //   });
    //   return true;
    // } catch {
    //   this.setState({
    //     isLastRoomConfigSavedSuccesfully: false,
    //   });
    //   return false;
    // }
  }
  // Send an IQ stanza to fetch the groupchat configuration data.
  // Returns a promise which resolves once the response IQ
  // has been received.
  getChatroomConfiguration() {
    // const { Strophe, $iq } = this.props.evtConverse.env;

    // return this.props.converse.api.sendIQ(
    //   $iq({ 'to': this.props.chat.roomJID, 'type': "get" })
    //     .c("query", { xmlns: Strophe.NS.MUC_OWNER })
    // );
  }
  // Chat room window minimizing toggle
  toggleMinimizeChats() {
    const roomJID = this.props.chat.roomJID;
    // let minimizedRoomList = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

    // // Check if chat room window is not mimimized and then mimimized it
    // if (this.state.minimized === false) {
    //   this.setState({
    //     minimized: true
    //   });

    //   // Update minimizedChats state and corresponding sessionStorage key
    //   if (!minimizedRoomList.includes(roomJID)) {
    //     minimizedRoomList.push(roomJID);
    //     this.setState({
    //       minimizedChats: minimizedRoomList
    //     });
    //     window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
    //   }
    //   // If chat room window is mimimized then open it
    // } else {
    //   this.setState({
    //     minimized: false
    //   });

    //   // Update minimizedChats state and corresponding sessionStorage key
    //   if (minimizedRoomList.includes(roomJID)) {
    //     const filteredRooms = minimizedRoomList.filter((item: any) => item !== roomJID);
    //     this.setState({
    //       minimizedChats: filteredRooms
    //     });
    //     window.sessionStorage.setItem("minimizedChats", JSON.stringify(filteredRooms));
    //   }
    //   // Trigger openMucConversation() to load chat room messages
    //   this.openMucConversation(roomJID);
    // }
  }
  async toggleOccupantsList() {
    // let roomsWithOpenOccupantsList = this.state.occupantsListOpened;

    // if (this.state.showOccupantsList === true) {

    //   const filteredRooms = roomsWithOpenOccupantsList.filter((item: any) => item !== this.props.chat.chatObject.attributes.jid);
    //   this.setState({
    //     showOccupantsList: false,
    //     occupantsListOpened: filteredRooms,
    //   });

    //   let result = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

    //   const filteredChats = result.filter(function (item: any) {
    //     return item !== this.props.chat.chatObject.attributes.jid;
    //   });

    //   window.sessionStorage.setItem("showOccupantsList", JSON.stringify(filteredChats));

    // } else if (!roomsWithOpenOccupantsList.includes(this.props.chat.chatObject.attributes.jid)) {

    //   roomsWithOpenOccupantsList.push(this.props.chat.chatObject.attributes.jid);

    //   this.setState({
    //     occupantsListOpened: roomsWithOpenOccupantsList,
    //     showOccupantsList: true
    //   });
    //   this.refreshChat();
    //   window.sessionStorage.setItem("showOccupantsList", JSON.stringify(roomsWithOpenOccupantsList));
    // }
  }
  async refreshChat() {
    // const chatObject = await this.props.converse.api.rooms.get(this.props.chat.roomJID);

    // this.props.onUpdateChatRoomConfig({
    //   ...this.props.chat,
    //   chatObject,
    // });

    // if (this.props.chat.chatObject.occupants.models.length > 0) {
    //   let MuikkuUser: any;
    //   let occupantData: any;
    //   let chatSettings: any;
    //   let tempStudentOccupants = new Array;
    //   let tempStaffOccupants = new Array;
    //   for (let item of this.props.chat.chatObject.occupants.models) {
    //     if (typeof item.attributes.from !== "undefined") {
    //       if (typeof item.attributes.nick !== 'undefined') {
    //         if (item.attributes.nick.startsWith("PYRAMUS-STAFF-") || item.attributes.nick.startsWith("PYRAMUS-STUDENT-")) {
    //           chatSettings = (await promisify(mApi().chat.settings.read(item.attributes.nick), 'callback')());
    //           MuikkuUser = (await promisify(mApi().user.users.basicinfo.read(item.attributes.nick, {}), 'callback')());
    //           let MuikkuNickName: string = chatSettings.nick;
    //           if (MuikkuNickName === "") {
    //             MuikkuNickName = MuikkuUser.firstName + " " + MuikkuUser.lastName;
    //           }
    //           occupantData = { UserId: item.attributes.nick, MuikkuNickName: MuikkuNickName, firstName: MuikkuUser.firstName, lastName: MuikkuUser.lastName, status: item.attributes.show };
    //         } else {
    //           MuikkuUser = item.attributes.nick;
    //           let MuikkuNickName = item.attributes.nick;
    //           occupantData = { UserId: item.attributes.nick, MuikkuNickName: MuikkuNickName, firstName: "", lastName: "", status: item.attributes.show };
    //         }
    //       }

    //       if (typeof item.attributes.nick !== 'undefined') {
    //         if (item.attributes.nick.startsWith("PYRAMUS-STAFF-")) {
    //           let isExists = tempStaffOccupants.some(function (curr: any) {
    //             if (curr.UserId === occupantData.UserId) {
    //               return true;
    //             }
    //           });
    //           if (isExists !== true) {
    //             tempStaffOccupants.push(occupantData);
    //           }
    //         } else {
    //           let isExists = tempStudentOccupants.some(function (curr: any) {
    //             if (curr.UserId === occupantData.UserId) {
    //               return true;
    //             }
    //           });
    //           if (isExists !== true) {
    //             tempStudentOccupants.push(occupantData);
    //           }
    //         }
    //       }
    //     }
    //   }
    //   this.setState({
    //     studentOccupants: tempStudentOccupants,
    //     staffOccupants: tempStaffOccupants
    //   });
    // } else {
    //   return;
    // }
  }
  // Scroll selected view to the bottom
  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }
  onEnterPress(e: any) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      return false;
    }
  }
  // Check whether chat room is for workspace or environment level
  // Workspace gets chat room automatically via workspace management chat settings
  isWorkspaceChatRoom(roomJID: string) {
    if (roomJID.startsWith("workspace-")) {
      this.setState({
        chatRoomType: "workspace"
      });
      return;
    } else {
      this.setState({
        chatRoomType: "other"
      });
      return;
    }
  }
  componentDidMount() {
    // var roomOccupantsFromSessionStorage = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

    // if (roomOccupantsFromSessionStorage) {
    //   roomOccupantsFromSessionStorage.map((item: any) => {
    //     if (item === this.props.chat.roomJID) {
    //       this.setState({
    //         showOccupantsList: true
    //       });
    //     }
    //   })
    // }

    // this.isWorkspaceChatRoom(this.props.chat.roomJID);

    // this.props.converse.api.waitUntil('chatBoxesFetched').then(async () => {
    //   this.openMucConversation(this.props.chat.roomJID);
    //   this.props.converse.api.listen.on('chatRoomInitialized', (chatbox: any) => {
    //     this.getMUCMessages(chatbox)
    //   });

    //   if (this.props.chat.chatObject) {
    //     this.props.chat.chatObject.listenTo(this.props.chat.chatObject.occupants, 'add', this.refreshChat);
    //     this.props.chat.chatObject.listenTo(this.props.chat.chatObject.occupants, 'destroy', this.refreshChat);
    //   }
    // });


    // // Getting minimizedChats sessionStorage value and set it to coresponding state (minimizedChats)
    // let minimizedChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

    // // Getting showOccupantsList sessionStorage value and set it to coresponding state
    // let showOccupantsFromSessionStorage = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || []

    // if (showOccupantsFromSessionStorage) {
    //   this.setState({
    //     occupantsListOpened: showOccupantsFromSessionStorage,
    //   });
    // }

    // if (minimizedChatsFromSessionStorage) {
    //   this.setState({
    //     minimizedChats: minimizedChatsFromSessionStorage,
    //   });

    //   minimizedChatsFromSessionStorage.map((item: any) => {
    //     if (item === this.props.chat.roomJID) {
    //       this.setState({
    //         minimized: true,
    //       });
    //     }
    //   })
    // }

    // this.props.converse.api.listen.on('message', this.handleIncomingMessages);
    // this.props.converse.api.listen.on('membersFetched', this.refreshChat);
  }
  render() {
    let chatRoomTypeClassName = this.state.chatRoomType === "workspace" ? "workspace" : "other";

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
                {(!this.state.isStudent) && <div onClick={this.toggleChatRoomSettings} className="chat__button chat__button--room-settings icon-cogs"></div>}
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
                      <label className="chat__label">Huoneen nimi: </label>
                      <input className="chat__textfield" name="newroomName" defaultValue={this.props.chat.roomName} type="text"></input>
                    </div>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">Huoneen kuvaus: </label>
                      <textarea className="chat__memofield" name="newroomDescription" defaultValue={this.props.chat.roomDesc}></textarea>
                    </div>
                    {(!this.state.isStudent) && <div className="chat__subpanel-row">
                      <label className="chat__label">Pysyvä huone: </label>
                      <input className="chat__checkbox" type="checkbox" name="persistent"></input>
                    </div>}
                    <input className={`chat__submit chat__submit--room-settings-${chatRoomTypeClassName}`} type="submit" value="Tallenna"></input>
                  </form>
                </div>

                {this.state.isLastRoomConfigSavedSuccesfully !== null
                  ? (
                    <div>
                      <p>{this.state.isLastRoomConfigSavedSuccesfully ? "SUCCESS" : "FAIL"}</p>
                    </div>
                  ) : null}
              </div>}

              <div className="chat__panel-body chat__panel-body--chatroom">
                <div className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}>
                  {this.state.groupMessages.map((groupMessage: any, i: any) => <ChatMessage key={i} setMessageAsRemoved={this.setMessageAsRemoved.bind(this)}
                    groupMessage={groupMessage} />)}
                  <div className="chat__messages-last-message" ref={this.messagesEnd}></div>
                </div>
                {this.state.showOccupantsList && <div className="chat__occupants-container">
                  <div className="chat__occupants-staff">
                    {this.state.staffOccupants.length > 0 ? "Henkilökunta" : ""}
                    {this.state.staffOccupants.map((staffOccupant: any, i: any) =>
                      <div className="chat__occupants-item" onClick={this.props.joinPrivateChat.bind(this, staffOccupant)} key={i}>
                        <span className={"chat__online-indicator chat__occupant-" + staffOccupant.status}></span>{staffOccupant.MuikkuNickName}</div>)}
                  </div>
                  <div className="chat__occupants-student">
                    {this.state.studentOccupants.length > 0 ? "Oppilaat" : ""}
                    {this.state.studentOccupants.map((studentOccupant: any, i: any) =>
                      <div className="chat__occupants-item" onClick={this.props.joinPrivateChat.bind(this, studentOccupant)} key={i}>
                        <span className={"chat__online-indicator chat__occupant-" + studentOccupant.status}></span>{studentOccupant.MuikkuNickName}</div>)}
                  </div>
                </div>}
              </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={this.sendMessageToChatRoom}>
                <input name="chatRecipient" className="chat__muc-recipient" value={this.props.chat.roomJID} readOnly />
                <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder="Kirjoita viesti tähän..." name="chatMessage"></textarea>
                <button className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`} type="submit" value=""><span className="icon-arrow-right"></span></button>
              </form>
            </div>)
        }
      </div>
    );
  }
}
