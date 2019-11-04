/*global converse */
import * as React from 'react'
import './index.scss';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any,
  converse?: any,
  orderNumber?: any,
  onOpenChat?:any
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


export class RoomsList extends React.Component<Iprops, Istate> {
  
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
      minimized: false,
      roomDesc: ""
    }
    this.myRef = null;
    this.openChatSettings = this.openChatSettings.bind(this);
    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
   // this.openMucConversation = this.openMucConversation.bind(this);
    

  }
  
  onOspenChat (room: string) {
    
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

      if (converse){
        this.setState({
          converse: converse
        });
      }
      
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;
      
      let chat = this.props.chat;
      let orderNumber = this.props.orderNumber;
      let description;
      
      if (chat){
          

        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT,
          roomDesc: chat.roomDesc
          
      
        });
      }
      
      
      
    }
    
    
    render() {
      
      return  (
        <div>
            <span className="toggle-info icon-action-menu-launcher"  onClick={() => this.toggleRoomInfo()}></span>
            <div className="rooms-list-room-name" onClick={() => this.props.onOpenChat(this.state.roomJid)}>
              {this.state.roomName}
            </div>
            { (this.state.showRoomInfo === true) && <div className="room-info"><p>{this.state.roomDesc}</p></div> }
        </div>

      
      );
    }
  }
