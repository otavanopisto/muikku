/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import {Groupchat} from './groupchat';
import {RoomsList} from './roomslist';
import converse from '~/lib/converse';
import {PrivateMessages} from './privatemessages';

interface Iprops{
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
  openRooms?: Object[],
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
      openRooms: [],
      userStatusColor: null,
      selectedState: "",
      privateChats: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.joinRoom= this.joinRoom.bind(this);
    this.sendPrivateMessage = this.sendPrivateMessage.bind(this);
   // this.sendMessage = this.sendMessage.bind(this);
    this.openControlBox = this.openControlBox.bind(this);
    this.openNewRoomForm = this.openNewRoomForm.bind(this);
    this.onOpenChat = this.onOpenChat.bind(this);
    this.onOpenPrivateChat = this.onOpenPrivateChat.bind(this);
    this.userAvailability = this.userAvailability.bind(this);
    this.changeUserAvailability = this.changeUserAvailability.bind(this);
    this.getChatNick = this.getChatNick.bind(this);
  }

  handleSubmit(event: any) { // login

    this.setState({
      path: "http-bind",
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

      let privateChats = this.state.privateChats;

      var isExists = privateChats.some(function(curr :any) {
        if (curr.jid === jid) {
          return true;
        }
      });

      if (isExists === true){

        const filteredRooms = privateChats.filter((item: any) => item.jid !== jid)
        this.setState({privateChats: filteredRooms})

        var result = JSON.parse(window.sessionStorage.getItem('openPrivateChats')) || [];

        const filteredChats = result.filter(function(item:any) {
          return item.jid !== jid;
        })

        window.sessionStorage.setItem("openPrivateChats", JSON.stringify(filteredChats));

        return;
      } else {
        privateChats.push({jid: jid, info: occupant});

        this.setState({privateChats: privateChats})
      }

    }
  }

  sendPrivateMessage(event:any){

    event.preventDefault();

    let text = event.target.chatMessage.value;

    var reactComponent = this;
    reactComponent.state.converse.api.chats.open('pyramus-staff-1@dev.muikkuverkko.fi').then((chat:any) => {

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
        reactComponent.setState({
          messages: chat.messages.models.map((model: any) => ({
            message: model.attributes.message,
            from: model.attributes.from
          })).filter((message: any) => message.message !== undefined)
        })

        reactComponent.state.converse.api.send(chat.createMessageStanza(message));
        return true;
      }

    });
  }


  //---------- CONVERSE MUC ROOMS --------------------

  // Nickname & room name for new chat room
  parseRoomDataFromEvent (form: HTMLFormElement) {
    const data = new FormData(form);
    const jid = data.get('roomName');
    const persistentRoom = data.get('persistent');
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
      'persistent': persistentRoom
    }
  }
  // Creating new chat room
  joinRoom (event: any) {

    var reactComponent = this;

    event.preventDefault();

    const data = this.parseRoomDataFromEvent(event.target);

    if (data.jid.toString().startsWith("workspace-")){
      alert("EI KÄY!!!");
      return;
    }

    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

    let makeRoomPersistent;

    if (data.persistent){
      makeRoomPersistent = true;
    } else { makeRoomPersistent = false;}

    if (data.nick === "") {
      // Make sure defaults apply if no nick is provided.
      data.nick = reactComponent.state.nick;
    }
    let jid;
    
    jid = data.jid + '@conference.dev.muikkuverkko.fi'
    

    let roomJidAndNick = jid + (data.nick !== null ? `/${data.nick}` : "");


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

    reactComponent.state.converse.api.rooms.open(jid, _.extend(data, {
      'nick': data.nick,
      'maximize': true,
      'name': jid.split('@conference.dev.muikkuverkko.fi'),
      'auto_configure': true,
      'publicroom': true,
      'persistentroom:': makeRoomPersistent,
      'roomconfig': {
        'persistentroom': makeRoomPersistent,
        'roomdesc': 'Comfy room for hanging out'
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

  // ----- ROOMS LIST-----ä
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
  onOpenChat (room: string) {

    let openRoomsList = this.state.openRooms;

    if (openRoomsList.includes(room)){
      const filteredRooms = openRoomsList.filter(item => item !== room)
      this.setState({openRooms: filteredRooms})

      var result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

      const filteredChats = result.filter(function(item:any) {
        return item !== room;
      })

      window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));

      return;

    } else {
      openRoomsList.push(room);

      this.setState({openRooms: openRoomsList})
    }


  }

    getWorkspaceMucRooms() { return this.state.availableMucRooms.filter((room:any) => room.jid.startsWith("workspace-")); }

    getNotWorkspaceMucRooms() { return this.state.availableMucRooms.filter((room:any) => !room.jid.startsWith("workspace-")); }

    changeUserAvailability (e:any){
      let newStatus = e.target.value;

      this.state.converse.api.user.status.set(newStatus);

      this.userAvailability();
    }

    userAvailability (){

      let userStatus = this.state.converse.api.user.status.get();


      if (userStatus === "online"){
        this.setState({
          userStatusColor: "green",
          selectedState: userStatus
        });
      } else if (userStatus === "away"){
        this.setState({
          userStatusColor: "orange",
          selectedState: userStatus
        });
      } else{
        this.setState({
          userStatusColor: "grey",
          selectedState: userStatus
        });
      }
    }

    componentDidMount() {

    var reactComponent = this;

    converse.plugins.add('myplugin', {

      initialize: function () {
        var _converse = this._converse;
        reactComponent.setState({converse: _converse});

        reactComponent.state.converse.on('connected', function () {

          const rooms = reactComponent.state.converse.api.rooms;

          reactComponent.setState({
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
          reactComponent.state.converse.api.sendIQ(iq)
            .then((iq: any) => reactComponent.onRoomsFound(iq))
            .catch((iq: any) => console.log(iq))

//          reactComponent.state.converse.api.listen.on('message', (data: any) => {
//
//            if (data.chatbox && data.chatbox.attributes.message_type === "chat"){
//              reactComponent.setState({
//                messages: data.chatbox.messages.models.map((model: any) => ({
//                  message: model.attributes.message,
//                  from: model.attributes.from,
//                  id: data.chatbox.id
//                })).filter((message: any) => message.message !== undefined)
//              })
//            } else {
//              return;
//            }
//          })

          let chatControlBoxStatus = window.sessionStorage.getItem("showControlBox");

          if (chatControlBoxStatus){
            if (chatControlBoxStatus === "opened"){
              reactComponent.setState({
                showControlBox: true,
                showChatButton: false
               });
            } else {
              reactComponent.setState({
                showControlBox: false,
                showChatButton: true
              });
            }
          } else {
            reactComponent.setState({
              showControlBox: false,
              showChatButton: true
            });
          }

          let openChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("openChats"));

          if (openChatsFromSessionStorage){
            reactComponent.setState({
              openRooms: openChatsFromSessionStorage
            });
          }

          let openPrivateChatsFromSessionStorage = JSON.parse(window.sessionStorage.getItem("openPrivateChats"));

          if (openPrivateChatsFromSessionStorage){
            reactComponent.setState({
              privateChats: openPrivateChatsFromSessionStorage
            });
          }
          let userStatus = reactComponent.state.converse.api.user.status.get();

          reactComponent.setState({
            selectedState: userStatus
          });

          reactComponent.userAvailability();

          reactComponent.getChatNick();
        });

      },
    });


  }

  render() {

    return  (

      <div className="chat__container">

        { (this.state.showChatButton === true) && <div onClick={() => this.openControlBox()} className="chat__container--button">
          <span className="icon-discussion"></span>
        </div>}

        { (this.state.showControlBox === true) && <div>
          <div className="chat__controlbox--body">
            <div className="chat__controlbox--header">
              <span onClick={() => this.openNewRoomForm()} className="chat__controlbox--new-room icon-add"></span>
              <span onClick={() => this.openControlBox()} className="icon-close chat__controlbox--close-controlbox"></span>
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


          { (this.state.showMaterial === true) && <div className="chat__controlbox--container">
            <select value={this.state.selectedState} style={{"borderColor": this.state.userStatusColor, "boxShadow": "0 0 3px " + this.state.userStatusColor }} onChange={this.changeUserAvailability} className="chat__controlbox--user-status">
              <option value="online">Paikalla</option>
              <option value="offline">Poissa</option>
              <option value="away">Palaan pian</option>
            </select>

            <h4 className="chat__controlbox--headings">Kurssikohtaiset huoneet: </h4>

            {this.getWorkspaceMucRooms().map((chat: any, i: any) => <RoomsList onOpenChat={this.onOpenChat} key={i} chat={chat} orderNumber={i} converse={this.state.converse}/>)}

            <h4 className="chat__controlbox--headings">Muut huoneet:</h4>
            {this.getNotWorkspaceMucRooms().map((chat: any, i: any) => <RoomsList onOpenChat={this.onOpenChat} key={i} chat={chat} orderNumber={i} converse={this.state.converse}/>)}


            { (this.state.showNewRoomForm === true) && <div className="chat__new-room-tab--container">
              <span onClick={() => this.openNewRoomForm()} className="chat__new-room-tab--close icon-close-small"></span>
              <h3>Luo uusi huone</h3>
              <br />
              <form onSubmit={this.joinRoom}>
                <label className="chat__controlbox--headings">Huoneen nimi: </label><input className="chat__new-room-tab--settings-input" name="roomName" ref="roomName" type="text"></input>
                <label className="chat__controlbox--headings">Huoneen kuvaus: </label><input className="chat__new-room-tab--settings-input" name="roomDesc" ref="roomDesc" type="text"></input>
                {(!this.state.isStudent) && <div>
                  <label className="chat__controlbox--headings">Pysyvä huone: </label><input type="checkbox" name="persistent"></input><br />
                </div>}
                <input className="chat__new-room--join-button" type="submit" value="Liity"></input>
              </form>
            </div>}

          </div>}
        </div>

        <div className="chat__chatboxes">
          {this.state.availableMucRooms.map((chat: any, i: any) => this.state.openRooms.includes(chat.jid) ? <Groupchat key={i} onOpenPrivateChat={this.onOpenPrivateChat.bind(this)} onOpenChat={this.onOpenChat} nick={this.state.nick} chatObject={this.state.chatBox} chat={chat} orderNumber={i} converse={this.state.converse}/>:null)}
          {this.state.privateChats.map((chat: any, i:any) => <PrivateMessages key={i} onOpenPrivateChat={this.onOpenPrivateChat} info={chat} converse={this.state.converse}/>)}
        </div>
      </div>}
    </div>
    );
  }
}