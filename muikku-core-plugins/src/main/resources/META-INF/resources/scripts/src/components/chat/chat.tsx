/*global converse */
import * as React from 'react'
import ReactDOM from 'react-dom';
import './index.css';
import {Groupchat} from './groupchat';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any
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
  availableMucRooms: Object[],
  chatBox:null,
  showChatButton: boolean,
  showControlBox: boolean,
  isStudent?: Boolean
}

declare namespace JSX {
  interface ElementClass {
    render: any
  }
}

declare global {
  interface Window {
    MUIKKU_IS_STUDENT:boolean;
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
      isStudent: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.joinRoom= this.joinRoom.bind(this);
    this.sendPrivateMessage = this.sendPrivateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.openControlBox = this.openControlBox.bind(this);
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
      
      
      reactComponent.setState({
        messages: chat.messages.models.map((model: any) => ({
          message: model.attributes.message,
          from: model.attributes.from
        })).filter((message: any) => message.message !== undefined)
      })
      
      // TODO: null check for sending messages
      reactComponent.state.converse.api.send(chat.createMessageStanza(message));
      return true;
      
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
      nick =this.state.converse.getDefaultMUCNickname();
      if (!nick) {
        throw new Error("Using locked_muc_nickname but no nickname found!");
      }
    } else {
      nick = data.get('nick');
      nick.trim();
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
    
    const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
    
    let makeRoomPersistent;
    
    if (data.persistent){
      makeRoomPersistent = true;
    } else { makeRoomPersistent = false;}
    
    if (data.nick === "") {
      // Make sure defaults apply if no nick is provided.
      data.nick = reactComponent.state.jid;
    }
    let jid;
    
    if (this.state.converse.locked_muc_domain || (this.state.converse.muc_domain)) {
      jid = `${Strophe.escapeNode(data.jid)}@${this.state.converse.muc_domain}`;
    } else {
      jid = data.jid + '@conference.dev.muikkuverkko.fi'
    }
    
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
      console.log(chat);
      
      
      
      let availableMucRoom =  {
        name: chat.attributes.jid.split('@conference.dev.muikkuverkko.fi'),
        jid: chat.attributes.jid,
        chatObject: chat
      };
      
      let groupchats = this.state.availableMucRooms;
      
      groupchats.push(availableMucRoom);
      
      this.setState({availableMucRooms: groupchats, chatBox: chat});
    });
    
    
    event.target.reset();
    
  }
  
  informRoomCreationFailed(){
    alert("EI OLE MITÄÄN HUONEITA TÄÄLLÄ!!");
  }
  
  // ----- ROOMS LIST-----ä
  onRoomsFound (iq: any) {
    //    /* Handle the IQ stanza returned from the server, containing
    //     * all its public groupchats.
    //     */
    let rooms = iq.querySelectorAll('query item');
    if (rooms.length) {
      const nodesArray = [].slice.call(rooms);
      this.setState({
        availableMucRooms: nodesArray.map((room: any) => ({
          name: room.attributes.name.nodeValue,
          jid: room.attributes.jid.value,
          chatObject: ""
        })).filter((room: any) => room.name !== undefined)
      })
    } else {
      // this.informNoRoomsFound();
    }
    
    return true;
  }
  
  // Send group chat messages
  
  sendMessage(event: any){ 
    
    event.preventDefault(); 
    
    let text = event.target.chatMessage.value;
    let jid = event.target.chatRecipient.value;
    
    var reactComponent = this;
    reactComponent.state.converse.api.rooms.open(jid).then((chat: any) => {
      
      console.log("TESTI: " + chat.messages)
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
      
      // TODO: null check for sending messages
      reactComponent.state.converse.api.send(chat.createMessageStanza(message));
      return true;
      
    });
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
  
  
  componentDidMount() {
    
    var reactComponent = this;
    
    converse.plugins.add('myplugin', { 
      
      initialize: function () {
        var _converse = this._converse;
        reactComponent.setState({converse: _converse});
        
        reactComponent.state.converse.on('connected', function () {
          
          reactComponent.state.converse.api.chats.open('pyramus-staff-1@dev.muikkuverkko.fi');
          
          const rooms = reactComponent.state.converse.api.rooms;
          console.log(rooms.get());
          
          reactComponent.setState({
            isConnectionOk: true,
            showMaterial: true,
            isStudent: window.MUIKKU_IS_STUDENT
          }); 
          
          const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
          
          
          const iq: any = $iq({
            'to': 'conference.dev.muikkuverkko.fi',
            'from': "pyramus-student-18@dev.muikkuverkko.fi",
            'type': "get"
          }).c("query", {xmlns: Strophe.NS.DISCO_ITEMS});
          reactComponent.state.converse.api.sendIQ(iq)
            .then((iq: any) => reactComponent.onRoomsFound(iq))
            .catch((iq: any) => console.log(iq))
          
          reactComponent.state.converse.api.listen.on('all',
            console.log
          )
          reactComponent.state.converse.api.listen.on('message', (data: any) => { 
            
            if (data.chatbox && data.chatbox.attributes.message_type === "chat"){
              reactComponent.setState({
                messages: data.chatbox.messages.models.map((model: any) => ({
                  message: model.attributes.message,
                  from: model.attributes.from,
                  id: data.chatbox.id
                })).filter((message: any) => message.message !== undefined)
              })
            } else {
              return;
            }
          })
          
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
        });
        
      }, 
    });
    
    
  }
  
  render() {
    
    return  (
      
      <div className="container">
        
        { (this.state.showChatButton === true) && <div onClick={() => this.openControlBox()} className="chatButton">Chat!</div>}
        
        { (this.state.showControlBox === true) && <div className="showControlBox">
          <div className="chatControlBox-body">
            <div onClick={() => this.openControlBox()} className="chatHeader">X</div>

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
          
          
          { (this.state.showMaterial === true) && <div className="chatControlBox-container">
            
            <div className="single-chat">
              <form onSubmit={this.sendPrivateMessage}>
                <div className="chatMessages">
                  {this.state.messages.map((message: any) => <p key={message.message}><b>{message.from} </b><br />{message.message}</p>)}
                </div>
                <label>Vastaanottaja: </label><input name="chatRecipient" className="chatRecipient" type="text" />
                <input className="chatMessage" name="chatMessage" type="text" />
                <input className="sendPrivateMessage" type="submit" value="Lähetä"/>
              </form>
            </div>
            
            <h3>Huoneet: </h3>
            
            
            <div>  
              {this.state.availableMucRooms.map((chat, i) => <Groupchat key={i} chat={chat} converse={this.state.converse}/>)}
            </div>
            
            <hr />
            <h3>Luo uusi huone</h3>
            
            <form onSubmit={this.joinRoom}>
              <label>Huoneen nimi: </label><input name="roomName" ref="roomName" type="text"></input>
              {(!this.state.isStudent) && <div>
              <label>Pysyvä huone: </label><input type="checkbox" name="persistent"></input><br />
              </div>}
              <input name="nick" type="text"></input>
              <input type="submit" value="Liity"></input>
            </form>
            
            <div className="chatMessages">
              </div>
            </div>
            
            
          }
        </div>
      </div>}
    </div>
    
    );
  }
}