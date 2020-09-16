import * as React from 'react'
import '~/sass/elements/chat.scss';
import { Groupchat } from './groupchat';
import { RoomsList } from './roomslist';
import { PrivateMessages } from './privatemessages';
import mApi, { MApiError } from '~/lib/mApi';
import promisify, { promisifyNewConstructor } from '~/util/promisify';

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

export interface IAvailableChatRoomType {
  roomName: string,
  roomJID: string,
  roomDesc: string,
  roomPersistent: boolean,
  chatObject: any,
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
  isConnectionOk: boolean,
  showMaterial: boolean,
  roomsList: Object[],
  messages: Object[],
  availableMucRooms: IAvailableChatRoomType[],
  showChatButton: boolean,
  showControlBox: boolean,
  showNewRoomForm: boolean,
  isStudent: boolean,
  pyramusUserId: string,
  openRoomNumber: number,
  openChatsJIDS: string[],
  selectedUserPresence: string,
  privateChatData: IPrivateChatData[],
  ready: boolean,

  roomNameField: string;
  roomDescField: string;
  roomPersistent: boolean;
}

export class Chat extends React.Component<{}, IChatState> {

  private evtConverse: any = null;
  private converse: any = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      isConnectionOk: false,
      showMaterial: false,
      roomsList: [],
      messages: [],
      availableMucRooms: [],
      showChatButton: null,
      showControlBox: null,
      showNewRoomForm: false,
      isStudent: false,
      openRoomNumber: null,
      pyramusUserId: window.MUIKKU_LOGGED_USER,
      openChatsJIDS: [],
      selectedUserPresence: null,
      privateChatData: [],
      ready: false,

      roomNameField: "",
      roomDescField: "",
      roomPersistent: false,
    }

    this.toggleControlBox = this.toggleControlBox.bind(this);
    this.toggleCreateChatRoomForm = this.toggleCreateChatRoomForm.bind(this);
    this.toggleJoinLeaveChatRoom = this.toggleJoinLeaveChatRoom.bind(this);
    this.toggleJoinLeavePrivateChat = this.toggleJoinLeavePrivateChat.bind(this);
    this.getUserAvailability = this.getUserAvailability.bind(this);
    this.setUserAvailability = this.setUserAvailability.bind(this);
    this.onConverseMessage = this.onConverseMessage.bind(this);
    this.onConverseInitialized = this.onConverseInitialized.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this);
    this.toggleRoomPersistent = this.toggleRoomPersistent.bind(this);
    this.toggleJoinLeavePrivateChat = this.toggleJoinLeavePrivateChat.bind(this);
    this.createAndJoinChatRoom = this.createAndJoinChatRoom.bind(this);
    this.updateChatRoomConfig = this.updateChatRoomConfig.bind(this);
    this.initializeConverse = this.initializeConverse.bind(this);
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
  async onConverseMessage(data: any) {
    const converseUtils = this.evtConverse.env.utils;
    let type = data.stanza.getAttribute('type');

    const { Strophe } = this.evtConverse.env;
    let from = data.stanza.getAttribute('from');
    let bareJIDOfSender = Strophe.getBareJidFromJid(from);
    const isSameUserAsLoggedInUser = bareJIDOfSender === this.converse.bare_jid;

    if (
      type !== null &&
      type !== 'groupchat' &&
      from !== null &&
      !converseUtils.isOnlyChatStateNotification(data.stanza) &&
      !converseUtils.isOnlyMessageDeliveryReceipt(data.stanza) &&
      !isSameUserAsLoggedInUser
    ) {
      const newPrivateChatData = [...this.state.privateChatData];
      const newOpenChatsJIDS = [...this.state.openChatsJIDS];

      if (!newOpenChatsJIDS.includes(bareJIDOfSender)) {
        const userId: string = data.stanza.getAttribute('from').split('@')[0];

        // Fetch message sender's chatSettings
        let chatSettings: any = (await promisify(mApi().chat.settings.read(userId), 'callback')());

        // Setup sender's MuikkuNickName
        let muikkuNickName: string = chatSettings.nick;

        // Fetch senders user details in case user has not set MuikkuNickName yet
        let muikkuUser: any = (await promisify(mApi().user.users.basicinfo.read(chatSettings.userIdentifier, {}), 'callback')());

        // Check whether message sender has setup a nick name, if not we use hes/her real name
        if (!muikkuNickName) {
          muikkuNickName = muikkuUser.firstName + " " + muikkuUser.lastName;
        }

        // Gather chatData so it can be used in onOpenPrivateChat method
        let occupant: IChatOccupant = {
          userId,
          muikkuNickName,
          status: '',
          firstName: muikkuUser.firstName,
          lastName: muikkuUser.lastName,
          receivedMessageNotification: true,
        };

        // Pushing BareJID to openChatsList and gathered chatData to newprivateChatData
        // Setting states of openChats and privateChatData from previously set values
        newPrivateChatData.push({ occupantBareJID: bareJIDOfSender, occupant });
        newOpenChatsJIDS.push(bareJIDOfSender);
        this.setState({
          privateChatData: newPrivateChatData,
          openChatsJIDS: newOpenChatsJIDS
        });
      }
    }
  }

  // Toggle Private Message Window
  async toggleJoinLeavePrivateChat(occupant: IChatOccupant) {
    let openChatsList = [...this.state.openChatsJIDS];
    let newPrivateChatData = [...this.state.privateChatData];

    // Checking if message receiver is the same user as logged in user
    // and if true we stop right here as you should not be able to send
    // private messages to yourself.
    if (occupant.userId === window.MUIKKU_LOGGED_USER) {
      return;
    } else if (occupant.userId.startsWith("PYRAMUS-STAFF-") || window.MUIKKU_IS_STUDENT === false) {
      let bareoccupantBareJID = occupant.userId.toLowerCase() + "@dev.muikkuverkko.fi";

      // Lets check whether private chat window's BareJID exists in openChatsList
      // or not so we know do we close or open the chat window
      if (openChatsList.includes(bareoccupantBareJID)) {
        // Remove the BareJID of the chat window we are closing from openChatsList
        const filteredChats = openChatsList.filter(item => item !== bareoccupantBareJID);
        const filteredChatData = newPrivateChatData.filter((item) => item.occupantBareJID !== bareoccupantBareJID);

        // Set filtered openChatsList as filteredChats to this.state.openChats
        this.setState({
          openChatsJIDS: filteredChats,
          privateChatData: filteredChatData,
        })

        // Set current openChatList to sessionStorage
        window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));

      } else {
        // Lets push object to openChatList and set it to openChats state
        openChatsList.push(bareoccupantBareJID);
        newPrivateChatData.push({ occupantBareJID: bareoccupantBareJID, occupant });

        this.setState({
          openChatsJIDS: openChatsList,
          privateChatData: newPrivateChatData
        });
      }
    }
  }

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
    event.preventDefault();
  
    // We need to trim and replace white spaces so new room will be created succefully
    const roomJID = this.state.roomNameField.trim().replace(/\s+/g, '-') + '@conference.dev.muikkuverkko.fi';;
    const roomName = this.state.roomNameField;
    const roomPersistent = this.state.roomPersistent;
    const roomDesc = this.state.roomDescField;

    if (roomJID.startsWith("workspace-")) {
      alert("Creation of workspace- prefixed chat room is forbidden");
      return;
    }

    const { Strophe, $pres, _ } = this.evtConverse.env;

    const occupantBareJID = roomJID + "/" + this.state.pyramusUserId;

    const stanza = $pres({
      'from': this.converse.connection.jid,
      'to': occupantBareJID
    }).c("x", { 'xmlns': Strophe.NS.MUC })
      .c("history", { 'maxstanzas': this.converse.muc_history_max_stanzas }).up();

    this.converse.api.send(stanza);

    this.converse.api.user.status.set('online');

    this.converse.api.rooms.open(roomJID, _.extend({
      'nick': this.state.pyramusUserId,
      'maximize': true,
      'auto_configure': true,
      'publicroom': true,
      'roomconfig': {
        'persistentroom': roomPersistent,
        'roomname': roomName,
        'roomdesc': roomDesc
      }
    }), true).then((chat: any) => {

      let newAvailableMucRoom: IAvailableChatRoomType = {
        roomJID,
        roomName,
        roomDesc,
        roomPersistent,
        chatObject: chat
      };

      const newAvailableMucRooms = [...this.state.availableMucRooms, newAvailableMucRoom];

      this.setState({
        availableMucRooms: newAvailableMucRooms,
        showNewRoomForm: false,
        roomPersistent: false,
        roomDescField: "",
        roomNameField: "",
      });
    });
  }

  // Getting available chat rooms to be listed in the control box
  async getAvailableChatRooms(iq: XMLDocument) {
    // Handle the IQ stanza returned from the server, containing all its public groupchats.
    let availableChatRooms = iq.querySelectorAll('query item');
    const { _ } = this.evtConverse.env;

    if (availableChatRooms.length) {
      const nodesArray = [].slice.call(availableChatRooms);
      const availableMucRoomsList = [...this.state.availableMucRooms];

      await Promise.all(nodesArray.map(async (node: any) => {
        const roomName = node.attributes.name.nodeValue;
        const roomJID = node.attributes.jid.value;
        // TODO check if this is correct
        const roomPersistent = node.attributes.persistent.value;

        const fields = await this.converse.api.disco.getFields(roomJID);
        const roomDesc = _.get(fields.findWhere({ 'var': "muc#roominfo_description" }), 'attributes.value');

        const newRoomToAdd = {
          roomName,
          roomJID,
          roomDesc,
          roomPersistent,
          chatObject: null as any,
        }

        availableMucRoomsList.push(newRoomToAdd);
      }));
    } else {

    }
    return true;
  }
  // Toggle states for Control Box window opening/closing
  toggleControlBox() {
    if (!this.state.showChatButton) {
      this.setState({
        showControlBox: false,
        showChatButton: true
      });
      window.sessionStorage.setItem("showControlBox", "closed");
    } else {
      this.setState({
        showControlBox: true,
        showChatButton: false
      });
      window.sessionStorage.setItem("showControlBox", "opened");
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
  // Toggles between joining and leaving the chat room
  async toggleJoinLeaveChatRoom(roomJID: string) {
    // Check whether current roomJID is allready part of openChatList
    if (this.state.openChatsJIDS.includes(roomJID)) {

      const filteredJIDS = this.state.openChatsJIDS.filter(item => item !== roomJID);

      // Set filtered and current openChatList to this.state.openChats
      this.setState({
        openChatsJIDS: filteredJIDS,
      });

      // Set the filtered openChatList to sessionStorage
      window.sessionStorage.setItem("openChats", JSON.stringify(filteredJIDS));

      // Fetch room object
      let chatRoom = await this.converse.api.rooms.get(roomJID);

      // When chat room window is closed user will leave the room also.
      chatRoom.leave();
    } else {
      // Lets push RoomJid to openChatList and set it to this.state.openChats
      const newJIDS = [...this.state.openChatsJIDS, roomJID];

      this.setState({
        openChatsJIDS: newJIDS
      });

      if (roomJID) {
        // Fetch room object
        const chatRoom = await this.converse.api.rooms.get(roomJID, {}, false);

        if (chatRoom) {
          // Join chat room
          chatRoom.join(this.state.pyramusUserId);
        }
      }
    }
  }
  getWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room) => room.roomJID.startsWith("workspace-"));
  }
  getNotWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room) => !room.roomJID.startsWith("workspace-"));
  }
  setUserAvailability(e: React.ChangeEvent<HTMLSelectElement>) {
    let newStatus = e.target.value;
    this.converse.api.user.status.set(newStatus);
    this.getUserAvailability();
  }
  getUserAvailability() {
    let userPresence = this.converse.api.user.status.get();
    this.setState({
      selectedUserPresence: userPresence
    });
  }
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "/scripts/gui/conversejs/6.0.0/converse-headless.min.js";
    document.head.appendChild(script);

    window.addEventListener("converse-loaded", this.initializeConverse);

    // Lets get openChats from sessionStorage value and set it to coresponding state (openChats)
    // Includes both chat rooms and private chats
    let openChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("openChats"));

    if (openChatsFromSessionStorage) {
      this.setState({
        openChatsJIDS: openChatsFromSessionStorage
      });
    }
  }
  initializeConverse(ev: CustomEvent) {
    const _this = this;
    this.evtConverse = (ev as any).converse;

    this.evtConverse.plugins.add("muikku-chat-ui", {

      initialize: function () {
        const initializedConverseInstance = this._converse;
        _this.converse = initializedConverseInstance;
        _this.onConverseInitialized();
      },
    });
  }
  onConverseInitialized() {
    this.converse.on('connected', () => {
      this.converse.api.listen.on('message', this.onConverseMessage);

      this.setState({
        isConnectionOk: true,
        showMaterial: true,
        isStudent: window.MUIKKU_IS_STUDENT,
        ready: true,
      });

      const { Strophe, $iq } = this.evtConverse.env;
      let from = window.MUIKKU_LOGGED_USER;
      const iq: any = $iq({
        'to': 'conference.dev.muikkuverkko.fi',
        'from': from + "@dev.muikkuverkko.fi",
        'type': "get"
      }).c("query", { xmlns: Strophe.NS.DISCO_ITEMS });

      this.converse.api.sendIQ(iq)
        .then((iq: XMLDocument) => this.getAvailableChatRooms(iq))
        .catch((iq: any) => console.log(iq));

      // Get showControlBox status from sessionStroage and set correcponding states
      // We either show the control box or chat bubble button, if sessionStorage does not
      // return value for the key then we have default state (chat bubble is visible then).
      let chatControlBoxStatus = window.sessionStorage.getItem("showControlBox");
      if (chatControlBoxStatus) {
        if (chatControlBoxStatus === "opened") {
          this.setState({
            showControlBox: true,
            showChatButton: false
          });
        } else {
          this.setState({
            showControlBox: false,
            showChatButton: true
          });
        }
      } else {
        this.setState({
          showControlBox: false,
          showChatButton: true
        });
      }

      // Fetch user presence status
      const userPresence = this.converse.api.user.status.get();
      this.setState({
        selectedUserPresence: userPresence
      });
    });
  }
  render() {
    if (!this.state.ready) {
      return null;
    }

    const userStatusClassName = this.state.selectedUserPresence === "online" ? "online" : this.state.selectedUserPresence === "offline" ? "offline" : "away";

    return (
      <div className="chat">
        {/* Chat bubble */}
        {(this.state.showChatButton === true) && <div onClick={this.toggleControlBox} className="chat__bubble">
          <span className="icon-chat"></span>
        </div>}

        {/* Chat controlbox */}
        {(this.state.showControlBox === true) && <div className="chat__panel chat__panel--controlbox">
          <div className="chat__panel-header chat__panel-header--controlbox">
            <span onClick={this.toggleCreateChatRoomForm} className="chat__button chat__button--new-room icon-plus"></span>
            <span onClick={this.toggleControlBox} className="chat__button chat__button--close icon-cross"></span>
          </div>

          {(this.state.showMaterial === true) && <div className="chat__panel-body chat__panel-body--controlbox">

            <select value={this.state.selectedUserPresence} onChange={this.setUserAvailability} className={`chat__controlbox-user-status chat__controlbox-user-status--${userStatusClassName}`}>
              <option value="online">Paikalla</option>
              <option value="away">Palaan pian</option>
            </select>

            <div className="chat__controlbox-rooms-heading">Kurssikohtaiset huoneet: </div>
            <div className="chat__controlbox-rooms-listing chat__controlbox-rooms-listing--workspace">
              {this.getWorkspaceMucRooms().length > 0 ?
                this.getWorkspaceMucRooms().map((chat, i) => <RoomsList modifier="workspace" toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom} key={i} chat={chat} orderNumber={i} converse={this.converse} />)
                : <div className="chat__controlbox-room  chat__controlbox-room--empty">Ei huoneita</div>}
            </div>

            <div className="chat__controlbox-rooms-heading">Muut huoneet:</div>
            <div className="chat__controlbox-rooms-listing">
              {this.getNotWorkspaceMucRooms().length > 0 ?
                this.getNotWorkspaceMucRooms().map((chat, i) => <RoomsList toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom} key={i} chat={chat} orderNumber={i} converse={this.converse} />)
                : <div className="chat__controlbox-room chat__controlbox-room--empty">Ei huoneita</div>}
            </div>

            {(this.state.showNewRoomForm === true) && <div className="chat__subpanel">
              <div className="chat__subpanel-header chat__subpanel-header--new-room">
                <div className="chat__subpanel-title">Luo uusi huone</div>
                <div onClick={() => this.toggleCreateChatRoomForm()} className="chat__button chat__button--close icon-cross"></div>
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
                  <input className="chat__submit chat__submit--new-room" type="submit" value="Lisää huone"/>
                </form>
              </div>
            </div>}
          </div>}
        </div>}

        {/* Chatrooms */}
        <div className="chat__chatrooms-container">
          {this.state.availableMucRooms.map((chat, i) => this.state.openChatsJIDS.includes(chat.roomJID) ?
            <Groupchat
              key={i}
              toggleJoinLeavePrivateChat={this.toggleJoinLeavePrivateChat}
              toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom}
              pyramusUserID={this.state.pyramusUserId}
              chat={chat}
              converse={this.converse}
              onUpdateChatRoomConfig={this.updateChatRoomConfig.bind(this, i)}
            />
            : null)}

          {this.state.privateChatData.map((privateChatData, i) => this.state.openChatsJIDS.includes(privateChatData.occupantBareJID) ?
            <PrivateMessages key={i} toggleJoinLeavePrivateChat={this.toggleJoinLeavePrivateChat} privateChatData={privateChatData} converse={this.converse} />
            : null)}
        </div>
      </div>
    );
  }
}