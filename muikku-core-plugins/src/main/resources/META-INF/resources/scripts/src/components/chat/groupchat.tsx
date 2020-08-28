  /*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import converse from '~/lib/converse';
import mApi, { MApiError } from '~/lib/mApi';
import promisify, { promisifyNewConstructor } from '~/util/promisify';
import {ChatMessage} from './chatMessage';

interface Iprops{
  chat?: any,
  converse?: any,
  orderNumber?: any,
  showChatbox?: any,
  chatObject?: any,
  onOpenChat?: any,
  onOpenPrivateChat?: any,
  removeMessage?: any,
  PyramusUserID?: any,
}

interface Istate {
  BareJID?: string,
  converse?: any,
  RoomJID?: string,
  RoomName?: string,
  RoomDesc: any,
  RoomConfig?: any,
  groupMessages?: Object[],
  availableMucRooms?: Object,
  chatBox?: any,
  openChatSettings?: Boolean,
  isStudent?: Boolean,
  PyramusUserID: string,
  isRoomConfigSavedSuccesfully: string,
  settingsInformBox:string,
  showRoomInfo: boolean,
  minimized: boolean,
  minimizedChats: Object[],
  chatRoomType: string,
  chatRoomOccupants: any,
  studentOccupants?: Object[],
  staffOccupants?: Object[],
  showOccupantsList?: boolean,
  occupantsListOpened?: Object[],
  RoomPersistency: boolean
}

declare global {
  interface Window {
    MUIKKU_IS_STUDENT:boolean,
    PROFILE_DATA: any,
    MUIKKU_LOGGED_USER: string
  }
}

export class Groupchat extends React.Component<Iprops, Istate> {

  private myRef: any;
  private messagesEnd: any;

  constructor(props: any){
    super(props);
    this.state = {
      BareJID: window.MUIKKU_LOGGED_USER + "@dev.muikkuverkko.fi".toLowerCase(),
      converse: this.props.converse,
      RoomJID: "",
      RoomName: "",
      RoomConfig: [],
      groupMessages: [],
      availableMucRooms: [],
      chatBox:null,
      openChatSettings: false,
      isStudent: false,
      PyramusUserID: "",
      isRoomConfigSavedSuccesfully: "",
      settingsInformBox: "settingsInform-none",
      showRoomInfo: false,
      minimized: false,
      minimizedChats: [],
      chatRoomType: "",
      chatRoomOccupants: [],
      studentOccupants: [],
      staffOccupants: [],
      showOccupantsList: false,
      occupantsListOpened: [],
      RoomDesc: "",
      RoomPersistency: false
    }
    this.myRef = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.openChatRoomSettings = this.openChatRoomSettings.bind(this);
    this.setChatRoomConfiguration = this.setChatRoomConfiguration.bind(this);
    this.sendChatRoomConfiguration = this.sendChatRoomConfiguration.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.toggleOccupantsList = this.toggleOccupantsList.bind(this);
    this.getOccupants = this.getOccupants.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleIncomingMessages = this.handleIncomingMessages.bind(this);
  }
  // Polling for incoming messages in active chat rooms
  async handleIncomingMessages( data: any ) {
    if(data.chatbox !== undefined) {
      if (data.chatbox.attributes.jid === this.state.RoomJID){
        if (data.chatbox.messages.models.length > 0) {
          this.getMUCMessages(data.chatbox.messages.models[data.chatbox.messages.models.length - 1]);
        }
      }
    }
  }
  // Open chat room window
  async openMucConversation(RoomJID: string){

    const { Strophe, _, $pres } = converse.env;

    // We fetch openChats JIDs from sessionStorage
    let openChatsList = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

    // If roomJID is not part of that list we update the openChatsList
    if (!openChatsList.includes(RoomJID)) {
      openChatsList.push(RoomJID);

      // We update sessionStorage only if roomJID is not stored already.
      window.sessionStorage.setItem("openChats", JSON.stringify(openChatsList));
    }

    this.setState({
      PyramusUserID: this.props.PyramusUserID
    });

    let __this = this;

    this.props.converse.api.rooms.open(RoomJID, _.extend(
      {
        'jid': RoomJID,
        'maximize': true,
        'auto_configure': true,
        'nick': __this.props.PyramusUserID,
        'publicroom': true,
      }), true).then(async(chat: any) => {
        __this.setState({
          chatBox: chat,
          groupMessages: [],
          chatRoomOccupants: chat.occupants,
          RoomPersistency: chat.features.attributes.persistent
        });
        chat.listenTo(chat.occupants, 'add', this.getOccupants);
        chat.listenTo(chat.occupants, 'destroy', this.getOccupants);
        chat.messages.models.map((stanza: any) => this.getMUCMessages(stanza));
      });
  }
  // Load chat room messages
  async getMUCMessages(stanza: any){

    if (stanza && stanza.attributes.type === "groupchat") {
      let message = stanza.attributes.message;
      // Message sender JID, can be OccupantJID or BareJID -> We parse this later
      let from = stanza.attributes.from;
      let senderClass = "";
      let user: any;
      let chatSettings: any;
      let messageId: any;
      let deleteId: any;
      let MuikkuNickName: any;
      let userName: any;
      let deletedTime: any;

      // Check if message has sender, if not then we skip it
      if (from) {

        // Try to split the sender's JID in case we get OccupantJID and
        // extract the resource part of it and pass it on.
        from = from.split("/").pop();

        // Check if the sender's JID is from PYRAMUS user (applies top both OccupantJID and BareJID)
        if (from.startsWith("PYRAMUS-")) {

          // Try to split the sender's JID in case we got BareJID so we can extract the local part of it.
          // In case of OcucpantJID we don't do anything as it has been extracted previously already.
          from = from.split("@");
          from = from[0];

          // Get user's MuikkuNickName
          chatSettings = (await promisify(mApi().chat.settings.read(from), 'callback')());
          MuikkuNickName = chatSettings.nick;

          // Check if user has MuikkuNickName, if not then we use real name
          if (MuikkuNickName == "" || MuikkuNickName == undefined) {
            user = (await promisify(mApi().user.users.basicinfo.read(from, {}), 'callback')());
            userName = user.firstName + " " + user.lastName;
            MuikkuNickName = userName;
          }

          // In case sender's JID is not from PYRAMUS user then we just use the given sender's JID
        } else {
          MuikkuNickName = from;
        }
      }

      if (message !== "") {
        messageId = stanza.attributes.id;
      } else {
        messageId = "null";
      }

      // Check if message was written by logged in user and set senderClass accordingly
      if (from === window.MUIKKU_LOGGED_USER) {
        senderClass = "sender-me";
      } else {
        senderClass = "sender-them";
      }

      // Check if message has timestamp, if not then it's newly
      // created message and we set current time in it.
      let timeStamp: any;
      if (stanza.attributes.time) {
        timeStamp = stanza.attributes.time;
      } else {
        timeStamp = new Date().toString();
      }

      let groupMessage: any = {
        from: MuikkuNickName,
        content: message,
        senderClass: senderClass,
        timeStamp: timeStamp,
        messageId: messageId,
        deleted: false,
        deletedTime: "",
        userIdentifier: from
      };

      if (message !== "") {
        let tempGroupMessages = new Array;

        if (this.state.groupMessages.length !== 0){
          tempGroupMessages = [...this.state.groupMessages];
        }

        if (!message.startsWith("messageID=")) {
          tempGroupMessages.push(groupMessage);
        } else {
          deleteId = message.split("=").pop();
          deletedTime = stanza.attributes.dateTime;
        }

        let i:any;
        for (i = 0; i < tempGroupMessages.length; i++) {
          let groupMessageId = tempGroupMessages[i].messageId;
          if (deleteId && groupMessageId === deleteId) {
            tempGroupMessages[i] = {...tempGroupMessages[i], deleted: true, deletedTime: deletedTime}
          }
        }

        tempGroupMessages.sort((a: any, b: any) => (a.timeStamp > b.timeStamp) ? 1 : -1)

        this.setState({
          groupMessages: tempGroupMessages
        }, this.scrollToBottom.bind(this, "smooth"));
          return;
      }
    } else {
        return;
    }
  }
  // Set chat room message as removed
  setMessageAsRemoved(data: any){
    let text = data;
    let chat = this.state.chatBox;

    let spoiler_hint = "undefined";

    const attrs = chat.getOutgoingMessageAttributes("messageID=" + text.messageId, spoiler_hint);

    let today = new Date();
    let date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    attrs.dateTime = dateTime;

    let message = chat.messages.findWhere('correcting')

    if (message) {
      message.save({
        'correcting': false,
        'edited': chat.moment().format(),
        'message': text,
        'references': text,
        'fullname': window.PROFILE_DATA.displayName,
        'dateTime': dateTime
      });
    } else {
      message = chat.messages.create(attrs);
    }

    this.props.converse.api.send(chat.createMessageStanza(message));
    this.getMUCMessages(message);
  }
  // Send message to the chat room
  sendMessage(event: any){
    event.preventDefault();

    let text = event.target.chatMessage.value;
    let chat = this.state.chatBox;

    var spoiler_hint = "undefined";

    const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

    attrs.fullname = window.PROFILE_DATA.displayName;
    attrs.identifier = window.MUIKKU_LOGGED_USER;
    attrs.from = this.state.BareJID;
    attrs.to = this.state.RoomJID;
    attrs.nick = chat.attributes.nick || window.PROFILE_DATA.displayName;

    let message = chat.messages.findWhere('correcting');

    if (message) {
      message.save({
        'correcting': false,
        'edited': chat.moment().format(),
        'message': text,
        'references': text,
        'fullname': window.PROFILE_DATA.displayName
      });
    } else {
      message = chat.messages.create(attrs);
    }
    event.target.chatMessage.value = '';

    if (text !== null || text !== ""){
      this.props.converse.api.send(chat.createMessageStanza(message));
    }
    this.scrollToBottom.bind(this, "smooth");
  }
  // Open chat room settings
  openChatRoomSettings(){
    if (this.state.openChatSettings === false && window.MUIKKU_IS_STUDENT === false) {
      this.setState({
        openChatSettings: true,
        settingsInformBox: "settingsInform-none",
        isRoomConfigSavedSuccesfully: ""
      });
    } else {
      this.setState({
        openChatSettings: false
      });
    }
  }
  // Set chat room configurations
  setChatRoomConfiguration(event: any){
    event.preventDefault();

    let RoomName = event.target.newRoomName.value;
    let RoomDesc = event.target.newRoomDescription.value;
    let RoomPersistency = event.target.persistent;

    if (RoomPersistency && RoomPersistency.checked === true) {
      RoomPersistency = 1;
    } else {
      RoomPersistency = 0;
    }

    this.setState({
      RoomConfig: {
        jid: this.state.RoomJID,
        roomname: RoomName,
        roomdesc: RoomDesc,
        persistentroom: RoomPersistency,
      }
    });

    const { $build, _ } = converse.env;

    this.getChatRoomConfiguration().then((stanza: any) => {

      const newRoomConfig: any = [],
      fields = stanza.querySelectorAll('field'),
      RoomConfig = this.state.RoomConfig;

      // Go through chat room configuration fields and update when necessary
      _.each(fields, (field: any) => {
        const fieldname = field.getAttribute('var').replace('muc#roomconfig_', ''),
        type = field.getAttribute('type');
        let value;

        // Check if fieldname is part of RoomConfig in hand
        if (fieldname in RoomConfig) {
          switch (type) {
            case 'boolean':
              value = RoomConfig[fieldname] ? 1 : 0;
              break;
            case 'list-multi':
              // TODO: we don't yet handle "list-multi" types
              value = field.innerHTML;
              break;

            default:
              value = RoomConfig[fieldname];
          }
          field.innerHTML = $build('value').t(value);
        }
        // Set updated field values and pass them to sendChatRoomConfiguration()
        newRoomConfig.push(field);
        this.sendChatRoomConfiguration(newRoomConfig);

        // Update necessary chat room states
        this.setState({
          RoomName: RoomName,
          RoomDesc: RoomDesc,
          RoomPersistency: RoomPersistency,
        });

        return;
      });
    }).catch(console.log);
  }
  // Send an IQ stanza with the groupchat configuration.
  sendChatRoomConfiguration(RoomConfig: any=[]){
    const { Strophe, $iq} = converse.env;
    const iq = $iq({ to: this.state.RoomJID, type: "set"})
    .c("query", {xmlns: Strophe.NS.MUC_OWNER})
    .c("x", {xmlns: Strophe.NS.XFORM, type: "submit"});

    RoomConfig.forEach((node: any) => iq.cnode(node).up());

    return this.props.converse.api.sendIQ(iq).then(() =>
      this.setState({
        isRoomConfigSavedSuccesfully: "Tallennettu onnistuneesti!",
        settingsInformBox: "chat-notification chat-notification--success"
      })
    ).catch(() =>
      this.setState({
        isRoomConfigSavedSuccesfully: "Tallennettu onnistuneesti!",
        settingsInformBox: "chat-notification chat-notification--failed"
      })
    );
  }
  // Send an IQ stanza to fetch the groupchat configuration data.
  // Returns a promise which resolves once the response IQ
  // has been received.
  getChatRoomConfiguration(){
    const { Strophe, $iq } = converse.env;

    return this.props.converse.api.sendIQ(
      $iq({ 'to': this.state.RoomJID, 'type': "get"})
      .c("query", {xmlns: Strophe.NS.MUC_OWNER})
    );
  }
  // Chat room window minimizing toggle
  toggleMinimizeChats(RoomJID: string){
    let minimizedRoomList = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

    // Check if chat room window is not mimimized and then mimimized it
    if (this.state.minimized === false) {
      this.setState({
        minimized: true
      });

      // Update minimizedChats state and corresponding sessionStorage key
      if (!minimizedRoomList.includes(RoomJID)) {
        minimizedRoomList.push(RoomJID);
        this.setState({
          minimizedChats: minimizedRoomList
        });
        window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
      }
      // If chat room window is mimimized then open it
    } else {
      this.setState({
        minimized: false
      });

      // Update minimizedChats state and corresponding sessionStorage key
      if (minimizedRoomList.includes(RoomJID)) {
        const filteredRooms = minimizedRoomList.filter((item: any) => item !== RoomJID);
        this.setState({
          minimizedChats: filteredRooms
        });
        window.sessionStorage.setItem("minimizedChats", JSON.stringify(filteredRooms));
      }
      // Trigger openMucConversation() to load chat room messages
      this.openMucConversation(RoomJID);
    }
  }
  async toggleOccupantsList(){
    let room = await this.props.converse.api.rooms.get(this.state.RoomJID);

    let roomsWithOpenOccupantsList = this.state.occupantsListOpened;

    if (this.state.showOccupantsList === true) {

      const filteredRooms = roomsWithOpenOccupantsList.filter((item: any) => item !== room.attributes.jid);
      this.setState({
        showOccupantsList: false,
        occupantsListOpened: filteredRooms,
      });

      let result = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

      const filteredChats = result.filter(function(item: any) {
        return item !== room.attributes.jid;
      });

      window.sessionStorage.setItem("showOccupantsList", JSON.stringify(filteredChats));

    } else if (!roomsWithOpenOccupantsList.includes(room.attributes.jid)) {

      roomsWithOpenOccupantsList.push(room.attributes.jid);

      this.setState({
        occupantsListOpened: roomsWithOpenOccupantsList,
        showOccupantsList: true
      });
      this.getOccupants();
      window.sessionStorage.setItem("showOccupantsList", JSON.stringify(roomsWithOpenOccupantsList));
    }
  }
  async getOccupants(){
    let room = await this.props.converse.api.rooms.get(this.state.RoomJID);

    if (room.occupants.models.length > 0) {
      let MuikkuUser: any;
      let occupantData: any;
      let chatSettings: any;
      let tempStudentOccupants = new Array;
      let tempStaffOccupants = new Array;
      for (let item of room.occupants.models) {
        if (typeof item.attributes.from !== "undefined"){
          if(typeof item.attributes.nick !== 'undefined'){
            if (item.attributes.nick.startsWith("PYRAMUS-STAFF-") || item.attributes.nick.startsWith("PYRAMUS-STUDENT-")) {
              chatSettings = (await promisify(mApi().chat.settings.read(item.attributes.nick), 'callback')());
              MuikkuUser = (await promisify(mApi().user.users.basicinfo.read(item.attributes.nick,{}), 'callback')());
              let MuikkuNickName: string = chatSettings.nick;
              if (MuikkuNickName === ""){
                MuikkuNickName = MuikkuUser.firstName + " " + MuikkuUser.lastName;
              }
              occupantData = { UserId: item.attributes.nick, MuikkuNickName: MuikkuNickName, firstName: MuikkuUser.firstName, lastName: MuikkuUser.lastName, status: item.attributes.show};
            } else {
              MuikkuUser = item.attributes.nick;
              let MuikkuNickName = item.attributes.nick;
              occupantData = { UserId: item.attributes.nick, MuikkuNickName: MuikkuNickName, firstName: "", lastName: "", status: item.attributes.show};
            }
          }

          if(typeof item.attributes.nick !== 'undefined'){
            if(item.attributes.nick.startsWith("PYRAMUS-STAFF-")){
              let isExists = tempStaffOccupants.some(function(curr :any) {
                if (curr.UserId === occupantData.UserId) {
                    return true;
                }
              });
              if (isExists !== true) {
                tempStaffOccupants.push(occupantData);
              }
            } else{
              let isExists = tempStudentOccupants.some(function(curr :any) {
                if (curr.UserId === occupantData.UserId) {
                    return true;
                }
              });
              if (isExists !== true) {
                tempStudentOccupants.push(occupantData);
              }
            }
          }
        }
      }
      this.setState({
        studentOccupants: tempStudentOccupants,
        staffOccupants: tempStaffOccupants
      });
    } else {
      return;
    }
  }
  // Scroll selected view to the bottom
  scrollToBottom(method: string = "smooth") {
    if (this.messagesEnd){
      this.messagesEnd.scrollIntoView({ behavior: method });
    }
  }
  onEnterPress(e: any) {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      return false;
    }
  }
  // Check which chat room type
  isWorkspaceChatRoom(RoomJID: any){
    if (RoomJID.startsWith("workspace-")){
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
  componentDidMount(){
    if (this.props.chat) {
      this.setState({
        RoomName: this.props.chat.RoomName,
        RoomJID: this.props.chat.RoomJID,
        isStudent: window.MUIKKU_IS_STUDENT,
        RoomDesc: this.props.chat.RoomDesc
      });

      var roomOccupantsFromSessionStorage = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

      if (roomOccupantsFromSessionStorage) {
        roomOccupantsFromSessionStorage.map((item: any) => {
          if (item === this.props.chat.RoomJID){
            this.setState({
              showOccupantsList: true
            });
          }
        })
      }

      this.isWorkspaceChatRoom(this.props.chat.RoomJID);
      this.props.converse.api.waitUntil('roomsAutoJoined').then(async() => {
        this.openMucConversation(this.props.chat.RoomJID);
        this.state.converse.api.listen.on('onChatReconnected', (chatbox:any) => { this.getMUCMessages(chatbox) });
        let room = await this.props.converse.api.rooms.get(this.state.RoomJID);

        if(room){
          room.listenTo(room.occupants, 'add', this.getOccupants);
          room.listenTo(room.occupants, 'destroy', this.getOccupants);
        }
        this.scrollToBottom.bind(this, "auto");
      });
    }

    // Lets get minimizedChats sessionStorage value and set it to coresponding state (minimizedChats)
    let minimizedChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

    // Lets get showOccupantsList sessionStorage value and set it to coresponding state
    let showOccupantsFromSessionStorage = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || []

    if (showOccupantsFromSessionStorage) {
      this.setState({
        occupantsListOpened: showOccupantsFromSessionStorage,
      });
    }

    if (minimizedChatsFromSessionStorage) {
      this.setState({
        minimizedChats: minimizedChatsFromSessionStorage,
      });

      minimizedChatsFromSessionStorage.map((item: any) => {
        if (item === this.props.chat.RoomJID) {
          this.setState({
            minimized: true,
          });
        }
      })
    }

    this.props.converse.api.listen.on('message', this.handleIncomingMessages);
    this.props.converse.api.listen.on('membersFetched', this.getOccupants );
  }
  render(){
    let chatRoomTypeClassName = this.state.chatRoomType === "workspace" ? "workspace" : "other";
    let messages = this.state.groupMessages;
    return  (
      <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>

        {this.state.minimized === true ? (
          <div className={`chat__minimized chat__minimized--${chatRoomTypeClassName}`}>
            <div onClick={() => this.toggleMinimizeChats(this.state.RoomJID)} className="chat__minimized-title">{this.state.RoomName}</div>
            <div onClick={() => this.props.onOpenChat(this.state.RoomJID)} className="chat__button chat__button--close icon-cross"></div>
          </div>
        ) : (
          <div className={`chat__panel chat__panel--${chatRoomTypeClassName}`}>
            <div className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}>
              <div className="chat__panel-header-title">{this.state.RoomName}</div>
              <div onClick={() => this.toggleOccupantsList()} className="chat__button chat__button--occupants icon-users"></div>
              <div onClick={() => this.toggleMinimizeChats(this.state.RoomJID)} className="chat__button chat__button--minimize icon-minus"></div>
              {(!this.state.isStudent) && <div onClick={() => this.openChatRoomSettings()} className="chat__button chat__button--room-settings icon-cogs"></div>}
                <div onClick={() => this.props.onOpenChat(this.state.RoomJID)} className="chat__button chat__button--close icon-cross"></div>
            </div>

            {(this.state.openChatSettings === true) && <div className="chat__subpanel">
              <div className={`chat__subpanel-header chat__subpanel-header--room-settings-${chatRoomTypeClassName}`}>
                <div className="chat__subpanel-title">Huoneen asetukset</div>
                <div onClick={() => this.openChatRoomSettings()} className="chat__button chat__button--close icon-cross"></div>
              </div>
              <div className="chat__subpanel-body">
                  <form onSubmit={this.setChatRoomConfiguration}>
                  <div className="chat__subpanel-row">
                    <label className="chat__label">Huoneen nimi: </label>
                    <input className="chat__textfield" name="newRoomName" defaultValue={this.state.RoomName} type="text"></input>
                  </div>
                  <div className="chat__subpanel-row">
                    <label className="chat__label">Huoneen kuvaus: </label>
                    <textarea className="chat__memofield" name="newRoomDescription" defaultValue={this.state.RoomDesc}></textarea>
                  </div>
                  {(!this.state.isStudent) && <div className="chat__subpanel-row">
                    <label className="chat__label">Pysyvä huone: </label>
                      <input className="chat__checkbox" defaultChecked={this.state.RoomPersistency} type="checkbox" name="persistent"></input>
                  </div>}
                  <input className={`chat__submit chat__submit--room-settings-${chatRoomTypeClassName}`} type="submit" value="Tallenna"></input>
                </form>
              </div>

              <div className={this.state.settingsInformBox}>
                <p>{this.state.isRoomConfigSavedSuccesfully}</p>
              </div>
            </div>}

            <div className="chat__panel-body chat__panel-body--chatroom">
              <div className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`} ref={ (ref) => this.myRef=ref }>
                  {this.state.groupMessages.map((groupMessage: any, i: any) => <ChatMessage key={i} setMessageAsRemoved={this.setMessageAsRemoved.bind(this)}
                  groupMessage={groupMessage} />)}
                <div className="chat__messages-last-message" ref={(el) => { this.messagesEnd = el; }}></div>
              </div>
              {this.state.showOccupantsList && <div className="chat__occupants-container">
                <div className="chat__occupants-staff">
                  {this.state.staffOccupants.length > 0 ? "Henkilökunta" : ""}
                  {this.state.staffOccupants.map((staffOccupant: any, i: any) =>
                  <div className="chat__occupants-item" onClick={() => this.props.onOpenPrivateChat(staffOccupant)} key={i}>
                    <span className={"chat__online-indicator chat__occupant-"+staffOccupant.status}></span>{staffOccupant.MuikkuNickName}</div>)}
                </div>
                <div className="chat__occupants-student">
                  {this.state.studentOccupants.length > 0 ? "Oppilaat" : ""}
                  {this.state.studentOccupants.map((studentOccupant: any, i: any) =>
                  <div className="chat__occupants-item" onClick={() => this.props.onOpenPrivateChat(studentOccupant)} key={i}>
                      <span className={"chat__online-indicator chat__occupant-" + studentOccupant.status}></span>{studentOccupant.MuikkuNickName}</div>)}
                </div>
              </div>}
            </div>
            <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={(e)=>this.sendMessage(e)}>
                <input name="chatRecipient" className="chat__muc-recipient" value={this.state.RoomJID} readOnly/>
              <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder="Kirjoita viesti tähän..." name="chatMessage"></textarea>
              <button className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`} type="submit" value=""><span className="icon-arrow-right"></span></button>
            </form>
          </div>)
        }
      </div>
    );
  }
}
