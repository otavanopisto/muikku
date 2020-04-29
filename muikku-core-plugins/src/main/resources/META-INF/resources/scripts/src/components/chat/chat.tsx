/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import {Groupchat} from './groupchat';
import {RoomsList} from './roomslist';
import converse from '~/lib/converse';
import {PrivateMessages} from './privatemessages';
import mApi, { MApiError } from '~/lib/mApi';
import promisify, { promisifyNewConstructor } from '~/util/promisify';

interface Iprops {
  chat?: any,
  onOpenChat?:any,
  showChatbox?: any,
  privateChats?: any
}

interface Istate {
  path?: string,
  port?: number,
  jid?: string,
  password?: string,
  hostname?: string,
  converse?: any,
  isConnectionOk?: boolean,
  showMaterial?: boolean,
  roomJid?: string,
  roomsList?: Object[],
  to?: string,
  messages: Object[],
  groupchats: Object[],
  groupMessages: Object[],
  groupMessageRecipient?: String,
  receivedMUCMessages: Object[],
  availableMucRooms: any,
  chatBox:null,
  showChatButton: boolean,
  showControlBox: boolean,
  showNewRoomForm: boolean,
  isStudent?: Boolean,
  showChatbox: boolean,
  nick?: string,
  openRoomNumber: number,
  openChats?: Object[],
  userStatusColor: string,
  selectedState: string,
  privateChats?: any
}

declare namespace JSX {
  interface ElementClass {
    render: any
  }
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
      path: "/http-bind/",
      port: 443,
      jid: "",
      password: "",
      hostname: "",
      converse: null,
      isConnectionOk: false,
      showMaterial: false,
      roomJid: "",
      roomsList: [],
      to: "",
      messages: [],
      groupchats: [],
      groupMessages: [],
      groupMessageRecipient: "",
      receivedMUCMessages: [],
      availableMucRooms: [],
      chatBox:null,
      showChatButton: null,
      showControlBox: null,
      showChatbox: null,
      showNewRoomForm: false,
      isStudent: false,
      openRoomNumber:null,
      nick: "",
      openChats: [],
      userStatusColor: null,
      selectedState: "",
      privateChats: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.sendPrivateMessage = this.sendPrivateMessage.bind(this);
   // this.sendMessage = this.sendMessage.bind(this);
    this.openControlBox = this.openControlBox.bind(this);
    this.openNewRoomForm = this.openNewRoomForm.bind(this);
    this.onOpenChat = this.onOpenChat.bind(this);
    this.onOpenPrivateChat = this.onOpenPrivateChat.bind(this);
    this.userAvailability = this.userAvailability.bind(this);
    this.changeUserAvailability = this.changeUserAvailability.bind(this);
    this.getChatNick = this.getChatNick.bind(this);
    this.privateMessageNotification = this.privateMessageNotification.bind(this);
  }

  async privateMessageNotification (data: any) {
    const u = converse.env.utils;
    let user: any;
    let privateChatData: any;
    let nick;
    let chatSettings: any;
    let userId: any;
    let from: any;
    let bareJid: any;
    let hiddenChat: any;
    let tempPrivateChats: any;
    const { Strophe, sizzle } = converse.env;
    from = data.stanza.getAttribute('from');
    bareJid = Strophe.getBareJidFromJid(from);
    const is_me = bareJid === this.state.converse.bare_jid;
    hiddenChat = this.isMessageToHiddenChat(data.stanza);
    if(hiddenChat){
      if(data.stanza.getAttribute('type') !== 'groupchat' &&
       from !== null && 
       !u.isOnlyChatStateNotification(data.stanza) && 
       !u.isOnlyMessageDeliveryReceipt(data.stanza) && 
       !is_me){
        userId = data.stanza.getAttribute('from').split('@');
        userId = userId[0];
        chatSettings = (await promisify(mApi().chat.settings.read(userId), 'callback')());
        nick = chatSettings.nick;       
        user = (await promisify(mApi().user.users.basicinfo.read(chatSettings.userIdentifier,{}), 'callback')());
        if (nick == "" || nick == undefined) {
          nick = user.firstName + " " + user.lastName;
        }
        privateChatData = {id: userId, nick: nick, status: '', firstName: user.firstName, lastName: user.lastName, receivedMessageNotification: true};
        
        tempPrivateChats = this.state.privateChats;
        let exists = tempPrivateChats.some(function(curr :any) {
          if (curr.jid === bareJid) {
            return true;
          }
        });

        if(!exists){
          tempPrivateChats.push({jid: bareJid, info: privateChatData});
          this.setState({
            privateChats: tempPrivateChats
          });
        }

      }
    }

  }
  
  /**
   * Adapted from converse-notification
   * https://m.conversejs.org/docs/html/api/converse-notification.js.html
   * @param stanza message stanza 
   */
  isMessageToHiddenChat (stanza: any) {
    const u = converse.env.utils;
    const { Strophe, sizzle } = converse.env;
    let something = this.state.converse.isUniView();
    
    let chatboxviews = converse.chatboxviews;
    // if (this.state.converse.isUniView()) {
        const jid = Strophe.getBareJidFromJid(stanza.getAttribute('from'));
        if (typeof converse.chatboxviews !== 'undefined') {
          const view = converse.chatboxviews.get(jid);
          if (view) {
            return view.model.get('hidden') || this.state.converse.windowState === 'hidden' || !u.isVisible(view.el);
          }
        }
        
        return true;
    // }
    // return this.state.converse.windowState === 'hidden';
  }
  
  handleSubmit(event: any) { // login

    this.setState({
      path: "http-bind/",
      port: 443,
      jid: event.target.jid.value + '@dev.muikkuverkko.fi',
      password: event.target.password
    });
    event.preventDefault();

    this.state.converse.api.user.login({
      'jid': event.target.jid.value + '@dev.muikkuverkko.fi',
      'password': event.target.password.value
    });
  }
  // --------------- PRIVATE MESSAGES ----------------------
  onOpenPrivateChat(occupant: any) {
    if (occupant.id === window.MUIKKU_LOGGED_USER){
      return;
    }
    else if (occupant.id.startsWith("PYRAMUS-STAFF-") || window.MUIKKU_IS_STUDENT === false){
      let jid = occupant.id.toLowerCase() + "@dev.muikkuverkko.fi";

      let isExists = this.state.privateChats.some(function(curr :any) {
        if (curr.jid === jid) {
          return true;
        }
      });

      if (isExists === true) {

        const filteredRooms = this.state.privateChats.filter((item: any) => item.jid !== jid)
        this.setState({privateChats: filteredRooms})

        let result = JSON.parse(window.sessionStorage.getItem('openPrivateChats')) || [];

        const filteredChats = result.filter(function(item:any) {
          return item.jid !== jid;
        })

        window.sessionStorage.setItem("openPrivateChats", JSON.stringify(filteredChats));

      } else {
        this.state.privateChats.push({jid: jid, info: occupant});

        this.setState({
          privateChats: this.state.privateChats
        })
      }
    }
  }

  sendPrivateMessage(event:any){

    event.preventDefault();

    let text = event.target.chatMessage.value;

    this.state.converse.api.chats.open('pyramus-staff-1@dev.muikkuverkko.fi').then((chat:any) => {

      var spoiler_hint = "undefined";

      const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

      let message = chat.messages.findWhere('correcting')

      if (message) {
        const older_versions = message.get('older_versions') || [];
        older_versions.push(message.get('message'));
        message.save({
          'correcting': false,
          'edited': chat.moment().format(),
          'message': text,
          'older_versions': older_versions,
          'references': text
        });
      } else {
        message = chat.messages.create(attrs);
      }

      if (text !== null || text !== ""){
        this.setState({
          messages: chat.messages.models.map((model: any) => ({
            message: model.attributes.message,
            from: model.attributes.from
          })).filter((message: any) => message.message !== undefined)
        })

        this.state.converse.api.send(chat.createMessageStanza(message));
        return true;
      }

    });
  }

  //---------- CONVERSE MUC ROOMS --------------------
  // Nickname, persistency, room name and room description for new chat room
  parseRoomDataFromEvent (form: HTMLFormElement) {
    const data = new FormData(form);
    const jid = data.get('roomName').toString();
    const persistentRoom = data.get('persistent');
    const roomDesc = data.get('roomDesc');
    const roomName = data.get('roomName');
    let nick: any;
    if (this.state.converse.locked_muc_nickname) {
      nick =this.state.nick;
      if (!nick) {
        throw new Error("Using locked_muc_nickname but no nickname found!");
      }
    }
    return {
      'jid': jid,
      'nick': nick,
      'persistent': persistentRoom,
      'roomdesc': roomDesc,
      'roomname': roomName
    }
  }
  // Creating new chat room
  async joinRoom (event: any) {

    event.preventDefault();

    const data = this.parseRoomDataFromEvent(event.target);

    if (data.jid.toString().startsWith("workspace-")){
      alert("EI KÄY!!!");
      return;
    }

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    // We need to trim and replace white spaces so new room will be created succefully
    let jid = data.jid.trim().replace(/\s+/g, '-') + '@conference.dev.muikkuverkko.fi';

    let persistent = data.persistent ? true : false;
    let roomName = (data.roomname && data.roomname !== "") ? data.roomname : "";
    let roomDesc = (data.roomdesc && data.roomdesc !== "") ? data.roomdesc : "";
    let nick = (data.nick || data.nick == "") ? this.state.nick : data.nick;
    let roomJidAndNick = jid + (data.nick !== null ? "data.nick" : "");

    const stanza = $pres({
      'from': this.state.converse.connection.jid,
      'to': roomJidAndNick
    }).c("x", {'xmlns': Strophe.NS.MUC})
    .c("history", {'maxstanzas': this.state.converse.muc_history_max_stanzas}).up();
    /* if (password) {
    stanza.cnode(Strophe.xmlElement("password", [], password));
    } */
    //this.save('connection_status', converse.ROOMSTATUS.CONNECTING);
    this.state.converse.api.send(stanza);

    this.state.converse.api.user.status.set('online');

    this.state.converse.api.rooms.open(jid, _.extend({
      'nick': nick,
      'maximize': true,
      'auto_configure': true,
      'publicroom': true,
      'roomconfig': {
        'persistentroom': persistent,
        'roomdesc': roomDesc,
        'roomname': roomName
      }
    }), true).then((chat: any) => {


      let availableMucRoom =  {
        name: chat.attributes.jid.split('@conference.dev.muikkuverkko.fi'),
        jid: chat.attributes.jid,
        chatObject: chat
      };

      let groupchats = this.state.availableMucRooms;

      groupchats.push(availableMucRoom);

      this.setState({availableMucRooms: groupchats, chatBox: chat, showNewRoomForm: false});
    });
	let parsedJid;
	parsedJid = jid.split("@");
	parsedJid = parsedJid[0];

	let affiliationlist = (await promisify(mApi().chat.affiliations.read({roomName: parsedJid}), 'callback')());

    event.target.reset();
  }
  informRoomCreationFailed(){
    alert("EI OLE MITÄÄN HUONEITA TÄÄLLÄ!!");
  }

  // ------ mApi() ----------
  async getChatNick (){
    this.setState({
      nick: window.MUIKKU_LOGGED_USER
    });
  }
  // ----- ROOMS LIST-----
  async onRoomsFound (iq: any) {
    //    /* Handle the IQ stanza returned from the server, containing
    //     * all its public groupchats.
    //     */¨

    let rooms = iq.querySelectorAll('query item');
    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    if (rooms.length) {
      const nodesArray = [].slice.call(rooms);
      let name;
      let jid;
      let description: any;
      var i;

      for (i = 0; i < nodesArray.length; i++) {
        name = nodesArray[i].attributes.name.nodeValue;
        jid = nodesArray[i].attributes.jid.value;

        const fields = await this.state.converse.api.disco.getFields(jid);
        description = _.get(fields.findWhere({'var': "muc#roominfo_description"}), 'attributes.value');

        let roomsList = this.state.availableMucRooms;

        let addRoomToList = {
          name: name,
          jid: jid,
          roomDesc: description
        }
        roomsList.push(addRoomToList);
          this.setState({availableMucRooms: roomsList});
      }
      return;
    } else {
      // this.informNoRoomsFound();
    }

    return true;
  }
  openControlBox(){
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
  openNewRoomForm(){
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
  onOpenChat (roomJid: string) {
    let openChatsList = this.state.openChats;

    if (openChatsList.includes(roomJid)){
      const filteredRooms = openChatsList.filter(item => item !== roomJid);
      this.setState({
        openChats: filteredRooms
      });

      var result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

      const filteredChats = result.filter(function(item: any) {
        return item !== roomJid;
      });

      window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));

      return;

    } else {
      openChatsList.push(roomJid);

      this.setState({
        openChats: openChatsList
      });
    }
  }
  getWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room:any) => room.jid.startsWith("workspace-"));
  }
  getNotWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room:any) => !room.jid.startsWith("workspace-"));
  }
  changeUserAvailability (e:any){
    let newStatus = e.target.value;

    this.state.converse.api.user.status.set(newStatus);
    
    this.userAvailability();
  }
  userAvailability (){
    let userStatus = this.state.converse.api.user.status.get();

    this.setState({
      selectedState: userStatus
    });
  }
  componentDidMount() {
    var __this = this;

    converse.plugins.add("muikku-chat-ui", {

      initialize: function () {
        var _converse = this._converse;
        __this.setState({converse: _converse});
        __this.state.converse.api.listen.on('message',  __this.privateMessageNotification);
        __this.state.converse.on('connected', function () {

          const rooms = __this.state.converse.api.rooms;

          __this.setState({
            isConnectionOk: true,
            showMaterial: true,
            isStudent: window.MUIKKU_IS_STUDENT
          });

          const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

          let from = window.MUIKKU_LOGGED_USER;
          const iq: any = $iq({
            'to': 'conference.dev.muikkuverkko.fi',
            'from': from + "@dev.muikkuverkko.fi",
            'type': "get"
          }).c("query", {xmlns: Strophe.NS.DISCO_ITEMS});
          __this.state.converse.api.sendIQ(iq)
            .then((iq: any) => __this.onRoomsFound(iq))
            .catch((iq: any) => console.log(iq));

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

          let openChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("openChats"));

          if (openChatsFromSessionStorage){
            __this.setState({
              openChats: openChatsFromSessionStorage
            });
          }

          let openPrivateChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("openPrivateChats"));

          if (openPrivateChatsFromSessionStorage){
            __this.setState({
              privateChats: openPrivateChatsFromSessionStorage
            });
          }
          let userStatus = __this.state.converse.api.user.status.get();

          __this.setState({
            selectedState: userStatus
          });

          __this.getChatNick();

        });
      },
    });
  }
  render() {
    let userStatusClassName = this.state.selectedState === "online" ? "online" : this.state.selectedState === "offline" ? "offline" : "away";

    return  (

      <div className="chat">

        {/* Chat bubble */}
        { (this.state.showChatButton === true) && <div onClick={() => this.openControlBox()} className="chat__bubble">
          <span className="icon-discussion"></span>
        </div>}

        {/* Chat controlbox */}
        { (this.state.showControlBox === true) && <div className="chat__panel chat__panel--controlbox">
          <div className="chat__panel-header chat__panel-header--controlbox">
            <span onClick={() => this.openNewRoomForm()} className="chat__button chat__button--new-room icon-add"></span>
            <span onClick={() => this.openControlBox()} className="chat__button chat__button--close icon-close"></span>
          </div>

          { (this.state.isConnectionOk === false) && <div>
            <h1>Kirjaudu chattiin</h1>
            <form onSubmit={this.handleSubmit}>
              <label>Käyttäjätunnus: </label><input name="jid" ref="jid" type="text"></input><br />
              <label>Salasana: </label><input type="password" name="password" ref="password"></input><br />
              <br />
              <input type="submit" value="Kirjaudu!"></input>
            </form>
          </div>
          }

          { (this.state.showMaterial === true) && <div className="chat__panel-body chat__panel-body--controlbox">
            <select value={this.state.selectedState} onChange={this.changeUserAvailability} className={`chat__controlbox-user-status chat__controlbox-user-status--${userStatusClassName}`}>
              <option value="online">Paikalla</option>
              <option value="away">Palaan pian</option>
              <option value="offline">Poissa</option>
            </select>

            <div className="chat__controlbox-rooms-heading">Kurssikohtaiset huoneet: </div>
            <div className="chat__controlbox-rooms-listing">
              {this.getWorkspaceMucRooms().length > 0 ?
                this.getWorkspaceMucRooms().map((chat: any, i: any) => <RoomsList onOpenChat={this.onOpenChat} key={i} chat={chat} orderNumber={i} converse={this.state.converse}/>)
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
                <div onClick={() => this.openNewRoomForm()} className="chat__button chat__button--close icon-close-small"></div>
              </div>
              <div className="chat__subpanel-body">
                <form onSubmit={this.joinRoom}>
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
          {this.state.availableMucRooms.map((chat: any, i: any) => this.state.openChats.includes(chat.jid) ? <Groupchat key={i} onOpenPrivateChat={this.onOpenPrivateChat.bind(this)} onOpenChat={this.onOpenChat} nick={this.state.nick} chatObject={this.state.chatBox} chat={chat} orderNumber={i} converse={this.state.converse}/>:null)}
          {this.state.privateChats.map((privateChatData: any, i:any) => <PrivateMessages key={i} onOpenPrivateChat={this.onOpenPrivateChat} info={privateChatData} converse={this.state.converse}/>)}
        </div>
      </div>
    );
  }
}
