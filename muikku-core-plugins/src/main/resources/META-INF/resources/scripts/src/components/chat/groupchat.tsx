/*global converse */
import * as React from 'react'
import './index.css';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any,
  converse?: any
}

interface Istate {
  jid?: string,
  password?: string,
  hostname?: string,
  converse?: any,
  roomJid?: string,
  roomsList?: Object,
  roomName?: string,
  roomConfig?: any,
  to?: string,
  messages?: Object,
  groupchats?: Object,
  groupMessages?: any,
  groupMessageRecipient?: string,
  receivedMUCMessages?: Object,
  availableMucRooms?: Object,
  chatBox?: any,
  chat?: any,
  showChatbox?: Boolean,
  openChatSettings?: Boolean,
  isStudent?: Boolean,
  openMucRoomJids?: any,
  nick: string,
  isRoomConfigSavedSuccesfully: string,
  settingsInformBox:string
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
  
  constructor(props: any){
    super(props);
    this.state = {
      jid: window.MUIKKU_LOGGED_USER + "@dev.muikkuverkko.fi".toLowerCase(),
      password: "",
      hostname: "",
      converse: this.props.converse,
      roomJid: "",
      roomsList: [],
      roomName: "",
      roomConfig: [],
      to: "",
      messages: [],
      groupchats: [],
      groupMessages: [],
      groupMessageRecipient: "",
      receivedMUCMessages: [],
      availableMucRooms: [],
      chatBox:null,
      chat: null,
      showChatbox: null,
      openChatSettings: false,
      isStudent: false,
      openMucRoomJids: [],
      nick: "",
      isRoomConfigSavedSuccesfully: "",
      settingsInformBox: "settingsInform-none"
    }
    this.myRef = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.openChatSettings = this.openChatSettings.bind(this);
    this.saveRoomFeatures = this.saveRoomFeatures.bind(this);
    this.sendConfiguration = this.sendConfiguration.bind(this);
  }
  
  openMucConversation (room: string) {
    
    if (this.state.showChatbox === true){
        
      this.setState({
        showChatbox: false
      }); 
      
      const result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

      const filteredChats = result.filter(function(item:any) {
        return item !== room;
      })
      
      window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));
      
      return;
      
    } else{
  
      let data = {
        jid: room,
        nick: window.PROFILE_DATA.displayName
      };
      
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
      
      var reactComponent = this;
      
      let list = [];
      
      const result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];
      
      result.push(room);
        
      reactComponent.setState({
        showChatbox: true,
        nick: window.PROFILE_DATA.displayName
      });
      
      window.sessionStorage.setItem("openChats", JSON.stringify(result));
      
      let nick: string;
      
      nick = window.PROFILE_DATA.displayName;
        
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
        data.nick = reactComponent.state.jid;
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
          'nick': window.PROFILE_DATA.displayName,
          'publicroom': true,
        }), false).then((chat: any) => {
          
          reactComponent.setState({
            chatBox: chat,
            groupMessages: []
          });
          
          
            chat.addHandler('message', 'groupMessages', reactComponent.getMUCMessages.bind(reactComponent) );
          
        });
      }
    }
    
    //------- HANDLING INCOMING GROUPCHAT MESSAGES
    
    getMUCMessages (stanza: any) {
    
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
      
      
      if (stanza && stanza.attributes.type.nodeValue === "groupchat"){
        let message = stanza.textContent;
        let from = stanza.attributes.from.value;
        from = from.split("/").pop();
        let groupMessage: any = {from: from, content: message};
        
        if (message !== ""){
          
          let groupMessages = this.state.groupMessages;
          
          groupMessages.push(groupMessage);
          
          this.setState({groupMessages: groupMessages});
          
          return;
        }
      } else {
        return;
      }
    }
    
    sendMessage(event: any){ 
      
      event.preventDefault(); 
      
      let text = event.target.chatMessage.value;
      console.log("ChatMessage Value:");
      console.log(event.target.chatMessage.value);
      let jid = this.state.roomJid;
      
      var reactComponent = this;
      
      let chat = this.state.chatBox;
      
      var spoiler_hint = "undefined";
      
      const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);
      
      let message = chat.messages.findWhere('correcting')
      
      if (message) {
        message.save({
          'correcting': false,
          'edited': chat.moment().format(),
          'message': text,
          'references': text,
          'fullname': reactComponent.state.converse.xmppstatus.get('fullname')
        });
      } else {
        message = chat.messages.create(attrs);
      }
      reactComponent.state.converse.api.send(chat.createMessageStanza(message));
    }
    
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
          registration: 0,
          roomadmins: "pyramus-staff-1@dev.muikkuverkko.fi",
          roomowners: "pyramus-staff-1@dev.muikkuverkko.fi"
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
          settingsInformBox: "settingsInform-success"
        })
      ).catch(() => 
        this.setState({
          isRoomConfigSavedSuccesfully: "Tallennettu onnistuneesti!",
          settingsInformBox: "settingsInform-failed"
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
    
    componentDidMount (){
      
      let reactComponent = this;
      let converse = this.props.converse;
      
      if (converse){
        this.setState({
          converse: converse
        });
      }
      
      let testi = window.MUIKKU_IS_STUDENT;
      
      
      let chat = this.props.chat;
      
      if (chat){
        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT
        });
      }
      
      
      let chatBoxState = JSON.parse(window.sessionStorage.getItem("openChats"));
      
      
      
      if (chatBoxState){
        if (chatBoxState.includes(chat.jid)){
          reactComponent.setState({
            showChatbox: true
          });
        } else {
          reactComponent.setState({
            showChatbox: false
          });
        }
      } else {
        reactComponent.setState({
          showChatbox: false
        });
      }
      
    }
    
    
    render() {
      
      return  (
        <div className="chatBox-body">
          <b onClick={() => this.openMucConversation(this.state.roomJid)}>{this.state.roomName}</b>
          { (this.state.showChatbox === true) && <div className="chat">
            <div onClick={() => this.openChatSettings()} className="roomSettings">
              <b className="chatBox-roomName">{this.state.roomName}</b>
              Asetukset
            </div>
            {(this.state.openChatSettings === true) && <div className="roomSettingsForm">
              <form onSubmit={this.saveRoomFeatures}>
                <label>Huoneen nimi:</label><br />
                <input type="text" name="newRoomName" defaultValue={this.state.roomName} />
                <br/>
  
                <label>Huoneen kuvaus:</label><br />
                <input type="text" name="newRoomDescription" />
                <br />
                <label>Pysyvä huone: </label><br/>
                <input type="checkbox" name="persistent" /><br />
           
                <input className="saveSettings"  type="submit" value="Tallenna" />
              </form>
              <div className={this.state.settingsInformBox}>
                <p>{this.state.isRoomConfigSavedSuccesfully}</p>
              </div>
            </div> }
            
            <form onSubmit={this.sendMessage}>                                                  
              <div className="chatMessages" ref={ (ref) => this.myRef=ref }>
                {this.state.groupMessages.map((message: any, i: number) => <p key={i}><b>{message.from} </b><br />{message.content}</p>)}
              </div>
              <label>Vastaanottaja: </label><input name="chatRecipient" className="chatRecipient" value={this.state.roomJid} readOnly/>
              <input className="chatMessage" name="chatMessage" type="text" />
              <input className="sendMessage" type="submit" value="Lähetä"/>
            </form>
          </div> }
        </div>
      );
    }
  }
