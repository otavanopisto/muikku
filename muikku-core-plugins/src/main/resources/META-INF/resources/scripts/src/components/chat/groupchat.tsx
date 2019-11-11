  /*global converse */
import * as React from 'react'
import ReactDOM from "react-dom";
import './index.scss';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any,
  converse?: any,
  orderNumber?: any,
  showChatbox?: any,
  chatObject?: any,
  onOpenChat?: any
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
  minimized: boolean,
  minimizedChats: any,
  minimizedClass: string,
  isWorkspaceChat: string
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
      minimized: false,
      minimizedChats: [],
      minimizedClass: "",
      isWorkspaceChat: ""
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
    
    let data = {
        jid: room,
        nick: window.PROFILE_DATA.displayName
      };
      
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
      
      var reactComponent = this;
      
      let list = [];
      
      let result = JSON.parse(window.sessionStorage.getItem('openChats')) || [];


      if (!result.includes(room)){
        result.push(room);
      }

      

      reactComponent.setState({
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
    
    //------- HANDLING INCOMING GROUPCHAT MESSAGES
    
    getMUCMessages (stanza: any) {
    
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
      
      
      if (stanza && stanza.attributes.type.nodeValue === "groupchat"){
        let message = stanza.textContent;
        let from = stanza.attributes.from.value;
        let senderClass ="";

        var sXML = new XMLSerializer().serializeToString(stanza.ownerDocument);
        
        //var node = new DOMParser().parseFromString(sXML, "text/xml");
        
        //const astamp = node.evaluate("/*[local-name()='delay']/@stamp", node, null, XPathResult.STRING_TYPE, null ).stringValue;

        
        var stamp = null; 
        var list = stanza.childNodes;
        
        for(var node of list) { 
            if (node.nodeName == 'delay') { 
                stamp = node.attributes.stamp.nodeValue 
              };
          }
        let days = "";
        let months = "";
        let datetime = "";
        let d;
        
        if (stamp){
          d = new Date(stamp);
        }else {
          d = new Date();
          
        } 
          let dd = d.getDate(); 
          let mm = d.getMonth() + 1; 
          var yyyy = d.getFullYear(); 
        
          if (dd < 10) { 
            
            days = '0' + dd.toString(); 
          } else {
            days = dd.toString();
          }
          if (mm < 10) { 
            months = '0' + mm; 
          } else {
            months = mm.toString();
          }
          
          var time = d.toLocaleTimeString();
        
          var date = days + '/' + months + '/' + yyyy; 
        
          datetime = date + " " + time;

          from = from.split("/").pop();
        
          if (from === this.state.nick){
            senderClass = "sender-me";

          }else{
            if (this.state.roomJid.startsWith("workspace-")){
              senderClass = "sender-others-workspace";
            } else {
              senderClass = "sender-others";
            }
          }
        
        let groupMessage: any = {from: from, content: message, senderClass: senderClass, timeStamp: datetime};
        
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
      event.target.chatMessage.value = '';
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

    scrollToBottom = () => {
      if (this.messagesEnd){
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
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
      let chatObject = this.props.chatObject;
      
      if (chat){
        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT
        });

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
        <div className={"chat-body " + this.state.minimizedClass}>

         
            { (this.state.minimized === true) && <div  
            onClick={() => this.minimizeChats(this.state.roomJid)} 
            className="minimized-chat">{this.state.roomName} <span onClick={() => this.props.onOpenChat(this.state.roomJid)} className="close icon-close"></span></div>}
  
            { (this.state.minimized === false) && <div id={this.props.orderNumber} className="chat">

            <div style={{"backgroundColor": this.state.isWorkspaceChat }} className="roomSettings">
              <div className="chatbox-room-name">{this.state.roomName}</div>
              <span onClick={() => this.minimizeChats(this.state.roomJid)} className="icon-remove"></span>
              <span onClick={() => this.openChatSettings()} className="icon-cogs room-settings-icon"></span>
              <span onClick={() => this.props.onOpenChat(this.state.roomJid)} className="icon-close"></span>
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
            
            <form ref={el => this.messageFormRef = el}  onSubmit={(e)=>this.sendMessage(e)}>                                                  
              <div className="chatMessages" ref={ (ref) => this.myRef=ref }>
                {this.state.groupMessages.map((message: any, i: number) => 
                <div className={message.senderClass + " message-item"} key={i}>
                  <p className={message.senderClass + " timestamp"}>
                  <b className={message.senderClass + " message-item-sender"}>{message.from} </b>
                  {message.timeStamp}</p>
                  <p className={message.senderClass + " message-item-content"}>{message.content}</p>
                </div>)}
                <div style={{ float:"left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}></div>
              </div>

              <input name="chatRecipient" className="chatRecipient" value={this.state.roomJid} readOnly/>
              <textarea className="chatMessage" onKeyDown={this.onEnterPress} placeholder="..Kirjoita jotakin" name="chatMessage"></textarea>
              <button className="sendMessage" type="submit" value=""><span className="icon-announcer"></span></button>
            </form>
          </div>}

          
      </div>
      );
    }
  }
