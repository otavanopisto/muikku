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
  minimizedChats: any,
  minimizedClass: string,
  isWorkspaceChat: string,
  showName: boolean,
  chatRoomOccupants: any,
  occupants?: any,
  showOccupantsList?: boolean,
  messageAreaWidth?: number,
  occupantsListOpened?: any,
  privateChats?: any
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
      openRoomNumber:null,
      nick: "",
      isRoomConfigSavedSuccesfully: "",
      settingsInformBox: "settingsInform-none",
      showRoomInfo: false,
      roomAlign: "",
      minimized: false,
      minimizedChats: [],
      minimizedClass: "",
      isWorkspaceChat: "",
      showName: false,
      chatRoomOccupants: [],
      occupants: [],
      showOccupantsList: null,
      messageAreaWidth: 100,
      occupantsListOpened: [],
      privateChats: []
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


  openMucConversation (room: string) {

    let data = {
        jid: room,
        nick: this.props.nick
      };

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

      var reactComponent = this;

      let list = [];

      let result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];


      if (!result.includes(room)){
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
      reactComponent.state.converse.api.send(stanza);

      if (data.nick === "") {
        // Make sure defaults apply if no nick is provided.
        data.nick = reactComponent.state.nick;
      }

      if (this.state.converse.locked_muc_domain || (this.state.converse.muc_domain)) {
        jid = `${Strophe.escapeNode(data.jid)}@${this.state.converse.muc_domain}`;
      } else {
        jid = data.jid;
      }

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


          chat.addHandler('message', 'groupMessages', reactComponent.getMUCMessages.bind(reactComponent) );
        });

    }

    //------- HANDLING INCOMING GROUPCHAT MESSAGES

    async getMUCMessages (stanza: any) {

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;


      if (stanza && stanza.attributes.type.nodeValue === "groupchat"){

        let message = stanza.textContent;
        let from = stanza.attributes.from.value;
        from = from.split("/").pop();
        from.toUpperCase();
        let senderClass ="";
        let user:any;
        let nickname: any;
        let messageId: any;
        let deleteId: any;
        let nick: any;
        let userName: any;

        if (from.startsWith("PYRAMUS-STAFF-") || from.startsWith("PYRAMUS-STUDENT-")){
          user = (await promisify(mApi().user.users.basicinfo.read(from,{}), 'callback')());
          nickname = (await promisify(mApi().chat.settings.read(from), 'callback')());
          userName = user.firstName + " " + user.lastName;
          nick = nickname.nick;
        } else {
          userName = from;
          nick = from;

        }

        if (message !== ""){
          messageId = stanza.attributes.id.value;
        } else {
          messageId = "null";
        }


        if (from === window.MUIKKU_LOGGED_USER){
          senderClass = "sender-me";
        } else {

          if (this.state.roomJid.startsWith("workspace-")){
            senderClass = "sender-others-workspace";
          } else {
            senderClass = "sender-them";
          }
        }

        var stamp = null;
        var list = stanza.childNodes;

        for(var node of list) {
            if (node.nodeName == 'delay') {
                stamp = node.attributes.stamp.nodeValue
              } else {
                stamp = new Date().toString()
              }
          }

        let groupMessage: any = {from: nick + " ", alt: userName, content: message, senderClass: senderClass, timeStamp: stamp, messageId: messageId, deleted: false};

        if (message !== ""){

          let groupMessages = this.state.groupMessages;

          if (!message.startsWith("messageID=")){
           groupMessages.push(groupMessage);
          } else{
            let arr= new Array();

            arr.push(message);
            deleteId = message.split("=").pop();

          }

          var i:any;
          for (i = 0; i < groupMessages.length; i++) {
            var groupMessageId = groupMessages[i].messageId;
            if (deleteId && groupMessageId === deleteId){
              groupMessages[i] = {...groupMessages[i], deleted: true}

            }
          }
          groupMessages.sort((a: any, b: any) => (a.timeStamp > b.timeStamp) ? 1 : -1)

          this.setState({groupMessages: groupMessages});

          if (this.state.showOccupantsList === true){
              this.getOccupants();
          }
          return;
        }
      } else {
        return;
      }
    }

    removeMessage(data: any) {
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
      let jid = this.state.roomJid;

      var reactComponent = this;

      let chat = this.state.chatBox;

      var spoiler_hint = "undefined";

      const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

      attrs.fullname = window.PROFILE_DATA.displayName;

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
      event.target.chatMessage.value = '';

      if (text !== null || text !== ""){
        reactComponent.state.converse.api.send(chat.createMessageStanza(message));
      }

    }


    //--- SETTINGS & INFOS
    openChatSettings() {
      if (this.state.openChatSettings === false && window.MUIKKU_IS_STUDENT === false){
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

    toggleRoomInfo() {
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
      let roomDescription = event.target.newRoomDescription.value;
      let persistentRoom = event.target.persistent;


      if (persistentRoom && persistentRoom.checked === true){
        persistentRoom = 1;
      } else {
        persistentRoom = 0;
      }

      this.setState({
        roomConfig: {
          jid: roomName.trim() + '@conference.muikkuverkko.fi',
          FORM_TYPE: "hidden",
          roomname: roomName,
          roomdesc: roomDescription,
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
           roomName: roomName
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
    sendConfiguration (config: any=[]) {

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

    fetchRoomConfiguration () {
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

    minimizeChats (roomJid:any){

      let minimizedRoomList = this.state.minimizedChats;

      if (this.state.minimized === false){
        this.setState({
          minimized: true,
          minimizedClass: "order-minimized"
        });

        if (!minimizedRoomList.includes(roomJid)){
          minimizedRoomList.push(roomJid);

          this.setState({minimizedChats: minimizedRoomList})
          window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
        }
      } else{

        if (minimizedRoomList.includes(roomJid)){
          const filteredRooms = minimizedRoomList.filter((item: any) => item !== roomJid)
          this.setState({minimizedChats: filteredRooms})

          var result = JSON.parse(window.sessionStorage.getItem('minimizedChats')) || [];

          const filteredChats = result.filter(function(item:any) {
          return item !== roomJid;
          })

          window.sessionStorage.setItem("minimizedChats", JSON.stringify(filteredChats));

          return;
        }

        this.setState({
          minimized: false,
          minimizedClass:""
        });
      }

    }

    async toggleOccupantsList (){

      let room = this.state.converse.api.rooms.get(this.state.roomJid);
      let roomsWithOpenOccupantsList = this.state.occupantsListOpened;


      if (this.state.showOccupantsList === true){
        this.setState({
          messageAreaWidth: 100,
          showOccupantsList: false
        })

        const filteredRooms = roomsWithOpenOccupantsList.filter((item: any) => item !== room.attributes.jid)
          this.setState({occupantsListOpened: filteredRooms})
          var result = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

          const filteredChats = result.filter(function(item:any) {
            return item !== room.attributes.jid;
          })

          window.sessionStorage.setItem("showOccupantsList", JSON.stringify(filteredChats));


        return;
      } else {

        if (!roomsWithOpenOccupantsList.includes(room.attributes.jid)){
          roomsWithOpenOccupantsList.push(room.attributes.jid);
          this.setState({
            occupantsListOpened: roomsWithOpenOccupantsList,
            messageAreaWidth: 75 ,
            showOccupantsList: true
          })
          this.getOccupants();
          window.sessionStorage.setItem("showOccupantsList", JSON.stringify(roomsWithOpenOccupantsList));
        } else {
          return;
        }
      }


    }

    async getOccupants (){
      let room = this.state.converse.api.rooms.get(this.state.roomJid);
      if (room.occupants.models){
          let occupantsList = this.state.occupants;
          let user: any;
          let userData: any;
          let nickname: any;


          for (const item of room.occupants.models) {
            if (item.attributes.nick.startsWith("PYRAMUS-STAFF-") || item.attributes.nick.startsWith("PYRAMUS-STUDENT-")){
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

            if (isExists !== true){
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

    onEnterPress= (e: any) => {
      if(e.keyCode == 13 && e.shiftKey == false) {
        e.preventDefault();

        return false;


      }
    }

    isWorkspaceChatRoom (jid: any){
      if (jid.startsWith("workspace-")){
        this.setState({
          isWorkspaceChat: "#25a98c"
        })

        return;
      } else {
        this.setState({
          isWorkspaceChat: "#007bb0"
        })
        return;
      }
    }

    componentDidMount (){

      let reactComponent = this;
      let converse = this.props.converse;

      if (converse){
        this.setState({
          converse: converse
        });
      }
      let chat = this.props.chat;

      if (chat){
        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT
        });

        var roomOccupantsFromSessionStorage = JSON.parse(window.sessionStorage.getItem('showOccupantsList')) || [];

        if (roomOccupantsFromSessionStorage){

          roomOccupantsFromSessionStorage.map((item: any) => {
            if (item === chat.jid){
              this.setState({
                showOccupantsList: true,
                messageAreaWidth: 75
              });
            }
          })
        }

        this.openMucConversation(chat.jid);
        this.scrollToBottom();
        this.isWorkspaceChatRoom(chat.jid);

      }


      let minimizedChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("minimizedChats"));

      if (minimizedChatsFromSessionStorage){
        reactComponent.setState({
          minimizedChats: minimizedChatsFromSessionStorage
        });

        minimizedChatsFromSessionStorage.map((item: any) => {
          if (item === chat.jid){
            this.setState({
              minimized: true,
              minimizedClass: "order-minimized"
            });
          }
        })
      }

    }

    componentDidUpdate() {
      this.scrollToBottom();
    }

    render() {

      return  (
        <div className={"chat__muc--body " + this.state.minimizedClass}>


            { (this.state.minimized === true) && <div
            onClick={() => this.minimizeChats(this.state.roomJid)}
            className="chat__minimized-chat">{this.state.roomName} <span onClick={() => this.props.onOpenChat(this.state.roomJid)} className="close icon-close"></span></div>}

            { (this.state.minimized === false) && <div id={this.props.orderNumber} className="chat__muc--container">

            <div style={{"backgroundColor": this.state.isWorkspaceChat }} className="chat__muc--header">
              <div className="chat__chatbox--room-name">{this.state.roomName}</div>
              <span onClick={() => this.toggleOccupantsList()} className="icon-profile"></span>
              <span onClick={() => this.minimizeChats(this.state.roomJid)} className="icon-remove"></span>
              <span onClick={() => this.openChatSettings()} className="icon-cogs chat__chatbox--room-settings-icon"></span>
              <span onClick={() => this.props.onOpenChat(this.state.roomJid)} className="icon-close"></span>
            </div>





            {(this.state.openChatSettings === true) && <div className="chat__muc--room-settings">
              <span onClick={() => this.openChatSettings()} className="chat__muc--close-chatbox icon-close-small"></span>
              <form onSubmit={this.saveRoomFeatures}>
                <label className="control-panel">Huoneen nimi: </label><input className="chat__muc--settings-input" name="newRoomName" defaultValue={this.state.roomName} type="text"></input>
                <label className="control-panel">Huoneen kuvaus: </label><input className="chat__muc--settings-input" name="newRoomDescription" type="text"></input>
                {(!this.state.isStudent) && <div>
                  <label className="control-panel">Pysyvä huone: </label><input type="checkbox" name="persistent"></input><br />
                </div>}
                <input className="chat__muc--save-button" type="submit" value="Tallenna"></input>
              </form>

              <div className={this.state.settingsInformBox}>
                <p>{this.state.isRoomConfigSavedSuccesfully}</p>
              </div>
            </div> }



            <form onSubmit={(e)=>this.sendMessage(e)}>
              <div className="chat__muc--message-wrapper">
                <div style={{width: this.state.messageAreaWidth + '%'}} className="chat__muc--messages" ref={ (ref) => this.myRef=ref }>
                  {this.state.groupMessages.map((groupMessage: any) => <ChatMessage key={groupMessage.timeStamp} removeMessage={this.removeMessage.bind(this)} groupMessage={groupMessage} />)}
                  <div style={{ float:"left", clear: "both"}} ref={(el) => { this.messagesEnd = el; }}></div>
                </div>
                {this.state.showOccupantsList && <div className="chat__muc--occupants-list">
                  <ul>
                    {this.state.occupants.map((occupant: any, i: any) => <li onClick={() => this.props.onOpenPrivateChat(occupant)} key={i}>{occupant.nick}</li>)}
                  </ul>
                </div>}
              </div>
              <input name="chatRecipient" className="chat__muc--recipient" value={this.state.roomJid} readOnly/>
              <textarea className="chat__muc--message-area" onKeyDown={this.onEnterPress} placeholder="..Kirjoita jotakin" name="chatMessage"></textarea>
              <button className="chat__muc--send-message" type="submit" value=""><span className="icon-announcer"></span></button>

              </form>
          </div>}


      </div>
      );
    }
  }
