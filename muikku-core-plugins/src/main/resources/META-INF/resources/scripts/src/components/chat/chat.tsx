import * as React from 'react'
import '~/sass/elements/chat.scss';
import {Groupchat} from './groupchat';
import {RoomsList} from './roomslist';
import converse from '~/lib/converse';
import {PrivateMessages} from './privatemessages';
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
  The <user@host> by which a user is identified outside the context of any existing session or resource; contrast with FullJID and OccupantJID.

FullJID
  The <user@host/resource> by which an online user is identified outside the context of a room; contrast with BareJID and OccupantJID.

OccupantJID
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
  A pre-defined pyramus-student-# or pyramus-staff-# user ide. This is the local part (user) in bareJID and fullJID and resource part (nick) in occupantJID variables.
*/

interface Iprops {
  chat?: any,
  onOpenChat?: any,
  showChatbox?: any,
  onOpenPrivateChat?: any
}

interface Istate {
  converse?: any,
  isConnectionOk?: boolean,
  showMaterial?: boolean,
  roomsList?: Object[],
  messages: Object[],
  availableMucRooms: any,
  chatBox: null,
  showChatButton: boolean,
  showControlBox: boolean,
  showNewRoomForm: boolean,
  isStudent?: Boolean,
  PyramusUserID?: string,
  openRoomNumber: number,
  openChats?: Object[],
  selectedUserPresence: string,
  privateChatData?: Object[],
}
declare global {
  interface Window {
    MUIKKU_IS_STUDENT:boolean,
    MUIKKU_LOGGED_USER: string
  }
}

export class Chat extends React.Component<Iprops, Istate> {

  constructor(props: any){
    super(props);

    this.state = {
      converse: null,
      isConnectionOk: false,
      showMaterial: false,
      roomsList: [],
      messages: [],
      availableMucRooms: [],
      chatBox:null,
      showChatButton: null,
      showControlBox: null,
      showNewRoomForm: false,
      isStudent: false,
      openRoomNumber:null,
      PyramusUserID: "",
      openChats: [],
      selectedUserPresence: "",
      privateChatData: [],
    }
    this.createAndJoinChatRoom = this.createAndJoinChatRoom.bind(this);
    this.toggleControlBox = this.toggleControlBox.bind(this);
    this.toggleCreateChatRoomForm = this.toggleCreateChatRoomForm.bind(this);
    this.onOpenChat = this.onOpenChat.bind(this);
    this.onOpenPrivateChat = this.onOpenPrivateChat.bind(this);
    this.getUserAvailability = this.getUserAvailability.bind(this);
    this.setUserAvailability = this.setUserAvailability.bind(this);
    this.getPyramusUserID = this.getPyramusUserID.bind(this);
    this.privateMessageNotification = this.privateMessageNotification.bind(this);
  }
  // Notification handler for Received Private Messages.
  // Sets privateChatData and openChats states based on received notification.
  // Private chat window opens when openChats state has correct BareJID stored in it.
  // PrivateChatData state requires necessary occupant data for the private chat.
  async privateMessageNotification (data: any) {
    const u = converse.env.utils;
    let type = data.stanza.getAttribute('type');
    const { Strophe } = converse.env;
    let from: any = data.stanza.getAttribute('from');
    let BareJID: any = Strophe.getBareJidFromJid(from);
    const is_me = BareJID === this.state.converse.bare_jid;

    if(type !== null && type !== 'groupchat' &&
      from !== null &&
      !u.isOnlyChatStateNotification(data.stanza) &&
      !u.isOnlyMessageDeliveryReceipt(data.stanza) &&
      !is_me){

      let newPrivateChatData: Object[] = this.state.privateChatData;

      let openChatsList = this.state.openChats;
      if (!openChatsList.includes(BareJID)) {
        let UserId: any = data.stanza.getAttribute('from').split('@');
        UserId = UserId[0];

        // Fetch message sender's chatSettings
        let chatSettings: any = (await promisify(mApi().chat.settings.read(UserId), 'callback')());

        // Setup sender's MuikkuNickName
        let MuikkuNickName: string = chatSettings.nick;

        // Fetch senders user details in case user has not set MuikkuNickName yet
        let MuikkuUser: any = (await promisify(mApi().user.users.basicinfo.read(chatSettings.userIdentifier,{}), 'callback')());

        // Check whether message sender has setup a nick name, if not we use hes/her real name
        if (MuikkuNickName == "" || MuikkuNickName == undefined) {
          MuikkuNickName = MuikkuUser.firstName + " " + MuikkuUser.lastName;
        }

        // Gather chatData so it can be used in onOpenPrivateChat method
        let occupant: any = { UserId: UserId, MuikkuNickName: MuikkuNickName, status: '', firstName: MuikkuUser.firstName, lastName: MuikkuUser.lastName, receivedMessageNotification: true};

        // Pushing BareJID to openChatsList and gathered chatData to newprivateChatData
        // Setting states of openChats and privateChatData from previously set values
        newPrivateChatData.push({ BareJID: BareJID, data: occupant});
        openChatsList.push(BareJID);
        this.setState({
          privateChatData: newPrivateChatData,
          openChats: openChatsList
        });
      }
    }
  }
  // Toggle Private Message Window
  async onOpenPrivateChat(occupant: any) {
    let openChatsList = this.state.openChats;
    let newPrivateChatData = this.state.privateChatData;

    // Checking if message receiver is the same user as logged in user
    // and if true we stop right here as you should not be able to send
    // private messages to yourself.
    if (occupant.UserId === window.MUIKKU_LOGGED_USER){
      return;
    } else if (occupant.UserId.startsWith("PYRAMUS-STAFF-") || window.MUIKKU_IS_STUDENT === false){
      let BareJID = occupant.UserId.toLowerCase() + "@dev.muikkuverkko.fi";

      // Lets check whether private chat window's BareJID exists in openChatsList
      // or not so we know do we close or open the chat window
      if (openChatsList.includes(BareJID)) {
        // Remove the BareJID of the chat window we are closing from openChatsList
        const filteredChats = openChatsList.filter(item => item !== BareJID);
        const filteredChatData = newPrivateChatData.filter((item: any) => item.BareJID !== BareJID);

        // Set filtered openChatsList as filteredChats to this.state.openChats
        this.setState({
          openChats: filteredChats,
          privateChatData: filteredChatData,
        })

        // Set current openChatList to sessionStorage
        window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));

      } else {
        // Lets push object to openChatList and set it to openChats state
        openChatsList.push(BareJID);
        newPrivateChatData.push({ BareJID: BareJID, data: occupant});

        this.setState({
          openChats: openChatsList,
          privateChatData: newPrivateChatData
        });
      }
    }
  }
  // Nickname, persistency, room name and room description for new chat room
  parseRoomDataFromEvent (form: HTMLFormElement) {
    let data = new FormData(form);
    let RoomJID = data.get('roomName').toString();
    let RoomPersistency = data.get('persistent');
    let RoomDesc = data.get('roomDesc');
    let RoomName = data.get('roomName');

    return {
      'RoomJID': RoomJID,
      'RoomPersistency': RoomPersistency,
      'RoomDesc': RoomDesc,
      'RoomName': RoomName
    }
  }
  // Creating new chat room
  // TODO: Need to check if RoomName is mempty and show error notification
  async createAndJoinChatRoom(event: any) {
    event.preventDefault();
    let data = this.parseRoomDataFromEvent(event.target);

    if (data.RoomJID.toString().startsWith("workspace-")){
      alert("Creation of workspace- prefixed chat room is forbidden");
      return;
    }

    const { Strophe, $pres, _ } = converse.env;

    // We need to trim and replace white spaces so new room will be created succefully
    let RoomJID = data.RoomJID.trim().replace(/\s+/g, '-') + '@conference.dev.muikkuverkko.fi';
    let OccupantJID = RoomJID + "/" + this.state.PyramusUserID;

    const stanza = $pres({
      'from': this.state.converse.connection.jid,
      'to': OccupantJID
    }).c("x", {'xmlns': Strophe.NS.MUC})
    .c("history", {'maxstanzas': this.state.converse.muc_history_max_stanzas}).up();

    this.state.converse.api.send(stanza);

    this.state.converse.api.user.status.set('online');

    this.state.converse.api.rooms.open(RoomJID, _.extend({
      'nick': this.state.PyramusUserID,
      'maximize': true,
      'auto_configure': true,
      'publicroom': true,
      'roomconfig': {
        'persistentroom': data.RoomPersistency ? true : false,
        'roomname': data.RoomName,
        'roomdesc': data.RoomDesc
      }
    }), true).then((chat: any) => {

      let newAvailableMucRoom =  {
        RoomName: data.RoomName,
        RoomJID: RoomJID,
        RoomDesc: data.RoomDesc,
        chatObject: chat
      };

      let availableMucRooms = this.state.availableMucRooms;

      availableMucRooms.push(newAvailableMucRoom);

      this.setState({
        availableMucRooms: availableMucRooms,
        chatBox: chat,
        showNewRoomForm: false
      });
    });
  }
  // Setting PyramusUserID state based on MUIKKU_LOGGED_USER
  async getPyramusUserID (){
    this.setState({
      PyramusUserID: window.MUIKKU_LOGGED_USER
    });
  }
  // Getting available chat rooms to be listed in the control box
  async getAvailableChatRooms (iq: any) {
    // Handle the IQ stanza returned from the server, containing all its public groupchats.
    let availableChatRooms = iq.querySelectorAll('query item');
    const { _ } = converse.env;

    if (availableChatRooms.length) {
      const nodesArray = [].slice.call(availableChatRooms);
      let RoomName;
      let RoomJID;
      let RoomDesc: any;
      let i;

      for (i = 0; i < nodesArray.length; i++) {
        RoomName = nodesArray[i].attributes.name.nodeValue;
        RoomJID = nodesArray[i].attributes.jid.value;

        const fields = await this.state.converse.api.disco.getFields(RoomJID);
        RoomDesc = _.get(fields.findWhere({'var': "muc#roominfo_description"}), 'attributes.value');

        let availableMucRoomsList = this.state.availableMucRooms;

        let addRoomToRoomsList = {
          RoomName: RoomName,
          RoomJID: RoomJID,
          RoomDesc: RoomDesc
        }

        availableMucRoomsList.push(addRoomToRoomsList);

        this.setState({
          availableMucRooms: availableMucRoomsList
        });
      }
      return;
    } else {

    }
    return true;
  }
  // Toggle states for Control Box window opening/closing
  toggleControlBox(){
    if (!this.state.showChatButton){
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
  toggleCreateChatRoomForm(){
    if (!this.state.showNewRoomForm){
      this.setState({
        showNewRoomForm: true
      });

    } else {
      this.setState({
        showNewRoomForm: false
      });
    }
  }
  //
  async onOpenChat (RoomJID: string) {
    let openChatsList = this.state.openChats;

    // Check whether current RoomJID is allready part of openChatList
    if (openChatsList.includes(RoomJID)){

      // Filter openChatList so we can remove RoomJID and close the Chat Room
      const filteredChats = openChatsList.filter(item => item !== RoomJID);

      // Set filtered and current openChatList to this.state.openChats
      this.setState({
        openChats: filteredChats
      });

      // Set the filtered openChatList to sessionStorage
      window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));

      // Fetch room object
      let chatRoom = await this.state.converse.api.rooms.get(RoomJID);

      // When chat room window is closed user will leave the room also.
      chatRoom.leave();
    } else {
      // Lets push RoomJid to openChatList and set it to this.state.openChats
      openChatsList.push(RoomJID);

      this.setState({
        openChats: openChatsList
      });

      if (RoomJID){
        // Fetch room object
        let chatRoom = await this.state.converse.api.rooms.get(RoomJID, {}, false);

        if (chatRoom) {
          // Join chat room
          chatRoom.join(this.state.PyramusUserID);
        }
      }
    }
  }
  getWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room:any) => room.RoomJID.startsWith("workspace-"));
  }
  getNotWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room: any) => !room.RoomJID.startsWith("workspace-"));
  }
  setUserAvailability (e:any){
    let newStatus = e.target.value;

    this.state.converse.api.user.status.set(newStatus);

    this.getUserAvailability();
  }
  getUserAvailability (){
    let userPresence = this.state.converse.api.user.status.get();

    this.setState({
      selectedUserPresence: userPresence
    });
  }
  componentDidMount() {
    var __this = this;

    converse.plugins.add("muikku-chat-ui", {

      initialize: function () {
        var _converse = this._converse;
        __this.setState({converse: _converse});

        __this.state.converse.on('connected', function () {
          __this.state.converse.api.listen.on('message',  __this.privateMessageNotification);

          __this.setState({
            isConnectionOk: true,
            showMaterial: true,
            isStudent: window.MUIKKU_IS_STUDENT
          });

          const { Strophe, $iq } = converse.env;
          let from = window.MUIKKU_LOGGED_USER;
          const iq: any = $iq({
            'to': 'conference.dev.muikkuverkko.fi',
            'from': from + "@dev.muikkuverkko.fi",
            'type': "get"
          }).c("query", {xmlns: Strophe.NS.DISCO_ITEMS});
          __this.state.converse.api.sendIQ(iq)
            .then((iq: any) => __this.getAvailableChatRooms(iq))
            .catch((iq: any) => console.log(iq));

          // Get showControlBox status from sessionStroage and set correcponding states
          // We either show the control box or chat bubble button, if sessionStorage does not
          // return value for the key then we have default state (chat bubble is visible then).
          let chatControlBoxStatus = window.sessionStorage.getItem("showControlBox");
          if (chatControlBoxStatus){
            if (chatControlBoxStatus === "opened"){
              __this.setState({
                showControlBox: true,
                showChatButton: false
                });
            } else {
              __this.setState({
                showControlBox: false,
                showChatButton: true
              });
            }
          } else {
            __this.setState({
              showControlBox: false,
              showChatButton: true
            });
          }

          // Fetch user presence status
          let userPresence = __this.state.converse.api.user.status.get();
          __this.setState({
            selectedUserPresence: userPresence
          });

          __this.getPyramusUserID();

        });
      },
    });

    // Lets get openChats from sessionStorage value and set it to coresponding state (openChats)
    // Includes both chat rooms and private chats
    let openChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("openChats"));

    if (openChatsFromSessionStorage) {
      this.setState({
        openChats: openChatsFromSessionStorage
      });
    }
  }
  render() {
    let userStatusClassName = this.state.selectedUserPresence === "online" ? "online" : this.state.selectedUserPresence === "offline" ? "offline" : "away";

    return  (
      <div className="chat">
        {/* Chat bubble */}
        {(this.state.showChatButton === true) && <div onClick={() => this.toggleControlBox()} className="chat__bubble">
          <span className="icon-chat"></span>
        </div>}

        {/* Chat controlbox */}
        { (this.state.showControlBox === true) && <div className="chat__panel chat__panel--controlbox">
          <div className="chat__panel-header chat__panel-header--controlbox">
            <span onClick={() => this.toggleCreateChatRoomForm()} className="chat__button chat__button--new-room icon-plus"></span>
            <span onClick={() => this.toggleControlBox()} className="chat__button chat__button--close icon-cross"></span>
          </div>

          { (this.state.showMaterial === true) && <div className="chat__panel-body chat__panel-body--controlbox">

            <select value={this.state.selectedUserPresence} onChange={this.setUserAvailability} className={`chat__controlbox-user-status chat__controlbox-user-status--${userStatusClassName}`}>
              <option value="online">Paikalla</option>
              <option value="away">Palaan pian</option>
            </select>

            <div className="chat__controlbox-rooms-heading">Kurssikohtaiset huoneet: </div>
            <div className="chat__controlbox-rooms-listing chat__controlbox-rooms-listing--workspace">
              {this.getWorkspaceMucRooms().length > 0 ?
                this.getWorkspaceMucRooms().map((chat: any, i: any) => <RoomsList modifier="workspace" onOpenChat={this.onOpenChat} key={i} chat={chat} orderNumber={i} converse={this.state.converse}/>)
              : <div className="chat__controlbox-room  chat__controlbox-room--empty">Ei huoneita</div>}
            </div>

            <div className="chat__controlbox-rooms-heading">Muut huoneet:</div>
            <div className="chat__controlbox-rooms-listing">
            {this.getNotWorkspaceMucRooms().length > 0 ?
              this.getNotWorkspaceMucRooms().map((chat: any, i: any) => <RoomsList onOpenChat={this.onOpenChat} key={i} chat={chat} orderNumber={i} converse={this.state.converse}/>)
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
                    <input className="chat__textfield" name="roomName" ref="roomName" type="text"></input>
                  </div>
                  <div className="chat__subpanel-row">
                    <label className="chat__label">Huoneen kuvaus:</label>
                    <textarea className="chat__memofield" name="roomDesc" ref="roomDesc"></textarea>
                  </div>
                  {(!this.state.isStudent) && <div className="chat__subpanel-row">
                    <label className="chat__label">Pysyvä huone:</label>
                    <input className="chat__checkbox" type="checkbox" name="persistent"></input>
                  </div>}
                  <input className="chat__submit chat__submit--new-room" type="submit" value="Lisää huone"></input>
                </form>
              </div>
            </div>}
          </div>}
        </div>}

        {/* Chatrooms */}
        <div className="chat__chatrooms-container">
          {this.state.availableMucRooms.map((chat: any, i: any) => this.state.openChats.includes(chat.RoomJID) ?
            <Groupchat key={i} onOpenPrivateChat={this.onOpenPrivateChat.bind(this)} onOpenChat={this.onOpenChat} PyramusUserID={this.state.PyramusUserID} chatObject={this.state.chatBox} chat={chat} orderNumber={i} converse={this.state.converse}/>
          : null)}

          {this.state.privateChatData.map((privateChatData: any, i: any) => this.state.openChats.includes(privateChatData.BareJID) ?
            <PrivateMessages key={i} onOpenPrivateChat={this.onOpenPrivateChat} privateChatData={privateChatData} converse={this.state.converse} />
          : null)}
        </div>
      </div>
    );
  }
}
