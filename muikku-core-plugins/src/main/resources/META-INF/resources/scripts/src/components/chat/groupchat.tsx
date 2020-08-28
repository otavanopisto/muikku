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
  nick?: any,
}

interface Istate {
  jid?: string,
  converse?: any,
  RoomJID?: string,
  RoomName?: string,
  RoomDesc: any,
  roomConfig?: any,
  messages?: Object,
  groupMessages?: Object[],
  availableMucRooms?: Object,
  chatBox?: any,
  chat?: any,
  showChatbox?: Boolean,
  openChatSettings?: Boolean,
  isStudent?: Boolean,
  openRoomNumber: number,
  nick: string,
  isRoomConfigSavedSuccesfully: string,
  settingsInformBox:string,
  showRoomInfo: boolean,
  roomAlign: string,
  minimized: boolean,
  minimizedChats: Object[],
  chatRoomType: string,
  showName: boolean,
  chatRoomOccupants: any,
  studentOccupants?: Object[],
  staffOccupants?: Object[],
  showOccupantsList?: boolean,
  occupantsListOpened?: Object[],
  isPersistentRoom: boolean
}

declare namespace JSX {
  interface ElementClass {
    render: any,
    converse: any;
  }
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
  private messageFormRef: any;

  constructor(props: any){
    super(props);
    this.state = {
      jid: window.MUIKKU_LOGGED_USER + "@dev.muikkuverkko.fi".toLowerCase(),
      converse: this.props.converse,
      RoomJID: "",
      RoomName: "",
      roomConfig: [],
      messages: [],
      groupMessages: [],
      availableMucRooms: [],
      chatBox:null,
      chat: null,
      showChatbox: null,
      openChatSettings: false,
      isStudent: false,
      openRoomNumber: null,
      nick: "",
      isRoomConfigSavedSuccesfully: "",
      settingsInformBox: "settingsInform-none",
      showRoomInfo: false,
      roomAlign: "",
      minimized: false,
      minimizedChats: [],
      chatRoomType: "",
      showName: false,
      chatRoomOccupants: [],
      studentOccupants: [],
      staffOccupants: [],
      showOccupantsList: false,
      occupantsListOpened: [],
      RoomDesc: "",
      isPersistentRoom: false
    }
    this.myRef = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.openChatSettings = this.openChatSettings.bind(this);
    this.saveRoomFeatures = this.saveRoomFeatures.bind(this);
    this.sendConfiguration = this.sendConfiguration.bind(this);
    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
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
  async openMucConversation(RoomJID: string){
    let data = {
      jid: RoomJID,
      nick: this.props.nick
    };

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    // We fetch openChats JIDs from sessionStorage
    let openChatsList = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

    // If roomJID is not part of that list we update the openChatsList
    if (!openChatsList.includes(RoomJID)) {
      openChatsList.push(RoomJID);

      // We update sessionStorage only if roomJID is not stored already.
      window.sessionStorage.setItem("openChats", JSON.stringify(openChatsList));
    }

    let nick: string = this.props.nick;
    //nick = this.props.nick;
    if (!nick) {
      throw new TypeError('join: You need to provide a valid nickname');
    }
    this.setState({
      nick: this.props.nick
    });

    let jid = Strophe.getBareJidFromJid(data.jid);
    let roomJidAndNick = jid + (nick !== null ? "/" + nick : "");

    const stanza = $pres({
      'from': this.props.converse.connection.jid,
      'to': roomJidAndNick
    }).c("x", {'xmlns': Strophe.NS.MUC})
    .c("history", {'maxstanzas': this.props.converse.muc_history_max_stanzas}).up();

    // TODO: Password protected rooms
    /* if (password) {
    stanza.cnode(Strophe.xmlElement("password", [], password));
    } */
    //this.save('connection_status', converse.ROOMSTATUS.CONNECTING);
    //this.state.converse.api.send(stanza);

    if (data.nick === "") {
      // Make sure defaults apply if no nick is provided.
      data.nick = this.props.nick;
    }

    jid = data.jid;
    let __ = this;

   this.props.converse.api.rooms.open(jid, _.extend(data,
      {
        'jid':jid,
        'maximize': true,
        'auto_configure': true,
        'nick': __.props.nick,
        'publicroom': true,
      }), true).then(async(chat: any) => {
        __.setState({
          chatBox: chat,
          groupMessages: [],
          chatRoomOccupants: chat.occupants,
          isPersistentRoom: chat.features.attributes.persistent
        });
       	let parsedJid = chat.attributes.jid.split("@");
		    let affiliationlist = (await promisify(mApi().chat.affiliations.read({roomName: parsedJid}), 'callback')());
        chat.listenTo(chat.occupants, 'add', this.getOccupants);
        chat.listenTo(chat.occupants, 'destroy', this.getOccupants);
        chat.messages.models.map((msg: any) => this.getMUCMessages(msg));

      })
  }
  async getMUCMessages(stanza: any){

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    if (stanza && stanza.attributes.type === "groupchat") {
      let message = stanza.attributes.message;
      let from = stanza.attributes.from;
      let senderClass ="";
      let user:any;
      let chatSettings: any;
      let messageId: any;
      let deleteId: any;
      let nick: any;
      let userName: any;
      let deletedTime: any;

      if (from){
        from = from.split("/").pop();

        if (from.startsWith("PYRAMUS-STAFF-") || from.startsWith("PYRAMUS-STUDENT-")) {
          from = from.split("@");
          from = from[0];
          chatSettings = (await promisify(mApi().chat.settings.read(from), 'callback')());
          nick = chatSettings.nick;

          if (nick == "" || nick == undefined) {
            user = (await promisify(mApi().user.users.basicinfo.read(from,{}), 'callback')());
            userName = user.firstName + " " + user.lastName;
            nick = userName;
          }
        } else {
          nick = from;
        }
      }


      if (message !== "") {
        messageId = stanza.attributes.id;
      } else {
        messageId = "null";
      }

      let myNick: string = "";
      if(!chatSettings){
        chatSettings = (await promisify(mApi().chat.settings.read(window.MUIKKU_LOGGED_USER), 'callback')());
      }

      myNick = chatSettings.nick;

      if (from === window.MUIKKU_LOGGED_USER || from === myNick) {
        senderClass = "sender-me";
      } else {
        senderClass = "sender-them";
      }

      let stamp = null;

      if (stanza.attributes.time) {
        stamp = stanza.attributes.time;
      } else {
        stamp = new Date().toString();
      }

      let groupMessage: any = {from: nick, alt: userName, content: message, senderClass: senderClass,

      timeStamp: stamp, messageId: messageId, deleted: false, deletedTime: "", userIdentifier: from};

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
  removeMessage(data: any){
    let text = data;
    let chat = this.state.chatBox;

    var spoiler_hint = "undefined";

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
  sendMessage(event: any){
    event.preventDefault();

    let text = event.target.chatMessage.value;
    let chat = this.state.chatBox;

    var spoiler_hint = "undefined";

    const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

    attrs.fullname = window.PROFILE_DATA.displayName;
    attrs.identifier = window.MUIKKU_LOGGED_USER;
    attrs.from = this.state.jid;
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
  //--- SETTINGS & INFOS
  openChatSettings(){
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
  toggleRoomInfo(){
    if (this.state.showRoomInfo === false){
      this.setState({
        showRoomInfo: true
      });
    } else {
      this.setState({
        showRoomInfo: false
      });
    }
  }
  saveRoomFeatures(event: any){
    event.preventDefault();

    let roomName = event.target.newRoomName.value;
    let roomDesc = event.target.newRoomDescription.value;
    let persistentRoom = event.target.persistent;

    if (persistentRoom && persistentRoom.checked === true) {
      persistentRoom = 1;
    } else {
      persistentRoom = 0;
    }

    this.setState({
      roomConfig: {
        jid: this.state.RoomJID,
        FORM_TYPE: "hidden",
        roomname: roomName,
        roomdesc: roomDesc,
        changesubject: 0,
        maxusers: 30,
        presencebroadcast: "participant",
        publicroom: 1,
        persistentroom: persistentRoom,
        moderatedroom: 1,
        membersonly: 0,
        allowinvites: 1,
        passwordprotectedroom: 0,
        roomsecret: "",
        whois: "anyone",
        allowpm: "anyone",
        enablelogging: 1,
        reservednick: 0,
        changenick: 0,
        registration: 0
      }
    });

    const { $build, _ } = converse.env;

    this.fetchRoomConfiguration().then((stanza: any) => {

      const configArray: any = [],
      fields = stanza.querySelectorAll('field'),
      config = this.state.roomConfig;

      let count = fields.length;
      _.each(fields, (field: any) => {
        const fieldname = field.getAttribute('var').replace('muc#roomconfig_', ''),
        type = field.getAttribute('type');
        let value;

        if (fieldname in config) {
          switch (type) {
            case 'boolean':
              value = config[fieldname] ? 1 : 0;
              break;
            case 'list-multi':
              // TODO: we don't yet handle "list-multi" types
              value = field.innerHTML;
              break;

            default:
              value = config[fieldname];
          }
          field.innerHTML = $build('value').t(value);
        }
        configArray.push(field);

        this.sendConfiguration(configArray);

        this.setState({
          RoomName: roomName,
          RoomDesc: roomDesc
        });

        return;
      });
    }).catch(console.log);
  }

  /* *
  * Send an IQ stanza with the groupchat configuration.
  * @private
  * @method _converse.ChatRoom#sendConfiguration
  * @param { Array } config - The groupchat configuration
  * @param { Function } callback - Callback upon succesful IQ response
  *      The first parameter passed in is IQ containing the
  *      groupchat configuration.
  *      The second is the response IQ from the server.
  * @param { Function } errback - Callback upon error IQ response
  *      The first parameter passed in is IQ containing the
  *      groupchat configuration.
  *      The second is the response IQ from the server.
  */
  sendConfiguration(config: any=[]){

    const { Strophe, $iq} = converse.env;

    const iq = $iq({ to: this.state.RoomJID, type: "set"})
    .c("query", {xmlns: Strophe.NS.MUC_OWNER})
    .c("x", {xmlns: Strophe.NS.XFORM, type: "submit"});

    config.forEach((node: any) => iq.cnode(node).up());

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
  fetchRoomConfiguration(){
    /* Send an IQ stanza to fetch the groupchat configuration data.
    * Returns a promise which resolves once the response IQ
    * has been received.
    */
    const { Strophe, $iq } = converse.env;

    return this.props.converse.api.sendIQ(
      $iq({ 'to': this.state.RoomJID, 'type': "get"})
      .c("query", {xmlns: Strophe.NS.MUC_OWNER})
    );
  }
  toggleMinimizeChats(roomJid: string){
    let minimizedRoomList = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

    if (this.state.minimized === false) {
      this.setState({
        minimized: true
      });

      if (!minimizedRoomList.includes(roomJid)) {

        minimizedRoomList.push(roomJid);

        this.setState({
          minimizedChats: minimizedRoomList
        });

        window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
      }
    } else {

      this.setState({
        minimized: false
      });

      if (minimizedRoomList.includes(roomJid)) {

        const filteredRooms = minimizedRoomList.filter((item: any) => item !== roomJid);

        this.setState({
          minimizedChats: filteredRooms
        });

        window.sessionStorage.setItem("minimizedChats", JSON.stringify(filteredRooms));
      }
      this.openMucConversation(roomJid);
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
              {(!this.state.isStudent) && <div onClick={() => this.openChatSettings()} className="chat__button chat__button--room-settings icon-cogs"></div>}
                <div onClick={() => this.props.onOpenChat(this.state.RoomJID)} className="chat__button chat__button--close icon-cross"></div>
            </div>

            {(this.state.openChatSettings === true) && <div className="chat__subpanel">
              <div className={`chat__subpanel-header chat__subpanel-header--room-settings-${chatRoomTypeClassName}`}>
                <div className="chat__subpanel-title">Huoneen asetukset</div>
                <div onClick={() => this.openChatSettings()} className="chat__button chat__button--close icon-cross"></div>
              </div>
              <div className="chat__subpanel-body">
                <form onSubmit={this.saveRoomFeatures}>
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
                    <input className="chat__checkbox" defaultChecked={this.state.isPersistentRoom} type="checkbox" name="persistent"></input>
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
                {this.state.groupMessages.map((groupMessage: any, i: any) => <ChatMessage key={i} removeMessage={this.removeMessage.bind(this)}
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
