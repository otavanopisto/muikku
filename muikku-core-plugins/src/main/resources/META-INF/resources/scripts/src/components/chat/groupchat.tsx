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
  nick?: any,
  privateChats?: any,
  onOpenPrivateChat?: any,
  removeMessage?: any
}

interface Istate {
  jid?: string,
  converse?: any,
  roomJid?: string,
  roomName?: string,
  roomConfig?: any,
  messages?: Object,
  groupMessages?: any,
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
  minimizedRooms: Object[],
  chatRoomType: string,
  showName: boolean,
  chatRoomOccupants: any,
  occupants?: any,
  showOccupantsList?: boolean,
  occupantsListOpened?: Object[],
  privateChats?: any,
  roomDesc: any
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
      roomJid: "",
      roomName: "",
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
      minimizedRooms: [],
      chatRoomType: "",
      showName: false,
      chatRoomOccupants: [],
      occupants: [],
      showOccupantsList: false,
      occupantsListOpened: [],
      privateChats: [],
      roomDesc: ""
    }
    this.myRef = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.openChatSettings = this.openChatSettings.bind(this);
    this.saveRoomFeatures = this.saveRoomFeatures.bind(this);
    this.sendConfiguration = this.sendConfiguration.bind(this);
    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
    this.minimizeChats = this.minimizeChats.bind(this);
    this.toggleOccupantsList = this.toggleOccupantsList.bind(this);
    this.getOccupants = this.getOccupants.bind(this);
  }
  openMucConversation(room: string){
    let data = {
      jid: room,
      nick: this.props.nick
    };

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    var reactComponent = this;

    let list = [];

    let result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

    if (!result.includes(room)) {
      result.push(room);
    }

    reactComponent.setState({
      nick: this.props.nick
    });

    window.sessionStorage.setItem("openChats", JSON.stringify(result));

    let nick: string;
    nick = this.props.nick;

    if (!nick) {
      throw new TypeError('join: You need to provide a valid nickname');
    }

    let jid = Strophe.getBareJidFromJid(data.jid);
    let roomJidAndNick = jid + (nick !== null ? `/${nick}` : "");

    const stanza = $pres({
      'from': reactComponent.state.converse.connection.jid,
      'to': roomJidAndNick
    }).c("x", {'xmlns': Strophe.NS.MUC})
    .c("history", {'maxstanzas': reactComponent.state.converse.muc_history_max_stanzas}).up();

    // TODO: Password protected rooms
    /* if (password) {
    stanza.cnode(Strophe.xmlElement("password", [], password));
    } */
    //this.save('connection_status', converse.ROOMSTATUS.CONNECTING);
    //reactComponent.state.converse.api.send(stanza);

    if (data.nick === "") {
      // Make sure defaults apply if no nick is provided.
      data.nick = reactComponent.state.nick;
    }

    jid = data.jid;

    reactComponent.state.converse.api.rooms.open(jid, _.extend(data,
      {
        'jid':jid,
        'maximize': true,
        'auto_configure': true,
        'nick': reactComponent.state.nick,
        'publicroom': true,
      }), false).then((chat: any) => {
        reactComponent.setState({
          chatBox: chat,
          groupMessages: [],
          chatRoomOccupants: chat.occupants
        });

        chat.messages.models.map((msg: any) => reactComponent.getMUCMessages(msg));
        //chat.addHandler('message', 'groupMessages', reactComponent.getMUCMessages.bind(reactComponent) );
      });

    }
    //------- HANDLING INCOMING GROUPCHAT MESSAGES
    async getMUCMessages(stanza: any){

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

      if (stanza && stanza.attributes.type === "groupchat") {
        let message = stanza.attributes.message;
        let from = stanza.attributes.identifier || stanza.attributes.from;
        from = from.split("/").pop();
        from.toUpperCase();
        let senderClass ="";
        let user:any;
        let nickname: any;
        let messageId: any;
        let deleteId: any;
        let nick: any;
        let userName: any;

        if (from.startsWith("PYRAMUS-STAFF-") || from.startsWith("PYRAMUS-STUDENT-")) {
          user = (await promisify(mApi().user.users.basicinfo.read(from,{}), 'callback')());
          nickname = (await promisify(mApi().chat.settings.read(from), 'callback')());
          userName = user.firstName + " " + user.lastName;
          nick = nickname.nick;
        } else {
          userName = from;
          nick = from;
        }

        if (message !== "") {
          messageId = stanza.attributes.id;
        } else {
          messageId = "null";
        }

        if (stanza.attributes.sender === "me") {
          senderClass = "sender-me";
        } else {
          senderClass = "sender-them";
        }

        var stamp = null;
//        var list = stanza.childNodes;
//
//        for(var node of list) {
//            if (node.nodeName == 'delay') {
//                stamp = node.attributes.stamp.nodeValue
//              } else {
//                stamp = new Date().toString()
//              }
//          }

        if (stanza.attributes.time) {
          stamp = stanza.attributes.time;
        } else {
          stamp = new Date().toString();
        }

        let groupMessage: any = {from: nick + " ", alt: userName, content: message, senderClass: senderClass, timeStamp: stamp, messageId: messageId, deleted: false};

        if (message !== "") {

          let groupMessages = this.state.groupMessages;

          if (!message.startsWith("messageID=")) {
           groupMessages.push(groupMessage);
          } else {
            let arr= new Array();
            arr.push(message);
            deleteId = message.split("=").pop();
          }

          var i:any;
          for (i = 0; i < groupMessages.length; i++) {
            var groupMessageId = groupMessages[i].messageId;
            if (deleteId && groupMessageId === deleteId) {
              groupMessages[i] = {...groupMessages[i], deleted: true}
            }
          }
          groupMessages.sort((a: any, b: any) => (a.timeStamp > b.timeStamp) ? 1 : -1)

          this.setState({
            groupMessages: groupMessages
          });

          if (this.state.showOccupantsList === true) {
            this.getOccupants();
          }
          return;
        }
      } else {
        return;
      }
    }
    removeMessage(data: any){
      let reactComponent = this;
      let text = data;
      let chat = this.state.chatBox;

      var spoiler_hint = undefined;

      const attrs = chat.getOutgoingMessageAttributes("messageID=" + text.messageId, spoiler_hint);

      let message = chat.messages.findWhere('correcting')

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

      reactComponent.state.converse.api.send(chat.createMessageStanza(message));
    }
    sendMessage(event: any){
      event.preventDefault();

      let text = event.target.chatMessage.value;

      var reactComponent = this;

      let chat = this.state.chatBox;

      var spoiler_hint = "undefined";

      const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

      attrs.fullname = window.PROFILE_DATA.displayName;
      attrs.identifier = window.MUIKKU_LOGGED_USER;
      attrs.from = this.state.jid;
      attrs.to = this.state.roomJid;

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
        reactComponent.state.converse.api.send(chat.createMessageStanza(message));
        reactComponent.getMUCMessages(message);
      }

      this.scrollToBottom();
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
          jid: roomName.trim() + '@conference.muikkuverkko.fi',
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
          //roomadmins: "pyramus-staff-1@dev.muikkuverkko.fi",
          //roomowners: "pyramus-staff-1@dev.muikkuverkko.fi"
        }
      });

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

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
            roomName: roomName,
            roomDesc: roomDesc
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

      let reactComponent = this;

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

      const iq = $iq({to: this.state.roomJid, type: "set"})
      .c("query", {xmlns: Strophe.NS.MUC_OWNER})
      .c("x", {xmlns: Strophe.NS.XFORM, type: "submit"});

      config.forEach((node: any) => iq.cnode(node).up());

      return this.state.converse.api.sendIQ(iq).then(() =>
        this.setState({
          isRoomConfigSavedSuccesfully: "Tallennettu onnistuneesti!",
          settingsInformBox: "settingsInform --success"
        })
      ).catch(() =>
        this.setState({
          isRoomConfigSavedSuccesfully: "Tallennettu onnistuneesti!",
          settingsInformBox: "settingsInform --failed"
        })
      );
    }
    fetchRoomConfiguration(){
      /* Send an IQ stanza to fetch the groupchat configuration data.
      * Returns a promise which resolves once the response IQ
      * has been received.
      */
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

      return this.state.converse.api.sendIQ(
        $iq({'to': this.state.roomJid, 'type': "get"})
        .c("query", {xmlns: Strophe.NS.MUC_OWNER})
      );
    }
    minimizeChats(roomJid: string){
      // For some reason this.state.minimizedRoom is everytime empty when minimizeChats() is called, that's why we load list from sessionStorage instead
      // let minimizedRoomList = this.state.minimizedRooms;
      let minimizedRoomList = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

      if (this.state.minimized === false) {

        this.setState({
          minimized: true
        });

        if (!minimizedRoomList.includes(roomJid)) {

          minimizedRoomList.push(roomJid);

          this.setState({
            minimizedRooms: minimizedRoomList
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
            minimizedRooms: filteredRooms
          });

          let result = JSON.parse(window.sessionStorage.getItem('minimizedChats')) || [];

          const filteredChats = result.filter(function(item: any) {
            return item !== roomJid;
          });

          window.sessionStorage.setItem("minimizedChats", JSON.stringify(filteredChats));

          return;
        }
      }
    }
    async toggleOccupantsList(){

      let room = await this.state.converse.api.rooms.get(this.state.roomJid);

      // For some reason this.state.occupantsListOpened is everytime empty when toggleOccupantsList() is called, that's why we load list from sessionStorage instead
      // let roomsWithOpenOccupantsList = this.state.occupantsListOpened;
      let roomsWithOpenOccupantsList = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

      if (this.state.showOccupantsList === true) {

        this.setState({
          showOccupantsList: false
        });

        const filteredRooms = roomsWithOpenOccupantsList.filter((item: any) => item !== room.attributes.jid);
        this.setState({
          occupantsListOpened: filteredRooms
        });

        let result = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

        const filteredChats = result.filter(function(item: any) {
          return item !== room.attributes.jid;
        });

        window.sessionStorage.setItem("showOccupantsList", JSON.stringify(filteredChats));

        return;
      } else {

        if (!roomsWithOpenOccupantsList.includes(room.attributes.jid)) {

          roomsWithOpenOccupantsList.push(room.attributes.jid);

          this.setState({
            occupantsListOpened: roomsWithOpenOccupantsList,
            showOccupantsList: true
          });

          this.getOccupants();

          window.sessionStorage.setItem("showOccupantsList", JSON.stringify(roomsWithOpenOccupantsList));

        } else {
          return;
        }
      }
    }
    async getOccupants(){
      let room = await this.state.converse.api.rooms.get(this.state.roomJid);

      if (room.occupants.models) {
        let occupantsList = this.state.occupants;
        let user: any;
        let userData: any;
        let nickname: any;

        for (const item of room.occupants.models) {
          if (item.attributes.nick.startsWith("PYRAMUS-STAFF-") || item.attributes.nick.startsWith("PYRAMUS-STUDENT-")) {
            nickname = (await promisify(mApi().chat.settings.read(item.attributes.nick), 'callback')());
            user = (await promisify(mApi().user.users.basicinfo.read(item.attributes.nick,{}), 'callback')());

            userData = {id: item.attributes.nick, nick: nickname.nick, status: item.attributes.show, firstName: user.firstName, lastName: user.lastName};

          } else {
            user = item.attributes.nick;
            nickname = item.attributes.nick;

            userData = {id: item.attributes.nick, nick: nickname, status: item.attributes.show, firstName: "", lastName: ""};
          }

          var isExists = occupantsList.some(function(curr :any) {
              if (curr.id === userData.id) {
                  return true;
              }
          });

          if (isExists !== true) {
            occupantsList.push(userData);
          }
        }
        this.setState({
          occupants: occupantsList
        });
      }
    }
    scrollToBottom = () => {
      if (this.messagesEnd){
        this.messagesEnd.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
    onEnterPress = (e: any) => {
      if(e.keyCode == 13 && e.shiftKey == false) {
        e.preventDefault();

        return false;
      }
    }
    isWorkspaceChatRoom(jid: any){
      if (jid.startsWith("workspace-")){
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
      let reactComponent = this;
      let converse = this.props.converse;

      if (converse) {
        this.setState({
          converse: converse
        });
      }
      let chat = this.props.chat;

      if (chat) {
        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT,
          roomDesc: chat.roomDesc
        });

        var roomOccupantsFromSessionStorage = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

        if (roomOccupantsFromSessionStorage) {
          roomOccupantsFromSessionStorage.map((item: any) => {
            if (item === chat.jid){
              this.setState({
                showOccupantsList: true
              });
            }
          })
        }

        this.openMucConversation(chat.jid);
        this.scrollToBottom();
        this.isWorkspaceChatRoom(chat.jid);
      }

      let minimizedChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("minimizedChats")) || [];

      if (minimizedChatsFromSessionStorage) {
        reactComponent.setState({
          minimizedRooms: minimizedChatsFromSessionStorage
        });

        minimizedChatsFromSessionStorage.map((item: any) => {
          if (item === chat.jid) {
            this.setState({
              minimized: true
            });
          }
        })
      }

    }
    componentDidUpdate(){
      this.scrollToBottom();
    }
    render(){
      let chatRoomTypeClassName = this.state.chatRoomType === "workspace" ? "workspace" : "other";

      return  (
        <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>

          {this.state.minimized === true ? (
            <div onClick={() => this.minimizeChats(this.state.roomJid)} className={`chat__minimized chat__minimized--${chatRoomTypeClassName}`}>
              <div className="chat__minimized-title">{this.state.roomName}</div>
              <div onClick={() => this.props.onOpenChat(this.state.roomJid)} className="chat__button chat__button--close icon-close"></div>
            </div>
          ) : (
            <div className={`chat__panel chat__panel--${chatRoomTypeClassName}`}>
              <div className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}>
                <div className="chat__panel-header-title">{this.state.roomName}</div>
                <div onClick={() => this.toggleOccupantsList()} className="chat__button chat__button--occupants icon-members"></div>
                <div onClick={() => this.minimizeChats(this.state.roomJid)} className="chat__button chat__button--minimize icon-remove"></div>
                {(!this.state.isStudent) && <div onClick={() => this.openChatSettings()} className="chat__button chat__button--room-settings icon-cogs"></div>}
                <div onClick={() => this.props.onOpenChat(this.state.roomJid)} className="chat__button chat__button--close icon-close"></div>
              </div>

              {(this.state.openChatSettings === true) && <div className="chat__subpanel">
                <div className={`chat__subpanel-header chat__subpanel-header--room-settings-${chatRoomTypeClassName}`}>
                  <div className="chat__subpanel-title">Huoneen asetukset</div>
                  <div onClick={() => this.openChatSettings()} className="chat__button chat__button--close icon-close-small"></div>
                </div>
                <div className="chat__subpanel-body">
                  <form onSubmit={this.saveRoomFeatures}>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">Huoneen nimi: </label>
                      <input className="chat__textfield" name="newRoomName" defaultValue={this.state.roomName} type="text"></input>
                    </div>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">Huoneen kuvaus: </label>
                      <textarea className="chat__memofield" name="newRoomDescription" defaultValue={this.state.roomDesc}></textarea>
                    </div>
                    {(!this.state.isStudent) && <div className="chat__subpanel-row">
                      <label className="chat__label">Pysyvä huone: </label>
                      <input className="chat__checkbox" type="checkbox" name="persistent"></input>
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
                  {this.state.groupMessages.map((groupMessage: any) => <ChatMessage key={groupMessage.timeStamp} removeMessage={this.removeMessage.bind(this)} groupMessage={groupMessage} />)}
                </div>
                {this.state.showOccupantsList && <div className="chat__occupants-container">
                  <ul>
                    {this.state.occupants.map((occupant: any, i: any) => <li onClick={() => this.props.onOpenPrivateChat(occupant)} key={i}>{occupant.nick}</li>)}
                  </ul>
                </div>}
              </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={(e)=>this.sendMessage(e)}>
                <input name="chatRecipient" className="chat__muc-recipient" value={this.state.roomJid} readOnly/>
                <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder="Kirjoita viesti tähän..." name="chatMessage"></textarea>
                <button className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`} type="submit" value=""><span className="icon-arrow-right-thin"></span></button>
              </form>
            </div>)
          }
        </div>
      );
    }
  }
