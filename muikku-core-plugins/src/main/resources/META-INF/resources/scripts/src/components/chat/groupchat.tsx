/*global converse */
import * as React from 'react'
import './index.scss';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any,
  converse?: any,
  orderNumber?: any
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
  openRoomNumber: number,
  nick: string,
  isRoomConfigSavedSuccesfully: string,
  settingsInformBox:string,
  showRoomInfo: boolean,
  roomAlign: string,
  minimized: boolean
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
      openRoomNumber:null,
      nick: "",
      isRoomConfigSavedSuccesfully: "",
      settingsInformBox: "settingsInform-none",
      showRoomInfo: false,
      roomAlign: "",
      minimized: false
    }
    this.myRef = null;
    this.sendMessage = this.sendMessage.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.openChatSettings = this.openChatSettings.bind(this);
    this.saveRoomFeatures = this.saveRoomFeatures.bind(this);
    this.sendConfiguration = this.sendConfiguration.bind(this);
    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
    this.minimizeChats = this.minimizeChats.bind(this);
  }
  
  openMucConversation (room: string) {
    
    if (this.state.showChatbox === true){
        
      
      
      const result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];

      const filteredChats = result.filter(function(item:any) {
        return item.jid !== room;
      })
      
      window.sessionStorage.setItem("openChats", JSON.stringify(filteredChats));
      
      this.setState({
        showChatbox: false
      }); 

      
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
      const newNumber = result.length + 1;
      let roomData = {jid: "", orderNumber: 0};

      const resultItem = result.map((item:any) => item.jid);

      if (!resultItem.includes(room)){

        const found = resultItem.some((el: any) => el.orderNumber === newNumber);

        if (found){
          roomData = {jid: room, orderNumber: newNumber + 1};

        } else {roomData = {jid: room, orderNumber: newNumber};}
        

        result.push(roomData);


      }

      let alignNumber:any;

      alignNumber = 260 + (roomData.orderNumber - 1) * 350;

      reactComponent.setState({
        showChatbox: true,
        nick: window.PROFILE_DATA.displayName,
        openRoomNumber: alignNumber
        
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
        let senderClass ="";

        from = from.split("/").pop();
        
        if (from === this.state.nick){
          senderClass = "sender-me";

        }else{
          senderClass = "sender-others";
        }
        let groupMessage: any = {from: from, content: message, senderClass: senderClass};
        
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
      if (this.state.minimized === false){
        this.setState({
          minimized: true
        });
      } else{
        this.setState({
          minimized: false
        });
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
      let orderNumber = this.props.orderNumber;
      
      if (chat){
        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT
        });
      }
      
      
      let chatBoxState1 = JSON.parse(window.sessionStorage.getItem("openChats"));
      
      
      if (chatBoxState1){

        const chatBoxState = chatBoxState1.map((item:any) => item.jid);
        const orderNumb = chatBoxState1.map((item:any) => item.orderNumber);


        if (chatBoxState.includes(chat.jid)){
          reactComponent.setState({
            showChatbox: true
          });


          let alignNumber:any;
          let k:any;
          orderNumb.map((el: any) => {
           
            k = el
            
          });

          alignNumber = 260 + (k - 1) * 350;
          reactComponent.setState({
              openRoomNumber: alignNumber
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
        <div>
          <div className="chatBox-body">
            <span className="toggle-info icon-action-menu-launcher"  onClick={() => this.toggleRoomInfo()}></span>
            <div className="rooms-list-room-name" onClick={() => this.openMucConversation(this.state.roomJid)}>
              {this.state.roomName}
            </div>
            { (this.state.showRoomInfo === true) && <div className="room-info"><p>plaaplaa</p></div> }
          </div>

          { (this.state.showChatbox === true) && <div style={{'right' :this.state.openRoomNumber + "px" }}  className="chat-discussion-container">
            { (this.state.minimized === true) && <div onClick={() => this.minimizeChats(this.state.roomJid)} className="minimized-chat">{this.state.roomName} <span className="icon-close"></span></div>}
  
            { (this.state.showChatbox === true && this.state.minimized === false) && <div id={this.props.orderNumber} className="chat">

            <div className="roomSettings">
              <div className="chatbox-room-name">{this.state.roomName}</div>
              <span onClick={() => this.minimizeChats(this.state.roomJid)} className="icon-remove"></span>
              <span onClick={() => this.openChatSettings()} className="icon-cogs room-settings-icon"></span>
              <span onClick={() => this.openMucConversation(this.state.roomJid)} className="icon-close"></span>
            </div>
              
            
              
              
              
            {(this.state.openChatSettings === true) && <div className="roomSettingsForm">
              <span onClick={() => this.openChatSettings()} className="close-new-room-form icon-close-small"></span>
              <form onSubmit={this.saveRoomFeatures}>
                <label className="control-panel">Huoneen nimi: </label><input className="settings-input" name="newRoomName" defaultValue={this.state.roomName} type="text"></input>
                <label className="control-panel">Huoneen kuvaus: </label><input className="settings-input" name="newRoomDescription" type="text"></input>
                {(!this.state.isStudent) && <div>
                  <label className="control-panel">Pysyvä huone: </label><input type="checkbox" name="persistent"></input><br />
                </div>}
                <input className="join-button" type="submit" value="Tallenna"></input>
              </form>

              <div className={this.state.settingsInformBox}>
                <p>{this.state.isRoomConfigSavedSuccesfully}</p>
              </div>
            </div> }
            
            <form onSubmit={this.sendMessage}>                                                  
              <div className="chatMessages" ref={ (ref) => this.myRef=ref }>
                {this.state.groupMessages.map((message: any, i: number) => 
                <div className={message.senderClass + " message-item"} key={i}>
                  <b className={message.senderClass + " message-item-sender"}>{message.from} </b>
                  <p className={message.senderClass + " message-item-content"}>{message.content}</p>
                </div>)}
              </div>

              <input name="chatRecipient" className="chatRecipient" value={this.state.roomJid} readOnly/>
              <textarea className="chatMessage" placeholder="..Kirjoita jotakin" name="chatMessage"></textarea>
              <button className="sendMessage" type="submit" value=""><span className="icon-announcer"></span></button>
            </form>
          </div>}

          </div>}
      </div>
      );
    }
  }
